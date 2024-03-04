import { SearchOutlined } from "@mui/icons-material";
import { IconButton, InputBase, Paper } from "@mui/material";

export function SearchBar() {
  return (
    <Paper
      component="form"
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", mb: 2 }}
    >
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <SearchOutlined />
      </IconButton>

      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search for collections"
        inputProps={{ "aria-label": "search for collections" }}
      />
    </Paper>
  );
}
