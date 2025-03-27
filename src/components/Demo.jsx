import {useState, useEffect} from 'react';
import {copy, linkIcon, loader, tick} from '../assets';
import {useLazyGetSummaryQuery, useLazyGetArticleQuery} from '../services/article';

const Demo = ({sidebarOpen, setSidebarOpen}) => {
  const [article, setArticle] = useState({
    url: '',
    summary: '',
    fullText: ''
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [activeTab, setActiveTab] = useState("summary"); 

  const [getSummary, {error: summaryError, isFetching: isSummaryFetching}] = useLazyGetSummaryQuery();
  const [getArticle, {error: articleError, isFetching: isArticleFetching}] = useLazyGetArticleQuery();

  const [copiedContent, setCopiedContent] = useState({
    url: "",
    summary: false,
    fullText: false
  });
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem('articles') || '[]'
    );

    if (articlesFromLocalStorage.length) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setArticle({
      ...article,
      summary: '',
      fullText: ''
    });

    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );
    
    if (existingArticle) {
      return setArticle(existingArticle);
    }
  }

  const handleGetSummary = async () => {
    if (!article.url) {
      return;
    }
    
    if (article.summary) {
      setActiveTab("summary");
      return;
    }
    
    try {
      const {data} = await getSummary({
        articleUrl: article.url,
        length: 3
      });

      if (data?.summary) {
        const newArticle = {...article, summary: data.summary};
        const updatedAllArticles = [newArticle, ...allArticles.filter(item => item.url !== article.url)];
        
        setArticle(newArticle);
        setAllArticles(updatedAllArticles);
        setActiveTab("summary");
        
        localStorage.setItem('articles', JSON.stringify(updatedAllArticles));
      }
    } catch (error) {
      console.error("Error getting summary:", error);
    }
  }
  
  const handleGetFullArticle = async () => {
    if (!article.url) {
      return;
    }
    
    if (article.fullText) {
      setActiveTab("fullText");
      return;
    }
    
    try {
      const {data} = await getArticle({
        articleUrl: article.url
      });

      if (data?.content) {
        const newArticle = {...article, fullText: data.content};
        
        const existingIndex = allArticles.findIndex(item => item.url === article.url);
        if (existingIndex !== -1) {
          const updatedAllArticles = [...allArticles];
          updatedAllArticles[existingIndex] = newArticle;
          setAllArticles(updatedAllArticles);
          localStorage.setItem('articles', JSON.stringify(updatedAllArticles));
        }
        
        setArticle(newArticle);
        setActiveTab("fullText");
      }
    } catch (error) {
      console.error("Error extracting article:", error);
    }
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  }

  const handleCopyContent = (type) => {
    let textToCopy = '';
    
    if (type === 'summary') {
      textToCopy = article.summary;
      setCopiedContent({...copiedContent, summary: true});
      navigator.clipboard.writeText(textToCopy);
    } else if (type === 'fullText') {
      const htmlContent = article.fullText;
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
  
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([htmlContent], {type: 'text/html'}),
        'text/plain': new Blob([tempDiv.textContent || tempDiv.innerText || ""], {type: 'text/plain'})
      });
      
      navigator.clipboard.write([clipboardItem])
        .catch(err => {
          console.error('Could not copy HTML content: ', err);
          navigator.clipboard.writeText(tempDiv.textContent || tempDiv.innerText || "");
        });
        
      setCopiedContent({...copiedContent, fullText: true});
    }
    
    setTimeout(() => {
      setCopiedContent({...copiedContent, summary: false, fullText: false});
    }, 3000);
  }

  return (
    <section className="mt-8 w-full max-w-xl relative">
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
      
      {/* URL Input */}
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center w-full"
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
      
      {/* Action Buttons */}
      {article.url && (
        <div className="flex gap-2 mt-3">
          <button 
            onClick={handleGetSummary}
            disabled={isSummaryFetching}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex-1 ${
              activeTab === "summary" 
                ? "bg-blue-700 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {isSummaryFetching ? 'Summarizing...' : 'Summary'}
          </button>
          
          <button 
            onClick={handleGetFullArticle}
            disabled={isArticleFetching}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex-1 ${
              activeTab === "fullText" 
                ? "bg-blue-700 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {isArticleFetching ? 'Extracting...' : 'Article'}
          </button>
        </div>
      )}

      {/* Results */}
      <div className="my-4 w-full overflow-visible">
        {isSummaryFetching || isArticleFetching ? (
          <div className="flex items-center justify-center">
            <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
          </div>
        ) : summaryError || articleError ? (
          <p className="font-inter font-bold text-black dark:text-white text-center">
            Well, that wasn't supposed to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-700 dark:text-gray-300">
              {summaryError?.data?.error || articleError?.data?.error}
            </span>
          </p>
        ) : (
          <>
            {/* Summary */}
            {activeTab === "summary" && article.summary && (
              <div className="flex flex-col gap-2 w-full relative -translate-x-8">
                <div className="flex justify-between items-center w-[calc(100%+5rem)]">
                  <h2 className="font-satoshi font-bold text-gray-600 dark:text-gray-300 text-xl ml-2">
                    <span className="blue_gradient">Article Summary</span>
                  </h2>
                  <button 
                    onClick={() => handleCopyContent('summary')}
                    className="flex items-center gap-1 text-xs py-1.5 px-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all text-gray-700 dark:text-gray-200 font-medium shadow-sm"
                  >  
                    {copiedContent.summary ? "Copied!" : "Copy"}
                    <img src={copiedContent.summary ? tick : copy} alt="copy" className="w-3 h-3" />
                  </button>
                </div>
                <div className="summary_box w-[calc(100%+5rem)]">
                  <p className="font-inter font-medium text-sm text-gray-700 dark:text-gray-300">
                    {article.summary}
                  </p>
                </div>
              </div>
            )}

            {/* Full Article */}
            {activeTab === "fullText" && article.fullText && (
              <div className="flex flex-col gap-2 w-full relative -translate-x-8">
                <div className="flex justify-between items-center w-[calc(100%+5rem)]">
                  <h2 className="font-satoshi font-bold text-gray-600 dark:text-gray-300 text-xl ml-2">
                    <span className="blue_gradient">Full Article</span>
                  </h2>
                  <button 
                    onClick={() => handleCopyContent('fullText')}
                    className="flex items-center gap-1 text-xs py-1.5 px-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all text-gray-700 dark:text-gray-200 font-medium shadow-sm"
                  >
                    {copiedContent.fullText ? "Copied!" : "Copy"}
                    <img src={copiedContent.fullText ? tick : copy} alt="copy" className="w-3 h-3" />
                  </button>
                </div>
                <div className="summary_box max-h-[500px] overflow-y-auto w-[calc(100%+5rem)]">
                  <div 
                    className="font-inter font-medium text-sm text-gray-700 dark:text-gray-300"
                    dangerouslySetInnerHTML={{__html: article.fullText}}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Demo;