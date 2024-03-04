import { FormTemplate } from "@chainfuse/core";
import { useFormTemplateList } from "@chainfuse/react";
import { Grid } from "@mui/material";
import * as React from "react";
import { useProjectListLoadable } from "../core/project.js";
import { useDialog } from "../dialogs/index.js";
import { OnboardingDialog } from "../dialogs/OnboardingDialog.js";
import { ProjectDialog } from "../dialogs/ProjectDialog.js";

export default function Onboard(): JSX.Element {
  const projectList = useProjectListLoadable();
  const projectDialog = useDialog(ProjectDialog);
  const onboardingDialog = useDialog(OnboardingDialog);

  // const project = useCurrentProjectId();
  const templates = useFormTemplateList();

  // Open a new project dialog in case when the list of projects is empty
  React.useEffect(() => {
    const template = templates.find((x) => x.id === "testing") as FormTemplate;

    onboardingDialog.open({
      template,
    });
  }, [projectList.state]);

  return (
    <Grid
      style={{
        height: "100vh",
        background:
          "url('https://test-upload.chainfuse.com/nyojzza6337u.jpg') no-repeat center center / cover",
      }}
    >
      {onboardingDialog.component}
    </Grid>
  );
}
