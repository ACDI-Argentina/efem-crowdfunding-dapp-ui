const bkgImg = require("assets/img/notificacion-bkg.png");

const web3BannerStyle = theme => ({
  notificationLayout: {
    position: 'fixed',
    backgroundImage: "url(" + bkgImg + ")",
    bottom: '0',
    zIndex: '10',
    textAlign: 'center',
    backgroundPosition: "0% 100%",
    backgroundSize: "auto 100%",
    heigth: '300px',
    maxHeigth: '300px',
    width: '100%',
    [theme.breakpoints.down("sm")]: {
      backgroundImage: "none",
      backgroundColor: "#FFF",
      margin: "0 10px",
      border: "1px solid #DDD",
      width: "calc(100% - 20px)",
      heigth: '200px',
      maxHeigth: '200px',
      borderRadius: "10px"
    }
  },
  notificationBox: {
    width: '320px',
    minWidth: '300px',
    padding: '16px 28px',
    marginLeft: '56px',
    height: '250px',
    [theme.breakpoints.down("sm")]: {
      width: '100%',
      height: '200px',
      minWidth: '100%',
      padding: '1em 0',
      marginLeft: '0',
    }
  }
});

export default web3BannerStyle;
