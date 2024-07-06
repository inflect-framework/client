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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Editor from "@monaco-editor/react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import Select from "react-select";

const initialTransformations = [
  { id: "transformation-1", label: "Transformation", value: "transformation1" },
  { id: "filter-1", label: "Filter", value: "filter1" },
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

const TabbedModal = ({ open, onClose, connection }: TabbedModalProps) => {
  const [tabValue, setTabValue] = useState(0);
  const [testEvent, setTestEvent] = useState("");
  const [testResult, setTestResult] = useState("");
  const [processes, setProcesses] = useState(initialTransformations);

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

  const handleBackdropClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  const handleDragEnd = (result: DropResult) => {
    console.log("Drag End:", result); // Debug log
    if (!result.destination) return;
    const items = Array.from(processes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setProcesses(items);
    console.log("Updated Processes:", items); // Debug log
  };

  const handleAddTransformation = (type: string) => {
    setProcesses([
      ...processes,
      {
        id: `${type}-${processes.length + 1}`,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        value: `${type}${processes.length + 1}`,
      },
    ]);
  };

  const handleDeleteTransformation = (id: string) => {
    if (
      processes.filter((item) => item.label === id.split("-")[0]).length > 1
    ) {
      setProcesses(processes.filter((item) => item.id !== id));
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      slotProps={{
        backdrop: {
          onClick: handleBackdropClick,
        },
      }}
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
          minHeight: 650,
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
          onChange={handleTabChange}
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
                styles={{
                  container: (base) => ({ ...base, flex: 1, width: "100%" }),
                }}
              />
            </Box>
            <Box>
              <Typography>Outgoing Schema</Typography>
              <Select
                options={options}
                isClearable
                styles={{
                  container: (base) => ({ ...base, flex: 1, width: "100%" }),
                }}
              />
            </Box>
            <Divider sx={{ my: 2 }} />
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="new-pipeline-processes">
                {(provided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {processes.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps} // Ensure drag handle props are here
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Select
                              options={options}
                              isClearable
                              styles={{
                                container: (base) => ({ ...base, flex: 1 }),
                              }}
                              defaultValue={options.find(
                                (option) => option.value === item.value
                              )}
                            />
                            <IconButton
                              onClick={() =>
                                handleAddTransformation(item.label)
                              }
                            >
                              <AddIcon />
                            </IconButton>
                            <IconButton
                              onClick={() =>
                                handleDeleteTransformation(item.id)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                            <IconButton {...provided.dragHandleProps}>
                              <DragIndicatorIcon />
                            </IconButton>
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
            <Button
              onClick={() => handleAddTransformation("transformation")}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ width: "fit-content", alignSelf: "flex-start" }}
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
            <Box sx={{ display: "flex", gap: 2, height: "400px" }}>
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
  );
};

export default TabbedModal;
