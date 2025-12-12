import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'id' ? 'en' : 'id';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-sm font-medium border border-white/10"
            aria-label="Switch Language"
        >
            <Globe className="w-4 h-4" />
            <span>{i18n.language === 'id' ? 'ID' : 'EN'}</span>
        </button>
    );
};

export default LanguageSwitcher;
