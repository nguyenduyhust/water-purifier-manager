import { Timestamp } from 'firebase/firestore';

// Filter status enum
export type FilterStatus = 'ok' | 'warning' | 'expired';

// Filter template for purifier types
export interface FilterTemplate {
  position: number;
  name: string;
  defaultIntervalMonths: number;
  description?: string;
}

// Purifier type (template)
export interface PurifierType {
  id: string;
  name: string;
  isCustom: boolean;
  userId: string | null;
  filterTemplates: FilterTemplate[];
  createdAt: Timestamp;
}

export interface CreatePurifierTypeData {
  name: string;
  isCustom: boolean;
  userId: string | null;
  filterTemplates: FilterTemplate[];
}

// Purifier
export interface Purifier {
  id: string;
  userId: string;
  typeId: string;
  typeName?: string; // Denormalized for display
  name: string;
  location?: string;
  installationDate: Timestamp;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreatePurifierData {
  userId: string;
  typeId: string;
  typeName?: string;
  name: string;
  location?: string;
  installationDate: Date;
  notes?: string;
}

export interface UpdatePurifierData {
  name?: string;
  location?: string;
  notes?: string;
}

// Filter
export interface Filter {
  id: string;
  purifierId: string;
  userId: string;
  position: number;
  name: string;
  intervalMonths: number;
  lastReplacedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateFilterData {
  purifierId: string;
  userId: string;
  position: number;
  name: string;
  intervalMonths: number;
  lastReplacedAt: Date;
}

export interface UpdateFilterData {
  intervalMonths?: number;
  lastReplacedAt?: Date;
}

// Filter replacement history
export interface FilterReplacement {
  id: string;
  filterId: string;
  userId: string;
  replacedAt: Timestamp;
  notes?: string;
  createdAt: Timestamp;
}

export interface CreateFilterReplacementData {
  filterId: string;
  userId: string;
  replacedAt: Date;
  notes?: string;
}

// Purifier with filters (for display)
export interface PurifierWithFilters extends Purifier {
  filters: Filter[];
}

// Filter with computed status
export interface FilterWithStatus extends Filter {
  status: FilterStatus;
  nextReplacementAt: Date;
  daysUntilReplacement: number;
}

// Dashboard stats
export interface DashboardStats {
  totalPurifiers: number;
  totalFilters: number;
  expiredFilters: number;
  warningFilters: number;
  okFilters: number;
}

// User preferences (optional)
export interface UserPreferences {
  id: string;
  userId: string;
  warningDays: number; // Days before expiration to show warning
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
