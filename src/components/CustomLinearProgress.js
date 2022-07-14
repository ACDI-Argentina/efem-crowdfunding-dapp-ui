import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const styles = (theme) => ({
  root: {
    borderRadius: "10px",
    height: "10px",
    marginBottom: "1em",
    overflow: "hidden",
    backgroundColor: "#EEE"
  },
  bar: ({ value }) => ({
    height: "100%",
    background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
    backgroundSize: `${value}% 100%`,
    backgroundRepeat: `no-repeat`
  })
});

const useStyles = makeStyles(styles);

export default function CustomLinearProgress(props) {
  const { value, ...rest } = props;
  const classes = useStyles({ value });
  return (
    <LinearProgress
      {...rest}
      classes={{
        root: classes.root,
        bar: classes.bar
      }}
    />
  );
}