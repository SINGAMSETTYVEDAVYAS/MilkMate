import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Customers() {
  const [showForm, setShowForm] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [customers, setCustomers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    quantity: "",
    shift: "Morning",
  });

  // Load customers from Spring Boot
  useEffect(() => {
    fetch("http://localhost:8080/api/customers")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }

        return response.json();
      })
      .then((data) => {
        const formattedCustomers = data.map((customer) => ({
          ...customer,
          quantity: `${customer.quantity} L`,
        }));

        setCustomers(formattedCustomers);
      })
      .catch((error) => {
        console.error("Error loading customers:", error);
      });
  }, []);

  // Handle form changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add or update customer
  const handleSubmit = async (event) => {
    event.preventDefault();

    const customerData = {
      name: formData.name,
      mobile: formData.mobile,
      address: formData.address,
      quantity: Number(formData.quantity),
      shift: formData.shift,
    };

    try {
      // UPDATE EXISTING CUSTOMER
      if (editingCustomerId !== null) {
        const response = await fetch(
          `http://localhost:8080/api/customers/${editingCustomerId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(customerData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update customer");
        }

        alert("PUT request status: " + response.status);

        const updatedCustomer = await response.json();

        const formattedCustomer = {
          ...updatedCustomer,
          quantity: `${updatedCustomer.quantity} L`,
        };

        setCustomers(
          customers.map((customer) =>
            customer.id === editingCustomerId
              ? formattedCustomer
              : customer
          )
        );

        alert("Customer updated successfully!");

        handleCancel();

        return;
      }

      // ADD NEW CUSTOMER
      const response = await fetch(
        "http://localhost:8080/api/customers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customerData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add customer");
      }

      const savedCustomer = await response.json();

      const formattedCustomer = {
        ...savedCustomer,
        quantity: `${savedCustomer.quantity} L`,
      };

      setCustomers([...customers, formattedCustomer]);

      alert("Customer added successfully!");

      handleCancel();
    } catch (error) {
      console.error("Error saving customer:", error);

      alert(
        "Failed to save customer. Please check the backend."
      );
    }
  };

  // Edit customer
  const handleEdit = (customer) => {
    setFormData({
      name: customer.name,
      mobile: customer.mobile,
      address: customer.address,
      quantity: customer.quantity.replace(" L", ""),
      shift: customer.shift,
    });

    setEditingCustomerId(customer.id);
    setShowForm(true);
  };

  // Delete customer
  const handleDelete = async (customerId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/customers/${customerId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      setCustomers(
        customers.filter(
          (customer) => customer.id !== customerId
        )
      );

      alert("Customer deleted successfully!");
    } catch (error) {
      console.error("Error deleting customer:", error);

      alert(
        "Failed to delete customer. Please check the backend."
      );
    }
  };

  // Cancel form
  const handleCancel = () => {
    setFormData({
      name: "",
      mobile: "",
      address: "",
      quantity: "",
      shift: "Morning",
    });

    setEditingCustomerId(null);
    setShowForm(false);
  };

  // Search customers
  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.toLowerCase();

    return (
      customer.name.toLowerCase().includes(search) ||
      customer.mobile.includes(search)
    );
  });

  return (
    <div className="dashboard">

      <Sidebar />

      <main className="main-content">

        {/* Page Header */}
        <div className="page-header">

          <div>
            <h1>Customers</h1>

            <p>
              Manage your milk delivery customers
            </p>
          </div>

          <button
            className="add-customer-button"
            onClick={() => {
              handleCancel();
              setShowForm(true);
            }}
          >
            + Add Customer
          </button>

        </div>

        {/* Add / Edit Form */}
        {showForm && (

          <div className="customer-form-section">

            <h2>
              {editingCustomerId !== null
                ? "Edit Customer"
                : "Add New Customer"}
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                {/* Customer Name */}
                <div className="form-group">

                  <label>
                    Customer Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter customer name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* Mobile */}
                <div className="form-group">

                  <label>
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Enter mobile number"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* Address */}
                <div className="form-group">

                  <label>
                    Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* Quantity */}
                <div className="form-group">

                  <label>
                    Milk Quantity (Litres)
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    placeholder="Example: 2"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* Shift */}
                <div className="form-group">

                  <label>
                    Delivery Shift
                  </label>

                  <select
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                  >

                    <option value="Morning">
                      🌅 Morning
                    </option>

                    <option value="Evening">
                      🌙 Evening
                    </option>

                  </select>

                </div>

              </div>

              {/* Form Buttons */}
              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-customer-button"
                >
                  {editingCustomerId !== null
                    ? "Update Customer"
                    : "Add Customer"}
                </button>

              </div>

            </form>

          </div>

        )}

        {/* Search */}
        <div className="customer-search">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

        </div>

        {/* Customer Table */}
        <div className="customer-section">

          <table className="customer-table">

            <thead>

              <tr>
                <th>Customer</th>
                <th>Mobile</th>
                <th>Address</th>
                <th>Quantity</th>
                <th>Shift</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredCustomers.map((customer) => (

                <tr key={customer.id}>

                  <td className="customer-name">
                    {customer.name}
                  </td>

                  <td>
                    {customer.mobile}
                  </td>

                  <td>
                    {customer.address}
                  </td>

                  <td>
                    {customer.quantity}
                  </td>

                  <td>

                    <span
                      className={
                        customer.shift === "Morning"
                          ? "shift-badge morning"
                          : "shift-badge evening"
                      }
                    >

                      {customer.shift === "Morning"
                        ? "🌅 Morning"
                        : "🌙 Evening"}

                    </span>

                  </td>

                  <td>

                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEdit(customer)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(customer.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

              {filteredCustomers.length === 0 && (

                <tr>

                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No customers found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </main>

    </div>
  );
}

export default Customers;