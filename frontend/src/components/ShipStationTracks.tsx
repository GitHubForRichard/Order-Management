import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useGetShipStationTrackingQuery } from "rtk/casesApi";

const ShipStationTracks = ({ trackingNumber }) => {
  const { data: shipStationTracks = [] } = useGetShipStationTrackingQuery(
    {
      trackingNumber,
    },
    {
      skip: !trackingNumber,
    }
  );

  return (
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
  );
};

export default ShipStationTracks;
