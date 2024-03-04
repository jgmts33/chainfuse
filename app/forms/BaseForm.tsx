import { FormTemplate, Step } from "@chainfuse/core";
import {
  SiteData,
  useContract,
  useCurrentUser,
  useEmailAndPasswordSignIn,
  useFacebookSignIn,
  useFormTemplate,
  useGoogleSignIn,
  useMutation,
  useNft,
  useTwitterSignIn,
  useYahooSignIn,
} from "@chainfuse/react";
import {
  CheckBoxFormField,
  ConnectWallet,
  CreateAccountFormField,
  NftUploadFormField,
  SelectFormField,
  TextFormField,
  UploadFormField,
} from "@chainfuse/ui";
import {
  Alert,
  AlertTitle,
  Box,
  BoxProps,
  Button,
  Card,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { User } from "firebase/auth";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useCurrentProjectId } from "../core/project.js";
import { toShortId } from "../core/utils.js";
import { SetState } from "./SiteForm.js";

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

interface BaseFormProps
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

export default function BaseForm(props: BaseFormProps) {
  const { template, onCancel, ...other } = props;

  const { enqueueSnackbar } = useSnackbar();

  const PARAMETRIZED_SIGN_IN: {
    [key: string]: (email: string, password: string) => Promise<User>;
  } = {
    emailAndPasswordSignIn: useEmailAndPasswordSignIn(),
  };

  const SIGN_IN_METHOD: { [key: string]: () => Promise<User> } = {
    googleSignIn: useGoogleSignIn(),
    facebookSignIn: useFacebookSignIn(),
    yahooSignIn: useYahooSignIn(),
    twitterSignIn: useTwitterSignIn(),
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const [success, setSuccess] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [successData, setSuccessData] = React.useState<SiteData>();

  const [signInProvider, setSignInProvider] =
    React.useState<ProviderType>("googleSignIn");
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const formRef = React.useRef<HTMLFormElement>();

  const [{ input }, setState] = useState(template);
  const formTemplate = useFormTemplate(template.id);

  const isStepOptional = (step: number) => {
    return step === 2 || step === 3;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleChange = useHandleChange(setState);

  const [handleSubmit, loading, errors] = useHandleSubmit(
    input,
    template,
    onCancel
  );

  function useHandleChange(setState: SetState) {
    return React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      let { name, value } = event.target;

      // Round the supply value to the whole number
      // Ensure that it's greater than 0
      if (name === "supply" && value !== "") {
        let supply = parseInt(value, 10);
        value = isNaN(supply) ? value : String(supply > 0 ? supply : 1);
      }

      const fields = template.steps
        .map((step) => step.fields.map((field) => field))
        .flat();

      setState((prev) => ({
        ...prev,
        input: {
          ...Object.fromEntries(
            fields.map((x) => [
              x.name,
              x.name === "checkbox" ? Boolean(x.initialValue) : x.initialValue,
            ])
          ),
          ...prev.input,
          [name]: name === "id" ? toShortId(value, false) : value,
          ...(name === "name" && {
            id: toShortId(value),
          }),
        },
      }));
    }, []);
  }

  const createUser = async (
    signInProvider: ProviderType,
    input: Record<string, any>
  ) => {
    let user: User;

    if (signInProvider === "emailAndPasswordSignIn") {
      user = await PARAMETRIZED_SIGN_IN[signInProvider](
        input.email,
        input.password
      );
    } else {
      user = await SIGN_IN_METHOD[signInProvider]();
    }

    return user;
  };

  function useHandleSubmit(
    input: Record<string, string>,
    template: FormTemplate,
    onCancel?: () => void
  ): [
    onSubmit: (event: React.FormEvent, signInProvider: ProviderType) => void,
    loading: boolean,
    errors: Record<string, string | undefined>
  ] {
    const me = useCurrentUser();
    const nftHook = useNft();
    const contractHooks = useContract();
    const project = useCurrentProjectId();
    const createUserProfile = useMutation("ProfileOnboarding");
    const createPinIds = useMutation("CreateIPFSPinsFromImages");

    const handleSubmit = React.useCallback(
      async function (event: React.FormEvent, signInProvider: ProviderType) {
        try {
          event.preventDefault();

          const formData = new FormData(event.currentTarget as HTMLFormElement);
          const images = await nftHook.uploadFiles(formData, me);

          console.log("Files", images);

          const ipfsPins = await createPinIds.commit({
            id: input.id,
            images,
          });

          console.log("IPFS Pins", ipfsPins);

          const registrationIds =
            await contractHooks.registerNftCollectionMultiple(
              ipfsPins.map((pin) => Number(pin.price)),
              ipfsPins.map((pin) => Number(pin.supply)),
              ipfsPins.map((pin) => pin.ipfsPin),
              Number(input.chainId)
            );

          console.log("registrationIds", registrationIds);

          // Send form data to server

          // console.log all the form event data

          // setSubmitting(true);

          // await createUser(signInProvider, input);

          // const data = await (async function () {
          //   return await createUserProfile.commit({
          //     ...(input as any),
          //     tenantId: Math.random().toString(36).slice(2, 18), // TODO: Use a robust tenant ID mechanism
          //     version: "latest",
          //     id: input.project,
          //     project: input.project,
          //   });
          // })();

          // setSuccess(true);
          // setSuccessData(data);

          // setSubmitting(false);

          // enqueueSnackbar("Your profile is now ready.", {
          //   variant: "success",
          // });
        } catch (error: any) {
          setSubmitting(false);
          enqueueSnackbar(error.message, {
            variant: "error",
          });
        }
      },
      [input, createUserProfile.commit, project, template?.id]
    );

    return [
      handleSubmit,
      createUserProfile.loading,
      createUserProfile.errors as any,
    ];
  }

  const ConnectWalletGateFormField = () => {
    return (
      <ConnectWallet
        onConnect={() => {
          handleNext();
        }}
      />
    );
  };

  const renderForm = (steps: Step[], activeStep: number) => {
    return steps.map((individualStep, stepIndex) => {
      return individualStep.fields.map((field, fieldIndex) => {
        return (
          <Box
            key={`field-${stepIndex}-${fieldIndex}`}
            style={{ display: stepIndex === activeStep ? "block" : "none" }}
          >
            {["text", "number"].includes(field.type) ? (
              <TextFormField
                field={field}
                loading={loading}
                errors={errors}
                input={input}
                handleChange={handleChange}
              />
            ) : field.type == "wallet" ? (
              <ConnectWalletGateFormField />
            ) : field.type == "image" ? (
              <UploadFormField
                field={field}
                loading={loading}
                errors={errors}
                input={input}
                setState={setState}
              />
            ) : field.type == "select" ? (
              <>
                <SelectFormField
                  field={field}
                  errors={errors}
                  loading={loading}
                  input={input}
                  setState={setState}
                />
              </>
            ) : field.type === "checkbox" ? (
              <Box mb={1} key={field.name}>
                <CheckBoxFormField
                  field={field}
                  loading={loading}
                  errors={errors}
                  input={input}
                  setState={setState}
                />
              </Box>
            ) : field.type === "nft" ? (
              <>
                <NftUploadFormField
                  field={field}
                  loading={loading}
                  errors={errors}
                  input={input}
                  setState={setState}
                />
              </>
            ) : field.type === "hidden" ? (
              <Box mb={1} key={field.name} display={"none"}>
                <TextField
                  fullWidth
                  key={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  name={field.name}
                  type={field.type}
                  value={field.initialValue}
                />
              </Box>
            ) : field.type === "createAccount" ? (
              <Box mb={1} key={field.name}>
                <CreateAccountFormField
                  handleChange={handleChange}
                  setSignInProvider={setSignInProvider}
                  submitting={submitting}
                />
              </Box>
            ) : null}
          </Box>
        );
      });
    });
  };

  if (success) {
    return (
      <Card>
        <Box p={1}>
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            Your profile was created — <strong>check it out!</strong>
          </Alert>
          <Divider
            style={{
              margin: "10px 0",
            }}
          />
          <Box mb={1}>
            <Button
              size="large"
              variant="outlined"
              href={`/sites/${successData?.site}?project=${successData?.project}`}
              fullWidth
            >
              Go to dashboard
            </Button>
          </Box>
          <Link target="_blank" href={successData?.siteUrl}>
            <Button fullWidth color="success" size="large" variant="contained">
              <strong>View profile</strong>
            </Button>
          </Link>
        </Box>
      </Card>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={2}>
          <Grid
            item
            sm={6}
            xs={12}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <Box
              sx={{
                height: 450,
                width: "100%",
                background:
                  "url(https://test-upload.chainfuse.com/o10c64edxw36.jpg) center center / cover",
                borderRadius: (theme) => theme.shape.borderRadius,
                color: (theme) => theme.palette.common.white,
                fontFamily: (theme) => theme.typography.fontFamily,
              }}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <React.Fragment>
                <Box
                  sx={{
                    width: "100%",
                  }}
                  m={2}
                >
                  <Box>
                    <Typography component="span"
                      sx={{
                        mb: 1,
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: "2rem",
                          fontWeight: (theme) =>
                            theme.typography.fontWeightBold,
                        }}
                      >
                        Step: {activeStep + 1}&nbsp;
                      </Box>
                      <Box
                        sx={{
                          fontSize: "1rem",
                        }}
                      >
                        / {formTemplate.steps.length}
                      </Box>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography component="span"
                      variant="h2"
                      sx={{
                        mb: 1,
                        fontWeight: (theme) => theme.typography.fontWeightBold,
                      }}
                    >
                      {formTemplate.steps[activeStep].title}
                    </Typography>
                  </Box>
                </Box>
              </React.Fragment>
            </Box>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Box
              mt={2}
              component="form"
              onSubmit={(e: any) => {
                handleSubmit(e, signInProvider);
              }}
              ref={formRef}
            >
              <React.Fragment>
                <Typography component="span" variant="h6" sx={{ mb: 1 }}>
                  {formTemplate.steps[activeStep].subTitle}
                </Typography>

                <Typography component="span" variant="body2" sx={{ mb: 1 }}>
                  {formTemplate.steps[activeStep].description}
                </Typography>
              </React.Fragment>

              <Divider sx={{ mb: 3 }} />

              {renderForm(formTemplate.steps, activeStep)}
            </Box>
            {!formTemplate.steps[activeStep].disableNext && (
              <Grid xs={12}>
                {activeStep === formTemplate.steps.length - 1 ? (
                  <React.Fragment>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Button
                        color="inherit"
                        disabled={
                          activeStep === 0 ||
                          formTemplate.steps[activeStep - 1].disableNext
                        }
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />
                    </Box>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Button
                        color="inherit"
                        disabled={
                          activeStep === 0 ||
                          formTemplate.steps[activeStep - 1].disableNext
                        }
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />
                      {isStepOptional(activeStep) && (
                        <Button
                          color="inherit"
                          onClick={handleSkip}
                          variant="outlined"
                          sx={{ mr: 1 }}
                        >
                          Skip
                        </Button>
                      )}
                      <Button variant="contained" onClick={handleNext}>
                        Next
                      </Button>
                    </Box>
                  </React.Fragment>
                )}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
