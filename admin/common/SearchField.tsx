import { Search } from "@mui/icons-material";
import { InputAdornment, TextField, TextFieldProps } from "@mui/material";

export function SearchField(props: TextFieldProps): JSX.Element {
  const { sx, InputProps, ...other } = props;

  return (
    <TextField
      sx={{ maxWidth: 320, ...sx }}
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
        ...InputProps,
      }}
      placeholder="Search..."
      fullWidth
      {...other}
    />
  );
}
