import { useFormContext, Controller } from "react-hook-form";
import {
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";

import { MODEL_NUMBERS } from "../../../constants";

const CaseDetail = () => {
  const { control } = useFormContext();

  return (
    <div>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, 
        color: "#3d79bdff",       // modern blue color (Material UI primary)
        fontWeight: 500,         // medium weight
        letterSpacing: "0.5px",  // subtle spacing
        textTransform: "capitalize", // optional, modern look
        borderBottom: "1px solid #31609eff",
        display: "inline-block", // makes the line match text width
        fontStyle: "normal",}}>
        Case Detail
      </Typography>

      <Stack spacing={2}>
        <FormControl fullWidth margin="normal" variant="outlined" size="small" required>
          <InputLabel id="model-number-label">Model</InputLabel>
          <Controller
            name="model_number"
            control={control}
            rules={{ required: "Model Name is required" }}
            render={({ field }) => (
              <Select {...field} labelId="model-number-label" label="Model">
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {MODEL_NUMBERS.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        <Controller
          name="serial"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Serial"
              variant="outlined"
              fullWidth
              margin="normal"
              size="small"
            />
          )}
        />

        <Controller
          name="issues"
          control={control}
          rules={{ required: "Issues is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              label="Issues"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
          )}
        />

        <Controller
          name="solution"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Solution"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
          )}
        />

        <Controller
          name="action"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Action"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
          )}
        />
      </Stack>
    </div>
  );
};

export default CaseDetail;
