import { useEffect, useState } from "react";
import "./style3.css"

const API_KEY = " https://newsapi.org/docs/endpoints/top-headlines";
const CATEGORIES = ["general", "technology", "sports", "business", "entertainment", "health", "science"];

export default function NewsAggregator() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    fetchNews();
    loadBookmarks();
  }, [category]);

  const fetchNews = async () => {
    setLoading(true);
    const url = searchQuery
      ? `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${API_KEY}`
      : `https://newsapi.org/v2/top-headlines?category=${category}&country=us&apiKey=${API_KEY}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarks = () => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setBookmarks(savedBookmarks);
  };

  const toggleBookmark = (article) => {
    let updatedBookmarks = [...bookmarks];

    if (bookmarks.find((item) => item.url === article.url)) {
      updatedBookmarks = updatedBookmarks.filter((item) => item.url !== article.url);
    } else {
      updatedBookmarks.push(article);
    }

    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    setBookmarks(updatedBookmarks);
  };

  return (
    <div className="container">
      <h1 className="title">News Aggregator</h1>

     
      <div className="category-buttons">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

     
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={fetchNews}>Search</button>
      </div>

      
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="news-grid">
          {articles.length === 0 ? (
            <p>No articles found.</p>
          ) : (
            articles.map((article, index) => (
              <div key={index} className="news-card" onClick={() => setSelectedArticle(article)}>
                <img src={article.urlToImage || "https://via.placeholder.com/150"} alt={article.title} />
                <div className="news-content">
                  <h2>{article.title}</h2>
                  <p>{article.source.name}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
 {/* Bookmarked Articles */}
      <h2 className="bookmark-title">Bookmarked Articles</h2>
      <div className="news-grid">
        {bookmarks.length === 0 ? (
          <p>No bookmarks saved.</p>
        ) : (
          bookmarks.map((article, index) => (
            <div key={index} className="news-card" onClick={() => setSelectedArticle(article)}>
              <img src={article.urlToImage || "https://via.placeholder.com/150"} alt={article.title} />
              <div className="news-content">
                <h2>{article.title}</h2>
                <p>{article.source.name}</p>
              </div>
            </div>
          ))
        )}
      </div>

     
      {selectedArticle && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedArticle.title}</h2>
            <img src={selectedArticle.urlToImage || "https://via.placeholder.com/150"} alt={selectedArticle.title} />
            <p>{selectedArticle.description || "No summary available."}</p>
            <button onClick={() => toggleBookmark(selectedArticle)}>
              {bookmarks.find((item) => item.url === selectedArticle.url) ? "Remove Bookmark" : "Bookmark"}
            </button>
            <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer">Read Full Article</a>
            <button onClick={() => setSelectedArticle(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
