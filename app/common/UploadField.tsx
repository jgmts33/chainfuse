import { UploadedFile, useCurrentUser, useNft } from "@chainfuse/react";
import {
  Avatar,
  Box,
  Button,
  CardMedia,
  FormControl,
  FormControlProps,
  FormHelperText,
} from "@mui/material";
import { User } from "firebase/auth";
import React from "react";

export function UploadField(props: UploadFieldProps): JSX.Element {
  const { sx, image, publicUpload, helperText, onUpload, ...other } = props;
  const [state, setState] = useUploadState();
  const me = useCurrentUser();

  const handleChange = useHandleUploadChange(
    setState,
    onUpload,
    publicUpload,
    me
  );

  return (
    <FormControl sx={sx} variant="outlined" {...other}>
      <Button
        component="label"
        sx={{
          color: "text.secondary",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "background.default",
          borderStyle: image ? undefined : "dashed",
          p: image ? 0 : 1,
          "&:hover": {
            borderStyle: image ? undefined : "dashed",
          },
        }}
        variant="outlined"
        size="large"
      >
        {image ? (
          <React.Fragment>
            <CardMedia sx={{ height: 200, width: "100%" }} image={image.url} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Box component="span">Upload profile image</Box>
            {/* <Box component="span" fontSize={12}>
              .png, .jpg, .jpeg, .gif, .svg, .glb
            </Box> */}
            <Avatar />
          </React.Fragment>
        )}
        {state && <Box component="span">{state.originalName}</Box>}
        <input type="file" accept="image/*" onChange={handleChange} hidden />
      </Button>
      {helperText ? <FormHelperText children={helperText} /> : null}
    </FormControl>
  );
}

function useUploadState() {
  return React.useState<UploadedFile>();
}

function useHandleUploadChange(
  setState: SetState,
  onUpload?: (file: UploadedFile) => void,
  publicUpload?: boolean,
  me?: User
) {
  const nftHook = useNft();

  return React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
        const uploadedFile = await nftHook.uploadFile(
          publicUpload ?? false,
          file,
          me
        );

        if (uploadedFile) {
          setState(uploadedFile);
          onUpload?.(uploadedFile);
        }
      }
    },
    [me?.uid, setState, onUpload]
  );
}

interface UploadFieldProps
  extends FormControlProps<
    "div",
    {
      image?: { url: string };
      helperText?: React.ReactNode;
      onUpload?: (file: UploadedFile) => void;
      publicUpload?: boolean;
    }
  > {}

type SetState = ReturnType<typeof useUploadState>[1];
