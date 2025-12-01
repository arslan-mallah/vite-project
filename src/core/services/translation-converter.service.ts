/**
 * Translation Converter Utility
 * Converts text from one language to another using stored translations
 */
import { translationService, type Translation } from './translation.service';

export class TranslationConverter {
  private translationCache: Map<string, Translation[]> = new Map();

  /**
   * Convert text from English to target language
   * @param text Text to translate
   * @param targetLanguage Target language code (e.g., 'fr', 'es')
   * @returns Translated text or original if translation not found
   */
  async convertText(text: string, targetLanguage: string): Promise<string> {
    try {
      // Get translations for target language
      let translations = this.translationCache.get(targetLanguage);
      
      if (!translations) {
        translations = await translationService.getTranslations(targetLanguage);
        this.translationCache.set(targetLanguage, translations);
      }

      // Convert text: split by spaces and translate each word
      const words = text.toLowerCase().split(/\s+/);
      const translatedWords = words.map(word => {
        const translation = translations?.find(t => t.key === word);
        return translation ? translation.value : word;
      });

      return translatedWords.join(' ');
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  /**
   * Translate entire sentence with intelligent parsing
   * @param text Full text/sentence
   * @param targetLanguage Target language
   * @returns Translated sentence
   */
  async translateSentence(text: string, targetLanguage: string): Promise<string> {
    try {
      let translations = this.translationCache.get(targetLanguage);
      
      if (!translations) {
        translations = await translationService.getTranslations(targetLanguage);
        this.translationCache.set(targetLanguage, translations);
      }

      // Try to match complete phrase first, then word by word
      let result = text.toLowerCase();
      
      // Sort by length descending to match longer phrases first
      const sortedTranslations = translations?.sort((a, b) => b.key.length - a.key.length) || [];
      
      for (const translation of sortedTranslations) {
        const regex = new RegExp(`\\b${translation.key}\\b`, 'gi');
        result = result.replace(regex, translation.value);
      }

      return result;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  /**
   * Get all available translations for a language
   * @param language Language code
   * @returns Array of translations
   */
  async getTranslations(language: string): Promise<Translation[]> {
    try {
      let translations = this.translationCache.get(language);
      
      if (!translations) {
        translations = await translationService.getTranslations(language);
        this.translationCache.set(language, translations);
      }

      return translations;
    } catch (error) {
      console.error('Error fetching translations:', error);
      return [];
    }
  }

  /**
   * Clear cache to refresh translations
   */
  clearCache(): void {
    this.translationCache.clear();
  }

  /**
   * Clear cache for specific language
   * @param language Language code
   */
  clearLanguageCache(language: string): void {
    this.translationCache.delete(language);
  }
}

export const translationConverter = new TranslationConverter();
