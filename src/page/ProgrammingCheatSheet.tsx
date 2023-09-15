import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { IconButton, Snackbar, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import useLocalStorage from "../hook/useLocalStorage";

const variable = "<var>";

const cheatSheet: {
  program: string;
  commands: { description: string; command: string; defaultParams: string[] }[];
}[] = [
  {
    program: "linux",
    commands: [
      createCommand(
        "Terminate a process running on a specific <port>",
        ["8080"],
        `kill -9 $(lsof -t -i tcp:${variable})`
      ),
    ],
  },
  {
    program: "docker",
    commands: [
      createCommand("list all running containers", [], "docker ps"),
      createCommand(
        "stop all running containers",
        [],
        "docker stop $(docker ps -a -q)"
      ),
    ],
  },
];

export default function ProgrammingCheatSheet() {
  const [openedTab, setOpenedTab] = useLocalStorage(
    "cheat-sheet-tab",
    cheatSheet[0].program
  );
  const [params, setParams] = useState<{
    [program: string]: { [command: string]: string[] };
  }>(
    cheatSheet.reduce(
      (m: { [program: string]: { [command: string]: string[] } }, cs) => {
        m[cs.program] = m[cs.program] || {};
        cs.commands.forEach((c) => {
          m[cs.program][c.description] = c.defaultParams;
        });
        return m;
      },
      {}
    )
  );
  const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null);

  return (
    <Box>
      <TabContext value={openedTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={(_e, newValue) => {
              setOpenedTab((_old) => newValue);
            }}
            aria-label="Programming commands table"
          >
            {cheatSheet.map((cs) => {
              return (
                <Tab key={cs.program} label={cs.program} value={cs.program} />
              );
            })}
          </TabList>
        </Box>
        {cheatSheet.map((cs) => (
          <TabPanel key={cs.program} value={cs.program}>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell width="30%">Description</TableCell>
                    <TableCell width="30%">Input</TableCell>
                    <TableCell>Command</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cheatSheet
                    .find((cs) => cs.program === openedTab)
                    ?.commands.map(({ command, description }) => {
                      const commandParams = params[openedTab][description];
                      const replacedCommand = replaceVariable(
                        command,
                        commandParams
                      );
                      return (
                        <TableRow
                          key={command}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            height: "54px",
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {description}
                          </TableCell>
                          <TableCell>
                            {commandParams.length > 0 && (
                              <TextField
                                size="small"
                                value={commandParams.join(",")}
                                onChange={(e) => {
                                  const newParams = e.target.value.split(",");
                                  if (
                                    newParams.length === commandParams.length
                                  ) {
                                    setParams((old) => {
                                      return {
                                        ...old,
                                        [openedTab]: {
                                          ...old[openedTab],
                                          [description]: newParams,
                                        },
                                      };
                                    });
                                  }
                                }}
                                fullWidth
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              aria-label="copy"
                              onClick={() => {
                                navigator.clipboard.writeText(replacedCommand);
                                setSnackbarMsg("Command copied 👍");
                              }}
                            >
                              <ContentCopyIcon fontSize="inherit" />
                            </IconButton>
                            {`      > ${replacedCommand}`}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        ))}
      </TabContext>
      <Snackbar
        autoHideDuration={1500}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbarMsg != null}
        onClose={() => setSnackbarMsg(null)}
        message={snackbarMsg}
      />
    </Box>
  );
}

function replaceVariable(command: string, params: string[]): string {
  let replaced = command;
  params.forEach((p) => {
    replaced = replaced.replace(variable, p);
  });
  return replaced;
}

function createCommand(
  description: string,
  defaultParams: string[],
  command: string
) {
  return { description, defaultParams, command };
}
