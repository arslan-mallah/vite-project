/**
 * Translation Service for Internationalization (i18n)
 * Uses HTTP service to fetch translations from backend
 */
import { httpService } from '../http/abi-http.service';

export interface Translation {
  key: string;
  value: string;
  language: string;
}

export class TranslationService {
  private endpoint = '/translations';

  /**
   * Get all translations for a language
   */
  async getTranslations(language: string): Promise<Translation[]> {
    return httpService.get<Translation[]>(`${this.endpoint}?lang=${language}`);
  }

  /**
   * Get a single translation by key and language
   */
  async getTranslation(key: string, language: string): Promise<Translation> {
    return httpService.get<Translation>(`${this.endpoint}/${key}?lang=${language}`);
  }

  /**
   * Add or update a translation
   */
  async setTranslation(key: string, value: string, language: string): Promise<Translation> {
    return httpService.post<Translation>(this.endpoint, { key, value, language });
  }

  /**
   * Delete a translation by key and language
   */
  async deleteTranslation(key: string, language: string): Promise<void> {
    return httpService.delete<void>(`${this.endpoint}/${key}?lang=${language}`);
  }
}

export const translationService = new TranslationService();
