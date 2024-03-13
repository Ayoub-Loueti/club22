import React from 'react';
import { MantineThemeProvider } from './mantineThemeProvider'; // Path to your custom provider
import { Modal } from '@mantine/core';
import PostShare from '../postShare/postShare';
import { useMantineTheme } from './mantineThemeProvider';

function ShareModal({ modalOpened, setModalOpened }) {
  const theme = useMantineTheme();

  return (
    <Modal
      overlayColor={
        theme.colorScheme === 'dark'
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="55%"
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
    >
      <PostShare />
    </Modal>
  );
}

export default ShareModal;
