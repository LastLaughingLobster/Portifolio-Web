import React from 'react';
import './LanguagesCard.css';

const LanguagesCard: React.FC = () => {
  return (
    <div className="languages-card">
      <h2 className="languages-card-header">Languages 🌍</h2>
      <p className="language-item">🇧🇷🇵🇹 Portuguese: Native</p>
      <p className="language-item">🇺🇸🇬🇧 English: Fluent (C2 / CAE)</p>
      <p className="language-item">🇪🇸🇦🇷 Spanish: Intermediate - thanks to being a sister language to Portuguese.</p>
      <p className="language-item">🇩🇪🇦🇹 German: Intermediate (B1 / DID) - Lived in Germany for 6 months. Still studying it!</p>
    </div>
  );
};

export default LanguagesCard;
