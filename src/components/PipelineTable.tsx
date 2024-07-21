import {
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
} from '@mui/material';
import {
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { Pipeline } from '../types/pipelines';
import { DrawerHeader } from './App';

interface PipelineTableProps {
  pipelines: Pipeline[];
  loading: boolean;
  theme: any;
  open: boolean;
  page: number;
  rowsPerPage: number;
  toggleModal: (pipeline: Pipeline) => void;
  showConfirmPause: (pipelineID: number, isActive: boolean) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
}

const PipelineTable = ({
  pipelines,
  loading,
  theme,
  open,
  page,
  rowsPerPage,
  toggleModal,
  showConfirmPause,
  setPage,
  setRowsPerPage,
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
        {loading ? (
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
                  <TableCell>Pause</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pipelines
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                            showConfirmPause(pipeline.id, pipeline.is_active)
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
