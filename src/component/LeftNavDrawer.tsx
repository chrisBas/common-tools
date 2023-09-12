import { ListSubheader, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { useLocation } from "react-router-dom";
import { navigationItems } from "../App";
import Link from "./Link";

const drawerWidth = 240;

export default function LeftNavDrawer() {
  const { pathname } = useLocation();
  const currentPath = pathname.replace(/^\//, "");

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List dense>
          {navigationItems.map((navigationItem) => (
            <ListItem
              key={navigationItem.section}
              sx={{ display: "block" }}
              disablePadding
            >
              <List
                subheader={
                  <ListSubheader
                    component="div"
                    sx={{ textTransform: "uppercase", lineHeight: 2 }}
                  >
                    {navigationItem.section}
                  </ListSubheader>
                }
                dense
              >
                {navigationItem.content.map((contentItem) => {
                  const isCurrentPath = currentPath === contentItem.path;
                  return (
                    <ListItem
                      key={contentItem.text}
                      sx={{ display: "block", py: 0, px: 1 }}
                    >
                      <Link to={contentItem.path}>
                        <ListItemButton
                          sx={[
                            {
                              "&:hover": {
                                color: "primary.main",
                              },
                            },
                            {
                              color: isCurrentPath
                                ? "primary.contrastText"
                                : undefined,
                              backgroundColor: isCurrentPath
                                ? "primary.main"
                                : undefined,
                            },
                          ]}
                        >
                          <ListItemText
                            disableTypography
                            primary={
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: "light" }}
                              >
                                {contentItem.text}
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                  );
                })}
              </List>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
