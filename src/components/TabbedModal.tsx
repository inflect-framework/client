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
import { useTheme } from "@mui/material/styles";
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
import Select, { StylesConfig } from "react-select";

const initialTransformations = [
  { id: "transformation-1", type: "transformation", value: "transformation1" },
  { id: "filter-1", type: "filter", value: "filter1" },
];

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "transformation1", label: "Transformation 1" },
  { value: "transformation2", label: "Transformation 2" },
  { value: "filter1", label: "Filter 1" },
  { value: "filter2", label: "Filter 2" },
];

const getCustomStyles = (mode: "light" | "dark"): StylesConfig => ({
  control: (provided) => ({
    ...provided,
    backgroundColor: mode === "dark" ? "#1d1d1d" : "#ffffff",
    color: mode === "dark" ? "#ffffff" : "#000000",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: mode === "dark" ? "#1d1d1d" : "#ffffff",
    color: mode === "dark" ? "#ffffff" : "#000000",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: mode === "dark" ? "#ffffff" : "#000000",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? mode === "dark"
        ? "#90caf9"
        : "#f0f0f0"
      : mode === "dark"
      ? "#1d1d1d"
      : "#ffffff",
    color: mode === "dark" ? "#ffffff" : "#000000",
    "&:hover": {
      backgroundColor: mode === "dark" ? "#333333" : "#f0f0f0",
    },
  }),
  input: (provided) => ({
    ...provided,
    color: mode === "dark" ? "#ffffff" : "#000000",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: mode === "dark" ? "#ffffff" : "#000000",
  }),
});

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
  const theme = useTheme();
  const mode = theme.palette.mode;

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

  const handleDragEnd = (result: DropResult) => {
    console.log("Drag End:", result); // Debug log
    if (!result.destination) return;
    const items = Array.from(processes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setProcesses(items);
    console.log("Updated Processes:", items); // Debug log
  };

  const handleAddItem = (type: string) => {
    setProcesses([
      ...processes,
      {
        id: `${type}-${processes.length + 1}`,
        type: type,
        value: `${type}${processes.length + 1}`,
      },
    ]);
  };

  const handleDeleteItem = (id: string) => {
    setProcesses(processes.filter((item) => item.id !== id));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
          minHeight: 650,
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
                styles={getCustomStyles(mode)}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography>Outgoing Schema</Typography>
                <Select
                  options={options}
                  isClearable
                  styles={getCustomStyles(mode)}
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
                              minWidth: 0, // Prevent teleportation
                            }}
                          >
                            {item.type === "filter" ? (
                              <>
                                <Box sx={{ flex: 1 }}>
                                  <Typography>Filter</Typography>
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
                                  <Typography>On Fail Topic</Typography>
                                  <Select
                                    options={options}
                                    isClearable
                                    styles={getCustomStyles(mode)}
                                  />
                                </Box>
                              </>
                            ) : (
                              <Box sx={{ flex: 1 }}>
                                <Typography>Transformation</Typography>
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
                            <IconButton
                              onClick={() => handleAddItem(item.type)}
                            >
                              <AddIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                            <IconButton
                              sx={{ cursor: "grab" }} // Ensure cursor change on drag
                              {...provided.dragHandleProps}
                            >
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
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={() => handleAddItem("transformation")}
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ width: "fit-content", alignSelf: "flex-start" }}
              >
                Add Transformation
              </Button>
              <Button
                onClick={() => handleAddItem("filter")}
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ width: "fit-content", alignSelf: "flex-start" }}
              >
                Add Filter
              </Button>
            </Box>
            <Button
              onClick={() => console.log("Create Pipeline")}
              variant="contained"
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
