import { Dialog, DialogProps, DialogTitle } from "@mui/material";
import * as React from "react";
import { DialogContent } from "./DialogContent.js";

const ProjectForm = React.lazy(() => import("../forms/ProjectForm.js"));

export function ProjectDialog(props: ProjectDialog): JSX.Element {
  const { cancel, ...other } = props;
  const handleClose = useHandleCancel(props);

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      {...other}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
          return;
        }
      }}
    >
      <DialogTitle children="Create a New Project" />
      <DialogContent>
        <ProjectForm cancel={cancel} onCancel={handleClose} />
      </DialogContent>
    </Dialog>
  );
}

function useHandleCancel(props: ProjectDialog) {
  if (props.preventClose) {
    return;
  }

  return React.useCallback(() => {
    props.onClose?.({}, "backdropClick");
  }, [props.onClose]);
}

interface ProjectDialog extends DialogProps {
  cancel?: false;
  preventClose?: boolean;
}
