import React from "react";

const OrderHistory = ({ orders, customer_id }) => {
  const historyOrders = orders
    .filter((order) => order.customer.id === customer_id)
    .sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

  return (
    <div className="form-section-card order-history">
      <h3 className="section-title">Order History</h3>
      {historyOrders.length > 0 ? (
        <table className="order-history-table">
          <thead>
            <tr>
              <th>Sales Order</th>
              <th>Model Name</th>
              <th>Order Date</th>
              <th>Marketplace</th>
              <th>Ship Status</th>
            </tr>
          </thead>
          <tbody>
            {historyOrders.map((order, idx) => (
              <tr key={idx}>
                <td>{order.sales_order}</td>
                <td>{order.model_number}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>{order.marketplace}</td>
                <td>{order.ship_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-detail-text">
          No order history found for this customer.
        </p>
      )}
    </div>
  );
};

export default OrderHistory;
