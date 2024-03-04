import { JSX } from "@emotion/react/jsx-runtime";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CardProps,
  Chip,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

const currencies = [
  {
    value: "0x45...123 (RIN)",
    label: "Metamask wallet",
  },
  {
    value: "Coinbase Wallet",
    label: "Coinbase Wallet",
  },
];
const min = 1;
const max = 10;

export function TokenDropUI(props: AssetCardProps): JSX.Element {
  const [currency, setCurrency] = React.useState("0x45...123 (RIN)");
  const [count, setCount] = React.useState<number>(1);
  const state = { counter: 0 };
  const displayCounter = state.counter > 0;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(event.target.value);
  };

  return (
    <>
      <Card
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CardMedia
          component="img"
          image="https://cdn.vox-cdn.com/uploads/chorus_image/image/68948366/2021_NYR_20447_0001_001_beeple_everydays_the_first_5000_days034733_.0.jpg"
          alt="green iguana"
        />
        <CardContent
          sx={{
            p: 0,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <Typography
            sx={{
              pb: 1,
            }}
            variant="subtitle2"
            color="text.primary"
          >
            Bean Sprouts Stir Fry
          </Typography>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            finibus nisl est, nec placerat mi suscipit at. Mauris tempus
            fringilla nisl.
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 0,
          }}
        >
          <Button
            sx={{ mt: 2, minWidth: "100%" }}
            variant="contained"
            size="small"
          >
            Connect to wallet
          </Button>
          <Box
            component="div"
            sx={{
              m: 1,
              display: "flex",
              flexDirection: "row-reverse",
              alignSelf: "flex-end",
            }}
          >
            <Box
              component="img"
              sx={{
                width: 24,
              }}
              alt="The house from the offer."
              src="https://storage.googleapis.com/assets.chainfuse.com/chainfuse_logo_only.svg"
            />
          </Box>
        </CardActions>
      </Card>

      <Card
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          id="outlined-select-currency-native"
          select
          hiddenLabel
          value={currency}
          size="small"
          sx={{
            p: 0,
            img: {
              marginRight: "8px",
            },
          }}
          InputProps={{
            style: { fontSize: 12 },
            startAdornment: (
              <img
                width={12}
                src="https://cryptologos.cc/logos/ethereum-eth-logo.svg"
              />
            ),
          }}
          onChange={handleChange}
          SelectProps={{
            native: true,
          }}
        >
          {currencies.map((option) => (
            <option key={option.value} value={option.value}>
              <Typography variant="caption" display="block" gutterBottom>
                {option.label}
              </Typography>
            </option>
          ))}
        </TextField>

        <CardMedia
          component="img"
          image="https://cdn.vox-cdn.com/uploads/chorus_image/image/68948366/2021_NYR_20447_0001_001_beeple_everydays_the_first_5000_days034733_.0.jpg"
          alt="green iguana"
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            p: 0,
          }}
        >
          <Typography
            sx={{
              pb: 1,
            }}
            variant="subtitle2"
            color="text.primary"
          >
            Bean Sprouts Stir Fry
          </Typography>
          <Box
            component="div"
            sx={{ display: "flex", flexDirection: "row", gap: 2, pb: 1 }}
          >
            <TextField
              id="outlined-select-currency-native"
              hiddenLabel
              size="small"
              value={"1"}
              sx={{
                p: 0,
                width: "25%",
                display: "inline-flex",
                img: {
                  marginRight: "8px",
                },
              }}
              InputProps={{
                style: { fontSize: 12 },
                startAdornment: (
                  <img
                    width={12}
                    src="https://cryptologos.cc/logos/ethereum-eth-logo.svg"
                  />
                ),
                endAdornment: "ETH",
              }}
            />
            <Typography variant="overline">11 of 10,000 Minted</Typography>
          </Box>

          <Grid container direction="row" spacing={1} alignItems="center">
            <Grid item></Grid>
            <Grid item></Grid>
          </Grid>

          <Typography variant="caption" color="text.secondary" gutterBottom>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            finibus nisl est, nec placerat mi suscipit at. Mauris tempus
            fringilla nisl.
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 0,
          }}
        >
          <Box
            component="div"
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              gap: 2,
              p: 0,
            }}
          >
            <TextField
              id="outlined-select-currency-native"
              hiddenLabel
              select
              size="small"
              value="1"
              InputProps={{
                style: { fontSize: 12 },
              }}
              sx={{
                p: 0,
                width: "35%",
                display: "inline-flex",
                img: {
                  marginRight: "8px",
                },
              }}
            >
              <option value="1">1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </TextField>
            <Button
              variant="contained"
              size="small"
              sx={{
                width: "100%",
              }}
            >
              Mint 1 of 10,000
            </Button>
          </Box>
          <Box
            component="div"
            sx={{
              m: 1,
              display: "flex",
              flexDirection: "row-reverse",
              alignSelf: "flex-end",
            }}
          >
            <Box
              component="img"
              sx={{
                width: 24,
              }}
              alt="The house from the offer."
              src="https://storage.googleapis.com/assets.chainfuse.com/chainfuse_logo_only.svg"
            />
          </Box>
        </CardActions>
      </Card>

      <Card
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          id="outlined-select-currency-native"
          select
          hiddenLabel
          value={currency}
          size="small"
          sx={{
            p: 0,
            img: {
              marginRight: "8px",
            },
          }}
          InputProps={{
            style: { fontSize: 12 },
            startAdornment: (
              <img
                width={12}
                src="https://cryptologos.cc/logos/ethereum-eth-logo.svg"
              />
            ),
          }}
          onChange={handleChange}
          SelectProps={{
            native: true,
          }}
        >
          {currencies.map((option) => (
            <option key={option.value} value={option.value}>
              <Typography variant="caption" display="block" gutterBottom>
                {option.label}
              </Typography>
            </option>
          ))}
        </TextField>
        <CardMedia
          component="img"
          image="https://cdn.vox-cdn.com/uploads/chorus_image/image/68948366/2021_NYR_20447_0001_001_beeple_everydays_the_first_5000_days034733_.0.jpg"
          alt="green iguana"
        />
        <CardContent
          sx={{
            p: 0,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <Typography
            sx={{
              pb: 1,
            }}
            variant="subtitle2"
            color="text.primary"
          >
            Bean Sprouts Stir Fry
          </Typography>

          <Box component="div" sx={{ pb: 2 }}>
            <Chip
              sx={{
                display: "inline-flex",
              }}
              label="2 Owned"
              color="success"
              size="small"
              variant="filled"
            />
          </Box>

          <Typography variant="caption" color="text.secondary" gutterBottom>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            finibus nisl est, nec placerat mi suscipit at. Mauris tempus
            fringilla nisl.
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 0,
          }}
        >
          <Box
            component="div"
            sx={{
              m: 1,
              display: "flex",
              flexDirection: "row-reverse",
              alignSelf: "flex-end",
            }}
          >
            <Box
              component="img"
              sx={{
                width: 24,
              }}
              alt="The house from the offer."
              src="https://storage.googleapis.com/assets.chainfuse.com/chainfuse_logo_only.svg"
            />
          </Box>
        </CardActions>
      </Card>
    </>
  );
}

type AssetCardProps = Omit<CardProps, "children">;
function setState(arg0: { counter: number }) {
  throw new Error("Function not implemented.");
}
