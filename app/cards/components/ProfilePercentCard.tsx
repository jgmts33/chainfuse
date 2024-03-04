import { Card, CircularProgress, Grid, Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  circle: {
    stroke: "url(#linearColors)",
  },
}));

const ProfilePercentCard = (props: { value: number }) => {
  const classes = useStyles({});

  return (
    <>
      <svg width={0} height={0}>
        <linearGradient id="linearColors" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF11" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFFFFF11" />
        </linearGradient>
      </svg>
      <Card sx={{ backgroundColor: "#707A8A", borderRadius: 2 }}>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            sx={{
              position: "relative",
              display: "inline-flex",
              justifyContent: "center",
              marginY: 1,
            }}
          >
            <CircularProgress
              variant="determinate"
              sx={{
                color: "#8E99AB",
              }}
              size={60}
              value={100}
            />
            <CircularProgress
              variant="determinate"
              sx={{
                position: "absolute",
                left: 0,
              }}
              classes={{ circle: classes.circle }}
              {...props}
              size={60}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                component="div"
                sx={{ color: "white", fontSize: 20 }}
              >{`${Math.round(props.value)}%`}</Typography>
            </Box>
          </Box>
          <Typography
            component="div"
            sx={{ color: "white", fontSize: 20, fontWeight: 800, marginY: 1 }}
          >
            Profile completeness
          </Typography>
        </Grid>
      </Card>
    </>
  );
};

export default ProfilePercentCard;
