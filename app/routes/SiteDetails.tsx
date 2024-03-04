import { Typography } from "@mui/material";
import * as React from "react";
import { useParams } from "react-router-dom";
import { useSite } from "../core/site.js";
import { useTemplate } from "../core/template.js";

const SiteForm = React.lazy(() => import("../forms/SiteForm.js"));

/**
 * My Assets -> Website -> Summary
 * https://chainfuse.com/sites/<id>
 */
export default function SiteDetails(): JSX.Element {
  const params = useParams();
  const site = useSite(params.id);
  const template = useTemplate(site.data()?.template);

  return (
    <React.Fragment>
      <Typography component="span"
        sx={{ fontSize: "1.25rem", mb: 2 }}
        variant="h3"
        children="Site Settings"
      />
      <SiteForm site={site} template={template} onCancel={() => {}} />
    </React.Fragment>
  );
}
