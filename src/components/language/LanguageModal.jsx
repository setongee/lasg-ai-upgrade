import { Check } from 'iconoir-react';
import './language.css';

const LanguageModal = ({ LANGUAGES, language, setLanguage, setShowLanguageMenu, customClass }) => {
  return (
    <div className={`language-menu ${customClass}`}>
      {Object.entries(LANGUAGES).map(([code, lang]) => (
        <button
          key={code}
          className={`language-option ${language === code ? 'active' : ''}`}
          onClick={() => {
            if (code === 'en' || code === 'yo') {
              setLanguage(code);
            }
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
