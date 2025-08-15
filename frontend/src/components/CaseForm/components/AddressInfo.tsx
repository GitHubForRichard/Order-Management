import { Controller, useFormContext } from "react-hook-form";
import {
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  TextField,
  Typography,
  Stack,
} from "@mui/material";

import { CANADA_PROVINCES, COUNTRIES, US_STATES } from "../../../constants";

const AddressInfo = () => {
  const { control, watch } = useFormContext();

  const country = watch("country");

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
        Address Info
      </Typography>

      <Stack direction="row" spacing={2} >
        {/* Street */}
        <Controller
          name="street"
          control={control}
          rules={{ required: "Street is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Street"
              variant="outlined"
              required
              error={!!fieldState.error}
              helperText={fieldState.error ? fieldState.error.message : null}
              margin="normal"
              size="small"
              sx={{ width: '400px' }}
            />
          )}
        />

        {/* City */}
        <Controller
          name="city"
          control={control}
          rules={{ required: "City is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="City"
              variant="outlined"
              required
              error={!!fieldState.error}
              helperText={fieldState.error ? fieldState.error.message : null}
              margin="normal"
              size="small"
              sx={{ flex: 1 }}
            />
          )}
        />
      </Stack>
        
      <Stack direction="row" spacing={2} flexWrap="wrap" mt={3} mb={4}>
        {/* Country */}
        <FormControl required margin="normal" size="small" sx={{ width: '200px' }}>
          <InputLabel id="country-label">Country</InputLabel>
          <Controller
            name="country"
            control={control}
            rules={{ required: "Country is required" }}
            defaultValue=""
            render={({ field, fieldState }) => (
              <Select
                {...field}
                labelId="country-label"
                label="Country"
                error={!!fieldState.error}
              >
                {COUNTRIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        {/* State / Province */}
        {country === "USA" || country === "Canada" ? (
          <FormControl required margin="normal" size="small" sx={{ width: '250px' }}>
            <InputLabel id="state-label">State / Province</InputLabel>
            <Controller
              name="state"
              control={control}
              rules={{ required: "State/Province is required" }}
              defaultValue=""
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  labelId="state-label"
                  label="State / Province"
                  error={!!fieldState.error}
                >
                  {(country === "USA" ? US_STATES : CANADA_PROVINCES).map((s) => (
                    <MenuItem key={s.abbreviation} value={s.abbreviation}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        ) : (
          <Controller
            name="state"
            control={control}
            rules={{ required: "State/Province is required" }}
            defaultValue=""
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="State / Province"
                variant="outlined"
                required
                error={!!fieldState.error}
                helperText={fieldState.error ? fieldState.error.message : null}
                margin="normal"
                size="small"
                sx={{ width: '250px' }}
              />
            )}
          />
        )}
          {/* Zip Code */}
          <Controller
            name="zip_code"
            control={control}
            rules={{ required: "Zip Code is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Zip Code"
                variant="outlined"
                required
                error={!!fieldState.error}
                helperText={fieldState.error ? fieldState.error.message : null}
                margin="normal"
                sx={{ flex: 1 }} 
                size="small"
              />
            )}
          />
        
      
      </Stack>
    </div>
  );
};

export default AddressInfo;
