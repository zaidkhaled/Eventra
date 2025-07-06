import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      lightBg: '#F7F6E7',
      darkBg: '#1a202c',
      accent: '#F2A154',
      card: '#E7E6E1',
      text: '#314E52',
    },
  },
});

export default theme;
