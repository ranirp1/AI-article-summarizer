import React from 'react';
import Hero from './components/Hero';
import Demo from './components/Demo';
import { ThemeProvider } from './components/Theme';
import './App.css';

const App = () => {
  return (
    <ThemeProvider>
    <main>
        <div className='main'>
            <div className='gradient' />
        </div>

        <div className='app'>
            <Hero />
            <Demo />
        </div>
    </main>
  </ThemeProvider>
  )
}

export default App;