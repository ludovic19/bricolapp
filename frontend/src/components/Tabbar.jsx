import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FavoriteIcon from "@mui/icons-material/Favorite"; // coeur pour les intérêts
import PersonPinIcon from "@mui/icons-material/PersonPin"; //mon compte
import PeopleIcon from "@mui/icons-material/People"; //2 tetes pour groupe
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; //pour les questions ?
import { Link } from "react-router-dom";
import { StyleSheet, css } from "aphrodite";
import "../css/Tabbar.css";


// import * as React from 'react';
import PropTypes from "prop-types";
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Information from "./Information";
import Question from "./Question";
import MyInterest from "./MyInterest";
import PrivateTchat from "./PrivateTchat";
// import { StyleSheet, css } from "aphrodite";

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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function IconLabelTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const style = StyleSheet.create({
    heading: {
   
      "@media (min-width: 820px)": {
        display : "none"
      }
    }
  });

  return (
    <Box className={css(style.heading)}>
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
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab icon={<PersonPinIcon />} label="mes infos" {...a11yProps(0)} />
          <Tab
            icon={<HelpOutlineIcon />}
            label="mes questions"
            {...a11yProps(1)}
          />
          <Tab icon={<FavoriteIcon />} label="mes intérêts" {...a11yProps(2)} />
          <Tab
            icon={<PeopleIcon />}
            label="mes discussions"
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
    </Box>
  );
}

// export default function IconLabelTabs() {
//   const [value, setValue] = React.useState(0);// pour enregistrer l'évolution du state

//   const handleChange = (event, newValue) => {// écoute l'évènement du clic
//     setValue(newValue);
//   };
//   const styles = StyleSheet.create({
//     heading: {

//       "@media (min-width: 820px)": {
//         display : "none"

//       }
//     }
//   });
//   return (
//     <Tabs className={css(styles.heading)} value={value} onChange={handleChange} aria-label="icon label tabs example">

//       <Tab icon={<PersonPinIcon />} label="Mes Informations" />

//       <Tab icon={<HelpOutlineIcon />} label="Questions" />

//       <Tab icon={<FavoriteIcon />} label="Centres d'Intérêts" />

//       <Tab icon={<PeopleIcon />} label="Groupes" />

//     </Tabs>
//   );
// }
