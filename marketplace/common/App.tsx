import { ThemeProvider } from "@emotion/react";
import { CssBaseline, Toolbar } from "@mui/material";
import * as React from "react";
import { Route, Routes } from "react-router-dom";
import { theme } from "../core/theme.js";
import { Home } from "../routes/index.js";
import { AppBar } from "./AppBar.js";
import { Hero } from "./Hero.js";
import { Footer } from "../common/Footer.js";
import Collection from "../routes/Collection.js";
import Library from "../routes/Library.js";
import Profile from "../routes/Profile.js";
import Item from "../routes/Item.js";

export function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar />
      <Toolbar />
      <Hero />

      <Routes>
        <Route path="/" element={<React.Suspense children={<Home />} />} />
        <Route
          path="/library"
          element={<React.Suspense children={<Library />} />}
        />
        <Route
          path="/collection"
          element={<React.Suspense children={<Collection />} />}
        />
        <Route
          path="/profile"
          element={<React.Suspense children={<Profile />} />}
        />
        <Route path="/item" element={<React.Suspense children={<Item />} />} />
      </Routes>
      <Footer />
    </ThemeProvider>
  );
}
