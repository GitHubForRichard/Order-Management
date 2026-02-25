import { useFormContext, Controller } from "react-hook-form";
import {
  Autocomplete,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useGetModelNumbersQuery } from "rtk/casesApi";

const CaseDetail = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const { data: modelNumbersData } = useGetModelNumbersQuery();
  const modelNumbers = modelNumbersData?.model_numbers || [];

  const modelNumberOptions = modelNumbers.map((modelNumber) => ({
    label: modelNumber,
    value: modelNumber,
  }));

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
        Case Detail
      </Typography>

      <Stack spacing={2}>
        <FormControl
          fullWidth
          margin="normal"
          variant="outlined"
          size="small"
          required
        >
          <Controller
            name="model_number"
            control={control}
            rules={{ required: "Model Number is required" }}
            render={({ field }) => (
              <Autocomplete
                disablePortal
                options={modelNumberOptions}
                value={field.value || null}
                onChange={(_, newValue) => field.onChange(newValue?.value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Model Numbers"
                    error={!!errors.model_number}
                    helperText={errors.model_number?.message?.toString() ?? ""}
                    required
                  />
                )}
              />
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
