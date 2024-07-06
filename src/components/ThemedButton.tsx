import React from "react";
import { useTheme } from "@mui/material/styles";
import { Button } from "@mui/material";

interface ThemedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const ThemedButton = (props: ThemedButtonProps) => {
  const theme = useTheme();
  const textColor = theme.palette.mode === "dark" ? "#fff" : "#000"; // white for dark mode, black for light mode

  return (
    <Button
      {...props}
      sx={{
        padding: "10px 15px",
        border: "none",
        borderRadius: "4px",
        backgroundColor: "#007bff",
        color: textColor,
        cursor: "pointer",
        transition: "background-color 0.2s",
        "&:hover": {
          backgroundColor: "#0056b3", // Darker shade on hover
        },
      }}
    >
      {props.children}
    </Button>
  );
};

export default ThemedButton;
