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

// Sharing
export type MemberRole = 'editor' | 'viewer';
export type AccessRole = 'owner' | MemberRole;

export interface MemberProfile {
  name: string;
  email: string | null;
  joinedAt?: Timestamp;
}

// Purifier
export interface Purifier {
  id: string;
  userId: string; // Owner
  typeId: string;
  typeName?: string; // Denormalized for display
  name: string;
  location?: string;
  installationDate: Timestamp;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  ownerName?: string; // Shown to members; set by the owner when inviting
  // Shared members, owner excluded
  memberIds?: string[];
  roles?: Record<string, MemberRole>;
  memberProfiles?: Record<string, MemberProfile>;
}

export type InviteStatus = 'pending' | 'accepted' | 'declined';

export interface Invite {
  id: string;
  purifierId: string;
  purifierName: string;
  role: MemberRole;
  email: string | null; // null = link invite
  status: InviteStatus;
  createdBy: string;
  createdByName: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  acceptedBy?: string;
  acceptedAt?: Timestamp;
}

// Who performed an action, recorded on history entries
export interface Actor {
  id: string;
  name: string;
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

// Filter replacement history (denormalized for performance)
export interface FilterReplacement {
  id: string;
  filterId: string;
  userId: string;
  replacedAt: Timestamp;
  notes?: string;
  createdAt: Timestamp;
  // Denormalized fields for history display (no extra queries needed)
  purifierId?: string;
  purifierName?: string;
  filterName?: string;
  filterPosition?: number;
}

export interface CreateFilterReplacementData {
  filterId: string;
  userId: string;
  replacedAt: Date;
  notes?: string;
  // Denormalized fields
  purifierId?: string;
  purifierName?: string;
  filterName?: string;
  filterPosition?: number;
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

// Activity Log - history entries, stored in purifiers/{id}/logs
// (older entries live in the legacy top-level activityLogs collection)
export type ActivityType = 'purifier_created' | 'purifier_updated' | 'purifier_deleted' | 'filter_replaced';

export interface ActivityLog {
  id: string;
  userId?: string; // Legacy entries only
  actorId?: string;
  actorName?: string;
  type: ActivityType;
  timestamp: Timestamp;
  // Purifier info (denormalized)
  purifierId: string;
  purifierName: string;
  // Filter info (optional, for filter events)
  filterId?: string;
  filterName?: string;
  filterPosition?: number;
  // Additional data
  notes?: string;
  createdAt: Timestamp;
}

export interface CreateActivityLogData {
  type: 'purifier_created' | 'filter_replaced';
  timestamp: Date;
  purifierName: string;
  filterId?: string;
  filterName?: string;
  filterPosition?: number;
  notes?: string;
  actor: Actor;
}
