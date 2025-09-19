import { useFormContext, Controller } from "react-hook-form";
import {
  Button,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  Stack,
} from "@mui/material";

import {
  CASE_FORM_ACTION_TYPES,
  PHONE_COUNTRY_CODES,
} from "../../../constants";
import { defaultValues } from "../NewCaseForm";

const CustomerInfo = ({
  caseFormActionType,
  selectedCustomer,
  setSelectedCustomer,
  disabled = false,
}) => {
  const {
    control,
    reset,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      {caseFormActionType === CASE_FORM_ACTION_TYPES.NEW && (
        <Typography variant="h4" gutterBottom>
          {selectedCustomer ? (
            <>
              {selectedCustomer.first_name} {selectedCustomer.last_name}{" "}
              <Button
                variant="contained"
                onClick={() => {
                  reset(defaultValues);
                  setSelectedCustomer(null);
                }}
              >
                Clear
              </Button>
            </>
          ) : (
            "Clear"
          )}
        </Typography>
      )}

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
        Customer Info
      </Typography>

      <Stack direction="row" spacing={2}>
        <Controller
          disabled={disabled}
          name="first_name"
          control={control}
          rules={{ required: "First name is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="First Name"
              variant="outlined"
              required
              error={!!errors.first_name}
              size="small"
              margin="normal"
              sx={{ width: "260px" }}
            />
          )}
        />
        <Controller
          disabled={disabled}
          name="middle_name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="MID"
              variant="outlined"
              margin="normal"
              sx={{ width: "100px" }}
              size="small"
            />
          )}
        />

        <Controller
          disabled={disabled}
          name="last_name"
          control={control}
          rules={{ required: "Last name is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Last Name"
              variant="outlined"
              required
              error={!!errors.last_name}
              margin="normal"
              size="small"
              sx={{ flex: 1 }}
            />
          )}
        />
      </Stack>
      <Stack direction="row" spacing={2} flexWrap="wrap" mt={3} mb={4}>
        <Controller
          disabled={disabled}
          name="phone_code"
          control={control}
          rules={{ required: "Phone code is required" }}
          render={({ field, fieldState }) => (
            <FormControl
              required
              margin="normal"
              size="small"
              sx={{ width: "70px" }}
            >
              <InputLabel id="phone-code-label" sx={{ fontSize: "0.6rem" }}>
                Code
              </InputLabel>
              <Select
                {...field}
                labelId="phone-code-label"
                label="Phone Code"
                error={!!fieldState.error}
                renderValue={(selected) => selected} // only show the code
              >
                {PHONE_COUNTRY_CODES.map((s) => (
                  <MenuItem
                    key={s.code}
                    value={s.code}
                    sx={{ fontSize: "0.8rem" }}
                  >
                    {s.code} {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <Controller
          disabled={disabled}
          name="phone_number"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Phone Number"
              variant="outlined"

              error={!!errors.phone_number}
              margin="normal"
              size="small"
            />
          )}
        />

        <Controller
          disabled={disabled}
          name="email"
          control={control}
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: "Invalid email address",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              variant="outlined"
              error={!!errors.email}
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

export default CustomerInfo;
