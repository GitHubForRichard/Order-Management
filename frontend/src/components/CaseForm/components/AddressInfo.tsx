import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { CANADA_PROVINCES, COUNTRIES, US_STATES } from "../../../constants";

const AddressInfo = () => {
  const { control, watch } = useFormContext({
    defaultValues: {
      street: "",
      city: "",
      zip_code: "",
      country: "",
      state: "",
    },
  });

  const country = watch("country");

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Address Info
      </Typography>

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
            fullWidth
            required
            error={!!fieldState.error}
            helperText={fieldState.error ? fieldState.error.message : null}
            margin="normal"
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
            fullWidth
            required
            error={!!fieldState.error}
            helperText={fieldState.error ? fieldState.error.message : null}
            margin="normal"
          />
        )}
      />

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
            fullWidth
            required
            error={!!fieldState.error}
            helperText={fieldState.error ? fieldState.error.message : null}
            margin="normal"
          />
        )}
      />

      {/* Country */}
      <FormControl fullWidth required margin="normal">
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
        <FormControl fullWidth required margin="normal">
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
              fullWidth
              required
              error={!!fieldState.error}
              helperText={fieldState.error ? fieldState.error.message : null}
              margin="normal"
            />
          )}
        />
      )}
    </div>
  );
};

export default AddressInfo;
