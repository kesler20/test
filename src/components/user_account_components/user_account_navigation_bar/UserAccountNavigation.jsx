import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import "./UserAccountNavigation.css";
export default function LabTabs({
  userFilesPanels,
  userClientPanels,
  userDashboards,
}) {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ width: "100%", typography: "body1" }}
      id="user-account-navigation"
    >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab
              className="user-account-navigation__tabs"
              label="User Files"
              value="1"
            />
            <Tab
              className="user-account-navigation__tabs"
              label="User Clients"
              value="2"
            />
            <Tab
              className="user-account-navigation__tabs"
              label="User Dashboards"
              value="3"
            />
          </TabList>
        </Box>
        <TabPanel value="1">{userFilesPanels}</TabPanel>
        <TabPanel value="2">{userClientPanels}</TabPanel>
        <TabPanel value="3">{userDashboards}</TabPanel>
      </TabContext>
    </Box>
  );
}
