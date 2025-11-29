import React, { useState, useEffect } from 'react';
import './App.css';
import NewsCard from './NewsCard';

function App() {
  const categories = {
    "Top Stories": "https://news.google.com/rss?hl=mr&gl=IN&ceid=IN:mr",
    "Rajkaran": "https://news.google.com/rss/search?q=Rajkaran+Maharashtra+when:1d&hl=mr&gl=IN&ceid=IN:mr",
    "Krida": "https://news.google.com/rss/search?q=Krida+batmya+when:1d&hl=mr&gl=IN&ceid=IN:mr",
    "Arthavishwa": "https://news.google.com/rss/search?q=Share+Market+Marathi+when:1d&hl=mr&gl=IN&ceid=IN:mr",
    "Tantra/Auto": "https://news.google.com/rss/search?q=Tantragyan+Auto+when:2d&hl=mr&gl=IN&ceid=IN:mr"
  };

  const [activeCategory, setActiveCategory] = useState("Top Stories");
  const [searchTerm, setSearchTerm] = useState(""); // State for Search
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load notes from local storage
  const [savedNotes, setSavedNotes] = useState(() => {
    const saved = localStorage.getItem("newsKattaNotes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("newsKattaNotes", JSON.stringify(savedNotes));
  }, [savedNotes]);

  // FETCH NEWS (Handles Categories OR Search)
  useEffect(() => {
    setLoading(true);
    let rssUrl = "";

    if (activeCategory === "Search") {
      // If in search mode, use the user's term + date filter
      rssUrl = `https://news.google.com/rss/search?q=${searchTerm}+Marathi+when:1d&hl=mr&gl=IN&ceid=IN:mr`;
    } else {
      rssUrl = categories[activeCategory];
    }

    const apiEndpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    fetch(apiEndpoint)
      .then(res => res.json())
      .then(data => {
        setNews(data.items || []);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, [activeCategory, searchTerm]); // Re-run when category or search changes

  // ADD NOTE
  const addNote = (text, headline) => {
    const newNote = {
      text: text,
      headline: headline,
      date: new Date().toLocaleString('en-IN', { 
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
      })
    };
    setSavedNotes([newNote, ...savedNotes]); 
  };

  // DELETE NOTE
  const deleteNote = (indexToDelete) => {
    setSavedNotes(savedNotes.filter((_, index) => index !== indexToDelete));
  };

  // FEATURE: EXPORT NOTES TO TXT
  const downloadNotes = () => {
    if(savedNotes.length === 0) return alert("No notes to export!");
    
    // Format the text nicely
    const fileContent = savedNotes.map(n => 
      `Date: ${n.date}\nTopic: ${n.headline}\nNote: ${n.text}\n-------------------\n`
    ).join("");

    const element = document.createElement("a");
    const file = new Blob([fileContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "NewsKatta_Notes.txt";
    document.body.appendChild(element);
    element.click();
  };

  // FEATURE: HANDLE SEARCH SUBMIT
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      setActiveCategory("Search"); // Triggers the useEffect
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>NewsKatta</h1>
        
        {/* FEATURE: SEARCH BAR */}
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search news (e.g. MPSC, Rain)..." 
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
        </div>
      </header>

      <div className="main-content">
        <aside className="sidebar-left">
          <h3 className="sidebar-title">Categories</h3>
          {Object.keys(categories).map((cat) => (
            <button 
              key={cat}
              className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </aside>

        <main className="news-feed">
          {loading && <p className="status-msg">Fetching {activeCategory === "Search" ? searchTerm : activeCategory}...</p>}
          {!loading && news.map((item, index) => (
            <NewsCard 
              key={index} 
              article={item} 
              onSaveNote={addNote} 
            />
          ))}
        </main>

        <aside className="sidebar-right">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
            <h3 className="sidebar-title" style={{marginBottom:0, border:0}}>My Notes</h3>
            {/* FEATURE: DOWNLOAD BUTTON */}
            <button onClick={downloadNotes} className="export-btn">⬇ Export</button>
          </div>
          <hr style={{marginBottom:'15px', border:'0', borderTop:'2px solid #ddd'}} />

          {savedNotes.length === 0 && <p style={{color:'#666', fontSize:'0.9rem', textAlign:'center'}}>No notes saved yet.</p>}
          
          {savedNotes.map((note, idx) => (
            <div key={idx} className="saved-note-item">
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <span className="note-date">{note.date}</span>
                <span onClick={() => deleteNote(idx)} style={{cursor:'pointer', color:'red'}}>×</span>
              </div>
              <p className="note-text" style={{fontWeight:'bold', marginBottom:'5px'}}>
                {note.headline.substring(0, 30)}...
              </p>
              <p className="note-text">{note.text}</p>
            </div>
          ))}
        </aside>
      </div>

      <footer className="app-footer">
        &copy; 2025 NewsKatta - Student News Portal
      </footer>
    </div>
  );
}

export default App;