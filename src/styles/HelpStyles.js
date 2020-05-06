export default {
  container: {
    marginTop: "2rem",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  card: {
    boxShadow: "0 1.5rem 3.5rem rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    borderRadius: "1rem",
    padding: "3.5rem",
    width: "25%",
    display: "flex",
    margin: "2rem 0",
    flexDirection: "column",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },

  content: {},

  cardHeading: {
    textTransform: "uppercase",
    display: "inline-block",
    // marginBottom: ".5rem",
  },

  text: {
    fontSize: "1.5rem",
    "&:not(:last-child)": {
      marginBottom: ".5rem",
    },
  },
  icons: {
    transition: "all .2s",
    "&:hover": {
      color: "#000",
      transform: "scale(1.02)",
    },
  },
};
