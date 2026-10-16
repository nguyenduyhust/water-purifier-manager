import purifierTypesData from "@shared/purifier-types.json";
import type { FilterTemplate } from "@/types";

export interface DefaultPurifierType {
  id: string;
  name: { en: string; vi: string };
  filterTemplates: Array<{
    position: number;
    name: { en: string; vi: string };
    defaultIntervalMonths: number;
    description: { en: string; vi: string };
  }>;
}

export interface LocalizedPurifierType {
  id: string;
  name: string;
  filterTemplates: FilterTemplate[];
}

// Source of truth is shared/purifier-types.json so web and native apps stay in sync.
export const DEFAULT_PURIFIER_TYPES: DefaultPurifierType[] = purifierTypesData;

type Language = "en" | "vi";

export function getLocalizedPurifierTypes(lang: Language): LocalizedPurifierType[] {
  return DEFAULT_PURIFIER_TYPES.map((type) => ({
    id: type.id,
    name: type.name[lang],
    filterTemplates: type.filterTemplates.map((filter) => ({
      position: filter.position,
      name: filter.name[lang],
      defaultIntervalMonths: filter.defaultIntervalMonths,
      description: filter.description[lang],
    })),
  }));
}

export function getLocalizedPurifierTypeById(
  id: string,
  lang: Language
): LocalizedPurifierType | undefined {
  const type = DEFAULT_PURIFIER_TYPES.find((t) => t.id === id);
  if (!type) return undefined;

  return {
    id: type.id,
    name: type.name[lang],
    filterTemplates: type.filterTemplates.map((filter) => ({
      position: filter.position,
      name: filter.name[lang],
      defaultIntervalMonths: filter.defaultIntervalMonths,
      description: filter.description[lang],
    })),
  };
}
