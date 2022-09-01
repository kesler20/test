import React, { useState } from "react";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import GridLayout from "react-grid-layout";
import PlotComponent from "../../components/dashboard_components/plot_component/PlotComponent";
import Nav from "../../components/dashboard_components/dashboard_speedial/Nav";
import DashboardThemeBtn from "../../components/dashboard_components/dashboard_theme_btn/DashboardThemeBtn";
import DashboardTitle from "../../components/dashboard_components/dashboard_title/DashboardTitle";
import InteractivityPanel from "../../components/dashboard_components/interactivity_panel/InteractivityPanel";
import "./Dashboard.css";

/////////////////////////////////////////////
// DASHBOARD CONTAINER FOR THE DASHBOARD PAGE
/////////////////////////////////////////////

let x = Array.from({ length: 20 }, () => Math.random() * (6 - 3) + 3);
let y = Array.from({ length: 20 }, () => Math.random() * (6 - 3) + 3);
let z = Array.from({ length: 10 }, () => Math.random() * (6 - 1) + 3);
let w = Array.from({ length: 10 }, () => Math.random() * (6 - 1) + 3);
let labels = ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"];
let values = Array.from({ length: 5 }, () => Math.random() * 10);
let heat = [
  Array.from({ length: 10 }, () => Math.random() * 10),
  Array.from({ length: 10 }, () => Math.random() * 10),
  Array.from({ length: 10 }, () => Math.random() * 10),
  Array.from({ length: 10 }, () => Math.random() * 10),
];
/**
 * Selection Data
 */
const editableFeatures = [
  {
    name: "Select a File",
    metaData: [
      { name: "Experimental_Data.csv", data: { x, y } },
      { name: "Random_data.csv", data: { x: z, y: w } },
      { name: "Portfolio_data.csv", data: { x: labels, y: values } },
      { name: "Another_random.csv", data: { x: [], y: heat } },
    ],
  },
  {
    name: "Select a Plot",
    metaData: [
      { name: "Scatter Plot" },
      { name: "Pie Chart" },
      { name: "BarChart" },
      { name: "Heatmap" },
      { name: "3D Plot" },
    ],
  },
  {
    name: "Select a Theme",
    metaData: [
      { name: "seaborn" },
      { name: "dark" },
      { name: "light" },
      { name: "gray" },
      { name: "default" },
    ],
  },
];

/**
 * The Dashboard container is used to manipulate the data within the Dashboard page
 *
 * State:
 * - dataGrid - this is an object containing {x,y,w,h} used by (RGL) to set the grid dimensions and positions
 * this has to be passed to the GridLayout child component
 * - plotKeys - this is an array of integers which is used to create unique keys and plot ids for plotly
 * - mode - the dashboard can be in one of two modes ['edit','view']
 */
const Dashboard = () => {
  const [dataGrid, setDataGrid] = useState([
    { x: 0, y: 0, w: 5, h: 10 },
    { x: 0, y: 0, w: 5, h: 10 },
  ]);
  const [plotKeys, setPlotKeys] = useState([0,1]);
  const [mode, setMode] = useState("edit");
  const [plotMetaData, setPlotMetaData] = useState(editableFeatures);
  const [selectedPlotFeature, setSelectedPlotFeature] = useState(
    editableFeatures[0]
  );
  const [theme, setTheme] = useState(false);
  const [dashboardStructure, setDashboardStructure] = useState([
    { data: { x, y }, layout: {}, plotType: "scatter" },{ tools : "filter" }
  ]);

  /**
   * Handles the navbar click event of Add Plot, Save/ Edit Dashboard
   *
   * @param btnName name of the btn being clicked i.e. "Add Plot"
   *
   * @returns
   * - if the btnName variable does not match any of the cases
   * a "nav clicked" message will be logged
   */
  const handleNavBtnClicked = (btnName) => {
    if (btnName === "Add Plot") {
      dataGrid.push({ x: 0, y: plotKeys.length * 2, w: 5, h: 10 });
      plotKeys.push(plotKeys.length);
      setDataGrid(
        dataGrid.map((grid) => {
          return grid;
        })
      );
      setPlotKeys(
        plotKeys.map((k) => {
          return k;
        })
      );
      dashboardStructure.push({
        data: { x, y },
        layout: {},
        plotType: "scatter",
      });
      setDashboardStructure(
        dashboardStructure.map((dashboard) => {
          return dashboard;
        })
      );
    } else if (btnName === "Save Dashboard") {
      setMode("save");
    } else if (btnName === "Edit Dashboard") {
      setMode("edit");
    } else {
      console.log("nav clicked");
    }
  };

  const handleRemovePlot = (plotKey) => {
    setPlotKeys(plotKeys.filter((k) => k !== plotKey));
    setDashboardStructure(
      dashboardStructure.filter(
        (dashboard) => dashboardStructure.indexOf(dashboard) === plotKey
      )
    );
  };

  const handleFeatureSelection = (selection) => {
    setSelectedPlotFeature(
      plotMetaData.filter((feature) => feature.name === selection)[0]
    );
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
      }}
    >
      <Nav onNavBtnClicked={(btnName) => handleNavBtnClicked(btnName)} />
      <div className={theme ? "dashboard__nav--light" : "dashboard__nav--dark"}>
        <div className="flex-space-evenly">
          <DashboardTitle viewMode={mode} theme={theme} />
          <DashboardThemeBtn onThemeChange={() => setTheme(!theme)} />
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "100vh",
          backgroundColor: `${theme ? "#d6e4ea" : "#161d33"}`,
        }}
      >
        <GridLayout
          className="layout"
          cols={24}
          rowHeight={30}
          width={2500}
          onLayoutChange={(layout) => setDataGrid(layout)}
          isDraggable={mode === "edit" ? true : false}
        >
          {plotKeys.map((plotKey) => {
            console.log("this is cool",dashboardStructure[plotKey].data)
            return dashboardStructure[plotKey].data !== undefined ? (
              <PlotComponent
                data={dashboardStructure[plotKey].data}
                layout={dashboardStructure[plotKey].layout}
                plotType={dashboardStructure[plotKey].plotType}
                key={plotKey}
                data-grid={dataGrid[plotKey]}
                plotID={plotKey}
                theme={theme}
                plotMetaData={plotMetaData}
                selectedPlotFeature={selectedPlotFeature}
                onFeatureSelected={(selection) =>
                  handleFeatureSelection(selection)
                }
                onRemoveBtnClicked={(plotKey) => handleRemovePlot(plotKey)}
                viewMode={mode}
              />
            ) : (
              <InteractivityPanel
                key={plotKey}
                data-grid={dataGrid[plotKey]}
                onRemoveBtnClicked={(plotKey) => handleRemovePlot(plotKey)}
                viewMode={mode}
              />
            );
          })}
        </GridLayout>
      </div>
    </div>
  );
};

export default Dashboard;

//TODO: perhaps add a preview mode ?
//TODO: simplify the architecture by having a single source of truth on the dashboard structures
// TODO: pass dashboard structure as a prop
