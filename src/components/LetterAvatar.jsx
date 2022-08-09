import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { deepOrange, deepPurple } from "@mui/material/colors";

const LetterAvatars = ({ username }) => {
  return (
    <Stack direction="row" spacing={2} style={{ marginLeft: "1480px" }}>
      <Avatar sx={{ bgcolor: deepOrange[500] }}>{username[0]}</Avatar>
    </Stack>
  );
};

export default LetterAvatars;
