import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Loader2, Droplets, RefreshCw, History as HistoryIcon } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { useHistory } from '@/hooks/use-history';
import type { HistoryEvent } from '@/services/history-service';

export function HistoryPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'vi' ? vi : enUS;
  const { events, loading } = useHistory();

  const groupEventsByDate = (events: HistoryEvent[]) => {
    const groups: { [key: string]: HistoryEvent[] } = {};

    events.forEach((event) => {
      const dateKey = format(event.timestamp, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });

    return Object.entries(groups).map(([dateKey, events]) => ({
      date: new Date(dateKey),
      events,
    }));
  };

  const groupedEvents = groupEventsByDate(events);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('history.title')}</h1>
          <p className="text-muted-foreground">{t('history.description')}</p>
        </div>

        {events.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <HistoryIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('history.noHistory')}</h3>
              <p className="text-muted-foreground text-center">
                {t('history.noHistoryDescription')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {groupedEvents.map((group) => (
              <div key={group.date.toISOString()}>
                <h2 className="text-sm font-medium text-muted-foreground mb-3">
                  {format(group.date, 'EEEE, d MMMM yyyy', { locale })}
                </h2>
                <div className="space-y-3">
                  {group.events.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="flex items-start gap-4 py-4">
                        <div className={`rounded-full p-2 ${
                          event.type === 'purifier_created'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {event.type === 'purifier_created' ? (
                            <Droplets className="h-5 w-5" />
                          ) : (
                            <RefreshCw className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium">
                                {event.type === 'purifier_created'
                                  ? t('history.purifierCreated')
                                  : t('history.filterReplaced')}
                              </p>
                              <Link
                                to={`/purifiers/${event.purifierId}`}
                                className="text-sm text-primary hover:underline"
                              >
                                {event.purifierName}
                              </Link>
                              {event.type === 'filter_replaced' && event.filterName && (
                                <p className="text-sm text-muted-foreground">
                                  {event.filterPosition}. {event.filterName}
                                </p>
                              )}
                              {event.notes && (
                                <p className="text-sm text-muted-foreground mt-1 italic">
                                  "{event.notes}"
                                </p>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {format(event.timestamp, 'HH:mm', { locale })}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
