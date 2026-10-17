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

  // Brands in catalog file order, as the iOS picker shows them.
  const purifierTypesByBrand = useMemo(() => {
    const groups = new Map<string, LocalizedPurifierType[]>();
    for (const type of purifierTypes) {
      groups.set(type.brand, [...(groups.get(type.brand) ?? []), type]);
    }
    return [...groups].map(([brand, types]) => ({ brand, types }));
  }, [purifierTypes]);

  const getPurifierTypeById = (id: string): LocalizedPurifierType | undefined => {
    return getLocalizedPurifierTypeById(id, lang);
  };

  return {
    purifierTypes,
    purifierTypesByBrand,
    getPurifierTypeById,
  };
}
