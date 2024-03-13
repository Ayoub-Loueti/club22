import React from 'react';
import { MantineProvider } from '@mantine/core';

const CustomThemeProvider = ({ children }) => {
  return <MantineProvider>{children}</MantineProvider>;
};

export default CustomThemeProvider;
