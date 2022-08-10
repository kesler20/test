import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { deepOrange, deepPurple } from "@mui/material/colors";
import "./LetterAvatars.css";
const LetterAvatars = ({ username }) => {
  return (
    <Stack direction="row" spacing={2} className="letter-avatar">
      <Avatar sx={{ bgcolor: deepOrange[500] }}>{username[0]}</Avatar>
    </Stack>
  );
};

export default LetterAvatars;
