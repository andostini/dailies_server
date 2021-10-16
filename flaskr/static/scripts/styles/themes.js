export const base = {
  
    palette: {
      type: 'dark',
      primary: {
        main: '#64b5f6',
      },
      secondary: {
        main: '#f44336',
      },
      background: {
        default: '#121212',
        paper: '#202020',
      },
    },
    shape: {
        borderRadius: 0
    },
    typography: {
      fontSize: 13,
      fontFamily: 'Source Sans Pro, Arial',
      h1: {
        fontSize: '28pt',
        fontFamily: 'Raleway',
        fontWeight: 500,
      },
      h2:  {
        fontSize: 32,
        fontWeight: 200,
        fontFamily: 'Lato',
        lineHeight: 1.2,
        paddingBottom: 15,
      },
      h3: {
        fontSize: 20,
        fontWeight: 600,
        paddingBottom: 5,
      },
      h4: {
        fontSize: 14,
        fontWeight: 600,
      },
      subtitle1: {
        fontFamily: 'Raleway',
        fontSize: '14pt',
        fontWeight: 200,
        lineHeight: 1.2,
      },
      button: {
        textTransform: "none"
      }
    },
    props: {
      MuiAppBar: {
        color: 'transparent',
      }
    }
  }