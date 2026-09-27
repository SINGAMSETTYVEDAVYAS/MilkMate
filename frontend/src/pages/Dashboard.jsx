import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);

  // Load customers and deliveries from backend
  useEffect(() => {
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
        console.error("Error loading customers:", error);
      });

    fetch("http://localhost:8080/api/deliveries")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch deliveries");
        }

        return response.json();
      })
      .then((data) => {
        setDeliveries(data);
      })
      .catch((error) => {
        console.error("Error loading deliveries:", error);
      });
  }, []);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Only today's deliveries
  const todaysDeliveries = deliveries.filter(
    (delivery) => delivery.deliveryDate === today
  );

  // Calculate dashboard values
  const totalCustomers = customers.length;

  const milkRequired = todaysDeliveries.reduce(
    (total, delivery) =>
      total + Number(delivery.quantity || 0),
    0
  );

  const deliveredCount = todaysDeliveries.filter(
    (delivery) => delivery.status === "Delivered"
  ).length;

  const pendingCount = todaysDeliveries.filter(
    (delivery) => delivery.status === "Pending"
  ).length;

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Good Morning, Owner 👋</h1>
            <p>Here's what's happening today.</p>
          </div>

          <div className="today-date">
            📅 Today
          </div>
        </div>

        {/* Statistics */}
        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">
              👥
            </div>

            <h3>Total Customers</h3>

            <strong>
              {totalCustomers}
            </strong>

            <p>Active customers</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              🥛
            </div>

            <h3>Milk Required</h3>

            <strong>
              {milkRequired} L
            </strong>

            <p>Required today</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              ✓
            </div>

            <h3>Delivered</h3>

            <strong>
              {deliveredCount}
            </strong>

            <p>Deliveries completed</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              ⏳
            </div>

            <h3>Pending</h3>

            <strong>
              {pendingCount}
            </strong>

            <p>Deliveries remaining</p>
          </div>

        </div>

        {/* Today's Deliveries */}
        <div className="customer-section">

          <h2 style={{ marginBottom: "20px" }}>
            Today's Deliveries
          </h2>

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

              {todaysDeliveries.map(
                (delivery) => (
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
                )
              )}

              {todaysDeliveries.length ===
                0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No deliveries for today
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

export default Dashboard;