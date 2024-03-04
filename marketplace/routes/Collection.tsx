import { Container, Typography } from "@mui/material";
import { AssetGrid } from "../common/AssetGrid.js";
import { SearchBar } from "../common/SearchBar.js";

export default function Collection(): JSX.Element {
  return (
    <Container sx={{ my: 4 }}>
      <Typography sx={{ mb: 4, fontSize: "1.25rem" }} variant="h3">
        All collections
      </Typography>
      <SearchBar />
      <AssetGrid />
    </Container>
  );
}
