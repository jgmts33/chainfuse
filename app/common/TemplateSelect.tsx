import { Add } from "@mui/icons-material";
import {
  Divider,
  MenuItem,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProjectListLoadable } from "../core/project.js";
import { useDialog } from "../dialogs/index.js";
import { ProjectDialog } from "../dialogs/ProjectDialog.js";

export function ProjectSelect(props: ProjectSelectProps): JSX.Element {
  const { ...other } = props;
  const projectDialog = useDialog(ProjectDialog);
  const [open, setOpen] = React.useState(false);
  const projectList = useProjectListLoadable();
  const navigate = useNavigate();
  const location = useLocation();

  const projectId =
    projectList.state === "hasValue"
      ? new URLSearchParams(location.search).get("project") ?? ""
      : "";

  React.useEffect(() => {
    if (
      projectList.state === "hasValue" &&
      projectList.contents.docs.length > 0
    ) {
      const searchParams = new URLSearchParams(location.search);
      const projectId = searchParams.get("project");

      if (
        !projectId ||
        !projectList.contents.docs.some((x) => x.id === projectId)
      ) {
        searchParams.set("project", projectList.contents.docs[0].id);
        navigate(`${location.pathname}?${searchParams.toString()}`);
      }
    }
  }, [projectList.state, location.pathname, location.search]);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("project", event.target.value);
      localStorage.setItem("project", event.target.value);
      navigate(`${window.location.pathname}?${searchParams.toString()}`);
    },
    []
  );

  const createProject = React.useCallback(() => {
    setOpen(false);
    projectDialog.open();
  }, []);

  const handleOpen = React.useCallback(() => setOpen(true), []);
  const handleClose = React.useCallback(() => {
    if (props.preventClose) {
      return;
    }

    setOpen(false);
  }, []);

  return (
    <React.Fragment>
      <TextField
        SelectProps={{
          open,
          onOpen: handleOpen,
          onClose: handleClose,
        }}
        disabled={projectList.state === "loading"}
        value={projectId}
        onChange={handleChange}
        size="small"
        fullWidth
        select
        {...other}
      >
        {projectList.state === "hasValue" ? (
          projectList.contents.docs.map((x) => (
            <MenuItem key={x.id} value={x.id} children={x.data().name} />
          ))
        ) : (
          <MenuItem />
        )}
        <Divider />
        <MenuItem
          sx={{ color: "text.secondary", fontSize: "0.875rem" }}
          onClick={createProject}
        >
          <Add sx={{ mr: 1 }} /> Create a new project
        </MenuItem>
      </TextField>
      {projectDialog.component}
    </React.Fragment>
  );
}

interface ProjectSelectProps
  extends Omit<TextFieldProps, "children" | "select"> {
  preventClose?: boolean;
}
