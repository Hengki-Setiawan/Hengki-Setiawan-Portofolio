import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translateText } from '../lib/translate';

interface TranslatedTextProps {
    children: string;
    as?: React.ElementType;
    className?: string;
    [key: string]: any;
}

/**
 * Component that automatically translates its text content
 * based on the current language setting using DeepL API
 * 
 * This is used for dynamic content from Supabase that can't be
 * pre-translated in static translation files.
 */
export const TranslatedText: React.FC<TranslatedTextProps> = ({
    children,
    as: Component = 'span',
    className,
    ...props
}) => {
    const { i18n } = useTranslation();
    const [translated, setTranslated] = useState(children);
    const [isTranslating, setIsTranslating] = useState(false);
    const currentLang = i18n.language;

    useEffect(() => {
        let isMounted = true;

        const doTranslate = async () => {
            if (!children || children.trim() === '') {
                setTranslated(children);
                return;
            }

            // If current language is Indonesian, show original (content is in ID)
            if (currentLang === 'id' || currentLang.startsWith('id')) {
                setTranslated(children);
                return;
            }

            // For English, translate from Indonesian to English
            setIsTranslating(true);

            try {
                const result = await translateText(children, 'EN');
                if (isMounted) {
                    setTranslated(result);
                }
            } catch {
                if (isMounted) {
                    setTranslated(children);
                }
            } finally {
                if (isMounted) {
                    setIsTranslating(false);
                }
            }
        };

        doTranslate();

        return () => {
            isMounted = false;
        };
    }, [children, currentLang]);

    return (
        <Component className={className} {...props}>
            {translated}
            {isTranslating && (
                <span className="ml-1 opacity-50 text-xs">...</span>
            )}
        </Component>
    );
};

export default TranslatedText;
