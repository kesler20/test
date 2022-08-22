import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import { Edit } from "@material-ui/icons";
import { Save } from "@material-ui/icons";
import { Add } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 380,
    transform: "translateZ(0px)",
    flexGrow: 1,
  },
  speedDial: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const actions = [
  { icon: <Save />, name: "Save Dashboard" },
  { icon: <Edit />, name: "Edit Dashboard" },
  { icon: <Add />, name: "Add Plot" },
];

const Nav = ({ onNavBtnClicked }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SpeedDial
      ariaLabel="SpeedDial openIcon example"
      className={classes.speedDial}
      icon={<SpeedDialIcon openIcon={<Edit />} />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => onNavBtnClicked(action.name)}
        />
      ))}
    </SpeedDial>
  );
};

export default Nav;
