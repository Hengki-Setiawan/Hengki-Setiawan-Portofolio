import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { translateText, translateBatch } from '../lib/translate';

/**
 * Hook to translate a single text string
 */
export function useAutoTranslate(text: string): string {
    const { i18n } = useTranslation();
    const [translated, setTranslated] = useState(text);
    const currentLang = i18n.language;

    useEffect(() => {
        let isMounted = true;

        const doTranslate = async () => {
            if (!text || text.trim() === '') {
                setTranslated(text);
                return;
            }

            // If current language is Indonesian, no need to translate (assuming content is in ID)
            if (currentLang === 'id') {
                setTranslated(text);
                return;
            }

            try {
                const result = await translateText(text, 'EN');
                if (isMounted) {
                    setTranslated(result);
                }
            } catch {
                if (isMounted) {
                    setTranslated(text);
                }
            }
        };

        doTranslate();

        return () => {
            isMounted = false;
        };
    }, [text, currentLang]);

    return translated;
}

/**
 * Hook to translate multiple texts at once (more efficient)
 */
export function useAutoTranslateBatch(texts: string[]): string[] {
    const { i18n } = useTranslation();
    const [translated, setTranslated] = useState<string[]>(texts);
    const currentLang = i18n.language;

    useEffect(() => {
        let isMounted = true;

        const doTranslate = async () => {
            if (!texts.length) {
                setTranslated(texts);
                return;
            }

            // If current language is Indonesian, no need to translate
            if (currentLang === 'id') {
                setTranslated(texts);
                return;
            }

            try {
                const results = await translateBatch(texts, 'EN');
                if (isMounted) {
                    setTranslated(results);
                }
            } catch {
                if (isMounted) {
                    setTranslated(texts);
                }
            }
        };

        doTranslate();

        return () => {
            isMounted = false;
        };
    }, [JSON.stringify(texts), currentLang]);

    return translated;
}

/**
 * Hook that provides a translate function for on-demand translation
 */
export function useTranslator() {
    const { i18n } = useTranslation();
    const currentLang = i18n.language;

    const translate = useCallback(
        async (text: string): Promise<string> => {
            if (!text || currentLang === 'id') {
                return text;
            }
            return translateText(text, 'EN');
        },
        [currentLang]
    );

    const translateMany = useCallback(
        async (texts: string[]): Promise<string[]> => {
            if (!texts.length || currentLang === 'id') {
                return texts;
            }
            return translateBatch(texts, 'EN');
        },
        [currentLang]
    );

    return { translate, translateMany, currentLang };
}
