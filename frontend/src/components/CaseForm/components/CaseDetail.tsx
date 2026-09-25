import { useFormContext, Controller } from "react-hook-form";
import { Stack, TextField, Typography } from "@mui/material";

const CaseDetail = () => {
  const { control } = useFormContext();

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
