import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  logo: {
    height: '2.5em',
    textAlign: "center",
    filter: "grayscale(100%)",
    maxWidth: '100%'
  },
  paperShadow: {
    padding: '1em 1em 1em 1em',
    boxShadow: 'rgb(0 0 0 / 45%) 25px 0px 20px -25px, rgb(0 0 0 / 45%) -25px 0px 20px -25px'
  },
  paperShadowLeft: {
    padding: '1em 1em 1em 1em',
    boxShadow: 'rgb(0 0 0 / 45%) -25px 0px 20px -25px'
  },
  paperShadowRight: {
    padding: '1em 1em 1em 1em',
    boxShadow: 'rgb(0 0 0 / 45%) 25px 0px 20px -25px'
  },
  paperShadowNone: {
    padding: '1em 1em 1em 1em',
  },
}));

function Sponsor(props) {
  const classes = useStyles();
  let paperShadowClass = classes.paperShadowNone;
  if (props.shadowLeft == true && props.shadowRight == false) {
    paperShadowClass = classes.paperShadowLeft;
  } else if (props.shadowLeft == false && props.shadowRight == true) {
    paperShadowClass = classes.paperShadowRight;
  } else if (props.shadowLeft == true && props.shadowRight == true) {
    paperShadowClass = classes.paperShadow;
  }
  return (
    <Paper className={paperShadowClass}
      elevation={0}
      square>
      <a href={props.url} target="_blank">
        <img src={props.logoPath}
          alt={props.name}
          className={classes.logo} />
      </a>
    </Paper>
  );
}

Sponsor.defaultProps = {
  shadowLeft: false,
  shadowRight: false
};

export default Sponsor;
