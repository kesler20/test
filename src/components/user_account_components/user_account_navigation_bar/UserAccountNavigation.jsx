import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

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
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab
              label="User Files"
              value="1"
              style={{
                marginRight: "10px",
                marginLeft: "10px",
                color: "#707772",
              }}
            />
            <Tab
              label="User Clients"
              value="2"
              style={{
                marginRight: "10px",
                marginLeft: "10px",
                color: "#707772",
              }}
            />
            <Tab
              label="User Dashboards"
              value="3"
              style={{
                marginRight: "10px",
                marginLeft: "10px",
                color: "#707772",
              }}
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
