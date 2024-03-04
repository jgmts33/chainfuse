import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export function SiteListFallback(): JSX.Element {
  return (
    <Container sx={{ my: 4 }}>
      <Typography component="span"
        sx={{ mb: 2, fontSize: "1.25rem" }}
        variant="h3"
        children="My sites"
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Site</TableCell>
            <TableCell>Template</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={3}>Loading...</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Container>
  );
}
