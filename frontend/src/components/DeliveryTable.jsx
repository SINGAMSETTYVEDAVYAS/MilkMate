import { useState } from "react";

function DeliveryTable() {

  const [selectedShift, setSelectedShift] = useState("All");

  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      name: "Ravi Kumar",
      address: "Kukatpally",
      quantity: "2 L",
      time: "7:00 AM",
      shift: "Morning",
      status: "Delivered",
    },
    {
      id: 2,
      name: "Priya Sharma",
      address: "KPHB",
      quantity: "1 L",
      time: "7:30 AM",
      shift: "Morning",
      status: "Delivered",
    },
    {
      id: 3,
      name: "Rahul Reddy",
      address: "Moosapet",
      quantity: "2 L",
      time: "8:00 AM",
      shift: "Morning",
      status: "Pending",
    },
    {
      id: 4,
      name: "Suresh Kumar",
      address: "Miyapur",
      quantity: "3 L",
      time: "6:00 PM",
      shift: "Evening",
      status: "Pending",
    },
    {
      id: 5,
      name: "Anitha Rao",
      address: "Bachupally",
      quantity: "1 L",
      time: "6:30 PM",
      shift: "Evening",
      status: "Pending",
    },
  ]);


  // Mark a delivery as delivered

  const markAsDelivered = (id) => {

    setDeliveries((previousDeliveries) =>
      previousDeliveries.map((delivery) =>
        delivery.id === id
          ? { ...delivery, status: "Delivered" }
          : delivery
      )
    );

  };


  // Filter deliveries based on shift

  const filteredDeliveries =
    selectedShift === "All"
      ? deliveries
      : deliveries.filter(
          (delivery) => delivery.shift === selectedShift
        );


  return (
    <div className="delivery-section">


      {/* Section Header */}

      <div className="section-header">

        <div>
          <h2>Today's Deliveries</h2>

          <p>
            Track today's milk deliveries
          </p>
        </div>

        <button className="view-all-button">
          View All
        </button>

      </div>


      {/* Shift Filters */}

      <div className="shift-filters">

        <button
          className={
            selectedShift === "All"
              ? "shift-button active"
              : "shift-button"
          }
          onClick={() => setSelectedShift("All")}
        >
          All
        </button>


        <button
          className={
            selectedShift === "Morning"
              ? "shift-button active"
              : "shift-button"
          }
          onClick={() => setSelectedShift("Morning")}
        >
          🌅 Morning
        </button>


        <button
          className={
            selectedShift === "Evening"
              ? "shift-button active"
              : "shift-button"
          }
          onClick={() => setSelectedShift("Evening")}
        >
          🌙 Evening
        </button>

      </div>


      {/* Delivery Table */}

      <div className="delivery-table-container">

        <table className="delivery-table">

          <thead>

            <tr>
              <th>Customer</th>
              <th>Address</th>
              <th>Quantity</th>
              <th>Shift</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>


          <tbody>

            {filteredDeliveries.map((delivery) => (

              <tr key={delivery.id}>

                <td className="customer-name">
                  {delivery.name}
                </td>

                <td>
                  {delivery.address}
                </td>

                <td>
                  {delivery.quantity}
                </td>

                <td>
                  {delivery.shift}
                </td>

                <td>
                  {delivery.time}
                </td>


                {/* Status */}

                <td>

                  <span
                    className={
                      delivery.status === "Delivered"
                        ? "status delivered"
                        : "status pending"
                    }
                  >

                    {delivery.status === "Delivered"
                      ? "✓ Delivered"
                      : "⏳ Pending"}

                  </span>

                </td>


                {/* Action */}

                <td>

                  {delivery.status === "Pending" && (

                    <button
                      className="mark-delivered-button"
                      onClick={() =>
                        markAsDelivered(delivery.id)
                      }
                    >
                      Mark Delivered
                    </button>

                  )}

                  {delivery.status === "Delivered" && (

                    <span className="completed-text">
                      Completed
                    </span>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default DeliveryTable;