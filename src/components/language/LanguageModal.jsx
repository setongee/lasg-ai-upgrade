import { Check } from 'iconoir-react';
import './language.css';

const LanguageModal = ({ LANGUAGES, language, setLanguage, setShowLanguageMenu }) => {
  return (
    <div className="language-menu">
      {Object.entries(LANGUAGES).map(([code, lang]) => (
        <button
          key={code}
          className={`language-option ${language === code ? 'active' : ''}`}
          onClick={() => {
            setLanguage(code);
            setShowLanguageMenu(false);
          }}
        >
          {lang.name}
          <span className="checked">{language === code ? <Check /> : ''}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageModal;
