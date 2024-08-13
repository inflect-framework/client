import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { Pipeline } from '../types/pipelines';
import { DrawerHeader } from './App';
import { Processor } from '../types/processor';

interface PipelineTableProps {
  setSelectedPipeline: React.Dispatch<React.SetStateAction<Pipeline>>;
  selectedPipeline: Pipeline;
  pipelines: Pipeline[];
  tableLoading: boolean;
  rowLoading: null | number;
  theme: any;
  open: boolean;
  page: number;
  rowsPerPage: number;
  toggleModal: (pipeline: Pipeline) => void;
  showConfirmPause: (pipelineID: number, isActive: boolean) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  processorOptions: Processor[];
}

const PipelineTable = ({
  open,
  page,
  pipelines,
  rowLoading,
  rowsPerPage,
  selectedPipeline,
  setPage,
  setRowsPerPage,
  setSelectedPipeline,
  showConfirmPause,
  tableLoading,
  theme,
  toggleModal,
  processorOptions,
}: PipelineTableProps) => {
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <DrawerHeader />
      <TableContainer
        component={Paper}
        sx={{ backgroundColor: theme.palette.background.paper }}
      >
        {tableLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '300px',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table aria-label='pipelines table'>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Source Topic</TableCell>
                  <TableCell>Target Topic</TableCell>
                  <TableCell>Processing Steps</TableCell>
                  <TableCell>Pipeline Status</TableCell>
                  <TableCell>Pause</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {JSON.parse(JSON.stringify(pipelines))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((pipeline: Pipeline) => (
                    <TableRow key={pipeline.id}>
                      {pipeline.id === rowLoading ? (
                        <TableCell>
                          <CircularProgress />
                        </TableCell>
                      ) : (
                        <>
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
                          {/* <TableCell>
                            <a onClick={() => toggleModal(pipeline)}>
                              {pipeline.steps.processors
                                .map(
                                  (processor) =>
                                    processorOptions.find(
                                      (option) => option.id === processor
                                    )?.processor_name
                                )
                                .join(', ')}
                            </a>
                          </TableCell> */}
                          <TableCell>
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<span>▼</span>}
                                aria-controls={`panel-${pipeline.id}-content`}
                                id={`panel-${pipeline.id}-header`}
                              >
                                <Typography
                                sx={{fontSize: '14px'}}
                                >
                                  {pipeline.steps.processors.length} Processor
                                  {pipeline.steps.processors.length !== 1
                                    ? 's'
                                    : ''}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography sx={{fontSize: '14px'}}>
                                  {pipeline.steps.processors
                                    .map(
                                      (processor) =>
                                        processorOptions.find(
                                          (option) => option.id === processor
                                        )?.processor_name
                                    )
                                    .join(', ')}
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          </TableCell>
                          <TableCell>
                          <a onClick={() => toggleModal(pipeline)}>
                            <Typography sx={pipeline.is_active ? {color: '#ADE8CC'} : {color: '#FFA2C7'}}>{pipeline.is_active ? 'Active' : 'Inactive'}</Typography>
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
                                <Tooltip title='Click to pause pipeline'>
                                  <PauseIcon />
                                </Tooltip>
                              ) : (
                                <Tooltip title='Click to restart pipeline'>
                                  <PlayArrowIcon />
                                </Tooltip>
                              )}
                            </a>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component='div'
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
    </>
  );
};

export default PipelineTable;
