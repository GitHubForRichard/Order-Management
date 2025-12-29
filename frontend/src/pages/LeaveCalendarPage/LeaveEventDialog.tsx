import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const LeaveEventDialog = ({ selectedLeave, setSelectedLeave }) => {
  return (
    <Dialog
      open={!!selectedLeave}
      onClose={() => setSelectedLeave(null)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <Typography variant="h6" align="center">
          {selectedLeave?.title}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {selectedLeave && (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body1" gutterBottom>
              <strong>Status:</strong> {selectedLeave.status}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Start:</strong> {selectedLeave.start.toLocaleDateString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>End:</strong> {selectedLeave.end.toLocaleDateString()}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        <Button variant="contained" onClick={() => setSelectedLeave(null)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeaveEventDialog;
