import { Box, BoxProps } from "@mui/material";
import { AssetCard } from "./AssetCard.js";

export function AssetGrid(props: AssetGridProps): JSX.Element {
  const { sx, ...other } = props;
  const assets = Array.from({ length: 12 });

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr 1fr",
          lg: "1fr 1fr 1fr 1fr",
        },
        gridGap: "1rem",
      }}
      {...other}
    >
      {assets.map((_, i) => (
        <AssetCard key={i} />
      ))}
    </Box>
  );
}

type AssetGridProps = Omit<BoxProps, "children">;
