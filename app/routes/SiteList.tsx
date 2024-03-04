import { ChainLogo } from "@chainfuse/ui";
import {
  ArrowDropDown as ArrowDropDownIcon,
  Edit,
  Link as LinkIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link as RouteLink } from "react-router-dom";
import { useCurrentProjectId } from "../core/project.js";
import { useSiteList } from "../core/site.js";
import { useTemplateList } from "../core/template.js";
import { SiteMenu, useOpenSiteMenu } from "../menus/SiteMenu.js";
import { getProjectUrl } from "./Templates.js";

export default function SiteList(): JSX.Element {
  const project = useCurrentProjectId();
  const sites = useSiteList(project);
  const templates = useTemplateList();
  const openMenu = useOpenSiteMenu();

  return (
    <>
      <Typography component="span"
        sx={{ mb: 2, fontSize: "1.25rem" }}
        variant="h3"
        children="Sites"
      />
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Site</TableCell>
              <TableCell>Template</TableCell>
              <TableCell>Chain</TableCell>
              <TableCell>Supply</TableCell>
              <TableCell sx={{ width: 100 }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sites.docs.map((x) => (
              <TableRow hidden={x.data()?.hidden} key={x.id}>
                <TableCell>
                  <Link
                    component={RouteLink}
                    to={`/sites/${x.id}?project=${project}`}
                    children={x.data()?.name}
                  />
                </TableCell>
                <TableCell>
                  {templates.find((t) => t.id === x.data()?.template)?.name}
                </TableCell>
                <TableCell>
                  <ChainLogo chainId={x.data()?.chainId} showCurrency={true} />
                </TableCell>
                <TableCell>{x.data()?.supply}</TableCell>
                <TableCell sx={{ display: "flex", gridGap: "0.5rem" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    href={getProjectUrl(x)}
                    target="_blank"
                    startIcon={<LinkIcon />}
                    children="View"
                  />
                  <ButtonGroup
                    variant="outlined"
                    size="small"
                    aria-label="edit button"
                  >
                    <Button
                      sx={{
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        mr: "-1px",
                      }}
                      startIcon={<Edit />}
                      component={RouteLink}
                      to={`/sites/${x.id}?project=${project}`}
                      children="Edit"
                    />
                    <Button
                      sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      onClick={openMenu}
                      children={<ArrowDropDownIcon sx={{ mx: "-4px" }} />}
                      data-id={x.id}
                    />
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {sites.docs.length === 0 ? (
          <Box style={{ padding: 10, textAlign: "center" }}>
            You don't have any deployables yet!
          </Box>
        ) : null}
      </Card>

      {/* Pop-up menu with [Delete] button */}
      <SiteMenu />
    </>
  );
}
