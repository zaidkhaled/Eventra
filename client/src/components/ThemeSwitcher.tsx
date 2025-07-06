'use client';

import { Button, useColorMode } from '@chakra-ui/react';

export default function ThemeSwitcher() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button onClick={toggleColorMode}>
      {colorMode === 'light' ? '🧑‍💼 رسمي' : '🎨 عصري'}
    </Button>
  );
}
