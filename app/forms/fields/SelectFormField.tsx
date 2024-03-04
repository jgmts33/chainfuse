import { FormTemplateField } from "@chainfuse/core";
import { useChainFuseLogin } from "@chainfuse/react";
import { CHAINFUSE } from "@chainfuse/ui";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import * as React from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      // width: 250,
    },
  },
};

export const SelectFormField = (props: {
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
  const { switchChain } = useChainFuseLogin();
  const { field, input, errors, loading, setState } = props;

  return (
    <>
      {field.category === "chain" ? (
        <Box mb={2}>
          <FormControl fullWidth>
            <InputLabel size="small" id="demo-multiple-name-label">
              {`${field.label}${field.required ? " *" : ""}`}
            </InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              multiple={field.multiple}
              label={field.label}
              variant="outlined"
              required={field.required}
              size="small"
              fullWidth
              error={!!errors[field.name]}
              type={field.type}
              input={
                <OutlinedInput
                  size="small"
                  id={field.name}
                  label={field.label}
                />
              }
              value={input[field.name] || []}
              placeholder={field.placeholder}
              name={field.name}
              MenuProps={MenuProps}
              onChange={async (e: any) => {
                const {
                  target: { value },
                } = e;

                // Check that value is not an array

                if (field.enableChangeChain && typeof value !== "string") {
                  switchChain(value);
                }

                setState((prev) => ({
                  ...prev,
                  input: {
                    ...prev.input,
                    [field.name]:
                      typeof value === "string" ? value.split(",") : value,
                  },
                }));
              }}
              disabled={loading || (field.locked ? true : false)}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <em>None</em>;
                }

                if (!field.multiple) {
                  const selectedChain = CHAINFUSE.find(
                    (c) => c.chainId == selected
                  );

                  return (
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        component="img"
                        src={selectedChain?.logo}
                        width={20}
                        height={20}
                        mr={1}
                      />
                      {selectedChain?.name}
                    </Box>
                  );
                } else {
                  return selected.map((chain: number) => {
                    const selectedChain = CHAINFUSE.find(
                      (c) => c.chainId == chain
                    );

                    return (
                      <>
                        <Chip
                          key={selectedChain?.chainId}
                          style={{
                            marginRight: 5,
                          }}
                          label={
                            <Box
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Box
                                component="img"
                                src={selectedChain?.logo}
                                width={20}
                                height={20}
                                mr={1}
                              />
                              {selectedChain?.name}
                            </Box>
                          }
                        />
                      </>
                    );
                  });
                }
              }}
            >
              {CHAINFUSE.map((chain) => {
                // Disable testnets
                if (chain.testnet) {
                  return null;
                }

                const innerBox = (
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={chain.logo}
                      width={20}
                      height={20}
                      mr={1}
                    />
                    {chain.name}
                  </Box>
                );

                if (field.enableAll) {
                  return (
                    <MenuItem
                      key={chain.chainId}
                      value={chain.chainId}
                      divider={chain.divider}
                    >
                      {innerBox}
                    </MenuItem>
                  );
                } else {
                  return (
                    <MenuItem
                      key={chain.chainId}
                      value={chain.chainId}
                      divider={chain.divider}
                      disabled={chain.disabled}
                    >
                      {innerBox}
                    </MenuItem>
                  );
                }
              })}
            </Select>
          </FormControl>
        </Box>
      ) : null}
    </>
  );
};
