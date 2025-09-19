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

const AddressInfo = ({ disabled = false }) => {
  const { control, watch, setValue } = useFormContext();
  const country = watch("country");

  // Fetch city/state from Zippopotam
  const fetchCityState = async (zip: string) => {
    try {
      if (country !== "USA") return;

      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!res.ok) {
        setValue("city", "", { shouldValidate: true });
        setValue("state", "", {
          shouldValidate: true,
        });
      }
      const data = await res.json();

      if (data?.places?.length > 0) {
        const place = data.places[0];
        setValue("city", place["place name"], { shouldValidate: true });
        setValue("state", place["state abbreviation"], {
          shouldValidate: true,
        });
      }
    } catch (err) {
      console.error("Failed to fetch city/state:", err);
    }
  };

  return (
    <div>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mb: 3,
          color: "#3d79bdff",
          fontWeight: 500,
          letterSpacing: "0.5px",
          textTransform: "capitalize",
          borderBottom: "1px solid #31609eff",
          display: "inline-block",
          fontStyle: "normal",
        }}
      >
        Address Info
      </Typography>

      <Stack direction="row" spacing={2}>
        {/* Street */}
        <Controller
          disabled={disabled}
          name="street"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Street"
              variant="outlined"
              error={!!fieldState.error}
              helperText={fieldState.error?.message || null}
              margin="normal"
              size="small"
              sx={{ width: "400px" }}
            />
          )}
        />

        {/* City */}
        <Controller
          disabled={disabled}
          name="city"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="City"
              variant="outlined"
              error={!!fieldState.error}
              helperText={fieldState.error?.message || null}
              margin="normal"
              size="small"
              sx={{ flex: 1 }}
            />
          )}
        />
      </Stack>

      <Stack direction="row" spacing={2} flexWrap="wrap" mt={3} mb={4}>
        {/* Country */}
        <FormControl margin="normal" size="small" sx={{ width: "200px" }}>
          <InputLabel id="country-label">Country</InputLabel>
          <Controller
            disabled={disabled}
            name="country"
            control={control}
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
          <FormControl margin="normal" size="small" sx={{ width: "250px" }}>
            <InputLabel id="state-label">State / Province</InputLabel>
            <Controller
              disabled={disabled}
              name="state"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  labelId="state-label"
                  label="State / Province"
                  error={!!fieldState.error}
                >
                  {(country === "USA" ? US_STATES : CANADA_PROVINCES).map(
                    (s) => (
                      <MenuItem key={s.abbreviation} value={s.abbreviation}>
                        {s.name}
                      </MenuItem>
                    )
                  )}
                </Select>
              )}
            />
          </FormControl>
        ) : (
          <Controller
            disabled={disabled}
            name="state"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="State / Province"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message || null}
                margin="normal"
                size="small"
                sx={{ width: "250px" }}
              />
            )}
          />
        )}

        {/* Zip Code */}
        <Controller
          disabled={disabled}
          name="zip_code"
          control={control}
          rules={{
            required: "Zip Code is required",
            pattern: {
              value: /^\d{5}$/, // only 5 digit numbers
              message: "Zip Code must be 5 digits",
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Zip Code"
              variant="outlined"
              error={!!fieldState.error}
              helperText={fieldState.error?.message || null}
              margin="normal"
              sx={{ flex: 1 }}
              size="small"
              onBlur={(e) => {
                field.onBlur();
                const zipCode = e.target.value;
                // Only fetch if valid 5-digit zip code
                if (/^\d{5}$/.test(zipCode)) {
                  fetchCityState(zipCode);
                }
              }}
            />
          )}
        />
      </Stack>
    </div>
  );
};

export default AddressInfo;
