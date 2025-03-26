import React, { useContext } from "react";
import { logo } from "../assets";
import { ThemeContext } from "../components/Theme";

const Hero = ({ toggleSidebar, sidebarOpen }) => {  
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <header className='w-full flex justify-center items-center flex-col'>
      <nav className='flex justify-between items-end w-full max-w-full mx-auto mb-10 pt-3 px-2 sm:px-4'>
          <div className="w-1/3 flex justify-start -ml-16">
            <img src={logo} alt='sumz_logo' className={`w-28 object-contain ${darkMode ? 'filter brightness-150' : ''}`} />
          </div>
          
          <div className="w-1/3 flex justify-end -mr-16 space-x-2">
            <button
              type='button'
              onClick={() =>
                window.open("https://github.com/ranirp1/AI_Article_Summarizer", "_blank")
              }
              className='black_btn flex items-center justify-center h-8 px-3 rounded-md'
            >
              GitHub
            </button>

            <button 
              onClick={toggleSidebar}
              className='black_btn flex items-center justify-center h-8 px-3 rounded-md'
              aria-label={sidebarOpen ? "Close history" : "Open history"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </button>

            <button
              type='button'
              onClick={toggleTheme}
              className='black_btn flex items-center justify-center h-8 px-3 rounded-md'
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? '🌙' : '☀️'}
            </button>
          </div>
      </nav>
    
        <h1 className='head_text dark:text-zinc-300'>
          Summarize Articles with <br className='max-md:hidden'/>
          <span className={`${darkMode ? 'text-orange-300' : 'orange_gradient'}`}>OpenAI GPT-4</span>
        </h1>
        <h2 className='desc text-gray-700 dark:text-zinc-200'>
          Simplify your reading with Summize, an open-source article summarizer
          that transforms lengthy articles into clear and concise summaries
        </h2>
    </header>
  );
};

export default Hero;