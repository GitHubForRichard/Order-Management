import React from "react";
import axios from "axios";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import api from "../api";

const ShipStationTracks = ({ trackingNumber }) => {
  const [shipStationTracks, setShipStationTracks] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (trackingNumber) {
      // Fetch ShipStation tracking information
      const fetchTrackingInfo = async () => {
        try {
          const response = await api.get(`shipstation/${trackingNumber}`);
          setShipStationTracks(response.data.shipments || []);
        } catch (error) {
          console.error("Error fetching ShipStation tracking info:", error);
        }
      };

      fetchTrackingInfo();
    }
  }, [trackingNumber]);

  return (
    trackingNumber && (
      <div className="form-section-card shipstation-track">
        <h3 className="section-title">ShipStation Track</h3>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Carrier</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Recipient</TableCell>
                <TableCell>Ship Date</TableCell>
                <TableCell>Tracking Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shipStationTracks.map((row) => (
                <TableRow
                  key={row.carrierCode}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row.carrierCode}</TableCell>
                  <TableCell>{row.serviceCode}</TableCell>
                  <TableCell>{row.shipTo?.name}</TableCell>
                  <TableCell>
                    {new Date(row.shipDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{row.trackingNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  );
};

export default ShipStationTracks;
