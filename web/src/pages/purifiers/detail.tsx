import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Calendar,
  Trash2,
  Edit,
  Share2,
  LogOut,
  Users,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { usePurifier } from '@/hooks/use-purifier';
import { usePurifiers } from '@/hooks/use-purifiers';
import { useSharing } from '@/hooks/use-sharing';
import { canEdit } from '@/lib/sharing';
import { ShareDialog } from '@/components/sharing/share-dialog';
import { FilterCard } from '@/components/filter/filter-card';
import { ReplaceFilterDialog } from '@/components/filter/replace-filter-dialog';
import { toast } from '@/hooks/use-toast';
import type { FilterWithStatus } from '@/types';

export function PurifierDetailPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'vi' ? vi : enUS;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { purifier, filters, role, loading } = usePurifier(id);
  const { deletePurifier } = usePurifiers();
  const { leave } = useSharing(purifier);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterWithStatus | null>(null);
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);

  const handleDelete = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      await deletePurifier(id);
      toast({
        title: t('purifier.purifierDeleted'),
        description: t('purifier.purifierDeletedDescription'),
      });
      navigate('/purifiers');
    } catch (error) {
      console.error('Delete purifier error:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('purifier.errors.deleteFailed'),
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleLeave = async () => {
    setIsLeaving(true);
    try {
      await leave();
      toast({ title: t('sharing.left') });
      navigate('/purifiers');
    } catch (error) {
      console.error('Leave purifier error:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('sharing.errors.generic'),
      });
    } finally {
      setIsLeaving(false);
      setShowLeaveDialog(false);
    }
  };

  const handleReplaceFilter = (filter: FilterWithStatus) => {
    setSelectedFilter(filter);
    setShowReplaceDialog(true);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!purifier) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-semibold mb-2">{t('purifier.notFound')}</h2>
          <p className="text-muted-foreground mb-4">
            {t('purifier.notFoundDescription')}
          </p>
          <Link to="/purifiers">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('purifier.backToPurifiers')}
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const isOwner = role === 'owner';
  const memberCount = purifier.memberIds?.length ?? 0;

  const installationDate =
    purifier.installationDate instanceof Timestamp
      ? purifier.installationDate.toDate()
      : new Date(purifier.installationDate);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Link to="/purifiers">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {purifier.name}
              </h1>
              {purifier.typeName && (
                <p className="text-muted-foreground">{purifier.typeName}</p>
              )}
              {!isOwner && role && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Users className="h-3 w-3" aria-hidden="true" />
                    {purifier.ownerName
                      ? t('sharing.sharedBy', { name: purifier.ownerName })
                      : t('sharing.shared')}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {t('sharing.yourRole', { role: t(`sharing.roles.${role}`) })}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {isOwner && (
              <Button variant="outline" size="sm" onClick={() => setShowShareDialog(true)}>
                <Share2 className="mr-2 h-4 w-4" />
                {t('sharing.share')}
                {memberCount > 0 && <span className="ml-1 text-muted-foreground">({memberCount})</span>}
              </Button>
            )}
            {canEdit(role) && (
              <Link to={`/purifiers/${id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  {t('common.edit')}
                </Button>
              </Link>
            )}
            {isOwner ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('common.delete')}
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowLeaveDialog(true)}>
                <LogOut className="mr-2 h-4 w-4" />
                {t('sharing.leave')}
              </Button>
            )}
          </div>
        </div>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('purifier.details')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {purifier.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{purifier.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{t('purifier.installed')} {format(installationDate, 'd MMMM, yyyy', { locale })}</span>
            </div>
            {purifier.notes && (
              <p className="text-sm text-muted-foreground pt-2 border-t">
                {purifier.notes}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Filters Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {t('filter.filters')} ({filters.length})
          </h2>
          {role === 'viewer' && (
            <p className="text-sm text-muted-foreground mb-4">{t('sharing.viewOnly')}</p>
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filters.map((filter) => (
              <FilterCard
                key={filter.id}
                filter={filter}
                onReplace={canEdit(role) ? handleReplaceFilter : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('purifier.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('purifier.deleteConfirmDescription', { name: purifier.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave Confirmation Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('sharing.leaveTitle', { name: purifier.name })}</AlertDialogTitle>
            <AlertDialogDescription>{t('sharing.leaveDescription')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLeaving}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeave} disabled={isLeaving}>
              {isLeaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('sharing.leave')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isOwner && (
        <ShareDialog purifier={purifier} open={showShareDialog} onOpenChange={setShowShareDialog} />
      )}

      {/* Replace Filter Dialog */}
      <ReplaceFilterDialog
        filter={selectedFilter}
        purifierId={id || ''}
        purifierName={purifier?.name}
        open={showReplaceDialog}
        onOpenChange={setShowReplaceDialog}
      />
    </AppLayout>
  );
}
