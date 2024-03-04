import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import defaultImage from "../../assets/images/cards/placeholder.jpg";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    paritialVisibilityGutter: 60,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    paritialVisibilityGutter: 50,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    paritialVisibilityGutter: 30,
  },
};

const useStyles = makeStyles({
  chip: {
    background: "#EBEFF5",
    borderRadius: 20,
    color: "#333840",
    fontWeight: 700,
    padding: "12px",
    cursor: "pointer",
    marginLeft: 5,
  },
  card: {
    borderRadius: 5,
    position: "relative",
    minWidth: "336px",
    cursor: "pointer",
  },
  cardMedia: {
    "& -webkit-user-drag": "none",
  },
  cardChip: {
    position: "absolute",
    top: "14px",
    right: "14px",
    zIndex: 1,
    fontWeight: 400,
    backgroundColor: "#DDE3ED",
    padding: "6px 8px",
  },
  cardContent: {
    backgroundColor: "#EBEFF5",
  },
  cardTitle: {
    fontWeight: 800,
  },
  contentBox: {
    display: "inline-flex",
    alignItems: "center",
  },
  carousel: {
    "& .carousel-item": {
      width: "max-content!important",
    },
  },
});

export const EventChip = (props: { label: string }) => {
  const classes = useStyles();
  return <Chip className={classes.chip} {...props} />;
};

export const EventCarousel = ({ children, ...props }: any) => {
  const classes = useStyles();
  return (
    <Carousel
      {...props}
      responsive={responsive}
      itemClass="carousel-item"
      className={classes.carousel}
    >
      {children}
    </Carousel>
  );
};

const EventCard = ({
  image,
  name,
  date,
  time,
}: {
  image?: any;
  name: string;
  date: string;
  time: string;
}) => {
  const classes = useStyles();
  return (
    <Card classes={{ root: classes.card }}>
      <Chip label={date} className={classes.cardChip} />
      <Box>
        <CardMedia component="img" height="140" image={image || defaultImage} />
        <CardContent className={classes.cardContent}>
          <Typography component="span" className={classes.cardTitle}>{name}</Typography>
          <Box className={classes.contentBox}>
            <AccessTimeIcon fontSize={"small"} />
            <Typography component="span" variant="body2" color="text.secondary">
              {time}
            </Typography>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default EventCard;
