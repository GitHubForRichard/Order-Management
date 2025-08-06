import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [orders, setOrders] = useState([]);
  const toProperCase = (str) => {
  return str
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };
  const [loggedInUser, setLoggedInUser] = useState("Xiaoyin Zhang"); // Replace with your actual logic
  const initialOrder = {
    first_name: "",
    last_name: "",
    mid: "",
    phone_number: "",
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
  };

  const countryCodes = [
  { code: "+1", name: "USA/Canada" },
  { code: "+44", name: "UK" },
  { code: "+61", name: "Australia" },
  { code: "+81", name: "Japan" },
  { code: "+49", name: "Germany" },
  { code: "+91", name: "India" },
  { code: "+33", name: "France" },
  { code: "+86", name: "China" },
  { code: "+82", name: "South Korea" },
  { code: "+34", name: "Spain" },
  // Add more as needed
  ];

  const countries = ["USA", "Canada", "UK", "Australia"];
  const usStates = [
  { name: "Alabama", abbreviation: "AL" },
  { name: "Alaska", abbreviation: "AK" },
  { name: "Arizona", abbreviation: "AZ" },
  { name: "Arkansas", abbreviation: "AR" },
  { name: "California", abbreviation: "CA" },
  { name: "Colorado", abbreviation: "CO" },
  { name: "Connecticut", abbreviation: "CT" },
  { name: "Delaware", abbreviation: "DE" },
  { name: "Florida", abbreviation: "FL" },
  { name: "Georgia", abbreviation: "GA" },
  { name: "Hawaii", abbreviation: "HI" },
  { name: "Idaho", abbreviation: "ID" },
  { name: "Illinois", abbreviation: "IL" },
  { name: "Indiana", abbreviation: "IN" },
  { name: "Iowa", abbreviation: "IA" },
  { name: "Kansas", abbreviation: "KS" },
  { name: "Kentucky", abbreviation: "KY" },
  { name: "Louisiana", abbreviation: "LA" },
  { name: "Maine", abbreviation: "ME" },
  { name: "Maryland", abbreviation: "MD" },
  { name: "Massachusetts", abbreviation: "MA" },
  { name: "Michigan", abbreviation: "MI" },
  { name: "Minnesota", abbreviation: "MN" },
  { name: "Mississippi", abbreviation: "MS" },
  { name: "Missouri", abbreviation: "MO" },
  { name: "Montana", abbreviation: "MT" },
  { name: "Nebraska", abbreviation: "NE" },
  { name: "Nevada", abbreviation: "NV" },
  { name: "New Hampshire", abbreviation: "NH" },
  { name: "New Jersey", abbreviation: "NJ" },
  { name: "New Mexico", abbreviation: "NM" },
  { name: "New York", abbreviation: "NY" },
  { name: "North Carolina", abbreviation: "NC" },
  { name: "North Dakota", abbreviation: "ND" },
  { name: "Ohio", abbreviation: "OH" },
  { name: "Oklahoma", abbreviation: "OK" },
  { name: "Oregon", abbreviation: "OR" },
  { name: "Pennsylvania", abbreviation: "PA" },
  { name: "Rhode Island", abbreviation: "RI" },
  { name: "South Carolina", abbreviation: "SC" },
  { name: "South Dakota", abbreviation: "SD" },
  { name: "Tennessee", abbreviation: "TN" },
  { name: "Texas", abbreviation: "TX" },
  { name: "Utah", abbreviation: "UT" },
  { name: "Vermont", abbreviation: "VT" },
  { name: "Virginia", abbreviation: "VA" },
  { name: "Washington", abbreviation: "WA" },
  { name: "West Virginia", abbreviation: "WV" },
  { name: "Wisconsin", abbreviation: "WI" },
  { name: "Wyoming", abbreviation: "WY" }
  ];
  const canadaProvinces = [
  { name: "Alberta", abbreviation: "AB" },
  { name: "British Columbia", abbreviation: "BC" },
  { name: "Manitoba", abbreviation: "MB" },
  { name: "New Brunswick", abbreviation: "NB" },
  { name: "Newfoundland and Labrador", abbreviation: "NL" },
  { name: "Nova Scotia", abbreviation: "NS" },
  { name: "Ontario", abbreviation: "ON" },
  { name: "Prince Edward Island", abbreviation: "PE" },
  { name: "Quebec", abbreviation: "QC" },
  { name: "Saskatchewan", abbreviation: "SK" },
  { name: "Northwest Territories", abbreviation: "NT" },
  { name: "Nunavut", abbreviation: "NU" },
  { name: "Yukon", abbreviation: "YT" }
  ];
  const requiredFields = [
  "first_name", "last_name", "phone_number", "email", 
  "street", "city", "zip_code", "country", "state", 
  "sales_order", "date", "assign", "status", 
  "model_number", "serial", "issues"
  ];
  const [productDetail, setProductDetail] = useState(null);

  const handleProductSearch = () => {
    const model = newOrder.model_number.trim();
    if (!model) return alert("Please enter a model number.");

    axios
      .get(`http://localhost:5001/api/products/${model}`)
      .then((res) => {
        setProductDetail(res.data);
      })
      .catch((err) => {
        console.error("Product not found", err);
        setProductDetail(null);
      });
  };
  const [newOrder, setNewOrder] = useState(initialOrder);
  const modelNumberList = [
  "ABC123",
  "XYZ789",
  "DEF456",
  "GHI012",
  "JKL345"
  ];
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
  axios
    .get("http://localhost:5001/api/orders")
    .then((response) => {
      const fetchedOrders = response.data.orders;
      setOrders(fetchedOrders);

      // Find highest case number
      const caseNumbers = fetchedOrders
        .map((order) => parseInt(order.case?.replace(/[^\d]/g, ""), 10))
        .filter((num) => !isNaN(num));
        
      const maxCase = caseNumbers.length > 0 ? Math.max(...caseNumbers) : 0;

      // Set new order with next case number
      setNewOrder((prev) => ({
        ...prev,
        case: `CASE-${String(maxCase + 1).padStart(3, "0")}`,
      }));
    })
    .catch((error) =>
      console.error("There was an error loading the orders!", error)
    );
}, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const missingFields = requiredFields.filter(field => !newOrder[field]);
    if (missingFields.length > 0) {
    alert(`Please fill out all required fields: ${missingFields.map(toProperCase).join(", ")}`);
    return;
    }
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

  const renderRow = (fields) => (
    <div className="form-row">
      {fields.map((field) => (
        <div
          key={field}
          className={`form-group ${["street", "email"].includes(field) ? "medium-wide" : ""}`}
        >

          <label>{toProperCase(field)}{" "}
          {requiredFields.includes(field) && <span className="required-asterisk">*</span>}</label>
          {/* Custom field types */}
          {field === "date" ? (
            <input
              type="date"
              value={newOrder[field]}
              onChange={(e) =>
                setNewOrder({ ...newOrder, [field]: e.target.value })
              }
            />
          ) : field === "phone_number" ? (
            <div className="phone-wrapper">
              <select
                value={newOrder.phoneCode || "+1"}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, phoneCode: e.target.value })
                }
                className="area-code"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={newOrder.phone}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, phone: e.target.value })
                }
                placeholder="Phone number"
                className="phone-input"
              />
            </div>
          ) : field === "status" ? (
            <select
              value={newOrder[field]}
              onChange={(e) =>
                setNewOrder({ ...newOrder, [field]: e.target.value })
              }
            >
              <option value="">Select status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          ) : field === "country" ? (
            <select
              value={newOrder[field]}
              onChange={(e) =>
                setNewOrder({
                  ...newOrder,
                  country: e.target.value,
                  state: "", // reset state when country changes
                })
              }
            >
              <option value="">Select country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          ) : field === "state" ? (
            newOrder.country === "USA" || newOrder.country === "Canada" ? (
              <select
                value={newOrder[field]}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, [field]: e.target.value })
                }
              >
                <option value="">Select state/province</option>
                {(newOrder.country === "USA" ? usStates : canadaProvinces).map(
                  (s) => (
                    <option key={s.abbreviation} value={s.abbreviation}>
                      {s.name} ({s.abbreviation})
                    </option>
                  )
                )}
              </select>
            ) : (
              <input
                type="text"
                value={newOrder[field]}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, [field]: e.target.value })
                }
                placeholder="Enter state/province"
              />
            )
          ) : field === "assign" ? (
            <select
              value={newOrder[field]}
              onChange={(e) =>
                setNewOrder({ ...newOrder, [field]: e.target.value })
              }
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
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, [field]: e.target.value })
                  }
                />
              ) : field === "case Number" ? (
                <input
                  type="text"
                  value={newOrder["case Number"]}
                  readOnly
                  style={{ backgroundColor: "#eee", cursor: "not-allowed" }}
                />
              ) : field === "model_number" ? (
                <select
                  value={newOrder[field]}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, [field]: e.target.value })
                  }
                >
                  <option value="">Select a model</option>
                  {modelNumberList.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={newOrder[field]}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, [field]: e.target.value })
                  }
                />
              )}
        </div>
      ))}
    </div>
  );
  const [fileType, setFileType] = useState('');
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
      <h2>Create New Order</h2>
      <div className="user-info-banner">
        Logged in: <strong>{loggedInUser}</strong>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          {/* Left Column */}
          <div className="form-left">
            <div className="form-row">
              {/* Customer Info */}
              <div className="form-section-card half-width">
                <h3 className="section-title">Customer Info</h3>
                {renderRow(["first_name", "last_name", "mid", "phone_number", "email"])}
                <h3 className="section-title">Address Info</h3>
                {renderRow(["street", "city", "zip_code", "country", "state"])}
              </div>

              {/* Order Info */}
              <div className="form-section-card half-width">
                <h3 className="section-title">Order Info</h3>
                {renderRow(["sales_order", "date", "assign", "status", "case Number"])}
                <h3 className="section-title">Extra Info</h3>
                {renderRow(["file_name", "tracking", "return_status"])}
              </div>
            </div>
            <div className="form-section-card">
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
                      order.customer_name.toLowerCase().includes(searchName.toLowerCase())
                    )
                    .map((order, idx) => (
                      <tr key={idx}>
                        <td>{order.customer_name}</td>
                        <td>{order.case_number}</td>
                        <td>{order.sales_order}</td>
                        <td>{order.issues}</td>
                        <td>{order.action}</td>
                        <td>{order.status}</td>
                        <td>{order.recorded_by}</td>
                        <td>{order.assign}</td>
                        <td>{order.created_date}</td>
                        <td>{order.last_update_date}</td>
                      </tr>
                    ))}
                </tbody>

              </table>
            </div>
          </div>
        
          {/* Right Column - Case Detail */}
          <div className="form-right sticky-right">
            <div className="form-section-card">
              <h3 className="section-title">Case Detail</h3>
              {renderRow(["model_number", "serial", "issues", "solution", "action"])}
            </div>

            {/* Product detail */}
            <div className="form-section-card">
              <div className="product-detail-header">
                <h3 className="section-title">Product Detail</h3>
                <button
                  type="button"
                  className="search-button"
                  onClick={handleProductSearch}
                >
                  Search
                </button>
              </div>
              {productDetail ? (
                <div className="product-detail-content">
                  <div className="product-image">
                    {productDetail.imageUrl ? (
                      <img src={productDetail.imageUrl} alt="Product" />
                    ) : (
                      <div className="image-placeholder">No Image</div>
                    )}
                  </div>
                  <div className="product-description">
                    <p>{productDetail.description}</p>
                  </div>
                </div>
              ) : (
                <p className="no-detail-text">No product detail found.</p>
              )}
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
              <div className="form-row" style={{ alignItems: "center", gap: "1rem", marginTop: "10px" }}>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.txt,.log"
                  onChange={handleFileChange}
                  className="form-input"
                />

                <button type="button" onClick={handleUpload} style={{ height: "36px" }}>
                  Upload
                </button>
              </div>

              {/* Preview Section */}
              <div style={{ marginTop: "10px" }}>
                {selectedFiles.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: "14px", marginBottom: "8px" }}>Selected Files:</h4>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {selectedFiles.map((file, index) => (
                        <li key={index} style={{ marginBottom: "6px" }}>
                          {file.type.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px", marginRight: "10px" }}
                            />
                          ) : (
                            <span style={{ fontSize: "13px", marginRight: "10px" }}>{file.name}</span>
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
                              cursor: "pointer"
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

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
