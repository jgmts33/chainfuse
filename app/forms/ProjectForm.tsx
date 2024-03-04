import { useCurrentUser } from "@chainfuse/react";
import { Box, Button, Link, TextField } from "@mui/material";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useProjectListLoadable,
  useProjectListRefresh,
} from "../core/project.js";

function toId(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/--+/g, "-");
}

export default function ProjectForm(props: ProjectFormProps): JSX.Element {
  const me = useCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();
  const projectRef = React.useRef<string>();
  const projectList = useProjectListLoadable();
  const [loading, setLoading] = React.useState(false);
  const refreshProjectList = useProjectListRefresh();
  const [errors, setErrors] = React.useState<Errors>({});
  const [input, setInput] = React.useState<Input>(() => {
    const id = Math.ceil(Math.random() * 8999) + 1000;
    return {
      id: `my-project-${id}`,
      name: `My Project ${id}`,
      customId: false,
    };
  });

  // Update the `?project=<name>` query string argument in the URL once
  // a new project was created
  React.useEffect(() => {
    if (
      projectList.state === "hasValue" &&
      projectRef.current &&
      projectList.contents.docs.some((x) => x.id === projectRef.current)
    ) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("project", projectRef.current as string);
      const newLocation = `${location.pathname}?${searchParams.toString()}`;
      navigate(newLocation, { replace: true });
      projectRef.current = undefined;
      props.onCancel?.();
      setLoading(false);
    }
  }, [projectList.state, location.pathname, location.search]);

  const path = `${location.pathname}${location.search}`;

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let { name, value } = event.target;
      setInput((prev) => ({
        ...prev,
        [name]:
          name === "id"
            ? value.toLowerCase().replace(/[^a-z0-9-]/g, "")
            : value,
        ...(name === "name" && {
          id: toId(value),
        }),
      }));
    },
    []
  );

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent) => {
      try {
        event.preventDefault();

        setErrors({});
        setLoading(true);

        const idToken = await me?.getIdToken();
        const res = await fetch(`/api/projects/${input.id}`, {
          method: "POST",
          headers: {
            [`Authorization`]: `Bearer ${idToken}`,
            [`Content-Type`]: `application/json`,
          },
          body: JSON.stringify({ name: input.name }),
        });

        if (res.ok) {
          // const project = await res.json();
          projectRef.current = input.id;
          refreshProjectList();
          props.onCancel?.();
        } else {
          const err = await res
            .json()
            .catch(() => Promise.resolve(new Error()));
          setErrors(
            err?.errors ?? { name: [err.message ?? "Something went wrong."] }
          );
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    },
    [input.id, input.name]
  );

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        sx={{ mt: "6px", mb: input.customId || errors.id ? 1 : 1 }}
        name="name"
        label="Project name"
        variant="outlined"
        inputProps={{ [`data-lpignore`]: "true" }}
        InputLabelProps={{ shrink: true }}
        value={input.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={
          errors.name?.[0] ||
          (input.customId || errors.id ? (
            " "
          ) : (
            <Box component="span">
              Project ID: <strong>{input.id}</strong> (
              <Link
                sx={{ color: "primary.main", fontWeight: 600 }}
                tabIndex={-1}
                href={path}
                onClick={(event) => {
                  event.preventDefault();
                  setInput((prev) => ({ ...prev, customId: true }));
                }}
              >
                edit
              </Link>
              ). It <strong>cannot be changed later</strong>.
            </Box>
          ))
        }
        disabled={loading}
        autoFocus
        fullWidth
        required
      />

      {(input.customId || errors.id) && (
        <TextField
          sx={{ mb: 1 }}
          name="id"
          label="Project ID"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          inputProps={{ [`data-lpignore`]: "true" }}
          value={input.id}
          onChange={handleChange}
          error={!!errors.id}
          helperText={errors.id?.[0] ?? " "}
          disabled={loading}
          fullWidth
          required
        />
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
          gridGap: "0.5rem",
        }}
      >
        <Button
          variant="contained"
          type="submit"
          children="Create"
          disabled={loading}
        />
        {props.cancel !== false && (
          <Button
            sx={{ color: "inherit" }}
            onClick={props.onCancel}
            children="Cancel"
          />
        )}
      </Box>
    </Box>
  );
}

interface Input {
  id: string;
  name: string;
  customId: boolean;
}

interface Errors {
  id?: string[];
  name?: string[];
}

type ProjectFormProps = {
  cancel?: false;
  onCancel?: () => void;
};
