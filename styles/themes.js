export const lightTheme = {
    background: '#ffffff',
    text: '#000000',
    primary: '#007bff',
  };
  
  export const darkTheme = {
    background: '#1a1a1a',
    text: '#ffffff',
    primary: '#4da6ff',
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