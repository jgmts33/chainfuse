import { CheckCircle, DoNotDisturbOn } from "@mui/icons-material";
import { Avatar, Link, Tooltip } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid-pro";
import * as React from "react";

export function renderDisplayName(
  params: GridRenderCellParams<string, any, any>
) {
  return (
    <React.Fragment>
      <Avatar
        sx={{ mr: 1, width: 28, height: 28 }}
        alt={params.value}
        src={params.row.photoURL}
      />
      <strong>{params.value}</strong>
    </React.Fragment>
  );
}

export function renderEmail(params: GridRenderCellParams<string, any, any>) {
  const email = params.value ?? "";
  return <Link href={`mailto:${email}`}>{email}</Link>;
}

export function renderSiteLink(params: GridRenderCellParams<string, any, any>) {
  if (!params.value) return null;
  return (
    <Link
      href={
        location.hostname === "chainfuse.com"
          ? `https://${params.value}.chainfuse.com`
          : `https://${params.value}-test.chainfuse.com`
      }
      children={<strong>{params.value}</strong>}
    />
  );
}

export function renderTemplate(params: GridRenderCellParams<string, any, any>) {
  if (!params.value) return null;
  const template = params.value.replace(":", "-");
  return (
    <Link
      href={`https://console.cloud.google.com/storage/browser/templates.chainfuse.com/${template}?project=chainfuse`}
      children={params.value}
    />
  );
}

export function renderHostname(params: GridRenderCellParams<string, any, any>) {
  if (!params.value) return null;
  return <Link href={`https://${params.value}/`} children={params.value} />;
}

export function renderDate(params: GridRenderCellParams<string, any, any>) {
  if (!params.value) return null;
  const date =
    typeof params.value === "string" ? new Date(params.value) : params.value;
  return (
    <Tooltip title={date.toLocaleString()}>
      <time dateTime={date.toISOString()}>{date.toLocaleDateString()}</time>
    </Tooltip>
  );
}

export function renderCheckMark(
  params: GridRenderCellParams<string, any, any>
) {
  if (params.value == null) return null;
  return params.value ? (
    <CheckCircle sx={{ width: 18, height: 18, color: "success.main" }} />
  ) : (
    <DoNotDisturbOn sx={{ width: 18, height: 18, color: "error.main" }} />
  );
}
