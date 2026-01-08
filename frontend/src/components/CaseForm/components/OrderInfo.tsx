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

import { CASE_FORM_ACTION_TYPES } from "../../../constants";
import { useAssignees } from "../../../hooks/useAssignees";

const CaseInfo = ({ caseFormActionType, disabled = false }) => {
  const { control } = useFormContext();

  const { assignees } = useAssignees();

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
        Order Info
      </Typography>

      <Stack direction="row" spacing={2}>
        <Controller
          disabled={disabled}
          name="sales_order"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Sales Order"
              variant="outlined"
              margin="normal"
              size="small"
              sx={{ width: "200px" }}
            />
          )}
        />

        <Controller
          disabled={disabled}
          name="purchase_order"
          control={control}
          rules={{ required: "Purchase Order is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              label="Purchase Order"
              variant="outlined"
              margin="normal"
              size="small"
              sx={{ width: "200px" }}
            />
          )}
        />

        <FormControl margin="normal" size="small" sx={{ flex: 1 }}>
          <InputLabel id="status-label">Market Place</InputLabel>
          <Controller
            disabled={disabled}
            name="market_place"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="market_place-label"
                label="Market Place"
                variant="outlined"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Amazon US">Amazon US</MenuItem>
                <MenuItem value="Amazon CA">Amazon CA</MenuItem>
                <MenuItem value="eBay">eBay</MenuItem>
                <MenuItem value="Wayfair">Wayfair</MenuItem>
                <MenuItem value="Shopify">Shopify</MenuItem>
                <MenuItem value="Home Depot">Home Depot</MenuItem>
                <MenuItem value="Walmart">Walmart</MenuItem>
                <MenuItem value="Craiglist">Craiglist</MenuItem>
                <MenuItem value="Shein">Shein</MenuItem>
                <MenuItem value="TikTok">TikTok</MenuItem>
                <MenuItem value="Lowe's">Lowe's</MenuItem>
                <MenuItem value="WooCommerce">WooCommerce</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={2} flexWrap="wrap" mt={3} mb={4}>
        <FormControl
          margin="normal"
          size="small"
          sx={{ width: "300px" }}
          required
        >
          <InputLabel id="assign-label">Assign to</InputLabel>
          <Controller
            disabled={disabled}
            name="assign"
            control={control}
            rules={{ required: "Assign is required" }}
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
                {assignees.map(({ name, email }) => (
                  <MenuItem key={email} value={email}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        <FormControl margin="normal" size="small" sx={{ flex: 1 }} required>
          <InputLabel id="status-label">Status</InputLabel>
          <Controller
            disabled={disabled}
            name="status"
            control={control}
            rules={{ required: "Status is required" }}
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

        {caseFormActionType === CASE_FORM_ACTION_TYPES.EXIST && (
          <Controller
            disabled={disabled}
            name="case_number"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                disabled
                label="Case Number"
                variant="outlined"
                margin="normal"
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1 }}
                size="small"
              />
            )}
          />
        )}
      </Stack>
    </div>
  );
};

export default CaseInfo;
