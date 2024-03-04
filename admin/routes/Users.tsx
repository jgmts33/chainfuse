import { Container } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { useRecoilValueLoadable } from "recoil";
import {
  renderCheckMark,
  renderDate,
  renderDisplayName,
  renderEmail,
} from "../common/DataGrid.js";
import * as state from "../core/state.js";

const columns: GridColDef[] = [
  {
    field: "displayName",
    headerName: "Display Name",
    width: 240,
    renderCell: renderDisplayName,
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
    renderCell: renderEmail,
  },
  {
    field: "metadata.creationTime",
    headerName: "Registered",
    width: 130,
    align: "center",
    headerAlign: "center",
    renderCell: renderDate,
    valueGetter: (params) => new Date(params.row.metadata.creationTime),
  },
  {
    field: "metadata.lastSignInTime",
    headerName: "Last Login",
    width: 130,
    align: "center",
    headerAlign: "center",
    renderCell: renderDate,
    valueGetter: (params) => new Date(params.row.metadata.lastSignInTime),
  },
  {
    field: "disabled",
    headerName: "Active",
    width: 90,
    align: "center",
    headerAlign: "center",
    renderCell: renderCheckMark,
    valueGetter: (params) => !params.row.disabled,
  },
];

export default function Users(): JSX.Element {
  const value = useRecoilValueLoadable(state.userList);

  return (
    <Container sx={{ my: 2, flexGrow: 1 }}>
      <DataGridPro
        loading={value.state === "loading"}
        getRowId={(user) => user.uid}
        rows={value.state === "hasValue" ? value.contents : []}
        columns={columns}
        // pageSize={100}
        // rowsPerPageOptions={[25, 50, 100]}
        checkboxSelection
        disableSelectionOnClick
      />
    </Container>
  );
}
