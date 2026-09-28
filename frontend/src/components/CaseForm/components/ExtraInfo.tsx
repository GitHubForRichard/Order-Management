import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField,
  Typography,
  Stack,
} from "@mui/material";

import { useGetModelNumbersQuery } from "rtk/casesApi";

type ModelNumberOption = { label: string; value: string };

const ExtraInfo = ({ disabled = false }) => {
  const { control } = useFormContext();

  const { data: modelNumbersData } = useGetModelNumbersQuery();
  const modelNumbers = modelNumbersData?.model_numbers || [];

  const modelNumberOptions = modelNumbers.map((modelNumber) => ({
    label: modelNumber,
    value: modelNumber,
  }));

  // Not wired to the form yet, so selections are not saved
  const [selectedModelNumbers, setSelectedModelNumbers] = useState<
    ModelNumberOption[]
  >([]);

  return (
    <Box>
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

      <Stack direction="column">
        <Controller
          name="return_for_service"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={!!field.value}
                  disabled={disabled}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label="Return for Service"
            />
          )}
        />

        <Controller
          name="warranty_replacement"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={!!field.value}
                  disabled={disabled}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label="Warranty Replacement"
            />
          )}
        />

        <FormControl fullWidth margin="normal" variant="outlined" size="small">
          <Autocomplete
            multiple
            disableCloseOnSelect
            disablePortal
            options={modelNumberOptions}
            value={selectedModelNumbers}
            disabled={disabled}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            onChange={(_, newValue) => setSelectedModelNumbers(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Parts" />
            )}
          />
        </FormControl>
      </Stack>
    </Box>
  );
};

export default ExtraInfo;
