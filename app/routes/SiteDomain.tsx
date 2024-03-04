import { useMutation } from "@chainfuse/react";
import { Check, CheckCircle, Error, ErrorOutline } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { type Site } from "db";
import { type DocumentSnapshot } from "firebase/firestore";
import * as React from "react";
import { useLocation, useParams } from "react-router-dom";
import { useHostname } from "../core/hostname.js";
import { useSite, useSiteRefresh } from "../core/site.js";

/**
 * My Assets -> Website -> Custom Domain
 * https://chainfuse.com/sites/<id>/domain
 */
export default function SiteDomain(): JSX.Element {
  const location = useLocation();
  const selfUrl = `${location.pathname}${location.search}`;
  const params = useParams();
  const site = useSite(params.id);
  const learn = useLearnHandler();
  const [
    input,
    errors,
    loading,
    handleChange,
    handleSubmit,
    handleDeleteHostname,
  ] = useState(site);
  const ready = /[\w-]+\.\w{2,}/.test(input.hostname);
  const error = errors.hostname?.[0] ?? errors._?.[0];
  const canDelete = site.data()?.hostname ? true : false;

  return (
    <React.Fragment>
      <Typography component="span"
        sx={{ fontSize: "1.25rem", mb: 2 }}
        variant="h3"
        children="Custom domain"
      />

      <Typography component="span" sx={{ mb: 2 }}>
        Custom domains allow you to serve your site from a domain other than{" "}
        <code>{site.id}.chainfuse.com.</code>{" "}
        <Link href={selfUrl} onClick={learn}>
          Learn more
        </Link>
        .
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto auto",
          gridGap: "0.5rem",
          maxWidth: 600,
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <TextField
          variant="outlined"
          name="hostname"
          placeholder="www.example.com"
          value={input.hostname}
          onChange={handleChange}
          size="small"
          disabled={loading}
          InputProps={{
            endAdornment: loading ? (
              <CircularProgress size={16} />
            ) : error ? (
              <Tooltip title={error}>
                <Error color="error" />
              </Tooltip>
            ) : (
              <StatusIconSuspense siteId={params.id} />
            ),
          }}
          error={!!errors.hostname}
        />
        <Button
          variant="contained"
          disabled={!ready || loading}
          children="Save"
          type="submit"
        />
        <Button
          sx={{ visibility: canDelete ? undefined : "hidden" }}
          variant="contained"
          disabled={!ready || loading}
          children="Delete"
          onClick={handleDeleteHostname}
        />
      </Box>
      {error && (
        <FormHelperText sx={{ ml: "14px" }} error={true} children={error} />
      )}
      <React.Suspense children={<CustomDomainStatus siteId={params.id} />} />
    </React.Fragment>
  );
}

function SuccessMessage(): JSX.Element {
  return (
    <Typography component="span"
      sx={{ my: 1, ml: 1, display: "flex", alignItems: "center" }}
      color="success.main"
      variant="body2"
    >
      <Check sx={{ mr: 1 }} />
      <Box component="span">DNS check successful</Box>
    </Typography>
  );
}

export function CustomDomainStatus(props: {
  siteId: string | undefined;
}): JSX.Element {
  const hostname = useHostname(props.siteId);

  if (!hostname) return <React.Fragment />;
  if (hostname.status === "active" && hostname.ssl?.status === "active")
    return <SuccessMessage />;

  return (
    <Alert
      sx={{ mt: 2, "& .MuiAlert-message": { width: "100%" } }}
      severity="warning"
    >
      <Typography component="span" sx={{ mb: 2 }} variant="body2">
        Please add the following DNS records to active your domain:
      </Typography>
      <Table
        size="small"
        sx={{ "& td": { fontSize: "0.75rem" }, width: "100%" }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Hostname</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <code>CNAME</code>
            </TableCell>
            <TableCell>
              <code>{hostname?.hostname}</code>
            </TableCell>
            <TableCell>
              <code>ssl.chainfuse.com</code>
            </TableCell>
          </TableRow>
          {hostname?.ssl?.validation_records?.[0].txt_name && (
            <TableRow>
              <TableCell>
                <code>TXT</code>
              </TableCell>
              <TableCell>
                <code>{hostname?.ssl?.validation_records?.[0].txt_name}</code>
              </TableCell>
              <TableCell>
                <code>{hostname?.ssl?.validation_records?.[0].txt_value}</code>
              </TableCell>
            </TableRow>
          )}
          {hostname?.ownership_verification?.name && (
            <TableRow>
              <TableCell>
                <code>TXT</code>
              </TableCell>
              <TableCell>
                <code>{hostname?.ownership_verification?.name}</code>
              </TableCell>
              <TableCell>
                <code>{hostname?.ownership_verification?.value}</code>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* <Box sx={{ fontSize: "0.75rem" }} component="pre">
        {JSON.stringify(hostname, null, "  ")}
      </Box>*/}
    </Alert>
  );
}

function StatusIcon(props: { siteId: string }): JSX.Element {
  const hostname = useHostname(props.siteId);
  const isActive =
    hostname?.status === "active" && hostname.ssl?.status === "active";
  const message =
    hostname?.ssl?.status ??
    hostname?.verification_errors?.[0] ??
    "Something went wrong";

  return isActive ? (
    <Tooltip title="DNS is active">
      <CheckCircle color="success" />
    </Tooltip>
  ) : hostname ? (
    <Tooltip sx={{ cursor: "help" }} title={message}>
      <ErrorOutline color="warning" />
    </Tooltip>
  ) : (
    <React.Fragment />
  );
}

function StatusIconSuspense(props: {
  siteId: string | undefined;
}): JSX.Element {
  return props.siteId ? (
    <React.Suspense
      children={<StatusIcon siteId={props.siteId} />}
      fallback={<CircularProgress size={16} />}
    />
  ) : (
    <React.Fragment />
  );
}

function useState(
  site: DocumentSnapshot<Site>
): [
  input: Input,
  errors: Errors,
  loading: boolean,
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void,
  submitHandler: (event: React.FormEvent) => void,
  deleteHostnameHandler: (event: React.MouseEvent) => void
] {
  const params = useParams();
  const refresh = useSiteRefresh(params.id);
  const updateSite = useMutation("UpdateSite");
  const deleteSiteHostname = useMutation("DeleteSiteHostname");
  const [input, setInput] = React.useState<Input>({
    hostname: site.data()?.hostname ?? "",
  });

  const changeHandler = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target as {
        name: keyof Input;
        value: string;
      };
      setInput((prev) => ({
        ...prev,
        [name]:
          name === "hostname" ? value.toLowerCase().replace(/\s+/g, "") : value,
      }));
      updateSite.setState((prev: any) =>
        prev.errors[name]
          ? { ...prev, errors: { ...prev.errors, [name]: undefined } }
          : prev
      );
    },
    []
  );

  const submitHandler = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      updateSite
        .commit({
          id: params.id as string,
          hostname: input.hostname,
        })
        .then(() => refresh());
    },
    [params.id, input.hostname, refresh]
  );

  const deleteHostnameHandler = React.useCallback(
    (event: React.MouseEvent) => {
      event?.preventDefault();
      deleteSiteHostname.commit({ id: params.id as string }).then(() => {
        refresh();
        setInput((prev) => ({ ...prev, hostname: "" }));
      });
    },
    [params.id]
  );

  return [
    input,
    updateSite.errors,
    updateSite.loading || deleteSiteHostname.loading,
    changeHandler,
    submitHandler,
    deleteHostnameHandler,
  ];
}

function useLearnHandler() {
  return React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
  }, []);
}

type Input = {
  hostname: string;
};

type Errors = {
  [key in keyof Input | "_"]?: string[];
};
