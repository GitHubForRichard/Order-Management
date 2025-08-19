import { useFormContext, Controller } from "react-hook-form";
import { TextField, Typography, Stack } from "@mui/material";

const ExtraInfo = ({ disabled = false }) => {
  const { control } = useFormContext();

  return (
    <div>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mb: 3,
          color: "#3d79bdff", // modern blue color (Material UI primary)
          fontWeight: 500, // medium weight
          letterSpacing: "0.5px", // subtle spacing
          textTransform: "capitalize", // optional, modern look
          borderBottom: "1px solid #31609eff",
          display: "inline-block", // makes the line match text width
          fontStyle: "normal",
        }}
      >
        Extra Info
      </Typography>

      <Stack direction="row" spacing={2}>
        <Controller
          disabled={disabled}
          name="tracking"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Tracking"
              variant="outlined"
              margin="normal"
              size="small"
              sx={{ width: "350px" }}
            />
          )}
        />

        <Controller
          disabled={disabled}
          name="return_status"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Return Status"
              variant="outlined"
              margin="normal"
              size="small"
              sx={{ flex: 1 }}
            />
          )}
        />
      </Stack>
    </div>
  );
};

export default ExtraInfo;
