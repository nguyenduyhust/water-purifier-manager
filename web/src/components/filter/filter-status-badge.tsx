import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { filterStatusService } from '@/services/filter-status-service';
import type { FilterStatus } from '@/types';

interface FilterStatusBadgeProps {
  status: FilterStatus;
  daysUntilReplacement?: number;
  showDays?: boolean;
}

export function FilterStatusBadge({
  status,
  daysUntilReplacement,
  showDays = true,
}: FilterStatusBadgeProps) {
  const { t } = useTranslation();

  const variant = filterStatusService.getStatusColor(status) as
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'success'
    | 'warning';

  const getStatusLabel = () => {
    switch (status) {
      case 'ok':
        return t('filter.status.ok');
      case 'warning':
        return t('filter.status.warning');
      case 'expired':
        return t('filter.status.expired');
      default:
        return status;
    }
  };

  const getDaysLabel = () => {
    if (!showDays || daysUntilReplacement === undefined) return null;

    if (daysUntilReplacement < 0) {
      const overdueDays = Math.abs(daysUntilReplacement);
      return t('filter.daysOverdue', { days: overdueDays });
    }

    if (daysUntilReplacement === 0) {
      return t('filter.dueToday');
    }

    return t('filter.daysRemaining', { days: daysUntilReplacement });
  };

  const daysLabel = getDaysLabel();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant={variant}>
        {getStatusLabel()}
      </Badge>
      {daysLabel && (
        <span className={`text-sm ${status === 'expired' ? 'text-destructive font-medium' : status === 'warning' ? 'text-amber-600 font-medium' : 'text-muted-foreground'}`}>
          {daysLabel}
        </span>
      )}
    </div>
  );
}
