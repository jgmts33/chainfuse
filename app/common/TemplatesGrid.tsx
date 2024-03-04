import {
  PersonPin as PersonPinIcon,
  Psychology as PsychologyIcon,
  RocketLaunch as RocketLaunchIcon,
  Storefront as StorefrontIcon,
  VideoCall,
} from "@mui/icons-material";
import {
  Box,
  BoxProps,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Template, type TemplateKey } from "core/templates";
import React from "react";
import { useTemplateList } from "../core/template.js";

export function TemplatesGrid(props: TemplatesGridProps): JSX.Element {
  const { sx, onDeploy, ...other } = props;
  const handleClick = useHandleClick(onDeploy);
  const templates = useTemplateList();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr", md: "1fr" },
        gridGap: "1rem",
        ...sx,
      }}
      {...other}
    >
      {templates
        .filter((value: Template) => {
          if (props.filterBy) {
            return props.filterBy.includes(value.id);
          } else if (props.excludeBy) {
            return !props.excludeBy.includes(value.id);
          }

          return true;
        })
        .map((x) => (
          <Card hidden={x.hidden} key={x.id}>
            <CardMedia
              component="img"
              height="140"
              image="https://test-upload.chainfuse.com/315wkamu9jv7.jpg"
              alt="green iguana"
            />

            <CardContent>
              <Typography
                sx={{ fontWeight: 600, mb: 1, mt: 1 }}
                display="flex"
                children={
                  <>
                    {x.id === "marketplace" ? (
                      <StorefrontIcon />
                    ) : x.id === "token-drop" ? (
                      <RocketLaunchIcon />
                    ) : x.id === "profile" ? (
                      <PersonPinIcon />
                    ) : x.id === "stream" ? (
                      <VideoCall />
                    ) : x.id === "ai" ? (
                      <PsychologyIcon />
                    ) : undefined}{" "}
                    {x.name}
                  </>
                }
              />
              <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
                {x.description}
              </Typography>

              <Button
                variant="contained"
                onClick={handleClick}
                children={`Create ${x.name}`}
                data-id={x.id}
              />

              {/* <Typography sx={{ fontWeight: 600, mb: 1 }} children={x.name} />
              <Typography sx={{ mb: 2 }} children={x.description} />
              <Button
                variant="contained"
                onClick={handleClick}
                children={`Deploy ${x.name}`}
                data-id={x.id}
              /> */}
            </CardContent>
          </Card>
        ))}
    </Box>
  );
}

function useHandleClick(onDeploy: DeployCallback) {
  return React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const templateId = event.currentTarget.dataset.id as TemplateKey;
      onDeploy?.(event, templateId);
    },
    [onDeploy]
  );
}

// #region TypeScript declarations

type DeployCallback = (
  event: React.MouseEvent<HTMLButtonElement>,
  templateId: TemplateKey
) => void;

type TemplatesGridProps = BoxProps<
  "div",
  {
    filterBy?: Array<TemplateKey>;
    excludeBy?: Array<TemplateKey>;
    onDeploy: DeployCallback;
  }
>;

// #endregion
