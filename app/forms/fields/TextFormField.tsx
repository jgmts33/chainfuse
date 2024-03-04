import { FormTemplateField } from "@chainfuse/core";
import { InputAdornment, TextField } from "@mui/material";
import * as React from "react";
import { adornments } from "../SiteForm.js";

export const TextFormField = (props: {
  field: FormTemplateField;
  input: Record<string, any>;
  loading: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string | undefined>;
}) => {
  const { field, input, errors, handleChange, loading } = props;

  return (
    <TextField
      fullWidth
      key={field.name}
      size="small"
      sx={{
        mb: 2,
        ".MuiInputBase-root": {
          alignItems: "baseline",
        },
      }}
      label={field.label}
      multiline={field.multiline}
      rows={3}
      placeholder={field.placeholder}
      name={field.name}
      type={field.type}
      variant="outlined"
      inputProps={{ [`data-lpignore`]: "true" }}
      value={input[field.name]}
      onChange={handleChange}
      error={!!(errors as any)[field.name]}
      helperText={(errors as any)[field.name]?.[0] ?? null}
      InputProps={{
        startAdornment: adornments[field.name] ? (
          <InputAdornment position="start">
            {adornments[field.name]}
          </InputAdornment>
        ) : null,
      }}
      required={field.required}
      disabled={loading || (field.locked ? true : false)}
    />
  );
};
