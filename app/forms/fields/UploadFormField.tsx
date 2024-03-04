import { FormTemplateField } from "@chainfuse/core";
import * as React from "react";
import { UploadField } from "../../common/UploadField.js";

export const UploadFormField = (props: {
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
  const { field, input, errors, loading, setState } = props;

  return (
    <>
      <UploadField
        sx={{ mb: 2 }}
        key={field.name}
        image={input[field.name] ? { url: input[field.name] } : undefined}
        error={!!errors[field.name]}
        publicUpload={field.publicUpload}
        helperText={errors[field.name]?.[0] ?? ""}
        onUpload={(file) => {
          setState((prev) => ({
            ...prev,
            input: { ...prev.input, [field.name]: file.url },
          }));
        }}
        disabled={loading || (field.locked ? true : false)}
        fullWidth
      />
    </>
  );
};
