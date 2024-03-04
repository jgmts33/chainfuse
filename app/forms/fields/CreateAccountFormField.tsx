import { FormTemplate } from "@chainfuse/core";
import {
  AlternateEmail,
  FacebookOutlined,
  Google,
  Twitter,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, BoxProps, Button, Divider, Grid, TextField } from "@mui/material";
import * as React from "react";

const steps = [
  "Connect your wallet",
  "Create your profile",
  "Add discovery information",
  "Preview your profile",
  "Success",
];

function useState(template: FormTemplate) {
  const fields = template.steps
    .map((step) => step.fields.map((field) => field))
    .flat();

  return React.useState(() => {
    return {
      input: {
        ...Object.fromEntries(
          fields.map((x) => [
            x.name,
            x.name === "checkbox" ? Boolean(x.initialValue) : x.initialValue,
          ])
        ),
        acceptPayments: true,
        enableAi: true,
      } as Record<string, string | boolean | any>,
      errors: {} as Record<string, string | undefined>,
      loading: false,
      customId: false,
    };
  });
}

interface OnboardFormProps
  extends BoxProps<
    "form",
    {
      /** Project ID */
      project?: string | null;
      template: FormTemplate;
      onCancel: () => void;
    }
  > {}

type ProviderType =
  | "googleSignIn"
  | "yahooSignIn"
  | "twitterSignIn"
  | "facebookSignIn"
  | "emailAndPasswordSignIn";

export const CreateAccountFormField = (props: {
  submitting: boolean;
  setSignInProvider: (value: ProviderType) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const { setSignInProvider, submitting, handleChange } = props;

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Box mb={1}>
          <TextField
            placeholder="Email"
            name="email"
            size="small"
            onChange={handleChange}
            fullWidth
          ></TextField>
        </Box>
        <TextField
          placeholder="Password"
          size="small"
          name="password"
          type={"password"}
          onChange={handleChange}
          fullWidth
        ></TextField>
        <Grid mt={1} container justifyContent={"flex-end"}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={submitting}
            onClick={() => {
              setSignInProvider("emailAndPasswordSignIn");
            }}
          >
            Create account
          </LoadingButton>
        </Grid>
        <Divider style={{ marginTop: 20, marginBottom: 10 }}>OR</Divider>
      </Grid>
      <Grid item xs={6}>
        <Box mb={1}>
          <Button
            variant="outlined"
            fullWidth
            type="submit"
            onClick={() => {
              setSignInProvider("googleSignIn");
            }}
          >
            <Google fontSize="small" /> &nbsp; Google
          </Button>
        </Box>
        <Button
          variant="outlined"
          type="submit"
          fullWidth
          onClick={() => {
            setSignInProvider("facebookSignIn");
          }}
        >
          <FacebookOutlined fontSize="small" /> &nbsp; Facebook
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Box mb={1}>
          <Button
            variant="outlined"
            fullWidth
            type="submit"
            onClick={() => {
              setSignInProvider("twitterSignIn");
            }}
          >
            <Twitter fontSize="small" /> &nbsp; Twitter
          </Button>
        </Box>
        <Button
          variant="outlined"
          fullWidth
          type="submit"
          onClick={() => {
            setSignInProvider("yahooSignIn");
          }}
        >
          <AlternateEmail fontSize="small" /> &nbsp; Yahoo
        </Button>
      </Grid>
    </Grid>
  );
};
