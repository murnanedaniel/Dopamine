import React from 'react';
import { ThemeProvider } from './styles/ThemeProvider';
import { GameContainer } from './components/core/GameContainer';

function App() {
  return (
    <ThemeProvider>
      <GameContainer />
    </ThemeProvider>
  );
}

export default App;
