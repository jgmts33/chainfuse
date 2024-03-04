import { Box, Button, Container, Stack } from "@mui/material";
import {
  DataGridPro,
  DataGridProProps,
  GridColDef,
  GridRowId,
} from "@mui/x-data-grid-pro";
import { ConfirmDialog, DialogElement } from "core/ui";
import * as React from "react";
import {
  renderHostname,
  renderSiteLink,
  renderTemplate,
} from "../common/DataGrid.js";
import { SearchField } from "../common/SearchField.js";
import { useCurrentUser } from "../core/auth.js";
import { useSiteListLoadable, useUpdateSiteList } from "../core/site.js";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "Site ID",
    width: 300,
    renderCell: renderSiteLink,
  },
  {
    field: "template",
    headerName: "Template",
    width: 200,
    renderCell: renderTemplate,
    valueGetter(params) {
      return `${params.row.template}:${params.row.version}`;
    },
  },
  {
    field: "hostname",
    headerName: "Hostname",
    width: 200,
    renderCell: renderHostname,
  },
];

export default function Sites(): JSX.Element {
  const [state, setState] = useState();
  const value = useSiteListLoadable();
  const confirmDialogRef = React.useRef<DialogElement>(null);
  const handleSelect = useHandleSelect(setState);
  const handleDelete = useHandleDelete(state);

  return (
    <Container
      sx={{
        my: 2,
        display: "grid",
        gridTemplateRows: "auto 1fr",
        flexGrow: 1,
      }}
    >
      <Stack sx={{ mb: 1 }} direction="row">
        <SearchField />
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          size="small"
          disabled={state.selected.length === 0}
          children="Delete"
          onClick={confirmDialogRef.current?.open}
        />
      </Stack>
      <DataGridPro
        loading={value.state === "loading"}
        rows={value.state === "hasValue" ? value.contents : []}
        columns={columns}
        // pageSize={100}
        // rowsPerPageOptions={[25, 50, 100]}
        checkboxSelection
        disableSelectionOnClick
        onSelectionModelChange={handleSelect}
      />
      <ConfirmDialog
        ref={confirmDialogRef}
        onConfirm={handleDelete}
        confirmText="Yes, Delete"
      >
        Are you sure you want to delete selected sites?
      </ConfirmDialog>
    </Container>
  );
}

function useState() {
  return React.useState<State>({ selected: [] });
}

function useHandleSelect(setState: SetState) {
  return React.useCallback<SelectHandler>(
    function (selected) {
      setState((prev) => ({ ...prev, selected }));
    },
    [setState]
  );
}

function useHandleDelete(state: State) {
  const updateSiteList = useUpdateSiteList();
  const me = useCurrentUser();
  return React.useCallback(
    async function () {
      const token = await me?.getIdToken();

      for (const id of state.selected) {
        const res = await fetch(`/api/sites/${id}`, {
          method: "DELETE",
          headers: { [`Authorization`]: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(
            `Failed to delete ${id}. Error ${res.status}: ${res.statusText}`
          );
        }
      }

      updateSiteList();
    },
    [state.selected, me, updateSiteList]
  );
}

// #region TypeScript declarations

type State = {
  selected: GridRowId[];
};

type SetState = ReturnType<typeof useState>[1];

type SelectHandler = NonNullable<DataGridProProps["onSelectionModelChange"]>;

// #endregion
