import React, { useState } from "react";
import {
  Modal,
  Box,
  Tabs,
  Tab,
  Typography,
  IconButton,
  Button,
  TextField,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Editor from "@monaco-editor/react";
import Select, {
  StylesConfig,
  SingleValue,
  MultiValue,
  ActionMeta,
} from "react-select";
import { getCustomStyles } from "../utils/getCustomStyles";
import { SelectedOption } from "../types/SelectedOption";

const initialTransformations = [
  { id: "1", type: "transformation", value: "capitalize" },
  { id: "2", type: "filter", value: "isString" },
  { id: "3", type: "transformation", value: "toUUID" },
  { id: "4", type: "filter", value: "isBool" },
  { id: "5", type: "transformation", value: "toNumber" },
  { id: "6", type: "filter", value: "isNumber" },
  { id: "7", type: "transformation", value: "toBool" },
  { id: "8", type: "filter", value: "isUUID" },
];

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "transformation1", label: "Transformation 1" },
  { value: "transformation2", label: "Transformation 2" },
  { value: "filter1", label: "Filter 1" },
  { value: "filter2", label: "Filter 2" },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

interface TabbedModalProps {
  open: boolean;
  onClose: () => void;
  connection: [string, string, string, boolean, number] | null;
}

const TabbedModal = ({ open, onClose }: TabbedModalProps) => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const [tabValue, setTabValue] = useState(0);
  const [incomingSchema, setIncomingSchema] = useState<string | null>(null);
  const [outgoingSchema, setOutgoingSchema] = useState<string | null>(null);
  const [redirectTopic, setRedirectTopic] = useState<string | null>(null);
  const [testEvent, setTestEvent] = useState("");
  const [testResult, setTestResult] = useState("");
  const [processes, setProcesses] = useState(initialTransformations);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleGenerateTestEvent = () => {
    const generatedEvent = '{ "sample": "event" }';
    setTestEvent(generatedEvent);
  };

  const handleTest = async () => {
    const result = await simulateBackendProcessing(testEvent);
    setTestResult(result as string);
  };

  const simulateBackendProcessing = (event: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Processed event: ${event}`);
      }, 1000);
    });
  };

  const handleClose = () => {
    onClose();
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newProcesses = [...processes];
    const temp = newProcesses[index - 1];
    newProcesses[index - 1] = newProcesses[index];
    newProcesses[index] = temp;
    setProcesses(newProcesses);
  };

  const handleMoveDown = (index: number) => {
    if (index === processes.length - 1) return;
    const newProcesses = [...processes];
    const temp = newProcesses[index + 1];
    newProcesses[index + 1] = newProcesses[index];
    newProcesses[index] = temp;
    setProcesses(newProcesses);
  };

  const handleAddItem = (type: string, index: number) => {
    const newProcesses = [...processes];
    newProcesses.splice(index + 1, 0, {
      id: `${type}-${newProcesses.length + 1}`,
      type: type,
      value: `${type}${newProcesses.length + 1}`,
    });
    setProcesses(newProcesses);
  };

  const handleDeleteItem = (id: string) => {
    setProcesses(processes.filter((item) => item.id !== id));
  };

  const handleCreatePipeline = () => {
    if (
      !outgoingSchema &&
      processes.some(
        (item) => item.type === "filter" || item.type === "transformation"
      )
    ) {
      setWarningDialogOpen(true);
    } else if (
      (outgoingSchema || processes.some((item) => item.type === "filter")) &&
      !redirectTopic
    ) {
      alert(
        "Please select a redirect topic for the outgoing schema or filters."
      );
      return;
    } else {
      const pipeline = {
        incomingSchema,
        outgoingSchema: { value: outgoingSchema, redirectTopic },
        processes: processes.map((process) => ({
          type: process.type,
          value: process.value,
          redirectTopic: process.type === "filter" ? redirectTopic : undefined,
        })),
      };

      console.log(pipeline);
      setTabValue(1);
    }
  };

  const handleConfirmPipelineCreation = () => {
    setConfirmDialogOpen(false);

    const pipeline = {
      incomingSchema,
      outgoingSchema: { value: outgoingSchema, redirectTopic },
      processes: processes.map((process) => ({
        type: process.type,
        value: process.value,
        redirectTopic: process.type === "filter" ? redirectTopic : undefined,
      })),
    };

    console.log(pipeline);
    setTabValue(1);
  };

  const resetDialogs = () => {
    setWarningDialogOpen(false);
    setConfirmDialogOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            minWidth: 900,
            maxWidth: "90%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            minHeight: 700,
            maxHeight: "90vh", // Ensure the modal does not grow beyond the viewport height
            overflow: "auto", // Allow the content to scroll
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="modal-title" variant="h6" component="h2">
            Edit Connection
          </Typography>
          <Tabs
            value={tabValue}
            onChange={(event, newValue) => {
              resetDialogs();
              handleTabChange(event, newValue);
            }}
            aria-label="connection tabs"
          >
            <Tab label="Design" {...a11yProps(0)} />
            <Tab label="Test" {...a11yProps(1)} />
            <Tab label="Finalize" {...a11yProps(2)} />
            <Tab label="Versioning and Evolution" {...a11yProps(3)} />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography>Incoming Schema</Typography>
                <Select
                  options={options}
                  isClearable
                  styles={getCustomStyles(mode)}
                  onChange={(selectedOption) =>
                    setIncomingSchema(
                      selectedOption
                        ? (selectedOption as SelectedOption).value
                        : null
                    )
                  }
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography>Outgoing Schema</Typography>
                  <Select
                    options={options}
                    isClearable
                    styles={getCustomStyles(mode)}
                    onChange={(selectedOption) =>
                      setOutgoingSchema(
                        selectedOption
                          ? (selectedOption as SelectedOption).value
                          : null
                      )
                    }
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography>Topic On Fail</Typography>
                  <Select
                    options={options}
                    isClearable
                    styles={getCustomStyles(mode)}
                    onChange={(selectedOption) =>
                      setRedirectTopic(
                        selectedOption
                          ? (selectedOption as SelectedOption).value
                          : null
                      )
                    }
                  />
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {processes.map((item, index) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 2,
                    }}
                  >
                    {item.type === "filter" ? (
                      <>
                        <Box sx={{ flex: 1 }}>
                          <Typography>
                            Filter{" "}
                            {processes
                              .filter((p) => p.type === "filter")
                              .indexOf(item) + 1}
                          </Typography>
                          <Select
                            options={options}
                            isClearable
                            styles={getCustomStyles(mode)}
                            defaultValue={options.find(
                              (option) => option.value === item.value
                            )}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography>Topic On Fail</Typography>
                          <Select
                            options={options}
                            isClearable
                            styles={getCustomStyles(mode)}
                          />
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ flex: 1 }}>
                        <Typography>
                          Transformation{" "}
                          {processes
                            .filter((p) => p.type === "transformation")
                            .indexOf(item) + 1}
                        </Typography>
                        <Select
                          options={options}
                          isClearable
                          styles={getCustomStyles(mode)}
                          defaultValue={options.find(
                            (option) => option.value === item.value
                          )}
                        />
                      </Box>
                    )}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        onClick={() => handleAddItem(item.type, index)}
                        sx={{ alignSelf: "flex-end" }}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteItem(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton onClick={() => handleMoveUp(index)}>
                        <ArrowUpwardIcon />
                      </IconButton>
                      <IconButton onClick={() => handleMoveDown(index)}>
                        <ArrowDownwardIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  onClick={() =>
                    handleAddItem("transformation", processes.length - 1)
                  }
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ width: "fit-content", alignSelf: "flex-start" }}
                >
                  Add Transformation
                </Button>
                <Button
                  onClick={() => handleAddItem("filter", processes.length - 1)}
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ width: "fit-content", alignSelf: "flex-start" }}
                >
                  Add Filter
                </Button>
              </Box>
              <Button
                onClick={handleCreatePipeline}
                variant="contained"
                color="secondary"
                sx={{ width: "fit-content", alignSelf: "flex-start", mt: 2 }}
              >
                Create Pipeline
              </Button>
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Button
                  onClick={handleGenerateTestEvent}
                  variant="contained"
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  Generate Test Event
                </Button>
                <Button
                  onClick={handleTest}
                  variant="contained"
                  color="secondary"
                >
                  Test
                </Button>
              </Box>
              <Box sx={{ display: "flex", gap: 2, height: "450px" }}>
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <Typography variant="subtitle1">
                    Generated Editable Test Event:
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Editor
                      height="100%"
                      language="json"
                      value={testEvent}
                      onChange={(value) => setTestEvent(value || "")}
                    />
                  </Box>
                </Box>
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <Typography variant="subtitle1">Result:</Typography>
                  <TextField
                    multiline
                    fullWidth
                    rows={10}
                    variant="outlined"
                    value={testResult}
                    InputProps={{
                      readOnly: true,
                      sx: { height: "100%" },
                    }}
                    sx={{ flex: 1 }}
                  />
                </Box>
                <Box
                  sx={{
                    width: "200px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="subtitle1">
                    Transformations and Filters:
                  </Typography>
                  <Box sx={{ mt: 2, flex: 1 }}>
                    <Typography>Incoming Schema</Typography>
                    <Typography>Transformation 1</Typography>
                    <Typography>Filter 1</Typography>
                    <Typography>Transformation 2</Typography>
                    <Typography color="error">Filter 2 (Error)</Typography>
                    <Typography>Outgoing Schema</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            {/* Render Finalize tab content here */}
            Finalize Content
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            {/* Render Versioning and Evolution tab content here */}
            Versioning and Evolution Content
          </TabPanel>
        </Box>
      </Modal>
      <Dialog
        open={warningDialogOpen}
        onClose={() => setWarningDialogOpen(false)}
      >
        <DialogTitle>Schema Validation Warning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            No outgoing schema selected. The pipeline will be processed without
            schema validation. Is that okay?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWarningDialogOpen(false)}>No</Button>
          <Button
            onClick={() => {
              setWarningDialogOpen(false);
              setConfirmDialogOpen(true);
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Pipeline Creation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to create the pipeline?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>No</Button>
          <Button onClick={handleConfirmPipelineCreation} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TabbedModal;
