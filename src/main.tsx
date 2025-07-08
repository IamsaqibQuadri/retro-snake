import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { GameSettingsProvider } from './contexts/GameSettingsContext'
import { SnakeSkinProvider } from './contexts/SnakeSkinContext'

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <GameSettingsProvider>
      <SnakeSkinProvider>
        <App />
      </SnakeSkinProvider>
    </GameSettingsProvider>
  </ThemeProvider>
);
