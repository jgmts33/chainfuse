import {
  Box,
  Divider,
  Grid,
  Hidden,
  // Hidden,
  Typography,
} from "@mui/material";
import { type Template, type TemplateKey } from "core/templates";
import * as React from "react";
import { ProjectSelect } from "../common/ProjectSelect.js";
import { TemplatesGrid } from "../common/TemplatesGrid.js";
import { useProjectListLoadable } from "../core/project.js";
import { useTemplateList } from "../core/template.js";
import { DeployDialog } from "../dialogs/DeployDialog.js";
import { useDialog } from "../dialogs/index.js";
import { OnboardingDialog } from "../dialogs/OnboardingDialog.js";
import { ProjectDialog } from "../dialogs/ProjectDialog.js";
import SiteList from "./SiteList.js";

export default function Templates(): JSX.Element {
  const projectList = useProjectListLoadable();
  const projectDialog = useDialog(ProjectDialog);
  const deployDialog = useDialog(DeployDialog);
  const onboardingDialog = useDialog(OnboardingDialog);

  const templates = useTemplateList();

  const deploy = React.useCallback(
    (event: React.MouseEvent<HTMLElement>, templateId: TemplateKey) => {
      const template = templates.find((x) => x.id === templateId) as Template;
      deployDialog.open({ template });
    },
    [deployDialog.open]
  );

  // Open a new project dialog in case when the list of projects is empty
  React.useEffect(() => {
    if (
      projectList.state === "hasValue" &&
      projectList.contents.docs.length === 0
    ) {
      projectDialog.open({ cancel: false });
    }
  }, [projectList.state]);

  return (
    <>
      <Grid>
        <Hidden only={["md", "lg", "xl"]}>
          <Box mb={2}>
            <ProjectSelect sx={{ maxWidth: 250 }} />
          </Box>
        </Hidden>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Grid justifyContent={"space-between"} alignItems={"center"}>
            <Typography component="span"
              sx={{ fontSize: "1.25rem", mb: 1 }}
              variant="h3"
              children="Templates"
            />
          </Grid>
          <TemplatesGrid
            excludeBy={["profile"]}
            sx={{ mb: 4 }}
            onDeploy={deploy}
          />
        </Grid>

        <Grid item xs={12} md={5}>
          <Typography component="span"
            sx={{ fontSize: "1.25rem", mb: 1 }}
            variant="h3"
            children="Claim your profile"
          />
          <TemplatesGrid
            filterBy={["profile"]}
            sx={{ mb: 4 }}
            onDeploy={deploy}
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <Divider sx={{ mb: 4 }} />
          <SiteList />
        </Grid>
      </Grid>
      {/*
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "50%" }}>Site</TableCell>
              <TableCell sx={{ width: "50%" }} align="center">
                Template
              </TableCell>
              <TableCell sx={{ minWidth: 100 }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {siteList.state === "hasValue" &&
              (siteList.contents.docs.length > 0 ? (
                siteList.contents.docs!.map((x) => (
                  <TableRow key={x.id}>
                    <TableCell sx={{ fontWeight: "bold" }}>{x.id}</TableCell>
                    <TableCell align="center">
                      {templates.find((t) => t.id === x.data().template)?.name}
                    </TableCell>
                    <TableCell
                      sx={{ display: "flex", gridGap: "0.5rem" }}
                      align="center"
                    >
                      <DeleteSiteButton id={x.id} />
                      <Button
                        variant="contained"
                        href={getProjectUrl(x)}
                        target="_blank"
                        endIcon={<LinkIcon />}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No content
                  </TableCell>
                </TableRow>
              ))}
            {siteList.state === "loading" && (
              <TableRow>
                <TableCell
                  sx={{ display: "flex", alignItems: "center" }}
                  colSpan={2}
                >
                  <CircularProgress sx={{ mr: 1 }} size={18} />
                  <span>Loading...</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card> */}
      {projectDialog.component}
      {deployDialog.component}
      {onboardingDialog.component}
    </>
  );
}

export function getProjectUrl(project: { id: string }) {
  return ["chainfuse.com", "chainfuse.io"].includes(location.hostname)
    ? `https://${project.id}.chainfuse.com`
    : location.hostname.endsWith(".chainfuse.com")
    ? `https://${project.id}-${location.hostname}`
    : `https://${project.id}-test.chainfuse.com`;
}
