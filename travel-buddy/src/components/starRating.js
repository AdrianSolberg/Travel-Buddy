import React from "react";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const starRating = () => {
  const totalStars = 5;
  const activeStars = 3;

  return (
    <Box>
      {[...new Array(totalStars)].map((arr, index) => {
        return index < activeStars ? <StarIcon /> : <StarBorderIcon />;
      })}
    </Box>
  );
};

export default starRating;