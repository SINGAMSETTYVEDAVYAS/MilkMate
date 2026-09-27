import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Reports() {
  const [customers, setCustomers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Load customers
    fetch("http://localhost:8080/api/customers")
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) =>
        console.error("Error loading customers:", error)
      );

    // Load deliveries
    fetch("http://localhost:8080/api/deliveries")
      .then((response) => response.json())
      .then((data) => setDeliveries(data))
      .catch((error) =>
        console.error("Error loading deliveries:", error)
      );

    // Load payments
    fetch("http://localhost:8080/api/payments")
      .then((response) => response.json())
      .then((data) => setPayments(data))
      .catch((error) =>
        console.error("Error loading payments:", error)
      );
  }, []);

  const deliveredCount = deliveries.filter(
    (delivery) => delivery.status === "Delivered"
  ).length;

  const pendingCount = deliveries.filter(
    (delivery) => delivery.status === "Pending"
  ).length;

  const totalMilk = deliveries.reduce(
    (total, delivery) =>
      total + Number(delivery.quantity || 0),
    0
  );

  const totalBilling = payments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0),
    0
  );

  const paidAmount = payments
    .filter((payment) => payment.paid === true)
    .reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );

  const pendingAmount = totalBilling - paidAmount;

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">

        <div className="page-header">
          <div>
            <h1>Reports</h1>
            <p>View MilkMate business reports</p>
          </div>
        </div>

        {/* Summary Cards */}

        <div className="delivery-summary">

          <div className="delivery-summary-card">
            <span>👥</span>

            <div>
              <strong>{customers.length}</strong>
              <p>Total Customers</p>
            </div>
          </div>

          <div className="delivery-summary-card">
            <span>🥛</span>

            <div>
              <strong>{totalMilk} L</strong>
              <p>Milk Delivered</p>
            </div>
          </div>

          <div className="delivery-summary-card">
            <span>✓</span>

            <div>
              <strong>{deliveredCount}</strong>
              <p>Delivered</p>
            </div>
          </div>

          <div className="delivery-summary-card">
            <span>⏳</span>

            <div>
              <strong>{pendingCount}</strong>
              <p>Pending</p>
            </div>
          </div>

        </div>

        {/* Billing Report */}

        <div className="customer-section">

          <div style={{ padding: "20px" }}>

            <h2>Billing Report</h2>

            <p>
              Total Billing:{" "}
              <strong>₹{totalBilling}</strong>
            </p>

            <p>
              Paid Amount:{" "}
              <strong>₹{paidAmount}</strong>
            </p>

            <p>
              Pending Amount:{" "}
              <strong>₹{pendingAmount}</strong>
            </p>

          </div>

        </div>

        {/* Delivery Report */}

        <div className="customer-section">

          <table className="customer-table">

            <thead>
              <tr>
                <th>Customer</th>
                <th>Quantity</th>
                <th>Shift</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {deliveries.length > 0 ? (
                deliveries.map((delivery) => (
                  <tr key={delivery.id}>

                    <td className="customer-name">
                      {delivery.customerName}
                    </td>

                    <td>
                      {delivery.quantity} L
                    </td>

                    <td>
                      {delivery.shift}
                    </td>

                    <td>
                      {delivery.deliveryTime}
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

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No delivery data found
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

export default Reports;