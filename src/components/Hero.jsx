import React, { useContext } from "react";
import { logo } from "../assets";
import { ThemeContext } from "../components/Theme";

const Hero = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <header className='w-full flex justify-center items-center flex-col'>
      <nav className='flex justify-between items-end w-full max-w-full mx-auto mb-10 pt-3 px-2 sm:px-4'>
          <div className="w-1/3 flex justify-start -ml-16">
            <img src={logo} alt='sumz_logo' className='w-28 object-contain' />
          </div>
          
          <div className="w-1/3 flex justify-end -mr-16 space-x-2">
            <button
              type='button'
              onClick={toggleTheme}
              className='black_btn flex items-center justify-center h-8 px-3 rounded-md'
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? '🌙' : '☀️'}
            </button>
            <button
              type='button'
              onClick={() =>
                window.open("https://github.com/ranirp1/AI_Article_Summarizer", "_blank")
              }
              className='black_btn flex items-center justify-center h-8 px-3 rounded-md'
            >
              GitHub
            </button>
          </div>
      </nav>

        <h1 className='head_text dark:text-white'>
          Summarize Articles with <br className='max-md:hidden'/>
          <span className='orange_gradient'>OpenAI GPT-4</span>
        </h1>
        <h2 className='desc dark:text-gray-300'>
          Simplify your reading with Summize, an open-source article summarizer
          that transforms lengthy articles into clear and concise summaries
        </h2>
    </header>
  );
};

export default Hero;