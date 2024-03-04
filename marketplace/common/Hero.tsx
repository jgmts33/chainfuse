import { Box, BoxProps, CardMedia, Container } from "@mui/material";

export function Hero(props: HeroProps): JSX.Element {
  const { sx, ...other } = props;

  return (
    <Box
      sx={{
        display: "grid",
        justifyItems: "stretch",
        alignItems: "stretch",
        gridTemplateColumns: "1fr",
        background: "url(https://pasteboard.co/xOeJjvQitXmf.png)",
        ...sx,
      }}
      component="header"
      {...other}
    >
      <CardMedia
        sx={{ gridArea: "1/1/2/2", height: 250 }}
        image="https://gcdnb.pbrd.co/images/xOeJjvQitXmf.png?o=1"
      />
      <Container sx={{ gridArea: "1/1/2/2" }}>...</Container>
    </Box>
  );
}

type HeroProps = Omit<BoxProps<"header">, "children">;
