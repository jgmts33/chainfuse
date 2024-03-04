import { FormTemplate } from "@chainfuse/core";
import { CreateCollectionForm } from "@chainfuse/ui";
import { Dialog, DialogProps } from "@mui/material";
import { ConfirmDialog, DialogElement } from "core/ui";
import * as React from "react";
import { DialogContent } from "./DialogContent.js";

export function OnboardingDialog(props: OnboardingDialogProps): JSX.Element {
  const { template, ...other } = props;
  const handleClose = useHandleClose(props);
  const dialogRef = React.useRef<DialogElement>(null);

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      {...other}
      sx={{ "& .MuiDialog-paper": { background: "none" } }}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
          // dialogRef.current?.open();
          return;
        }
      }}
    >
      <DialogContent
        sx={{
          padding: 0,
          minWidth: 280,
          background: (theme) => theme.palette.background.paper,
          borderRadius: (theme) => theme.shape.borderRadius,
        }}
      >
        <CreateCollectionForm
          onComplete={() => {
            handleClose();
          }}
          template={template}
          onCancel={handleClose}
          animatedBg={true}
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

export interface OnboardingDialogProps extends DialogProps {
  template: FormTemplate;
}
