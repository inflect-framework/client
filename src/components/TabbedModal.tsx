import React, { useState } from 'react';
import { Modal, Box, Tabs, Tab, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

interface TabbedModalProps {
  open: boolean;
  onClose: () => void;
  connection: [string, string, string, boolean, number] | null;
}

const TabbedModal: React.FC<TabbedModalProps> = ({
  open,
  onClose,
  connection,
}) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='modal-title'
      aria-describedby='modal-description'
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id='modal-title' variant='h6' component='h2'>
          Edit Connection
        </Typography>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label='connection tabs'
        >
          <Tab label='Design' {...a11yProps(0)} />
          <Tab label='Test' {...a11yProps(1)} />
          <Tab label='Finalize' {...a11yProps(2)} />
          <Tab label='Versioning and Evolution' {...a11yProps(3)} />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          {/* Render Design tab content here */}
          Design Content
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {/* Render Test tab content here */}
          Test Content
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
