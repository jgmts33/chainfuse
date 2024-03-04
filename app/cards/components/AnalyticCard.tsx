import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import PaymentsIcon from "@mui/icons-material/Payments";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { Box, Card, CardContent, Typography } from "@mui/material";

// ==============================|| Event Card ||============================== //

const titleList = ["Tickets sold", "Total earnings", "total views"];
const iconList = [
  <PaymentsIcon fontSize="large" />,
  <ChangeCircleIcon fontSize="large" />,
  <RemoveRedEyeOutlinedIcon fontSize="large" />,
];
const AnalyticCard = ({ id, amount }: { id: number; amount: number }) => {
  return (
    <Card sx={{ width: "100%", borderRadius: 5, margin: 1 }}>
      <CardContent sx={{ backgroundColor: "#EBEFF5" }}>
        <Typography gutterBottom variant="subtitle1" component="div">
          {titleList[id]}
        </Typography>
        <Box sx={{ display: "inline-flex", alignItems: "center" }}>
          {iconList[id]}
          <span
            style={{
              fontWeight: 800,
              fontSize: "35px",
              lineHeight: "49px",
              fontStyle: "normal",
              color: "#333840",
              paddingLeft: 5,
            }}
          >
            {amount}
          </span>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AnalyticCard;
