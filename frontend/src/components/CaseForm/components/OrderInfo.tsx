import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";

const ASSIGNEES = [
  "Vincent Ma",
  "James Tan",
  "Jimmy Jiang",
  "May Lau",
  "Michael Liu",
  "Elvis Chen",
  "Nayeli Marquez",
  "Maries Nguyen",
  "Mariana Santamaria",
  "Sheng Huang",
  "Ivey Tam",
  "Alexandra Geronimo",
];

const OrderInfo = () => {
  const { control } = useFormContext({
    defaultValues: {
      sales_order: "",
      date: "",
      assign: "",
      status: "",
      case_Number: "",
    },
  });

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Order Info
      </Typography>

      <Controller
        name="sales_order"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Sales Order"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        )}
      />

      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Date"
            type="date"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        )}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="assign-label">Assign to</InputLabel>
        <Controller
          name="assign"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              labelId="assign-label"
              label="Assign to"
              variant="outlined"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {ASSIGNEES.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="status-label">Status</InputLabel>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              labelId="status-label"
              label="Status"
              variant="outlined"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          )}
        />
      </FormControl>

      <Controller
        name="case_Number"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            disabled
            label="Case Number"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        )}
      />
    </div>
  );
};

export default OrderInfo;
