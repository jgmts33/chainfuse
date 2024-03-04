import { useMutation } from "@chainfuse/react";
import { Delete, DeleteForever } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuProps,
  Typography,
} from "@mui/material";
import * as React from "react";
import {
  atom,
  useRecoilCallback,
  useRecoilTransaction_UNSTABLE,
  useRecoilValue,
} from "recoil";

const SiteMenuState = atom<State>({
  key: "SiteMenu",
  default: { open: false, anchorEl: null, id: null },
});

export function SiteMenu(props: SiteMenuProps): JSX.Element {
  const state = useRecoilValue(SiteMenuState);
  const handleClose = useCloseSiteMenu();
  const openDeleteDialog = useOpenDeleteDialog();
  const closeDeleteDialog = useCloseDeleteDialog();
  const del = useDeleteSite();

  return (
    <React.Fragment>
      <Menu
        id="site-menu"
        open={state.open}
        onClose={handleClose}
        anchorEl={state.anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        {...props}
      >
        <MenuItem onClick={openDeleteDialog} dense>
          <ListItemIcon children={<Delete fontSize="small" />} />
          <Typography component="span" variant="inherit">Delete</Typography>
        </MenuItem>
      </Menu>

      <Dialog
        open={state.confirmDelete ?? false}
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent sx={{ "&:last-child": {} }}>
          <Typography component="span" sx={{ mb: 2 }}>
            Are you sure you want to delete <strong>{state.id}</strong>?
          </Typography>

          <Alert severity="error">
            {del.errors._?.[0] || del.errors.id?.[0] || (
              <Box>
                <strong>Warning</strong>: This action cannot be undone!
              </Box>
            )}
          </Alert>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              gridGap: "0.5rem",
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              startIcon={<DeleteForever />}
              onClick={del.commit}
              disabled={del.loading}
              children="Yes, Delete"
            />
            <Button
              variant="outlined"
              onClick={closeDeleteDialog}
              children="Cancel"
            />
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export function useOpenSiteMenu() {
  return useRecoilCallback((ctx) => (event: React.MouseEvent) => {
    const id = (event.currentTarget as HTMLElement).dataset.id as string;
    ctx.set(SiteMenuState, { open: true, anchorEl: event.currentTarget, id });
  });
}

export function useCloseSiteMenu() {
  return useRecoilCallback((ctx) => (event: React.MouseEvent) => {
    ctx.set(SiteMenuState, { open: false, anchorEl: null, id: null });
  });
}

function useOpenDeleteDialog() {
  return useRecoilCallback((ctx) => () => {
    ctx.set(SiteMenuState, (prev) => ({
      ...prev,
      confirmDelete: true,
      open: false,
      anchorEl: null,
    }));
  });
}

function useCloseDeleteDialog() {
  return useRecoilCallback((ctx) => () => {
    ctx.set(SiteMenuState, (prev) => ({ ...prev, confirmDelete: false }));
  });
}

function useDeleteSite() {
  const closeDialog = useCloseDeleteDialog();
  const mutation = useMutation("DeleteSite");
  const commit = useRecoilTransaction_UNSTABLE(
    (ctx) => () => {
      const { id } = ctx.get(SiteMenuState);
      if (!id) throw new Error();
      mutation.commit({ id }).then(closeDialog);
    },
    [mutation.commit, closeDialog]
  );
  return { ...mutation, commit };
}

type SiteMenuProps = Omit<MenuProps, "children" | "open" | "anchorEl">;
type State = {
  open: boolean;
  anchorEl: Element | null;
  id: string | null;
  confirmDelete?: boolean;
};
