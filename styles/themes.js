export const lightTheme = {
  primary: '#007bff',
  background: '#f5f5f5',
  surface: '#ffffff',
  text: {
    primary: '#333333',
    secondary: '#666666',
    tertiary: '#999999'
  },
  border: '#dddddd',
  input: {
    background: '#ffffff',
    border: '#dddddd',
    focus: '#007bff'
  },
  button: {
    primary: '#007bff',
    hover: '#0056b3'
  },
  shadow: '0 4px 20px rgba(0,0,0,0.1)'
};

export const darkTheme = {
  primary: '#9965db',
  background: '#121212',
  surface: '#1e1e1e',
  text: {
    primary: '#ffffff',
    secondary: '#e0e0e0',
    tertiary: '#a0a0a0'
  },
  border: '#333333',
  input: {
    background: '#2d2d2d',
    border: '#404040',
    focus: '#9965db'
  },
  button: {
    primary: '#9965db',
    hover: '#7b4db8'
  },
  shadow: '0 4px 20px rgba(0,0,0,0.3)'
};

export const getTheme = (theme) => {
  switch (theme) {
    case 'dark':
      return darkTheme;
    case 'light':
      return lightTheme;
    case 'auto':
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? darkTheme : lightTheme;
    default:
      return lightTheme;
  }
};