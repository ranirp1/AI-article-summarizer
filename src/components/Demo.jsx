import {useState, useEffect} from 'react';
import {copy, linkIcon, loader, tick} from '../assets';
import {useLazyGetSummaryQuery} from '../services/article';

const Demo = ({ sidebarOpen, toggleSidebar }) => {
  const[article, setArticle] = useState({
    url: '',
    summary: '',
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  const [getSummary, {error, isFetching}] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem('articles')
    );

    if(articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );
    
    if(existingArticle) {
      return setArticle(existingArticle);
    }

    const {data} = await getSummary({
      articleUrl: article.url,
      length: 3
    });

    if(data?.summary) {
      const newArticle = {...article, summary: data.summary};
      const updatedAllArticles = [newArticle, ...allArticles];
      
      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      
      localStorage.setItem('articles', JSON.stringify(updatedAllArticles));
    }
  }

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <section className= "mt-8 w-full max-w-xl relative">
      {/* History */}
      <div 
        className={`fixed right-4 top-[60px] h-auto max-h-[80vh] bg-gray-100 dark:bg-gray-800 shadow-lg rounded-lg transition-all duration-300 z-10 ${
          sidebarOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        } w-[352px]`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">History</h3>
          <button 
            onClick={toggleSidebar} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
          >
            ×
          </button>
        </div>
        <div className="p-2 overflow-y-auto h-[calc(100%-4rem)]">
          {allArticles.length > 0 ? (
            allArticles.map((item, index) => (
              <div
                key={`link-${index}`}
                onClick={() => {
                  setArticle(item);
                  toggleSidebar();
                }}
                className="link_card"
              >
                <div 
                  className="copy_btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(item.url);
                  }}
                >
                  <img
                    src={copied === item.url ? tick : copy}
                    alt="copy_icon"
                    className="w-[40%] h-[40%] object-contain"
                  />
                </div>
                <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                  {item.url}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center p-4">No history yet</p>
          )}
        </div>
      </div>
      
      {/* Search */}
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          
          <input
            type="url"
            placeholder="Enter a URL"
            value={article.url}
            onChange={(e) => setArticle({...article, url: e.target.value})}
            required
            className="url_input peer"
          />

          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            ↲
          </button>
        </form>
      </div>

      {/* Result */}
      <div className="my-4 w-full flex items-center justify-center overflow-visible relative">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black dark:text-white text-center">
            Well, that wasn't supposed to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-700 dark:text-gray-300">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-2 -ml-12 w-[120%] relative">
              <h2 className="font-satoshi font-bold text-gray-600 dark:text-gray-300 text-xl">
               <span className="blue_gradient">Article Summary</span>
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-700 dark:text-gray-300">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  )
}

export default Demo