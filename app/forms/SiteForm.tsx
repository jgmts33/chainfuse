import {
  chainIdState,
  currentAccountState,
  loggedInState,
  SiteData,
  useContract,
  useMutation,
  useNft,
} from "@chainfuse/react";
import {
  Ai,
  CHAINFUSE,
  CodeBlock,
  DecentralizedProfile,
  TokenDialog,
  TokenDialogElement,
  TokenDropShell,
} from "@chainfuse/ui";
import {
  Abc,
  Badge,
  Business,
  CalendarMonth,
  Email,
  GitHub,
  GrainRounded,
  Handyman,
  Instagram,
  LinkedIn,
  LinkOutlined,
  Person,
  ShortText,
  Telegram,
  Twitter,
} from "@mui/icons-material";
import {
  Box,
  BoxProps,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Hidden,
  InputAdornment,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { type Template } from "core/templates";
import { Site } from "db";
import { DocumentSnapshot } from "firebase/firestore";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Gate } from "../common/Gate.js";
import { UploadField } from "../common/UploadField.js";
import { useCurrentProjectId } from "../core/project.js";
import { useSiteListRefresh } from "../core/site.js";
import { toShortId } from "../core/utils.js";

export const adornments: {
  [key: string]: any;
} = {
  profileName: <Person />,
  name: <ShortText />,
  supply: <GrainRounded />,
  work: <Business />,
  project: <Handyman />,
  title: <Badge />,
  description: <ShortText />,
  telegram: <Telegram />,
  linkedIn: <LinkedIn />,
  instagram: <Instagram />,
  calendar: <CalendarMonth />,
  github: <GitHub />,
  twitter: <Twitter />,
  link: <LinkOutlined />,
  email: <Email />,
  customUrl: <LinkOutlined />,
  customUrlText: <Abc />,
};

export default function SiteForm(props: SiteFormProps): JSX.Element {
  const { site, template, onCancel, ...other } = props;
  const idRef = React.useRef<HTMLInputElement>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);

  const location = useLocation();

  const tokenDialogRef = React.useRef<TokenDialogElement>(null);

  const [{ input, customId }, setState] = useState(template, site);

  const [isActive] = useRecoilState(loggedInState);
  const [currentAccounts] = useRecoilState(currentAccountState);
  const [chainId, setChainId] = useRecoilState(chainIdState);

  const { registerNftCollection } = useContract();
  const { createNft } = useNft();

  const [currentTab, setCurrentTab] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [siteMetadata, setSiteMetadata] = React.useState<
    SiteData | undefined
  >();

  const getSite = useMutation("GetSite");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const defaultChain = CHAINFUSE.find(
    (c: any) => c.chainId === chainId
  )!.chainId;
  const currentChain = CHAINFUSE.find(
    (c: any) => c.chainId === Number(input.chainId || defaultChain)
  )!;

  const handleChange = useHandleChange(setState);
  const [handleSubmit, loading, errors] = useHandleSubmit(
    site,
    input,
    template,
    onCancel
  );

  function useHandleSubmit(
    site: DocumentSnapshot<Site> | undefined,
    input: Record<string, string>,
    template: Template,
    onCancel?: () => void
  ): [
    onSubmit: (event: React.FormEvent) => void,
    loading: boolean,
    errors: Record<string, string | undefined>
  ] {
    const project = useCurrentProjectId();
    const navigate = useNavigate();
    const createSite = useMutation("CreateSite");
    const updateSite = useMutation("UpdateSite");

    const siteListRefresh = useSiteListRefresh(project as string);
    const handleSubmit = React.useCallback(
      async function (event: React.FormEvent) {
        event.preventDefault();

        const normalizedInput: any = {
          ...input,
        };

        // Transform string fields to a number if they are numeric.
        template.fields.forEach(({ name, type }) => {
          if (
            (type === "number" && typeof input[name] === "string") ||
            (type === "select" && typeof input[name] === "string")
          ) {
            normalizedInput[name] = Number(input[name]);
          }
        });

        // Remove non-editable fields from the input in edit mode
        if (site) {
          template.fields.forEach((field) => {
            if (field.locked) delete normalizedInput[field.name];
          });
        }

        const promise = site
          ? updateSite.commit(normalizedInput)
          : (async function () {
              if (template.id === "marketplace") {
                return createSite.commit({
                  ...normalizedInput,
                  address: currentAccounts![0],
                  chainId,
                  tenantId: Math.random().toString(36).slice(2, 18), // TODO: Use a robust tenant ID mechanism
                  project: project as string,
                  template: template.id,
                  version: "latest",
                });
              } else if (template.id === "token-drop") {
                // tokenDialogRef.current?.open(); // <-- opens the dialog

                const nftCreateResponse: any = await createNft({
                  name: normalizedInput.tokenName,
                  description: normalizedInput.tokenDescription,
                  image: normalizedInput.logoUrl,
                  external_url: "http://chainfuse.com",
                });

                // setCurrentStep(1);

                const voucher: any = await registerNftCollection(
                  Number(normalizedInput.price),
                  Number(normalizedInput.supply),
                  nftCreateResponse.IpfsHash,
                  chainId
                );

                // setCurrentStep(2);

                return createSite.commit({
                  ...normalizedInput,
                  ...voucher,
                  chainId,
                  tenantId: Math.random().toString(36).slice(2, 18), // TODO: Use a robust tenant ID mechanism
                  project: project as string,
                  template: template.id,
                  version: "latest",
                });
              } else if (template.id === "profile") {
                return createSite.commit({
                  ...normalizedInput,
                  address: currentAccounts![0],
                  chainId,
                  tenantId: Math.random().toString(36).slice(2, 18), // TODO: Use a robust tenant ID mechanism
                  project: project as string,
                  template: template.id,
                  version: "latest",
                });
              } else if (template.id === "ai") {
                return createSite.commit({
                  ...normalizedInput,
                  chainId,
                  tenantId: Math.random().toString(36).slice(2, 18), // TODO: Use a robust tenant ID mechanism
                  project: project as string,
                  template: template.id,
                  version: "latest",
                });
              }
            })();

        promise.then((data: any) => {
          navigate(`/sites/${data.id}`, { replace: true });
          siteListRefresh();
          onCancel?.();
        });
      },
      [
        Boolean(site),
        input,
        createSite.commit,
        updateSite.commit,
        project,
        template?.id,
      ]
    );

    return site
      ? [handleSubmit, updateSite.loading, updateSite.errors as any]
      : [handleSubmit, createSite.loading, createSite.errors as any];
  }

  React.useEffect(() => {
    nameRef.current?.select();
  }, []);

  React.useEffect(() => {
    const getSiteData = async () => {
      const siteData = await getSite.commit({
        id: input.id,
      });
      setSiteMetadata(siteData);
    };

    if (location.pathname.includes("sites")) {
      getSiteData();
    }
  }, []);

  React.useEffect(() => {
    if (errors.id) {
      setState((prev) => (prev.customId ? prev : { ...prev, customId: true }));
    }
  }, [errors.id]);

  React.useEffect(() => {
    if (customId) idRef.current?.select();
  }, [customId]);

  const useCustomId = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setState((prev) => ({ ...prev, customId: true }));
  }, []);

  const selfHref = `${location.pathname}${location.search}`;

  console.log("input", site, input, template);

  const nameHelperText =
    customId || site ? null : (
      <React.Fragment>
        Publish URL:{" "}
        <Box sx={{ color: "primary.main" }} component="strong">
          {window.location.hostname === "chainfuse.com"
            ? `${input.id}`
            : `${input.id}-test`}
          .chainfuse.com
        </Box>{" "}
        {/* (
        <Link
          tabIndex={-1}
          sx={{ fontWeight: 600 }}
          href={selfHref}
          onClick={useCustomId}
          children="edit"
        />
        ) */}
      </React.Fragment>
    );

  const content = (
    <>
      <Box sx={{ mt: 1 }} component="form" onSubmit={handleSubmit} {...other}>
        <TextField
          sx={{ mb: 2 }}
          inputRef={nameRef}
          name="name"
          label={template?.fields[0].label}
          variant="outlined"
          inputProps={{ [`data-lpignore`]: "true" }}
          value={input.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name?.[0] || (errors.id ? null : nameHelperText)}
          disabled={loading}
          autoFocus
          fullWidth
          required
        />
        {customId && (
          <TextField
            sx={{ mb: 2 }}
            inputRef={idRef}
            name="id"
            label="Publish URL"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <Box sx={{ color: "text.secondary" }} component="span">
                  .chainfuse.com
                </Box>
              ),
            }}
            inputProps={{ [`data-lpignore`]: "true" }}
            value={input.id}
            onChange={handleChange}
            error={!!errors.id}
            helperText={errors.id?.[0] ?? null}
            disabled={loading}
            fullWidth
            required
          />
        )}
        {template!.fields.slice(1).map((field) => {
          return ["text", "number"].includes(field.type) ? (
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
              disabled={loading || (site && field.locked ? true : false)}
            />
          ) : field.type == "image" ? (
            <UploadField
              sx={{ mb: 2 }}
              key={field.name}
              // image={
              //   input[field.name] ? { url: input[field.name] } : undefined
              // }
              error={!!errors[field.name]}
              helperText={errors[field.name]?.[0] ?? ""}
              onUpload={(file) => {
                setState((prev) => ({
                  ...prev,
                  input: { ...prev.input, [field.name]: file.url },
                }));
              }}
              disabled={loading || (site && field.locked ? true : false)}
              fullWidth
            />
          ) : field.type == "select" ? (
            <Box mb={2} key={field.name}>
              <TextField
                id="filled-select-currency-native"
                select
                label={field.label}
                variant="outlined"
                fullWidth
                value={input.chainId || chainId}
                name={field.name}
                onChange={async (e: any) => {
                  await setChainId(e.target.value);

                  setState((prev: any) => ({
                    ...prev,
                    input: {
                      ...prev.input,
                      [field.name]: `${e.target.value}`,
                    },
                  }));
                }}
                disabled={loading || (site && field.locked ? true : false)}
              >
                {CHAINFUSE.map((chain: any) => {
                  return (
                    <MenuItem
                      key={chain.chainId}
                      value={chain.chainId}
                      divider={chain.divider}
                      disabled={chain.disabled}
                    >
                      <Box style={{ display: "flex", alignItems: "center" }}>
                        <Box
                          component="img"
                          src={chain.logo}
                          width={20}
                          height={20}
                          mr={1}
                        />
                        {chain.name}
                      </Box>
                    </MenuItem>
                  );
                })}
              </TextField>
            </Box>
          ) : field.type === "checkbox" ? (
            <Box mb={1} key={field.name}>
              <FormControl
                required
                name={field.name}
                component="fieldset"
                variant="standard"
                onChange={async (e: any) => {
                  setState((prev: any) => ({
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
            </Box>
          ) : null;
        })}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            gridGap: "0.5rem",
            mt: 2,
            mb: 2,
          }}
        >
          <Button
            variant="contained"
            children={site ? "Save" : "Create"}
            type="submit"
            disabled={loading}
          />
          <Button children="Cancel" onClick={onCancel} color="inherit" />
        </Box>
        <Box
          sx={{
            display: "flex",
            visibility: [template.id].includes("ai") ? "hidden" : "visible",
          }}
        >
          <Typography
            sx={{
              flexGrow: 1,
              fontSize: "0.8125rem",
              color: "text.secondary",
            }}
            children={
              template.id === "profile" ? (
                <>This template is multi-chain</>
              ) : (
                `Deploying to ${currentChain?.name} network.`
              )
            }
            component="span"
          />

          <Box
            component="img"
            src={
              template.id === "profile"
                ? "https://storage.googleapis.com/assets.chainfuse.io/images/logos/gif/chainfuse_animation_small.gif"
                : currentChain.logo
            }
            height={20}
          />
        </Box>
      </Box>
      <Hidden only={["xs", "sm"]}>
        <Box
          sx={{
            display: "grid",
            gridTemplateRows: "auto 1fr auto",
            background: "#ebebeb",
            borderRadius: "8px",
          }}
        >
          <Typography component="span"
            sx={{
              background: "#d8d8d8",
              padding: "5px",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
            variant="h6"
            align="center"
            children={
              location.pathname.includes("sites") ? (
                <>
                  <strong>Live</strong> Preview
                </>
              ) : (
                "Test preview"
              )
            }
          />
          <Grid
            container
            sx={{ p: 2, flexGrow: 1 }}
            alignContent={"center"}
            justifyContent={"center"}
          >
            {template.id == "token-drop" ? (
              <TokenDropShell
                id={input.id}
                name={input.tokenName}
                description={input.tokenDescription}
                chainId={Number(input.chainId) || defaultChain}
                logoUrl={input.logoUrl}
                price={input.price}
                supply={input.supply}
                voucher={siteMetadata?.voucher}
              />
            ) : template.id == "profile" ? (
              <DecentralizedProfile
                name={input.profileName}
                title={input.title}
                description={input.description}
                telegram={input.telegram}
                linkedIn={input.linkedIn}
                customUrl={input.customUrl}
                avatar={input.avatar}
                enableAi={input.enableAi}
                customUrlText={input.customUrlText}
                calendar={input.calendar}
                github={input.github}
                email={input.email}
                twitter={input.twitter}
                instagram={input.instagram}
                kyc={input.kyc}
                discoverable={input.discoverable}
                // Always available, user shouldn't see form if not logged in
                address={currentAccounts ? currentAccounts[0] : ""}
                acceptPayments={Boolean(input.acceptPayments)}
              />
            ) : template.id == "ai" ? (
              <Ai
                name={input.name}
                avatar={input.avatar}
                prompt={input.prompt}
                // intro={`You are about to talk to start a conversation with ${input.name}'s assistant. The assistant can read ${input.name}'s schedule and create meetings.`}
              />
            ) : null}
          </Grid>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
          >
            <Tab label="@chainfuse/ui" />
            <Tab label="Iframe" />
          </Tabs>
          <TabPanel value={currentTab} index={0}>
            <CodeBlock
              sx={{
                my: 0,
                p: 2,
                overflow: "hidden",
                backgroundColor: "#ccc",
                fontSize: "0.875rem",
                borderBottomLeftRadius: "8px",
                borderBottomRightRadius: "8px",
              }}
            >
              {[
                'import { StrictMode } from "react";',
                'import { createRoot } from "react-dom";',
                'import { ChainFuseRoot } from "@chainfuse/ui";',
                "",
                'createRoot(document.findElementById("root")).render(',
                "  <StrictMode>",
                `    <ChainFuseRoot site="${input.id}">`,
                "      <TokenDrop />",
                "    </ChainFuseRoot>",
                "  </StrictMode>",
                ");",
              ].join("\n")}
            </CodeBlock>
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <CodeBlock
              sx={{
                my: 0,
                p: 2,
                overflow: "hidden",
                backgroundColor: "#ccc",
                fontSize: "0.875rem",
                borderBottomLeftRadius: "8px",
                borderBottomRightRadius: "8px",
              }}
            >
              {[
                `<iframe `,
                `  src="${
                  window.location.hostname === "chainfuse.com"
                    ? `https://${input.id}.chainfuse.com`
                    : `https://${input.id}-test.chainfuse.com`
                }"`,
                `  frameBorder="0"`,
                `  style="width: 100%; height: 500px;"`,
                `/>`,
              ].join("\n")}
            </CodeBlock>
          </TabPanel>
        </Box>
      </Hidden>
    </>
  );

  return (
    <FormControl
      sx={{
        display: "grid",
        gridGap: "1rem",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr",
          md: "1fr 1fr",
        },
      }}
    >
      <TokenDialog
        onComplete={() => {
          console.log("complete");
        }}
        ref={tokenDialogRef}
        step={currentStep}
        handleClose={onCancel}
      />
      {!template.skipWalletGate ? <Gate>{content}</Gate> : content}
    </FormControl>
  );
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function useState(template: Template, site?: DocumentSnapshot<Site>) {
  if (site && !site.exists) {
    throw new Error("Site not found.");
  }

  return React.useState(() => {
    const id = Math.ceil(Math.random() * 8999) + 1000;
    const name = `My Website ${id}`;
    return {
      input: {
        ...Object.fromEntries(
          template.fields?.map((x) => [
            x.name,
            site ? site.data()?.[x.name] ?? "" : "",
          ])
        ),
        id: site ? site.id : toShortId(name),
        name: site ? site.data()?.name : name,
        acceptPayments: true,
        enableAi: true,
      } as Record<string, string | boolean | any>,
      errors: {} as Record<string, string | undefined>,
      loading: false,
      customId: false,
    };
  });
}

function useHandleChange(setState: SetState) {
  return React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = event.target;

    // Round the supply value to the whole number
    // Ensure that it's greater than 0
    if (name === "supply" && value !== "") {
      let supply = parseInt(value, 10);
      value = isNaN(supply) ? value : String(supply > 0 ? supply : 1);
    }

    setState((prev) => ({
      ...prev,
      input: {
        ...prev.input,
        [name]: name === "id" ? toShortId(value, false) : value,
        ...(name === "name" && {
          id: toShortId(value),
        }),
      },
    }));
  }, []);
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface SiteFormProps
  extends BoxProps<
    "form",
    {
      site?: DocumentSnapshot<Site>;
      /** Project ID */
      project?: string | null;
      template: Template;
      onCancel: () => void;
    }
  > {}

export type SetState = ReturnType<typeof useState>[1];
