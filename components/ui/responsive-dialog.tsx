import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';

export function ResponsiveDialog({
  children,
  trigger,
  title,
  description: desc,
  open,
  onOpenChange,
  className,
}: {
  children: React.ReactNode;
  trigger: React.ReactElement;
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger render={trigger} />

        <DialogContent className={className ?? 'sm:max-w-106.25'}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {desc && <DialogDescription>{desc}</DialogDescription>}
          </DialogHeader>

          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger render={trigger} />

      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>{title}</DrawerTitle>
          {desc && <DrawerDescription>{desc}</DrawerDescription>}
        </DrawerHeader>

        <div className='p-4'>{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
