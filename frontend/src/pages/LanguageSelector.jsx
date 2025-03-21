import React from 'react';
import { FaGlobe } from 'react-icons/fa';



const languages= [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
];

export  default function LanguageSelector() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentLang, setCurrentLang] = React.useState('en');

  const changeLanguage = (langCode) => {
    const select = document.querySelector('.goog-te-combo') ;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
      setCurrentLang(langCode);
    }
    setIsOpen(false);
  };

  // Initialize Google Translate
  //Translate
  React.useEffect(() => {
    const interval = setInterval(() => {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        // Move the select element to our container
        const container = document.getElementById('google_translate_element');
        if (container && !container.contains(select)) {
          container.appendChild(select);
          clearInterval(interval);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
      >
        <FaGlobe className="w-5 h-5 text-gray-600" />
        <span className="text-gray-700">
          {languages.find(lang => lang.code === currentLang)?.nativeName}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg py-2 w-48 z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-150
                ${currentLang === language.code ? 'bg-gray-50 font-medium' : ''}`}
            >
              <span className="block text-sm">{language.nativeName}</span>
              <span className="block text-xs text-gray-500">{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}