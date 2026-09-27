import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Deliveries() {
  const [selectedShift, setSelectedShift] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [dayClosed, setDayClosed] = useState(false);

  const [showAddDelivery, setShowAddDelivery] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [deliveryShift, setDeliveryShift] = useState("Morning");
  const [deliveryTime, setDeliveryTime] = useState("07:00");
  const [deliveryQuantity, setDeliveryQuantity] = useState("");

  // Format delivery date
  const formatDeliveryDate = (date) => {
    if (!date) {
      return "";
    }

    const parts = date.split("-");

    if (parts.length !== 3) {
      return date;
    }

    const year = parts[0];
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${day} ${monthNames[month - 1]} ${year}`;
  };

  // Load deliveries and customers
  useEffect(() => {
    loadDeliveries();
    loadCustomers();
  }, []);

  // Load deliveries
  const loadDeliveries = () => {
    fetch("http://localhost:8080/api/deliveries")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch deliveries");
        }

        return response.json();
      })
      .then((data) => {
        const formattedDeliveries = data.map((delivery) => ({
          ...delivery,
          name: delivery.customerName,
          quantity: `${delivery.quantity} L`,
          time: delivery.deliveryTime,
        }));

        setDeliveries(formattedDeliveries);

        // Check whether the day is already closed
        if (
          data.length > 0 &&
          data.every(
            (delivery) => delivery.dayClosed === true
          )
        ) {
          setDayClosed(true);
        } else {
          setDayClosed(false);
        }
      })
      .catch((error) => {
        console.error(
          "Error loading deliveries:",
          error
        );
      });
  };

  // Load customers
  const loadCustomers = () => {
    fetch("http://localhost:8080/api/customers")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }

        return response.json();
      })
      .then((data) => {
        setCustomers(data);
      })
      .catch((error) => {
        console.error(
          "Error loading customers:",
          error
        );
      });
  };

  // When customer is selected
  const handleCustomerChange = (event) => {
    const customerId = event.target.value;

    setSelectedCustomerId(customerId);

    const customer = customers.find(
      (item) => String(item.id) === String(customerId)
    );

    if (customer) {
      setDeliveryQuantity(customer.quantity || "");

      setDeliveryShift(
        customer.shift || "Morning"
      );

      if (customer.shift === "Evening") {
        setDeliveryTime("18:00");
      } else {
        setDeliveryTime("07:00");
      }
    }
  };

  // Add new delivery
  const addDelivery = async (event) => {
    event.preventDefault();

    if (dayClosed) {
      alert(
        "The day is already closed. You cannot add a delivery."
      );
      return;
    }

    if (!selectedCustomerId) {
      alert("Please select a customer.");
      return;
    }

    if (!deliveryQuantity) {
      alert("Please enter the milk quantity.");
      return;
    }

    const customer = customers.find(
      (item) =>
        String(item.id) === String(selectedCustomerId)
    );

    if (!customer) {
      alert("Customer not found.");
      return;
    }

    const deliveryData = {
      customerName: customer.name,
      mobile: customer.mobile,
      address: customer.address,
      quantity: Number(deliveryQuantity),
      shift: deliveryShift,
      deliveryTime: deliveryTime,
      status: "Pending",
      dayClosed: false,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/deliveries",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deliveryData),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to create delivery"
        );
      }

      const newDelivery =
        await response.json();

      const formattedDelivery = {
        ...newDelivery,
        name: newDelivery.customerName,
        quantity: `${newDelivery.quantity} L`,
        time: newDelivery.deliveryTime,
      };

      setDeliveries((currentDeliveries) => [
        ...currentDeliveries,
        formattedDelivery,
      ]);

      setShowAddDelivery(false);
      setSelectedCustomerId("");
      setDeliveryQuantity("");
      setDeliveryShift("Morning");
      setDeliveryTime("07:00");

      alert(
        "Delivery added successfully!"
      );
    } catch (error) {
      console.error(
        "Error adding delivery:",
        error
      );

      alert(
        "Failed to add delivery. Please check the backend."
      );
    }
  };

  // Mark delivery as Delivered or Pending
  const updateDeliveryStatus = async (
    delivery,
    newStatus
  ) => {
    if (
      dayClosed ||
      delivery.dayClosed === true
    ) {
      alert(
        "This day is closed. Delivery cannot be changed."
      );

      return;
    }

    const deliveryData = {
      customerName: delivery.customerName,
      mobile: delivery.mobile,
      address: delivery.address,
      quantity: Number(
        delivery.quantity.replace(" L", "")
      ),
      shift: delivery.shift,
      deliveryTime: delivery.deliveryTime,
      status: newStatus,
      dayClosed: false,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/deliveries/${delivery.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deliveryData),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update delivery"
        );
      }

      const updatedDelivery =
        await response.json();

      const formattedDelivery = {
        ...updatedDelivery,
        name: updatedDelivery.customerName,
        quantity: `${updatedDelivery.quantity} L`,
        time: updatedDelivery.deliveryTime,
      };

      setDeliveries(
        (currentDeliveries) =>
          currentDeliveries.map((item) =>
            item.id === delivery.id
              ? formattedDelivery
              : item
          )
      );

      if (newStatus === "Delivered") {
        alert(
          "Delivery marked as delivered! SMS request sent."
        );
      } else {
        alert(
          "Delivery changed back to pending!"
        );
      }
    } catch (error) {
      console.error(
        "Error updating delivery:",
        error
      );

      alert(
        "Failed to update delivery. Please check the backend."
      );
    }
  };

  // Close the day
  const closeDay = async () => {
    if (deliveries.length === 0) {
      alert(
        "There are no deliveries to close."
      );

      return;
    }

    const pendingCount =
      deliveries.filter(
        (delivery) =>
          delivery.status === "Pending"
      ).length;

    if (pendingCount > 0) {
      const confirmClose =
        window.confirm(
          `There are ${pendingCount} pending deliveries. Are you sure you want to close the day?`
        );

      if (!confirmClose) {
        return;
      }
    } else {
      const confirmClose =
        window.confirm(
          "All deliveries are completed. Do you want to close the day?"
        );

      if (!confirmClose) {
        return;
      }
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/deliveries/close-day",
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to close day"
        );
      }

      setDeliveries(
        (currentDeliveries) =>
          currentDeliveries.map(
            (delivery) => ({
              ...delivery,
              dayClosed: true,
            })
          )
      );

      setDayClosed(true);

      alert(
        "Day closed successfully! All deliveries are now locked."
      );
    } catch (error) {
      console.error(
        "Error closing day:",
        error
      );

      alert(
        "Failed to close the day. Please check the backend."
      );
    }
  };

  // Get the date to display
  const deliveryDate =
    deliveries.length > 0
      ? deliveries[0].deliveryDate
      : null;

  // Filter deliveries
  const filteredDeliveries =
    deliveries.filter((delivery) => {
      const matchesShift =
        selectedShift === "All" ||
        delivery.shift === selectedShift;

      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        delivery.name
          .toLowerCase()
          .includes(search) ||
        delivery.mobile.includes(search);

      return (
        matchesShift &&
        matchesSearch
      );
    });

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">

        {/* Page Header */}
        <div className="page-header">

          <div>
            <h1>Deliveries</h1>

            <p>
              Manage today's milk deliveries

              {deliveryDate && (
                <>
                  {" "}• 📅{" "}
                  {formatDeliveryDate(
                    deliveryDate
                  )}
                </>
              )}
            </p>
          </div>

          {/* Buttons */}
          <div>

            {!dayClosed && (
              <button
                className="save-customer-button"
                onClick={() =>
                  setShowAddDelivery(
                    !showAddDelivery
                  )
                }
                style={{
                  marginRight: "10px",
                }}
              >
                {showAddDelivery
                  ? "Cancel"
                  : "+ Add Delivery"}
              </button>
            )}

            {!dayClosed ? (
              <button
                className="close-day-button"
                onClick={closeDay}
              >
                🔒 Close Day
              </button>
            ) : (
              <span className="day-closed-badge">
                🔒 Day Closed
              </span>
            )}

          </div>

        </div>

        {/* Add Delivery Form */}
        {showAddDelivery && !dayClosed && (
          <div className="settings-section">

            <h2>Add Today's Delivery</h2>

            <p className="settings-description">
              Select a customer and create a delivery for today.
            </p>

            <form onSubmit={addDelivery}>

              <div className="settings-grid">

                <div className="form-group">
                  <label>Customer</label>

                  <select
                    value={selectedCustomerId}
                    onChange={handleCustomerChange}
                    required
                  >
                    <option value="">
                      Select Customer
                    </option>

                    {customers.map(
                      (customer) => (
                        <option
                          key={customer.id}
                          value={customer.id}
                        >
                          {customer.name} -{" "}
                          {customer.mobile}
                        </option>
                      )
                    )}

                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Quantity (Litres)
                  </label>

                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={deliveryQuantity}
                    onChange={(event) =>
                      setDeliveryQuantity(
                        event.target.value
                      )
                    }
                    placeholder="Enter quantity"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Shift</label>

                  <select
                    value={deliveryShift}
                    onChange={(event) => {
                      const shift =
                        event.target.value;

                      setDeliveryShift(shift);

                      if (
                        shift === "Evening"
                      ) {
                        setDeliveryTime(
                          "18:00"
                        );
                      } else {
                        setDeliveryTime(
                          "07:00"
                        );
                      }
                    }}
                  >
                    <option value="Morning">
                      🌅 Morning
                    </option>

                    <option value="Evening">
                      🌙 Evening
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Delivery Time
                  </label>

                  <input
                    type="time"
                    value={deliveryTime}
                    onChange={(event) =>
                      setDeliveryTime(
                        event.target.value
                      )
                    }
                    required
                  />
                </div>

              </div>

              <div className="settings-actions">

                <button
                  type="submit"
                  className="save-customer-button"
                >
                  Save Delivery
                </button>

              </div>

            </form>

          </div>
        )}

        {/* Summary */}
        <div className="delivery-summary">

          <div className="delivery-summary-card">

            <span>🥛</span>

            <div>

              <strong>
                {deliveries.length}
              </strong>

              <p>
                Total Deliveries
              </p>

            </div>

          </div>

          <div className="delivery-summary-card">

            <span>✓</span>

            <div>

              <strong>
                {
                  deliveries.filter(
                    (delivery) =>
                      delivery.status ===
                      "Delivered"
                  ).length
                }
              </strong>

              <p>
                Delivered
              </p>

            </div>

          </div>

          <div className="delivery-summary-card">

            <span>⏳</span>

            <div>

              <strong>
                {
                  deliveries.filter(
                    (delivery) =>
                      delivery.status ===
                      "Pending"
                  ).length
                }
              </strong>

              <p>
                Pending
              </p>

            </div>

          </div>

        </div>

        {/* Search */}
        <div className="customer-search">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search by customer name or mobile..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>

        {/* Shift Filters */}
        <div className="shift-filters">

          <button
            className={
              selectedShift === "All"
                ? "shift-button active"
                : "shift-button"
            }
            onClick={() =>
              setSelectedShift("All")
            }
          >
            All
          </button>

          <button
            className={
              selectedShift === "Morning"
                ? "shift-button active"
                : "shift-button"
            }
            onClick={() =>
              setSelectedShift("Morning")
            }
          >
            🌅 Morning
          </button>

          <button
            className={
              selectedShift === "Evening"
                ? "shift-button active"
                : "shift-button"
            }
            onClick={() =>
              setSelectedShift("Evening")
            }
          >
            🌙 Evening
          </button>

        </div>

        {/* Delivery Table */}
        <div className="customer-section">

          <table className="customer-table">

            <thead>

              <tr>

                <th>Customer</th>
                <th>Mobile</th>
                <th>Address</th>
                <th>Quantity</th>
                <th>Shift</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {filteredDeliveries.map(
                (delivery) => (

                  <tr key={delivery.id}>

                    <td className="customer-name">
                      {delivery.name}
                    </td>

                    <td>
                      {delivery.mobile}
                    </td>

                    <td>
                      {delivery.address}
                    </td>

                    <td>
                      {delivery.quantity}
                    </td>

                    <td>

                      <span
                        className={
                          delivery.shift ===
                          "Morning"
                            ? "shift-badge morning"
                            : "shift-badge evening"
                        }
                      >
                        {delivery.shift ===
                        "Morning"
                          ? "🌅 Morning"
                          : "🌙 Evening"}
                      </span>

                    </td>

                    <td>
                      {delivery.time}
                    </td>

                    <td>

                      <span
                        className={
                          delivery.status ===
                          "Delivered"
                            ? "status delivered"
                            : "status pending"
                        }
                      >
                        {delivery.status ===
                        "Delivered"
                          ? "✓ Delivered"
                          : "⏳ Pending"}
                      </span>

                    </td>

                    <td>

                      {/* Pending → Delivered */}
                      {delivery.status ===
                        "Pending" &&
                        !dayClosed &&
                        delivery.dayClosed !==
                          true && (
                          <button
                            className="mark-delivered-button"
                            onClick={() =>
                              updateDeliveryStatus(
                                delivery,
                                "Delivered"
                              )
                            }
                          >
                            Mark Delivered
                          </button>
                        )}

                      {/* Delivered → Pending */}
                      {delivery.status ===
                        "Delivered" &&
                        !dayClosed &&
                        delivery.dayClosed !==
                          true && (
                          <button
                            className="undo-delivery-button"
                            onClick={() =>
                              updateDeliveryStatus(
                                delivery,
                                "Pending"
                              )
                            }
                          >
                            Undo Delivery
                          </button>
                        )}

                      {/* Locked */}
                      {(dayClosed ||
                        delivery.dayClosed ===
                          true) && (
                        <span className="locked-text">
                          🔒 Locked
                        </span>
                      )}

                    </td>

                  </tr>

                )
              )}

              {filteredDeliveries.length ===
                0 && (

                <tr>

                  <td
                    colSpan="8"
                    style={{
                      textAlign:
                        "center",
                      padding: "30px",
                    }}
                  >
                    No deliveries found
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

export default Deliveries;