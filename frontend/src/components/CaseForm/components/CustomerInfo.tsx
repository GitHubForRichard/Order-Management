import { useFormContext, Controller } from "react-hook-form";
import {
  Button,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { PHONE_COUNTRY_CODES } from "../../../constants.js";
import { defaultValues } from "../CaseForm";

const CustomerInfo = ({ selectedCustomer, setSelectedCustomer }) => {
  const {
    control,
    reset,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
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
              New Customer
            </Button>
          </>
        ) : (
          "New Customer"
        )}
      </Typography>

      <Typography variant="h5" gutterBottom>
        Customer Info
      </Typography>

      <Controller
        name="first_name"
        control={control}
        rules={{ required: "First name is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="First Name"
            variant="outlined"
            fullWidth
            required
            error={!!errors.first_name}
            margin="normal"
          />
        )}
      />

      <Controller
        name="last_name"
        control={control}
        rules={{ required: "Last name is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Last Name"
            variant="outlined"
            fullWidth
            required
            error={!!errors.last_name}
            margin="normal"
          />
        )}
      />

      <Controller
        name="mid"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="MID"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        )}
      />

      <Controller
        name="phone_code"
        control={control}
        rules={{ required: "Phone code is required" }}
        render={({ field, fieldState }) => (
          <FormControl fullWidth required margin="normal">
            <InputLabel id="phone-code-label">Phone Code</InputLabel>
            <Select
              {...field}
              labelId="phone-code-label"
              label="Phone Code"
              error={!!fieldState.error}
            >
              {PHONE_COUNTRY_CODES.map((s) => (
                <MenuItem key={s.code} value={s.code}>
                  {s.code} {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="phone_number"
        control={control}
        rules={{ required: "Phone number is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Phone Number"
            variant="outlined"
            fullWidth
            required
            error={!!errors.phone_number}
            margin="normal"
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        rules={{
          required: "Email is required",
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
            fullWidth
            required
            error={!!errors.email}
            margin="normal"
          />
        )}
      />
    </div>
  );
};

export default CustomerInfo;
