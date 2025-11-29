import React, { useState } from 'react';
import './NewsCard.css'; 

function NewsCard({ article, onSaveNote }) {
  const [note, setNote] = useState('');

  const handleSaveClick = () => {
    if (note.trim()) {
      onSaveNote(note, article.title);
      setNote('');
    }
  };

  // FEATURE: WHATSAPP SHARE
  const handleShare = () => {
    const text = `Check this news: ${article.title} \nRead more: ${article.link}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const imgMatch = article.description.match(imgRegex);
  let imageUrl = imgMatch ? imgMatch[1] : null;

  const formattedDate = new Date(article.pubDate).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  });

  const cleanDescription = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <div className="news-card-container">
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
        <span style={{fontSize:'0.75rem', color:'#888', fontWeight:'bold'}}>{formattedDate}</span>
      </div>

      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="News Thumbnail" 
          className="nc-img" 
          onError={(e) => {e.target.style.display='none'}} 
        />
      )}

      <div className="nc-header">
         <h3>{article.title}</h3>
      </div>
      
      <p className="nc-desc">{cleanDescription(article.description).substring(0, 120)}...</p>
      
      <div className="nc-actions">
        <a href={article.link} target="_blank" rel="noopener noreferrer" className="nc-link">Read Full Story →</a>
        
        {/* WHATSAPP SHARE BUTTON */}
        <button onClick={handleShare} className="share-btn">
          Share 📢
        </button>
      </div>

      <div className="nc-note-area">
        <input 
          type="text" 
          placeholder="Add a study note..." 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSaveClick()} 
        />
        <button onClick={handleSaveClick}>Save</button>
      </div>
    </div>
  );
}

export default NewsCard;