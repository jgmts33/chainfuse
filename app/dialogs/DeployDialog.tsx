import { Dialog, DialogProps, DialogTitle } from "@mui/material";
import { type Template } from "core/templates";
import { ConfirmDialog, DialogElement } from "core/ui";
import * as React from "react";
import { DialogContent } from "./DialogContent.js";

const SiteForm = React.lazy(() => import("../forms/SiteForm.js"));

export function DeployDialog(props: DeployDialogProps): JSX.Element {
  const { template, ...other } = props;
  const handleClose = useHandleClose(props);
  const dialogRef = React.useRef<DialogElement>(null);

  return (
    <Dialog
      maxWidth="lg"
      fullWidth
      {...other}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
          dialogRef.current?.open();
          return;
        }
      }}
    >
      <DialogTitle children={`Create ${template?.name}`} />
      <DialogContent>
        <SiteForm
          template={template}
          onCancel={() => {
            dialogRef.current?.open();
          }}
        />
        <ConfirmDialog
          ref={dialogRef}
          onConfirm={async () => {
            return handleClose();
          }}
        >
          Are you sure you want to close this dialog?
        </ConfirmDialog>
      </DialogContent>
    </Dialog>
  );
}

function useHandleClose(props: DialogProps) {
  return React.useCallback(() => {
    props.onClose?.({}, "backdropClick");
  }, [props.onClose]);
}

export interface DeployDialogProps extends DialogProps {
  template: Template;
}
