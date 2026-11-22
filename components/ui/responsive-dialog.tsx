import { useRef } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';

export function ResponsiveDialog({
  children,
  footer,
  trigger,
  title,
  description: desc,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
  trigger: React.ReactElement;
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const titleRef = useRef<HTMLHeadingElement>(null);

  const Modal = isDesktop
    ? {
        Root: Dialog,
        Trigger: DialogTrigger,
        Content: DialogContent,
        Header: DialogHeader,
        Title: DialogTitle,
        Description: DialogDescription,
        Footer: DialogFooter,
      }
    : {
        Root: Drawer,
        Trigger: DrawerTrigger,
        Content: DrawerContent,
        Header: DrawerHeader,
        Title: DrawerTitle,
        Description: DrawerDescription,
        Footer: DrawerFooter,
      };

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Trigger render={trigger} />

      <Modal.Content
        initialFocus={titleRef}
        className='md:max-h-[calc(100dvh-2rem)] md:max-w-2xl md:grid-rows-[auto_minmax(0,1fr)_auto]'
      >
        <Modal.Header className='border-border border-b px-4 py-6 md:px-6'>
          <Modal.Title ref={titleRef} tabIndex={-1}>
            {title}
          </Modal.Title>
          <Modal.Description>{desc}</Modal.Description>
        </Modal.Header>

        <div className='min-h-0 overflow-y-auto px-4 py-6 md:px-6'>
          {children}
        </div>

        {footer && (
          <Modal.Footer className='border-border gap-4 border-t px-4 py-6 md:px-6'>
            {footer}
          </Modal.Footer>
        )}
      </Modal.Content>
    </Modal.Root>
  );
}
