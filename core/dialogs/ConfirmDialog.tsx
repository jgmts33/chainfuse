import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from "@mui/material";
import * as React from "react";

/**
 * @example
 *
 *   function Example(): JSX.Element {
 *     const dialogRef = React.useRef<DialogElement>(null);
 *
 *     return (
 *       <Container>
 *         <Button onClick={dialogRef.current?.open}>Delete</Dialog>
 *         <ConfirmDialog ref={dialogRef} onConfirm={...}>
 *           Are you sure you want to delete X?
 *         </ConfirmDialog>
 *       <Container>
 *     )
 *   }
 */
export const ConfirmDialog = React.forwardRef<
  DialogElement,
  ConfirmDialogProps
>(function ConfirmDialog(props, ref): JSX.Element {
  const { children, onConfirm, confirmText, cancelText, title, ...other } =
    props;
  const [state, setState] = useState();
  const handleClose = useHandleClose(setState);
  const handleConfirm = useHandleConfirm(setState, onConfirm);
  useImperativeHandle(ref, setState);
  const id = `confirm-dialog-${React.useId()}`;

  return (
    <Dialog
      open={state.open}
      maxWidth="xs"
      onClose={handleClose}
      aria-describedby={id}
      keepMounted
      fullWidth
      {...other}
    >
      {title && <DialogTitle>{title}</DialogTitle>}

      <DialogContent id={id}>
        {state.error && (
          <Alert
            sx={{ mb: 2 }}
            severity="error"
            children={state.error?.message}
          />
        )}
        <DialogContentText>{children}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} children={cancelText || "Cancel"} />
        <LoadingButton
          variant="contained"
          onClick={handleConfirm}
          children={confirmText || "OK"}
          loading={state.loading}
        />
      </DialogActions>
    </Dialog>
  );
});

// #region React hooks

function useState() {
  return React.useState<State>({ open: false, loading: false });
}

function useHandleClose(setState: SetState) {
  return React.useCallback(() => setState({ open: false, loading: false }), []);
}

function useHandleConfirm(setState: SetState, onConfirm?: () => Promise<void>) {
  const handleClose = useHandleClose(setState);
  return React.useCallback(
    function () {
      const action = onConfirm?.();
      if (action?.then) {
        setState((prev) => ({ ...prev, loading: true }));
        action
          .then(() => handleClose())
          .catch((error) => {
            setState((prev) => ({ ...prev, loading: false, error }));
          });
      } else {
        handleClose();
      }
    },
    [onConfirm]
  );
}

function useImperativeHandle(
  ref: React.ForwardedRef<DialogElement>,
  setState: SetState
) {
  React.useImperativeHandle(ref, () => ({
    open() {
      setState({ open: true, loading: false });
    },
  }));
}

// #endregion

// #region TypeScript declarations

type ConfirmDialogProps = Omit<DialogProps, "open" | "title"> & {
  onConfirm?: () => Promise<void>;
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
  title?: React.ReactNode;
};

type State = {
  open: boolean;
  loading: boolean;
  error?: Error;
};

type SetState = React.Dispatch<React.SetStateAction<State>>;

export type DialogElement = {
  open: () => void;
};

// #endregion
