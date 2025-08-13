import React from "react";

const CustomerList = ({ customers, onRowDoubleClicked }) => {
  const [searchName, setSearchName] = React.useState("");

  return (
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
                    onRowDoubleClicked && onRowDoubleClicked(customer)
                  }
                >
                  <td>
                    {customer.first_name} {customer.last_name}
                  </td>
                  <td>
                    {customer.phone_code} {customer.phone_number}
                  </td>
                  <td>{customer.email}</td>
                  <td>
                    {customer.street}, {customer.city}, {customer.state},
                    {customer.country} {customer.zip_code}
                  </td>
                  <td>{customer.loggedInUser}</td>
                  <td>
                    {new Date(customer.created_at).toLocaleDateString()}{" "}
                    {new Date(customer.created_at).toLocaleTimeString()}
                  </td>
                  <td>{customer.last_updated}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;
