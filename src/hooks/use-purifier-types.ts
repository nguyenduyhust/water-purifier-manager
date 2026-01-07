import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getLocalizedPurifierTypes,
  getLocalizedPurifierTypeById,
  type LocalizedPurifierType,
} from '@/data/purifier-types';

export function usePurifierTypes() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === 'vi' ? 'vi' : 'en') as 'en' | 'vi';

  const purifierTypes = useMemo(() => {
    return getLocalizedPurifierTypes(lang);
  }, [lang]);

  const getPurifierTypeById = (id: string): LocalizedPurifierType | undefined => {
    return getLocalizedPurifierTypeById(id, lang);
  };

  return {
    purifierTypes,
    getPurifierTypeById,
  };
}
