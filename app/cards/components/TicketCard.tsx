import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
  Grid,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import defaultImage from "../../assets/images/cards/default.png";

const useStyles = makeStyles({
  chip: {
    background: "#C8D1E0",
    borderRadius: 20,
    color: "#333840",
    fontWeight: 700,
    padding: "12px",
    cursor: "pointer",
    marginLeft: 5,
  },
  ticketBox: {
    backgroundColor: "#EBEFF5",
    borderRadius: 10,
    padding: 10,
    "& .cardArea": {
      maxHeight: 500,
      marginTop: 10,
      overflowY: "scroll",
      padding: 5,
      "&::-webkit-scrollbar": {
        width: "5px",
        height: "5px",
      },
      "&::-webkit-scrollbar-thumb": {
        borderRadius: "8px",
        background: "#8E99AB",
        backgroundClip: "padding-box",
      },
      "&::-webkit-scrollbar-track": {
        borderRadius: "10px",
        backgroundColor: "#C8D1E0",
      },
    },
  },
});

export const TicketChip = (props: { label: string }) => {
  const classes = useStyles();
  return <Chip className={classes.chip} {...props} />;
};

export const TicketsBox = (props: any) => {
  const classes = useStyles();

  return <Box className={classes.ticketBox}>{props.children}</Box>;
};

const TicketCard = ({
  image,
  name,
  date,
  time,
  description,
}: {
  image?: any;
  name: string;
  date: string;
  time: string;
  description: string;
}) => {
  return (
    <Card sx={{ borderRadius: 5 }}>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={3}>
          <CardMedia
            component="img"
            image={image || defaultImage}
            sx={{
              width: "100%",
              height: "100%",
              maxHeight: { xs: "140px", sm: "none" },
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={9}
          sx={{
            backgroundColor: "#EBEFF5",
            padding: 2,
            position: "relative",
          }}
        >
          <Chip
            label={date}
            sx={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}
          />
          <Typography
            gutterBottom
            variant="subtitle1"
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            {name}
          </Typography>
          <Box sx={{ display: "inline-flex", alignItems: "center" }}>
            <ChangeCircleIcon fontSize={"small"} />
            <Typography component="span" variant="body1" color="text.secondary">
              {time}
            </Typography>
          </Box>
          <Typography component="span" variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default TicketCard;
