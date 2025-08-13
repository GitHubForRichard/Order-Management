import { useFormContext, Controller } from "react-hook-form";
import { TextField, Typography } from "@mui/material";

const ExtraInfo = () => {
  const { control } = useFormContext();

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Extra Info
      </Typography>

      <Controller
        name="tracking"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Tracking"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        )}
      />

      <Controller
        name="return_status"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Return Status"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        )}
      />
    </div>
  );
};

export default ExtraInfo;
