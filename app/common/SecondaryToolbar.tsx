import { LaunchOutlined } from "@mui/icons-material";
import {
  Box,
  BoxProps,
  Button,
  Container,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useMatch } from "react-router-dom";
import { useSite } from "../core/site.js";

/**
 * The toolbar component that shows right below the top application toolbar.
 *
 * @example
 *   ---------------------------------------------------------------------------
 *   <- All my sites | My Site 123
 *   ---------------------------------------------------------------------------
 */
export function SecondaryToolbar(props: BoxProps): JSX.Element {
  const { sx, children, ...other } = props;
  const path = useMatch({ path: "sites/:id", end: false });

  return (
    <Box
      sx={{
        height: 60,
        borderBottom: "1px solid",
        borderBottomColor: "divider",
        display: "flex",
        alignItems: "center",
        mb: 2,
      }}
      {...other}
    >
      {/* If no `children` prop was provided, render the site title by default */}
      {children ??
        (path?.params.id && (
          <Container maxWidth="md">
            <Typography
              sx={{ fontSize: "1.25rem", fontWeight: 500 }}
              variant="h2"
            >
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <React.Suspense
                  children={<SiteTitle siteId={path.params.id} />}
                  fallback={<Skeleton />}
                />
                <React.Suspense
                  children={
                    <Button
                      href={
                        location.hostname === "chainfuse.com"
                          ? `https://${path.params.id}.chainfuse.com`
                          : `https://${path.params.id}-test.chainfuse.com`
                      }
                      target="_blank"
                      variant="contained"
                      endIcon={<LaunchOutlined />}
                    >
                      Visit site
                    </Button>
                  }
                  fallback={<Skeleton />}
                />
              </Grid>
            </Typography>
          </Container>
        ))}
    </Box>
  );
}

function SiteTitle(params: { siteId: string | undefined }): JSX.Element {
  const site = useSite(params.siteId);
  return <Typography variant="h5">{site?.data()?.name}</Typography>;
}
