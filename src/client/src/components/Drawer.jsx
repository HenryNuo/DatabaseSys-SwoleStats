import React from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Drawer,
  IconButton,
  List,
  Box,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const Header = (props) => {
  const [open, setOpen] = React.useState(false);

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setOpen(false)}
      onKeyDown={() => setOpen(false)}
    >
      <List>
        {[
          { name: "Home", link: "/home" },
          { name: "Add Workout", link: "/addworkout" },
          { name: "View Exercises", link: "/viewexercises" },
          { name: "Search Exercises", link: "/searchexercises" },
          { name: "Add Exercises", link: "/addexercises" },
          { name: "Update Exercises", link: "/editexercises" },
          { name: "Delete Exercises", link: "/deleteexercises" },
          { name: "View Acheivments", link: "/viewacheivments" },
          { name: "Leaderboard", link: "/leaderboard" },
          { name: "Personal Records", link: "/personalrecords" },
          { name: "Logout", link: "/logout" },
        ].map((text, index) => (
          <ListItemButton
            key={index}
            component={Link}
            to={text.link}
            sx={{ mb: 1 }}
          >
            <ListItemText primary={text.name} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={() => setOpen(!open)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          margin: "1rem",
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
          },
        }}
      >
        {list()}
      </Drawer>
    </div>
  );
};

export default Header;
