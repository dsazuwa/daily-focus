import CloudCheck from 'lucide-react/icons/cloud-check';
import LoaderCircle from 'lucide-react/icons/loader-circle';

type SaveState = 'saving' | 'saved' | 'idle';

const STATUS_CONFIG: Record<
  SaveState,
  { icon: React.ReactNode; label: string }
> = {
  saving: {
    icon: <LoaderCircle className='size-3 animate-spin' aria-hidden='true' />,
    label: 'Saving...',
  },
  saved: {
    icon: <CloudCheck className='size-3' aria-hidden='true' />,
    label: 'All changes saved',
  },
  idle: {
    icon: (
      <span className='grid size-3 place-content-center' aria-hidden='true'>
        <span className='bg-muted-foreground size-1.5 rounded-full' />
      </span>
    ),
    label: 'Ready',
  },
};

function getSaveState(isSaving: boolean, hasSavedChanges: boolean): SaveState {
  if (isSaving) return 'saving';
  if (hasSavedChanges) return 'saved';
  return 'idle';
}

export default function SaveStatus() {
  const isSaving = false;
  const hasSavedChanges = false;

  const status = getSaveState(isSaving, hasSavedChanges);
  const { icon, label } = STATUS_CONFIG[status];

  return (
    <div
      role='status'
      aria-live='polite'
      className='text-muted-foreground text-xxs flex items-center gap-1 font-medium md:text-xs'
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
