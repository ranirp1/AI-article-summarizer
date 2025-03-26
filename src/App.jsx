import React, { useState } from 'react';
import Hero from './components/Hero';
import Demo from './components/Demo';
import { ThemeProvider } from './components/Theme';
import './App.css';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider>
      <main className='transition-colors duration-300 dark:bg-gray-900'>
        <div className='main'>
          <div className='gradient' />
        </div>
        
        <div className='app'>
          <Hero toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
          <Demo toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        </div>
      </main>
    </ThemeProvider>
  );
};

export default App;