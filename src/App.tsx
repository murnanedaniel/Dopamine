import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './styles/ThemeProvider';
import { GameContainer } from './components/core/GameContainer';
import { TestPage } from './components/tests/TestPage';
import { GoalWheelTestPage } from './components/tests/GoalWheelTestPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GameContainer />} />
          <Route path="/tests" element={<TestPage />} />
          <Route path="/goalwheel" element={<GoalWheelTestPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
