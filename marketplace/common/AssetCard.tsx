import { MoreVert } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  CardProps,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";

export function AssetCard(props: AssetCardProps): JSX.Element {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image="https://cdn.vox-cdn.com/uploads/chorus_image/image/71207686/acastro_210329_1777_nft_0003.0.jpg"
        alt="green iguana"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>

        <Chip
          sx={{ mt: 2 }}
          variant="outlined"
          size="small"
          label="George"
          avatar={<Avatar src="/static/images/avatar/1.jpg" />}
        />
      </CardContent>
    </Card>
  );
}

type AssetCardProps = Omit<CardProps, "children">;
