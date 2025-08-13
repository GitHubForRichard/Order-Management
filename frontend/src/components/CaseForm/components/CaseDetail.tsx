import { useFormContext, Controller } from "react-hook-form";
import {
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";

import { MODEL_NUMBERS } from "../../../constants";

const CaseDetail = () => {
  const { control } = useFormContext();

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Case Detail
      </Typography>

      <FormControl fullWidth margin="normal" variant="outlined">
        <InputLabel id="model-number-label">Model</InputLabel>
        <Controller
          name="model_number"
          control={control}
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
          />
        )}
      />

      <Controller
        name="issues"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
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
    </div>
  );
};

export default CaseDetail;
