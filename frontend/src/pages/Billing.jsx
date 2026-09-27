import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Billing() {
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [milkPrice, setMilkPrice] = useState(60);

  const billingMonth = "2026-09";

  useEffect(() => {
    loadCustomers();
    loadPayments();
    loadSettings();
  }, []);

  const loadCustomers = () => {
    fetch("http://localhost:8080/api/customers")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
        return response.json();
      })
      .then((data) => setCustomers(data))
      .catch((error) =>
        console.error("Error loading customers:", error)
      );
  };

  const loadPayments = () => {
    fetch("http://localhost:8080/api/payments")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch payments");
        }
        return response.json();
      })
      .then((data) => setPayments(data))
      .catch((error) =>
        console.error("Error loading payments:", error)
      );
  };

  const loadSettings = () => {
    fetch("http://localhost:8080/api/settings")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.milkPrice) {
          setMilkPrice(Number(data.milkPrice));
        }
      })
      .catch((error) =>
        console.error("Error loading settings:", error)
      );
  };

  const calculateAmount = (customer) => {
    const quantity = Number(customer.quantity || 0);
    const days = 30;

    return quantity * days * milkPrice;
  };

  const getPayment = (customerId) => {
    return payments.find(
      (payment) =>
        payment.customerId === customerId &&
        payment.billingMonth === billingMonth
    );
  };

  const isCustomerPaid = (customerId) => {
    const payment = getPayment(customerId);

    return payment ? payment.paid === true : false;
  };

  const markAsPaid = async (customer) => {
    const amount = calculateAmount(customer);
    const existingPayment = getPayment(customer.id);

    try {
      if (existingPayment) {
        const paymentData = {
          customerId: customer.id,
          billingMonth: billingMonth,
          amount: amount,
          paid: !existingPayment.paid,
        };

        const response = await fetch(
          `http://localhost:8080/api/payments/${existingPayment.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update payment");
        }

        const updatedPayment = await response.json();

        setPayments((currentPayments) =>
          currentPayments.map((payment) =>
            payment.id === existingPayment.id
              ? updatedPayment
              : payment
          )
        );

        return;
      }

      const paymentData = {
        customerId: customer.id,
        billingMonth: billingMonth,
        amount: amount,
        paid: true,
      };

      const response = await fetch(
        "http://localhost:8080/api/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save payment");
      }

      const newPayment = await response.json();

      setPayments((currentPayments) => [
        ...currentPayments,
        newPayment,
      ]);
    } catch (error) {
      console.error("Error updating payment:", error);

      alert(
        "Failed to update payment. Please check the backend."
      );
    }
  };

  const totalAmount = customers.reduce(
    (total, customer) =>
      total + calculateAmount(customer),
    0
  );

  const paidAmount = customers.reduce(
    (total, customer) => {
      if (isCustomerPaid(customer.id)) {
        return total + calculateAmount(customer);
      }

      return total;
    },
    0
  );

  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Billing</h1>
            <p>Manage monthly milk bills</p>
          </div>
        </div>

        <div className="delivery-summary">
          <div className="delivery-summary-card">
            <span>💰</span>

            <div>
              <strong>₹{totalAmount}</strong>
              <p>Total Amount</p>
            </div>
          </div>

          <div className="delivery-summary-card">
            <span>✓</span>

            <div>
              <strong>₹{paidAmount}</strong>
              <p>Paid Amount</p>
            </div>
          </div>

          <div className="delivery-summary-card">
            <span>⏳</span>

            <div>
              <strong>₹{pendingAmount}</strong>
              <p>Pending Amount</p>
            </div>
          </div>
        </div>

        <div className="customer-section">
          <table className="customer-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Mobile</th>
                <th>Quantity / Day</th>
                <th>Days</th>
                <th>Price / Litre</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {customers.length > 0 ? (
                customers.map((customer) => {
                  const amount = calculateAmount(customer);
                  const isPaid = isCustomerPaid(customer.id);

                  return (
                    <tr key={customer.id}>
                      <td className="customer-name">
                        {customer.name}
                      </td>

                      <td>{customer.mobile}</td>

                      <td>{customer.quantity} L</td>

                      <td>30</td>

                      <td>₹{milkPrice}</td>

                      <td>₹{amount}</td>

                      <td>
                        <span
                          className={
                            isPaid
                              ? "status delivered"
                              : "status pending"
                          }
                        >
                          {isPaid
                            ? "✓ Paid"
                            : "⏳ Pending"}
                        </span>
                      </td>

                      <td>
                        <button
                          className={
                            isPaid
                              ? "undo-delivery-button"
                              : "mark-delivered-button"
                          }
                          onClick={() =>
                            markAsPaid(customer)
                          }
                        >
                          {isPaid
                            ? "Undo Payment"
                            : "Mark Paid"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="8"
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

export default Billing;