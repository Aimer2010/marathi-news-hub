import React, { useState } from 'react';
import './NewsCard.css'; 

// 1. DEFINE CATEGORY PLACEHOLDERS (High Quality Unsplash Images)
const categoryImages = {
  "Top Stories": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=500&q=60", // Newspaper
  "Rajkaran": "https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?auto=format&fit=crop&w=500&q=60",   // Politics/Flag
  "Krida": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=500&q=60",      // Cricket/Sports
  "Arthavishwa": "https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&w=500&q=60", // Stock Market
  "Tantra/Auto": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=60", // Tech/Chip
  "Search": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&q=60"      // Search/Globe
};

function NewsCard({ article, category, onSaveNote }) { // Receive 'category' prop
  const [note, setNote] = useState('');
  const [imgError, setImgError] = useState(false);

  const handleSaveClick = () => {
    if (note.trim()) {
      onSaveNote(note, article.title);
      setNote('');
    }
  };

  const handleShare = () => {
    const text = `Check this news: ${article.title} \nRead more: ${article.link}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // --- IMAGE LOGIC ---
  let imageUrl = null;

  // Try extracting real image
  if (article.enclosure?.link) imageUrl = article.enclosure.link;
  else if (article.thumbnail) imageUrl = article.thumbnail;
  else {
    const imgMatch = article.description.match(/<img[^>]+src=["']([^"']+)["']/);
    if (imgMatch) imageUrl = imgMatch[1];
  }

  // FALLBACK: Use the Category Image if no real image found
  // We check if we have a specific image for this category, otherwise default to Top Stories
  const fallbackImage = categoryImages[category] || categoryImages["Top Stories"];

  // --- DATE & CLEANUP ---
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

      {/* IMAGE: Show Real Image OR Category Fallback */}
      <img 
        src={!imgError && imageUrl ? imageUrl : fallbackImage} 
        alt="News" 
        className="nc-img" 
        onError={() => setImgError(true)} 
      />

      <div className="nc-header">
         <h3>{article.title}</h3>
      </div>
      
      <p className="nc-desc">{cleanDescription(article.description).substring(0, 120)}...</p>
      
      <div className="nc-actions">
        <a href={article.link} target="_blank" rel="noopener noreferrer" className="nc-link">Read Full Story →</a>
        <button onClick={handleShare} className="share-btn">Share 📢</button>
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