import React from "react";

const ShipStationTracks = ({ shipStationTracks }) => {
  return (
    <div className="form-section-card shipstation-track">
      <h3 className="section-title">ShipStation Track</h3>
      {shipStationTracks.length > 0 ? (
        <table className="shipstation-table">
          <thead>
            <tr>
              <th>Order#</th>
              <th>Provider</th>
              <th>Recipient</th>
              <th>Service</th>
              <th>Ship Date</th>
              <th>Ship From</th>
              <th>Tracking Number</th>
            </tr>
          </thead>
          <tbody>
            {shipStationTracks.map((shipment, idx) => (
              <tr key={idx}>
                <td>{shipment.orderNumber}</td>
                <td>{shipment.carrierCode}</td>
                <td>{shipment.recipient?.name}</td>
                <td>{shipment.serviceCode}</td>
                <td>{new Date(shipment.shipDate).toLocaleDateString()}</td>
                <td>
                  {shipment.shipFrom?.city}, {shipment.shipFrom?.state}
                </td>
                <td>{shipment.trackingNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-detail-text">No shipments found for this customer.</p>
      )}
    </div>
  );
};

export default ShipStationTracks;
