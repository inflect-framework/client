import React, { useState, useEffect, useMemo } from 'react';
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
  Switch,
  FormControlLabel,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@mui/icons-material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { lightTheme, darkTheme } from '../utils/theme';
import {
  getPipelines,
  getProcessors,
  getTopicsAndSchemas,
} from '../utils/getEntities';
import { putPipeline } from '../utils/putPipeline';
import TabbedModal from './TabbedModal';
import PipelineTable from './PipelineTable';
import { Pipeline } from '../types/pipelines';
import { Processor } from '../types/processor';

const drawerWidth = 200;

// const AppBarStyled = styled(AppBar, {
//   shouldForwardProp: (prop) => prop !== 'open',
// })<{ open?: boolean }>(({ theme, open }) => ({
//   transition: theme.transitions.create(['margin', 'width'], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     width: `calc(100% - ${drawerWidth}px)`,
//     marginLeft: `${drawerWidth}px`,
//     transition: theme.transitions.create(['margin', 'width'], {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  height: '110px', // Set the height to 110px
  justifyContent: 'center', // Center the content vertically
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between', // Changed from 'flex-end' to 'space-between'
  backgroundColor: theme.palette.background.paper,
  width: drawerWidth,
  boxSizing: 'border-box',
}));

const DrawerButton = styled(ListItemButton)(({ theme }) => ({
  textAlign: 'left',
  width: '100%',
  background: 'none',
  border: 'none',
  padding: theme.spacing(1),
  margin: theme.spacing(2, 0),
  cursor: 'pointer',
  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
}));

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  marginTop: '110px', // Add this line to push content below the AppBar
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  backgroundColor: theme.palette.background.default,
}));

const emptyPipeline: Pipeline = {
  id: NaN,
  name: '',
  source_topic: '',
  target_topic: '',
  incoming_schema: '',
  outgoing_schema: '',
  steps: { dlqs: [], processors: [] },
  is_active: false,
  redirect_topic: '',
};

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
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
    useState<Pipeline>(emptyPipeline);
  const [pipelineAlterations, setPipelineAlterations] = useState(0);
  const [mainContent, setMainContent] = useState('pipelines');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPipelineId, setDialogPipelineID] = useState<number | null>(null);
  const [dialogActiveState, setDialogActiveState] = useState<boolean | null>(
    null
  );
  const [tableLoading, setTableLoading] = useState(true);
  const [rowLoading, setRowLoading] = useState<null | number>(null);
  const [processorOptions, setProcessorOptions] = useState<Processor[]>([]);
  const [schemas, setSchemas] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const fetchPipelines = async () => {
    try {
      const rows = await getPipelines();

      const rowsWithRedirect = rows.map((row) => {
        const mappedRow = { ...row };
        if (mappedRow.steps.hasOwnProperty('dlqs')) {
          const redirect_topic = row.steps.dlqs.at(-1);
          mappedRow.redirect_topic =
            typeof redirect_topic === 'string' ? redirect_topic : '';
        } else {
          mappedRow.redirect_topic = '';
        }
        return mappedRow;
      });

      return rowsWithRedirect;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const cachedPipelines = useMemo(() => {
    return fetchPipelines();
  }, [pipelineAlterations]);

  const loadTopicsAndSchemas = () => {
    const request = async () => {
      const result = await getTopicsAndSchemas();
      setSchemas(result.schemas);
      setTopics(result.topics);
    };
    request();
  };

  const loadProcessors = () => {
    const request = async () => {
      const request = await getProcessors();
      setProcessorOptions(request);
      console.log('processors', request);
    };
    request();
  };

  useEffect(() => {
    const fetchData = async () => {
      setTableLoading(true);
      const rows = await cachedPipelines;
      setPipelines(rows);
      setTableLoading(false);
    };

    fetchData();
  }, [cachedPipelines]);

  useEffect(() => {
    loadTopicsAndSchemas();
    loadProcessors();
  }, []);

  const toggleModal = (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline);
    setModalDisplayed((prev) => !prev);
  };

  const pausePipeline = (pipelineID: number) => {
    const request = async () => {
      setRowLoading(pipelineID);
      const pipeline = JSON.parse(JSON.stringify(selectedPipeline));
      pipeline.is_active = !pipeline.is_active;
      pipeline.redirect_topic = pipeline.redirect_topic || '';
      const result = await putPipeline(pipeline);
      setSelectedPipeline(emptyPipeline);
      setRowLoading(null);
      setPipelineAlterations((prev) => prev + 1);
      return result;
    };

    request();
  };

  const showConfirmPause = (pipelineID: number, activeState: boolean) => {
    const pipeline = pipelines.find((p) => p.id === pipelineID);
    if (!pipeline) return;
    setSelectedPipeline(pipeline);
    setDialogPipelineID(pipelineID);
    setDialogActiveState(activeState);
    setDialogOpen(true);
  };

  const handleDialogClose = (confirmed: boolean) => {
    setDialogOpen(false);
    if (confirmed && dialogPipelineId !== null && dialogActiveState !== null) {
      pausePipeline(dialogPipelineId);
    }
  };

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const handleAddPipeline = () => {
    setModalDisplayed(true);
    setSelectedPipeline({
      id: NaN,
      name: '',
      source_topic: '',
      target_topic: '',
      incoming_schema: '',
      outgoing_schema: '',
      steps: { dlqs: [], processors: [] },
      is_active: false,
      redirect_topic: '',
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBarStyled position='fixed' open={open}>
          <Toolbar sx={{ height: '100%' }}>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={() => setOpen(!open)}
              edge='start'
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' noWrap component='div'>
              Pipelines
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={handleThemeChange}
                  name='themeSwitch'
                  color='default'
                />
              }
              label={darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              sx={{ marginLeft: 'auto' }}
            />
          </Toolbar>
        </AppBarStyled>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
          }}
          variant='persistent'
          anchor='left'
          open={open}
        >
          <DrawerHeader>
            <img
              src={
                theme.palette.mode === 'dark'
                  ? '/logo_transparent_png_dark.png'
                  : '/logo_transparent_png_light.png'
              }
              alt='Inflect Logo'
              style={{ height: '110px', width: 'auto' }}
            />
            <IconButton onClick={() => setOpen(false)}>
              {theme.direction === 'ltr' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {['Pipelines', 'Add New Pipeline'].map((text, index) => (
              <DrawerButton
                key={text}
                onClick={
                  text === 'Add New Pipeline'
                    ? handleAddPipeline
                    : () => setMainContent(text.toLowerCase().replace(' ', ''))
                }
              >
                <ListItemText primary={text} />
              </DrawerButton>
            ))}
          </List>
        </Drawer>

        <Main open={open}>
          <PipelineTable
            setSelectedPipeline={setSelectedPipeline}
            selectedPipeline={selectedPipeline}
            rowsPerPage={rowsPerPage}
            page={page}
            pipelines={pipelines}
            tableLoading={tableLoading}
            rowLoading={rowLoading}
            theme={theme}
            open={open}
            toggleModal={toggleModal}
            showConfirmPause={showConfirmPause}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
            processorOptions={processorOptions}
          />
        </Main>

        <TabbedModal
          open={modalDisplayed}
          onClose={() => setModalDisplayed(false)}
          selectedPipeline={selectedPipeline}
          setSelectedPipeline={setSelectedPipeline}
          pipelines={pipelines}
          topics={topics}
          schemas={schemas}
          processorOptions={processorOptions}
        />

        <Dialog open={dialogOpen} onClose={() => handleDialogClose(false)}>
          <DialogTitle>Confirm Pause/Restart</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`Are you sure you want to ${
                dialogActiveState ? 'pause' : 'restart'
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
