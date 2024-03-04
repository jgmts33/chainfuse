import { FormTemplateField } from "@chainfuse/core";
import { CHAINFUSE } from "@chainfuse/ui";
import { CloseOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import * as React from "react";
import { adornments } from "../SiteForm.js";

const useRefs = () => {
  const refs = React.useRef<Record<string, HTMLInputElement | null>>({});

  const setRefFromKey = (key: string) => (element: HTMLInputElement | null) => {
    refs.current[key] = element;
  };

  return { refs: refs.current, setRefFromKey };
};

export const NftUploadFormField = (props: {
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
  const { field, input, errors, setState } = props;
  const { refs, setRefFromKey } = useRefs();

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Button fullWidth variant="contained" component="label">
            <Box>Upload NFTs &nbsp;</Box>{" "}
            {refs.nfts?.files?.length! > 0 && (
              <>({refs.nfts?.files?.length} selected)</>
            )}
            <input
              type="file"
              name="nft"
              key={field.name}
              multiple
              hidden
              accept="image/png, image/jpeg, image/gif"
              ref={setRefFromKey(field.name)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const images = Object.keys(e.target.files!).map(
                  (_, index) => e.target.files?.[index]
                );

                setState((prev) => ({
                  ...prev,
                  input: {
                    ...prev.input,
                    [field.name]: images.map((image, index) => {
                      return {
                        name: image?.name,
                        file: URL.createObjectURL(
                          e.target?.files?.[index] as Blob
                        ),
                      };
                    }),
                  },
                }));
              }}
            />
          </Button>
        </Grid>

        {input[field.name] && (
          <>
            {input[field.name].map((image: any, index: number) => {
              return (
                <Grid key={`nft-field-${index}`} item xs={12} sm={6}>
                  <Card style={{ position: "relative" }}>
                    <CardHeader
                      size="small"
                      disableTypography
                      sx={{
                        pt: 1,
                        pb: 1,
                        pr: 2,
                      }}
                      action={
                        <Button
                          size="small"
                          variant="text"
                          disableRipple
                          disableFocusRipple
                          onClick={() => {
                            const dt = new DataTransfer();

                            if (refs.nfts != null) {
                              const { files } = refs.nfts;

                              // Create new datatransfer filtering out old file
                              for (let i = 0; i < files?.length!; i++) {
                                const file = files?.[i];
                                if (index !== i) {
                                  dt.items.add(file!);
                                }
                              }

                              // Assign new datatransfer to input
                              refs.nfts.files = dt.files;

                              // Splice from the state and from the UI
                              input[field.name].splice(index, 1);

                              // Set state
                              setState((prev) => ({
                                ...prev,
                                input: {
                                  ...prev.input,
                                  [field.name]: input[field.name],
                                },
                              }));
                            }
                          }}
                        >
                          <CloseOutlined />
                        </Button>
                      }
                    />
                    <CardMedia
                      component="img"
                      height="140"
                      image={image.file}
                      alt="green iguana"
                    />
                    <CardContent>
                      <React.Fragment>
                        <Box mb={1}>
                          <TextField
                            fullWidth
                            required
                            label="Name"
                            size="small"
                            name={`${field.name}[${index}][name]`}
                            value={image.name}
                            onChange={(e) => {
                              const newInput = input[field.name];
                              newInput[index].name = e.target.value;

                              // Set state
                              setState((prev) => ({
                                ...prev,
                                input: {
                                  ...prev.input,
                                  [field.name]: newInput,
                                },
                              }));
                            }}
                          />
                        </Box>

                        <Box mb={1}>
                          <TextField
                            fullWidth
                            required
                            type="number"
                            label="Supply"
                            size="small"
                            name={`${field.name}[${index}][supply]`}
                            inputProps={{ min: 1, max: 10000000 }}
                            InputProps={{
                              startAdornment: adornments["supply"] ? (
                                <InputAdornment position="start">
                                  {adornments["supply"]}
                                </InputAdornment>
                              ) : null,
                            }}
                            value={image.supply || 1}
                            onChange={(e) => {
                              const newInput = input[field.name];
                              newInput[index].supply = e.target.value;

                              // Set state
                              setState((prev) => ({
                                ...prev,
                                input: {
                                  ...prev.input,
                                  [field.name]: newInput,
                                },
                              }));
                            }}
                          />
                        </Box>
                        <Box mb={1}>
                          <TextField
                            fullWidth
                            required
                            type="number"
                            label="Price"
                            size="small"
                            name={`${field.name}[${index}][price]`}
                            inputProps={{ min: 1, max: 10000000 }}
                            value={image.price || 1}
                            InputProps={{
                              startAdornment: (
                                <>
                                  {CHAINFUSE?.find(
                                    (c) => c?.chainId == input?.["chainId"]
                                  )?.logo ? (
                                    <InputAdornment position="start">
                                      <Box
                                        component="img"
                                        src={
                                          CHAINFUSE?.find(
                                            (c) =>
                                              c?.chainId == input?.["chainId"]
                                          )?.logo
                                        }
                                        width={20}
                                        height={20}
                                        mr={1}
                                      />
                                    </InputAdornment>
                                  ) : null}
                                </>
                              ),
                            }}
                            onChange={(e) => {
                              const newInput = input[field.name];
                              newInput[index].price = e.target.value;

                              // Set state
                              setState((prev) => ({
                                ...prev,
                                input: {
                                  ...prev.input,
                                  [field.name]: newInput,
                                },
                              }));
                            }}
                          />
                        </Box>
                        <Box mb={1}>
                          <TextField
                            fullWidth
                            type="text"
                            label="External url"
                            size="small"
                            name={`${field.name}[${index}][external_url]`}
                            value={
                              image.external_url || "https://chainfuse.com/"
                            }
                            onChange={(e) => {
                              const newInput = input[field.name];
                              newInput[index].external_url = e.target.value;

                              // Set state
                              setState((prev) => ({
                                ...prev,
                                input: {
                                  ...prev.input,
                                  [field.name]: newInput,
                                },
                              }));
                            }}
                          />
                        </Box>
                      </React.Fragment>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </>
        )}
      </Grid>
    </>
  );
};
