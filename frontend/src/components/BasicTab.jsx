import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Information from './Information';
import Question from './Question'
import MyInterest from './MyInterest'
import PrivateTchat from './PrivateTchat'
import { StyleSheet, css } from "aphrodite";
import "../css/basictab.css";


function TabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const style = StyleSheet.create({
    heading: {
      width :"100%",
      "@media (max-width: 819px)": {
        display : "none"
        
      }
    }
  });

  return (
    <Box className={css(style.heading)}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs className ="onglets" value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="mes infos" {...a11yProps(0)} />
          <Tab label="mes questions" {...a11yProps(1)} />
          <Tab label="mes intérêts" {...a11yProps(2)} />
          <Tab label="mes discussions" {...a11yProps(3)} />

        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Information />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Question />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <MyInterest />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <PrivateTchat />
      </TabPanel>
      
    </Box>
  );
}
