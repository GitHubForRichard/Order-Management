import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import {
  CANADA_PROVINCES,
  COUNTRIES,
  PHONE_COUNTRY_CODES,
  MODEL_NUMBERS,
  US_STATES,
} from "./constants";

import OrderHistory from "./OrderHistory";
import ProductDetail from "./ProductDetail";
import ShipStationTracks from "./ShipStationTracks";

function App() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const toProperCase = (str) => {
    return str
      .replace(/_/g, " ")
      .replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
  };

  const [selectedCase, setSelectedCase] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Extract unique status and assigned for dropdowns

  const initialOrder = {
    first_name: "",
    last_name: "",
    mid: "",
    model_number: "",
    issues: "",
    case_number: "",
    email: "",
    sales_order: "",
    date: "",
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
    phone_code: "+1",
  };
  const [newOrder, setNewOrder] = useState(initialOrder);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const requiredFields = [
    "first_name",
    "last_name",
    "phone_number",
    "email",
    "street",
    "city",
    "zip_code",
    "country",
    "state",
    "sales_order",
    "date",
    "assign",
    "status",
    "model_number",
    "serial",
    "issues",
  ];
  const [searchName, setSearchName] = useState("");

  // useEffect for getting orders
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/orders")
      .then((response) => {
        const fetchedOrders = response.data;
        setOrders(fetchedOrders);

        // Find highest case number
        const caseNumbers = fetchedOrders
          .map((order) =>
            parseInt(order.case_number?.replace(/[^\d]/g, ""), 10)
          )
          .filter((num) => !isNaN(num));
        const maxCase = caseNumbers.length > 0 ? Math.max(...caseNumbers) : 0;
      })
      .catch((error) =>
        console.error("There was an error loading the orders!", error)
      );
  }, [newOrder.customer_name]);

  const customerName = newOrder.first_name + " " + newOrder.last_name;

  // useEffect to get customers
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/customers")
      .then((response) => {
        const fetchedCustomers = response.data;
        setCustomers(fetchedCustomers);
      })
      .catch((error) =>
        console.error("There was an error loading the customers!", error)
      );
  }, []);

  const handleCustomerRowSelect = (row) => {
    setSelectedCustomer(row);
    setNewOrder((prev) => ({
      ...prev,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      phone_number: row.phone_number,
      street: row.street,
      city: row.city,
      state: row.state,
      zip_code: row.zip_code,
      country: row.country,
    }));
  };

  const handleCaseSelect = (caseData) => {
    if (isEdited) {
      const confirmSwitch = window.confirm(
        "You have unsaved changes. Do you want to discard them?"
      );
      if (!confirmSwitch) return; // Cancel switching
    }

    setNewOrder(caseData); // Load data into all sections
    setSelectedCase(caseData.case_number);
    setIsEdited(false); // Reset edit tracking
  };

  // Set new update to the database
  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:5001/api/orders/${newOrder.id}`, newOrder)
      .then(() => axios.get("http://localhost:5001/api/orders"))
      .then((response) => {
        setOrders(response.data);
        setNewOrder(initialOrder);
      })
      .catch((error) =>
        console.error("There was an error updating the order!", error)
      );
  };

  // Set new case to the database
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const missingFields = requiredFields.filter((field) => !newOrder[field]);
      if (missingFields.length > 0) {
        alert(
          `Please fill out all required fields: ${missingFields
            .map(toProperCase)
            .join(", ")}`
        );
        return;
      }

      let customerId = null;
      if (!selectedCustomer) {
        const postCustomerResponse = await axios.post(
          "http://localhost:5001/api/customers",
          newOrder
        );
        setCustomers((prev) => [...prev, postCustomerResponse.data.customer]);
        customerId = postCustomerResponse.data.customer.id;
      } else {
        customerId = selectedCustomer.id;
        const updateCustomerResponse = await axios.put(
          `http://localhost:5001/api/customers/${customerId}`,
          newOrder
        );
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.id === customerId
              ? updateCustomerResponse.data.customer
              : customer
          )
        );
      }

      const orderPostResponse = await axios.post(
        "http://localhost:5001/api/orders",
        { ...newOrder, customer_id: customerId }
      );

      const ordersGetResponse = await axios.get(
        "http://localhost:5001/api/orders"
      );
      setOrders(ordersGetResponse.data);
      setNewOrder(initialOrder);
      setSelectedCase(null); // Clear selection
      setIsEdited(false); // Reset edit tracking
    } catch (error) {
      console.error("There was an error creating the order!", error);
    }
  };
  const [currentPage, setCurrentPage] = useState("new");
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchName.toLowerCase();
    return (
      order.customer.first_name.toLowerCase().includes(searchLower) ||
      order.customer.last_name.toLowerCase().includes(searchLower) ||
      order.case_number?.toLowerCase().includes(searchLower) ||
      order.sales_order?.toLowerCase().includes(searchLower)
    );
  });

  const renderRow = (fields) => (
    <div className="form-row">
      {fields.map((field) => (
        <div
          key={field}
          className={`form-group ${
            ["street", "email"].includes(field) ? "medium-wide" : ""
          }`}
        >
          <label>
            {toProperCase(field)}{" "}
            {requiredFields.includes(field) && (
              <span className="required-asterisk">*</span>
            )}
          </label>
          {/* Custom field types */}
          {field === "date" ? (
            <input
              type="date"
              value={newOrder[field]}
              onChange={(e) => {
                setNewOrder({ ...newOrder, [field]: e.target.value });
                setIsEdited(true); // 🔥 Track that something changed
              }}
            />
          ) : field === "phone_number" ? (
            <div className="phone-wrapper">
              <select
                value={newOrder.phone_code}
                onChange={(e) => {
                  setNewOrder({ ...newOrder, phone_code: e.target.value });
                  setIsEdited(true); // 🔥 Track that something changed
                }}
                className="area-code"
              >
                {PHONE_COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={newOrder.phone_number}
                onChange={(e) => {
                  setNewOrder({ ...newOrder, phone_number: e.target.value });
                  setIsEdited(true); // 🔥 Track that something changed
                }}
                placeholder="Phone number"
                className="phone-input"
              />
            </div>
          ) : field === "status" ? (
            <select
              value={newOrder[field]}
              onChange={(e) => {
                setNewOrder({ ...newOrder, [field]: e.target.value });
                setIsEdited(true); // 🔥 Track that something changed
              }}
            >
              <option value="">Select status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          ) : field === "country" ? (
            <select
              value={newOrder[field]}
              onChange={(e) => {
                setNewOrder({
                  ...newOrder,
                  country: e.target.value,
                  state: "", // reset state when country changes
                });
                setIsEdited(true); // 🔥 Track that something changed
              }}
            >
              <option value="">Select country</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          ) : field === "state" ? (
            newOrder.country === "USA" || newOrder.country === "Canada" ? (
              <select
                value={newOrder[field]}
                onChange={(e) => {
                  setNewOrder({ ...newOrder, [field]: e.target.value });
                  setIsEdited(true); // 🔥 Track that something changed
                }}
              >
                <option value="">Select state/province</option>
                {(newOrder.country === "USA"
                  ? US_STATES
                  : CANADA_PROVINCES
                ).map((s) => (
                  <option key={s.abbreviation} value={s.abbreviation}>
                    {s.name} ({s.abbreviation})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={newOrder[field]}
                onChange={(e) => {
                  setNewOrder({ ...newOrder, [field]: e.target.value });
                  setIsEdited(true); // 🔥 Track that something changed
                }}
                placeholder="Enter state/province"
              />
            )
          ) : field === "assign" ? (
            <select
              value={newOrder[field]}
              onChange={(e) => {
                setNewOrder({ ...newOrder, [field]: e.target.value });
                setIsEdited(true); // 🔥 Track that something changed
              }}
            >
              <option value="">Please assign to</option>
              <option value="Vincent Ma">Vincent Ma</option>
              <option value="James Tan">James Tan</option>
              <option value="Jimmy Jiang">Jimmy Jiang</option>
              <option value="May Lau">May Lau</option>
              <option value="Michael Liu">Michael Liu</option>
              <option value="Elvis Chen">Elvis Chen</option>
              <option value="Nayeli Marquez">Nayeli Marquez</option>
              <option value="Maries Nguyen">Maries Nguyen</option>
              <option value="Mariana Santamaria">Mariana Santamaria</option>
              <option value="Sheng Huang">Sheng Huang</option>
              <option value="Ivey Tam">Ivey Tam</option>
              <option value="Alexandra Geronimo">Alexandra Geronimo</option>
            </select>
          ) : ["issues", "solution", "action"].includes(field) ? (
            <textarea
              className="textarea-scroll"
              value={newOrder[field]}
              onChange={(e) => {
                setNewOrder({ ...newOrder, [field]: e.target.value });
                setIsEdited(true); // 🔥 Track that something changed
              }}
            />
          ) : field === "case_Number" ? (
            <input
              type="text"
              value={newOrder["case_Number"]}
              readOnly
              style={{ backgroundColor: "#eee", cursor: "not-allowed" }}
            />
          ) : field === "model_number" ? (
            <select
              value={newOrder[field]}
              onChange={(e) => {
                setNewOrder({ ...newOrder, [field]: e.target.value });
                setIsEdited(true); // 🔥 Track that something changed
              }}
            >
              <option value="">Select a model</option>
              {MODEL_NUMBERS.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={newOrder[field]}
              onChange={(e) => {
                setNewOrder({ ...newOrder, [field]: e.target.value });
                setIsEdited(true); // 🔥 Track that something changed
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
  const [fileType, setFileType] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }
    // Simulate upload
    alert(`Uploading ${selectedFiles.length} file(s) as ${fileType}`);
  };
  return (
    <div className="App">
      <div className="header">
        <img src="/logo_company.jpg" alt="Logo" className="logo" />
        <h2 className="title">Customer Services</h2>
        <div className="spacer" />
      </div>
      <div className="user-info-banner">
        Logged in: <strong>{loggedInUser}</strong>
      </div>
      <div
        style={{
          display: "flex",
          marginLeft: "40px",
          gap: "5px",
          marginBottom: "5px",
        }}
      >
        <div
          className={`tab ${currentPage === "new" ? "active" : ""}`}
          onClick={() => {
            setNewOrder(initialOrder);
            setCurrentPage("new");
          }}
        >
          New Case
        </div>
        <div
          className={`tab ${currentPage === "exist" ? "active" : ""}`}
          onClick={() => {
            setNewOrder(initialOrder);
            setCurrentPage("exist");
          }}
        >
          Exist Case
        </div>
      </div>
      {currentPage === "new" && (
        <form onSubmit={handleSubmit}>
          <div className="form-container">
            {/* Left Column */}
            <div className="form-left">
              <div className="form-row">
                {/* Customer/address Info */}
                <div className="form-section-card half-width">
                  <h2>
                    {selectedCustomer ? (
                      <>
                        {selectedCustomer.first_name}{" "}
                        {selectedCustomer.last_name}
                        <button
                          onClick={() => {
                            setNewOrder(initialOrder);
                            setSelectedCustomer(null);
                          }}
                        >
                          New Customer
                        </button>
                      </>
                    ) : (
                      "New Customer"
                    )}
                  </h2>
                  <h3 className="section-title">Customer Info</h3>
                  {renderRow([
                    "first_name",
                    "last_name",
                    "mid",
                    "phone_number",
                    "email",
                  ])}
                  <h3 className="section-title">Address Info</h3>
                  {renderRow([
                    "street",
                    "city",
                    "zip_code",
                    "country",
                    "state",
                  ])}
                </div>

                {/* Order/extra Info */}
                <div className="form-section-card half-width">
                  <h3 className="section-title">Order Info</h3>
                  {renderRow([
                    "sales_order",
                    "date",
                    "assign",
                    "status",
                    "case_Number",
                  ])}
                  <h3 className="section-title">Extra Info</h3>
                  {renderRow(["file_name", "tracking", "return_status"])}
                </div>
              </div>
              {/* next container column */}
              <div className="form-container">
                <div className="form-left search-order">
                  {/* customer search bar */}
                  <div className="form-section-card search-bar">
                    <input
                      type="text"
                      className="form-input search-input"
                      placeholder="Search by customer name"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                    />
                    <table>
                      <thead>
                        <tr>
                          <th>Customer Name</th>
                          <th>Phone Number</th>
                          <th>Email</th>
                          <th>Address</th>
                          <th>Recorded By</th>
                          <th>Created Date</th>
                          <th>Last Updated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers
                          .filter((customer) =>
                            [customer.first_name, customer.last_name]
                              .join(" ")
                              .toLowerCase()
                              .includes(searchName.toLowerCase())
                          )
                          .map((customer, idx) => (
                            <tr
                              key={idx}
                              onDoubleClick={() =>
                                handleCustomerRowSelect(customer)
                              }
                            >
                              <td>
                                {customer.first_name} {customer.last_name}
                              </td>
                              <td>{customer.phone_number}</td>
                              <td>{customer.email}</td>
                              <td>
                                {customer.street}, {customer.city},{" "}
                                {customer.state},{customer.country}{" "}
                                {customer.zip_code}
                              </td>
                              <td>{customer.loggedInUser}</td>
                              <td>
                                {new Date(
                                  customer.created_at
                                ).toLocaleDateString()}{" "}
                                {new Date(
                                  customer.created_at
                                ).toLocaleTimeString()}
                              </td>
                              <td>{customer.last_updated}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <ShipStationTracks shipStationTracks={[]} />
                </div>
                <div className="form-left ship-product">
                  <OrderHistory
                    orders={orders}
                    customer_id={selectedCustomer?.id}
                  />
                  <ProductDetail />
                </div>
              </div>
            </div>

            {/* Right Column - Case Detail */}
            <div className="form-right sticky-right">
              <div className="form-section-card">
                <h3 className="section-title">Case Detail</h3>
                {renderRow([
                  "model_number",
                  "serial",
                  "issues",
                  "solution",
                  "action",
                ])}
                <div className="action-buttons">
                  <button
                    onClick={handleSubmit}
                    className="btn-small btn-create"
                  >
                    Create New
                  </button>
                </div>
              </div>

              <div className="form-section-card">
                <h3 className="section-title">Attachments</h3>

                {/* File Type Dropdown */}
                <div className="form-group medium-wide">
                  <label>Select File Type</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select type</option>
                    <option value="screenshot">Screenshot</option>
                    <option value="log">Log File</option>
                    <option value="pdf">PDF</option>
                    <option value="image">Image</option>
                  </select>
                </div>

                {/* File Input & Buttons */}
                <div
                  className="form-row"
                  style={{
                    alignItems: "center",
                    gap: "1rem",
                    marginTop: "10px",
                  }}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.txt,.log"
                    onChange={handleFileChange}
                    className="form-input"
                  />

                  <button
                    type="button"
                    onClick={handleUpload}
                    style={{ height: "36px" }}
                  >
                    Upload
                  </button>
                </div>

                {/* Preview Section */}
                <div style={{ marginTop: "10px" }}>
                  {selectedFiles.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: "14px", marginBottom: "8px" }}>
                        Selected Files:
                      </h4>
                      <ul style={{ listStyle: "none", padding: 0 }}>
                        {selectedFiles.map((file, index) => (
                          <li key={index} style={{ marginBottom: "6px" }}>
                            {file.type.startsWith("image/") ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  marginRight: "10px",
                                }}
                              />
                            ) : (
                              <span
                                style={{
                                  fontSize: "13px",
                                  marginRight: "10px",
                                }}
                              >
                                {file.name}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              style={{
                                fontSize: "12px",
                                padding: "4px 8px",
                                background: "#dc3545",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
      {currentPage === "exist" && (
        <form onSubmit={handleSubmit}>
          <div className="form-container">
            {/* Left Column */}
            <div className="form-left">
              {/* Search bar */}
              <div className="form-section-card search-bar">
                <input
                  type="text"
                  className="form-input search-input"
                  placeholder="Search by customer name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <table>
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Case</th>
                      <th>Sales Order</th>
                      <th>Issues</th>
                      <th>Action</th>
                      <th>Status</th>
                      <th>Recorded By</th>
                      <th>Assigned To</th>
                      <th>Created Date</th>
                      <th>Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders
                      .filter((order) =>
                        [order.customer.first_name, order.customer.last_name]
                          .join(" ")
                          .toLowerCase()
                          .includes(searchName.toLowerCase())
                      )
                      .map((order, idx) => (
                        <tr
                          key={idx}
                          onDoubleClick={() => handleCaseSelect(order)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>
                            {order.customer.first_name}{" "}
                            {order.customer.last_name}
                          </td>
                          <td>{order.case_number}</td>
                          <td>{order.sales_order}</td>
                          <td>{order.issues}</td>
                          <td>{order.action}</td>
                          <td>{order.status}</td>
                          <td>{order.recorded_by}</td>
                          <td>{order.assign}</td>
                          <td>
                            {new Date(order.created_at).toLocaleDateString()}{" "}
                            {new Date(order.created_at).toLocaleTimeString()}
                          </td>
                          <td>
                            {order.updated_at ? (
                              <>
                                {new Date(
                                  order.updated_at
                                ).toLocaleDateString()}{" "}
                                {new Date(
                                  order.updated_at
                                ).toLocaleTimeString()}
                              </>
                            ) : (
                              ""
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Product detail */}
              <div className="form-section-card">
                <ProductDetail />
              </div>
              <div className="form-row">
                {/* Customer Info */}
                <div className="form-section-card half-width">
                  <h3 className="section-title">Customer Info</h3>
                  {renderRow([
                    "first_name",
                    "last_name",
                    "mid",
                    "phone_number",
                    "email",
                  ])}
                  <h3 className="section-title">Address Info</h3>
                  {renderRow([
                    "street",
                    "city",
                    "zip_code",
                    "country",
                    "state",
                  ])}
                </div>

                {/* Order Info */}
                <div className="form-section-card half-width">
                  <h3 className="section-title">Order Info</h3>
                  {renderRow([
                    "sales_order",
                    "date",
                    "assign",
                    "status",
                    "case_Number",
                  ])}
                  <h3 className="section-title">Extra Info</h3>
                  {renderRow(["file_name", "tracking", "return_status"])}
                </div>
              </div>

              {/* Right Column - Case Detail */}
              <div className="form-right sticky-right">
                <div className="form-section-card">
                  <h3 className="section-title">Case Detail</h3>
                  {renderRow([
                    "model_number",
                    "serial",
                    "issues",
                    "solution",
                    "action",
                  ])}
                  <div className="action-buttons">
                    <button
                      onClick={handleSubmit}
                      className="btn-small btn-create"
                    >
                      Create New
                    </button>
                    <button
                      onClick={handleUpdate}
                      className={`btn-small ${
                        newOrder.case_number ? "btn-update" : "btn-disabled"
                      }`}
                    >
                      Update Case
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default App;
