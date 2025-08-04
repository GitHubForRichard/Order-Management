import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [orders, setOrders] = useState([]);

  const initialOrder = {
    customer_name: "",
    primary_number: "",
    model_number: "",
    issues: "",
    case: "",
    email: "",
    sales_order: "",
    date: "",
    address: "",
    street: "",
    city: "",
    zip_code: "",
    state: "",
    country: "",
    assign: "",
    status: "Pending",
    serial: "",
    solution: "",
    action: "",
    file_name: "",
    tracking: "",
    return_status: "",
  };

  const [newOrder, setNewOrder] = useState(initialOrder);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/orders")
      .then((response) => setOrders(response.data.orders))
      .catch((error) =>
        console.error("There was an error loading the orders!", error)
      );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5001/api/orders", newOrder)
      .then((response) => {
        setOrders([...orders, response.data.order]);
        setNewOrder(initialOrder);
      })
      .catch((error) =>
        console.error("There was an error creating the order!", error)
      );
  };

  const filteredOrders = orders.filter((order) =>
    order.customer_name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Order Management</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Customer Name: </label>
            <input
              type="text"
              value={newOrder.customer_name}
              onChange={(e) =>
                setNewOrder({ ...newOrder, customer_name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Primary Number: </label>
            <input
              type="text"
              value={newOrder.primary_number}
              onChange={(e) =>
                setNewOrder({ ...newOrder, primary_number: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Model Number: </label>
            <input
              type="text"
              value={newOrder.model_number}
              onChange={(e) =>
                setNewOrder({ ...newOrder, model_number: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Issues: </label>
            <input
              type="text"
              value={newOrder.issues}
              onChange={(e) =>
                setNewOrder({ ...newOrder, issues: e.target.value })
              }
            />
          </div>
          <div>
            <label>Case: </label>
            <input
              type="text"
              value={newOrder.case}
              onChange={(e) =>
                setNewOrder({ ...newOrder, case: e.target.value })
              }
            />
          </div>
          <div>
            <label>Email: </label>
            <input
              type="email"
              value={newOrder.email}
              onChange={(e) =>
                setNewOrder({ ...newOrder, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Sales Order: </label>
            <input
              type="text"
              value={newOrder.sales_order}
              onChange={(e) =>
                setNewOrder({ ...newOrder, sales_order: e.target.value })
              }
            />
          </div>
          <div>
            <label>Date: </label>
            <input
              type="date"
              value={newOrder.date}
              onChange={(e) =>
                setNewOrder({ ...newOrder, date: e.target.value })
              }
            />
          </div>
          <div>
            <label>Address: </label>
            <input
              type="text"
              value={newOrder.address}
              onChange={(e) =>
                setNewOrder({ ...newOrder, address: e.target.value })
              }
            />
          </div>
          <div>
            <label>Street: </label>
            <input
              type="text"
              value={newOrder.street}
              onChange={(e) =>
                setNewOrder({ ...newOrder, street: e.target.value })
              }
            />
          </div>
          <div>
            <label>City: </label>
            <input
              type="text"
              value={newOrder.city}
              onChange={(e) =>
                setNewOrder({ ...newOrder, city: e.target.value })
              }
            />
          </div>
          <div>
            <label>Zip Code: </label>
            <input
              type="text"
              value={newOrder.zip_code}
              onChange={(e) =>
                setNewOrder({ ...newOrder, zip_code: e.target.value })
              }
            />
          </div>
          <div>
            <label>State: </label>
            <input
              type="text"
              value={newOrder.state}
              onChange={(e) =>
                setNewOrder({ ...newOrder, state: e.target.value })
              }
            />
          </div>
          <div>
            <label>Country: </label>
            <input
              type="text"
              value={newOrder.country}
              onChange={(e) =>
                setNewOrder({ ...newOrder, country: e.target.value })
              }
            />
          </div>
          <div>
            <label>Assign: </label>
            <input
              type="text"
              value={newOrder.assign}
              onChange={(e) =>
                setNewOrder({ ...newOrder, assign: e.target.value })
              }
            />
          </div>
          <div>
            <label>Status: </label>
            <select
              value={newOrder.status}
              onChange={(e) =>
                setNewOrder({ ...newOrder, status: e.target.value })
              }
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label>Serial: </label>
            <input
              type="text"
              value={newOrder.serial}
              onChange={(e) =>
                setNewOrder({ ...newOrder, serial: e.target.value })
              }
            />
          </div>
          <div>
            <label>Solution: </label>
            <input
              type="text"
              value={newOrder.solution}
              onChange={(e) =>
                setNewOrder({ ...newOrder, solution: e.target.value })
              }
            />
          </div>
          <div>
            <label>Action: </label>
            <input
              type="text"
              value={newOrder.action}
              onChange={(e) =>
                setNewOrder({ ...newOrder, action: e.target.value })
              }
            />
          </div>
          <div>
            <label>File Name: </label>
            <input
              type="text"
              value={newOrder.file_name}
              onChange={(e) =>
                setNewOrder({ ...newOrder, file_name: e.target.value })
              }
            />
          </div>
          <div>
            <label>Tracking: </label>
            <input
              type="text"
              value={newOrder.tracking}
              onChange={(e) =>
                setNewOrder({ ...newOrder, tracking: e.target.value })
              }
            />
          </div>
          <div>
            <label>Return Status: </label>
            <input
              type="text"
              value={newOrder.return_status}
              onChange={(e) =>
                setNewOrder({ ...newOrder, return_status: e.target.value })
              }
            />
          </div>
          <button type="submit">Add Order</button>
        </form>

        <div>
          <label>Search by Customer Name: </label>
          <input
            type="text"
            placeholder="Enter customer name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>

        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Model</th>
                <th>Issues</th>
                <th>Case</th>
                <th>Email</th>
                <th>Sales Order</th>
                <th>Date</th>
                <th>Address</th>
                <th>Street</th>
                <th>Assign</th>
                <th>Status</th>
                <th>Serial</th>
                <th>Solution</th>
                <th>Action</th>
                <th>File Name</th>
                <th>Tracking</th>
                <th>Return Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.customer_name}</td>
                  <td>{order.primary_number}</td>
                  <td>{order.model_number}</td>
                  <td>{order.issues}</td>
                  <td>{order.case}</td>
                  <td>{order.email}</td>
                  <td>{order.sales_order}</td>
                  <td>{order.date}</td>
                  <td>{order.address}</td>
                  <td>{order.street}</td>
                  <td>{order.assign}</td>
                  <td>{order.status}</td>
                  <td>{order.serial}</td>
                  <td>{order.solution}</td>
                  <td>{order.action}</td>
                  <td>{order.file_name}</td>
                  <td>{order.tracking}</td>
                  <td>{order.return_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </header>
    </div>
  );
}

export default App;
