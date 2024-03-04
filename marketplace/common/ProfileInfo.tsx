import { styled } from "@mui/material/styles";
import {
  Button,
  Card,
  CardMedia,
  CardProps,
  Grid,
  Link,
  Typography,
} from "@mui/material";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

export function ProfileInfo() {
  return (
    <Grid container xs direction="row" spacing={4} sx={{ pb: 4 }}>
      <Grid item>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Card sx={{ maxWidth: 345, minWidth: 240 }}>
              <CardMedia
                component="img"
                height="100%"
                image="https://nftstudio24.com/wp-content/uploads/2022/05/Untitled.jpg"
                alt="green iguana"
              />
            </Card>
          </Grid>
          <Grid item>
            <Button sx={{ minWidth: "100%" }} variant="outlined">
              Edit profile
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs spacing={4} sx={{ minWidth: 450 }}>
        <Typography gutterBottom variant="h4" component="div">
          John Smith
        </Typography>
        <Grid container direction="row" spacing={2} sx={{ pb: 4 }}>
          <Grid item>
            <Link href="#">
              <Img
                sx={{ width: 24, height: 24 }}
                alt="Facebook"
                src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Facebook_colored_svg_copy-1024.png"
              />
            </Link>
          </Grid>
          <Grid item>
            <Link href="#">
              <Img
                sx={{ width: 24, height: 24 }}
                alt="YouTube"
                src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Youtube_colored_svg-1024.png"
              />
            </Link>
          </Grid>
          <Grid item>
            <Link href="#">
              <Img
                sx={{ width: 24, height: 24 }}
                alt="Instagram"
                src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Instagram_colored_svg_1-1024.png"
              />
            </Link>
          </Grid>
          <Grid item>
            <Link href="#">
              <Img
                sx={{ width: 24, height: 24 }}
                alt="Twitter"
                src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Twitter_colored_svg-1024.png"
              />
            </Link>
          </Grid>
        </Grid>
        <Typography variant="body1" sx={{ pb: 4 }} color="text.secondary">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut
          sodales justo. Duis posuere metus non tellus lacinia mattis. Etiam
          rhoncus dapibus auctor. Proin pharetra purus sed ipsum tincidunt, in
          auctor est cursus. Aliquam efficitur ipsum at consequat tempus
        </Typography>
        <Grid container direction="row" spacing={6}>
          <Grid item>
            <Typography variant="overline" color="text.secondary">
              Items
            </Typography>
            <Typography variant="h6">9</Typography>
          </Grid>
          <Grid item>
            <Typography variant="overline" color="text.secondary">
              Owners
            </Typography>
            <Typography variant="h6">116.3K</Typography>
          </Grid>
          <Grid item>
            <Typography variant="overline" color="text.secondary">
              Floor price
            </Typography>
            <Typography variant="h6">$10 dlls</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

type AssetCardProps = Omit<CardProps, "children">;
