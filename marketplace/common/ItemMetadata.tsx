import {
  Avatar,
  Button,
  Card,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from "@mui/material";

export function ItemMetadata() {
  return (
    <Grid container xs direction="row" spacing={4} sx={{ pb: 4 }}>
      <Grid item>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Card sx={{ maxWidth: 345, minWidth: 240 }}>
              <CardMedia
                component="img"
                height="100%"
                image="https://particle.azureedge.net/app/uploads/2018/02/cute-cryptokitty-666x400-c-center.jpg"
                alt="green iguana"
              />
            </Card>
          </Grid>
          <Grid item>
            <Button sx={{ minWidth: "100%" }} variant="contained">
              Buy now
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs spacing={4} sx={{ minWidth: 450 }}>
        <Typography gutterBottom variant="h4" component="div">
          Duchess Olepooka
        </Typography>
        <Chip
          sx={{ mb: 3 }}
          variant="outlined"
          size="small"
          label="George"
          avatar={<Avatar src="/static/images/avatar/1.jpg" />}
        />
        <Typography variant="body1" sx={{ pb: 3 }} color="text.secondary">
          Greetings! I'm Duchess Olepooka. I tend to drink when I'm excited. I
          heard a rumour Bob Saget was running for president. They'd have my
          vote. What do you say you and me get outta here?
        </Typography>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography variant="overline" color="text.secondary">
              ACCENT COLOUR
            </Typography>
            <Typography variant="subtitle2">Missmuffett</Typography>
          </Grid>
          <Grid item>
            <Typography variant="overline" color="text.secondary">
              BASE COLOUR
            </Typography>
            <Typography variant="subtitle2">Bananacream</Typography>
          </Grid>
          <Grid item>
            <Typography variant="overline" color="text.secondary">
              EYE COLOUR
            </Typography>
            <Typography variant="subtitle2">Parakeet</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
