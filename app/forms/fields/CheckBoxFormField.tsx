import { FormTemplateField } from "@chainfuse/core";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import * as React from "react";

export const CheckBoxFormField = (props: {
  field: FormTemplateField;
  input: Record<string, any>;
  loading: boolean;
  errors: Record<string, string | undefined>;
  setState: (
    value: React.SetStateAction<{
      input: Record<string, any>;
      errors: Record<string, string | undefined>;
      loading: boolean;
      customId: boolean;
    }>
  ) => void;
}) => {
  const { field, errors, setState } = props;

  return (
    <FormControl
      required
      name={field.name}
      defaultChecked={Boolean(field.initialValue)}
      component="fieldset"
      variant="standard"
      error={!!errors[field.name]}
      onChange={async (e: any) => {
        setState((prev) => ({
          ...prev,
          input: {
            ...prev.input,
            [field.name]: e.target.checked,
          },
        }));
      }}
    >
      <FormLabel component="legend">{field.label}</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              name={field.name}
              defaultChecked={Boolean(field.initialValue)}
            />
          }
          label="Enabled"
        />
      </FormGroup>
    </FormControl>
  );
};
