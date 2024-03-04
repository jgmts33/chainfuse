import { Container, Link } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { useRecoilValueLoadable } from "recoil";
import * as state from "../core/state.js";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "Hostname ID",
    renderCell(params) {
      const href = `https://dash.cloudflare.com/e9b82b39aa91575a2643529d24a1bf02/chainfuse.com/ssl-tls/custom-hostnames/${params.id}`;
      return <Link href={href} children={params.id} />;
    },
    width: 300,
  },
  {
    field: "hostname",
    headerName: "Hostname",
    renderCell(params) {
      return <Link href={`https://${params.value}/`} children={params.value} />;
    },
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 200,
  },
];

export default function Hostnames(): JSX.Element {
  const value = useRecoilValueLoadable(state.hostnameList);

  return (
    <Container sx={{ my: 2, flexGrow: 1 }}>
      <DataGridPro
        loading={value.state === "loading"}
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
