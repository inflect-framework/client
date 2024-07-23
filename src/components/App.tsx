import React, { useState, useEffect, useMemo } from "react";
import {
  CssBaseline,
  Drawer,
  Box,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Switch,
  FormControlLabel,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { lightTheme, darkTheme } from "../utils/theme";
import { getPipelines } from "../utils/getEntities";
import { putPipeline } from "../utils/putPipelines";
import TabbedModal from "./TabbedModal";
import { Pipeline, PipelineTuple } from "../types/pipelines";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  backgroundColor: theme.palette.background.default,
}));

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
  backgroundColor: theme.palette.background.paper,
}));

const DrawerButton = styled(ListItemButton)(({ theme }) => ({
  textAlign: "left",
  width: "100%",
  background: "none",
  border: "none",
  padding: theme.spacing(1),
  margin: theme.spacing(2, 0),
  cursor: "pointer",
  color: theme.palette.mode === "dark" ? "#fff" : "#000",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },
}));

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const theme = React.useMemo(
    () => createTheme(darkMode ? darkTheme : lightTheme),
    [darkMode]
  );

  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  const [open, setOpen] = useState(true);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [modalDisplayed, setModalDisplayed] = useState(false);
  const [selectedPipeline, setSelectedPipeline] =
    useState<PipelineTuple | null>(null);
  const [pipelineAlterations, setPipelineAlterations] = useState(0);
  const [mainContent, setMainContent] = useState("pipelines");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPipelineId, setDialogPipelineID] = useState<number | null>(null);
  const [dialogActiveState, setDialogActiveState] = useState<boolean | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const fetchPipelines = async () => {
    try {
      const rows = await getPipelines();
      console.log(rows);
      return rows;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const cachedPipelines = useMemo(() => {
    return fetchPipelines();
  }, [pipelineAlterations]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const rows = await cachedPipelines;
      setPipelines(rows);
      setLoading(false);
    };

    fetchData();
  }, [cachedPipelines]);

  const toggleModal = (pipeline: Pipeline) => {
    setSelectedPipeline(Object.values(pipeline) as PipelineTuple);
    setModalDisplayed((prev) => !prev);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const pausePipeline = (pipelineID: number, activeState: boolean) => {
    const request = async () => {
      const result = await putPipeline(pipelineID, !activeState);
      setPipelineAlterations((prev) => prev + 1);
      return result;
    };

    request();
  };

  const showConfirmPause = (pipelineID: number, activeState: boolean) => {
    setDialogPipelineID(pipelineID);
    setDialogActiveState(activeState);
    setDialogOpen(true);
  };

  const handleDialogClose = (confirmed: boolean) => {
    setDialogOpen(false);
    if (confirmed && dialogPipelineId !== null && dialogActiveState !== null) {
      pausePipeline(dialogPipelineId, dialogActiveState);
    }
  };

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const handleAddPipeline = () => {
    setModalDisplayed(true);
    setSelectedPipeline(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppBarStyled position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(!open)}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Pipelines
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={handleThemeChange}
                  name="themeSwitch"
                  color="default"
                />
              }
              label={darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              sx={{ marginLeft: "auto" }}
            />
          </Toolbar>
        </AppBarStyled>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: theme.palette.background.paper,
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={() => setOpen(false)}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {["Pipelines", "Add New Pipeline"].map((text, index) => (
              <DrawerButton
                key={text}
                onClick={
                  text === "Add New Pipeline"
                    ? handleAddPipeline
                    : () => setMainContent(text.toLowerCase().replace(" ", ""))
                }
              >
                <ListItemText primary={text} />
              </DrawerButton>
            ))}
          </List>
        </Drawer>

        <Main open={open}>
          <DrawerHeader />
          <TableContainer
            component={Paper}
            sx={{ backgroundColor: theme.palette.background.paper }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "300px",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Table aria-label="pipelines table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Source Topic</TableCell>
                      <TableCell>Target Topic</TableCell>
                      <TableCell>Processing Steps</TableCell>
                      <TableCell>Pause</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pipelines
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((pipeline: Pipeline) => (
                        <TableRow key={pipeline.id}>
                          <TableCell>
                            <a onClick={() => toggleModal(pipeline)}>
                              {pipeline.name}
                            </a>
                          </TableCell>
                          <TableCell>
                            <a onClick={() => toggleModal(pipeline)}>
                              {pipeline.source_topic}
                            </a>
                          </TableCell>
                          <TableCell>
                            <a onClick={() => toggleModal(pipeline)}>
                              {pipeline.target_topic}
                            </a>
                          </TableCell>
                          <TableCell>
                            <a onClick={() => toggleModal(pipeline)}>
                              {JSON.stringify(pipeline.steps.processors)}
                            </a>
                          </TableCell>
                          <TableCell>
                            <a
                              onClick={() =>
                                showConfirmPause(
                                  pipeline.id,
                                  pipeline.is_active
                                )
                              }
                            >
                              {pipeline.is_active ? (
                                <PauseIcon />
                              ) : (
                                <PlayArrowIcon />
                              )}
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50]}
                  component="div"
                  count={pipelines.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                />
              </>
            )}
          </TableContainer>
        </Main>

        <TabbedModal
          open={modalDisplayed}
          onClose={() => setModalDisplayed(false)}
          pipeline={selectedPipeline}
        />

        <Dialog open={dialogOpen} onClose={() => handleDialogClose(false)}>
          <DialogTitle>Confirm Pause/Restart</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`Are you sure you want to ${
                dialogActiveState ? "pause" : "restart"
              } pipeline ${dialogPipelineId}?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDialogClose(false)}>No</Button>
            <Button onClick={() => handleDialogClose(true)} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default App;
