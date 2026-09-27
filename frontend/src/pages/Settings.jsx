import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Settings() {
  const [shopName, setShopName] = useState("MilkMate");
  const [ownerName, setOwnerName] = useState("Milk Owner");
  const [mobile, setMobile] = useState("");
  const [milkPrice, setMilkPrice] = useState("60");

  const [morningDeliveryTime, setMorningDeliveryTime] =
    useState("07:00");

  const [eveningDeliveryTime, setEveningDeliveryTime] =
    useState("18:00");

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/settings")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load settings");
        }

        return response.json();
      })
      .then((data) => {
        if (data) {
          setShopName(data.shopName || "MilkMate");
          setOwnerName(data.ownerName || "Milk Owner");
          setMobile(data.mobile || "");
          setMilkPrice(data.milkPrice || "60");

          setMorningDeliveryTime(
            data.morningDeliveryTime || "07:00"
          );

          setEveningDeliveryTime(
            data.eveningDeliveryTime || "18:00"
          );
        }
      })
      .catch((error) => {
        console.error("Error loading settings:", error);
      });
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();

    const settings = {
      shopName: shopName,
      ownerName: ownerName,
      mobile: mobile,
      milkPrice: Number(milkPrice),
      morningDeliveryTime: morningDeliveryTime,
      eveningDeliveryTime: eveningDeliveryTime,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/settings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      const data = await response.json();

      setShopName(data.shopName);
      setOwnerName(data.ownerName);
      setMobile(data.mobile || "");
      setMilkPrice(data.milkPrice);
      setMorningDeliveryTime(
        data.morningDeliveryTime || "07:00"
      );
      setEveningDeliveryTime(
        data.eveningDeliveryTime || "18:00"
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving settings:", error);

      alert(
        "Failed to save settings. Please check the backend."
      );
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Settings</h1>
            <p>Manage your MilkMate shop settings</p>
          </div>
        </div>

        <div className="settings-section">
          <h2>Shop Information</h2>

          <p className="settings-description">
            Update your milk shop details.
          </p>

          <form onSubmit={handleSave}>
            <div className="settings-grid">

              <div className="form-group">
                <label>Shop Name</label>

                <input
                  type="text"
                  value={shopName}
                  onChange={(event) =>
                    setShopName(event.target.value)
                  }
                  placeholder="Enter shop name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Owner Name</label>

                <input
                  type="text"
                  value={ownerName}
                  onChange={(event) =>
                    setOwnerName(event.target.value)
                  }
                  placeholder="Enter owner name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Mobile Number</label>

                <input
                  type="tel"
                  value={mobile}
                  onChange={(event) =>
                    setMobile(event.target.value)
                  }
                  placeholder="Enter mobile number"
                />
              </div>

              <div className="form-group">
                <label>Milk Price (₹ / Litre)</label>

                <input
                  type="number"
                  value={milkPrice}
                  onChange={(event) =>
                    setMilkPrice(event.target.value)
                  }
                  min="1"
                  placeholder="Enter milk price"
                  required
                />
              </div>

            </div>

            <div className="settings-actions">
              <button
                type="submit"
                className="save-customer-button"
              >
                Save Settings
              </button>
            </div>

            {saved && (
              <div className="settings-success">
                ✓ Settings saved successfully
              </div>
            )}
          </form>
        </div>

        <div className="settings-section">
          <h2>Delivery Settings</h2>

          <p className="settings-description">
            Default delivery times for your customers.
          </p>

          <div className="settings-grid">

            <div className="form-group">
              <label>🌅 Morning Delivery Time</label>

              <input
                type="time"
                value={morningDeliveryTime}
                onChange={(event) =>
                  setMorningDeliveryTime(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>🌙 Evening Delivery Time</label>

              <input
                type="time"
                value={eveningDeliveryTime}
                onChange={(event) =>
                  setEveningDeliveryTime(
                    event.target.value
                  )
                }
              />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;