'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

import type { getPlannerDefaultsAction } from '@/app/actions/planner-defaults';

type PlannerDefaultsResult = Awaited<
  ReturnType<typeof getPlannerDefaultsAction>
>;

type PlannerDefaultsContextValue = {
  result: PlannerDefaultsResult;
  dialogOpen: boolean;
  dialogOpenedAt: Date | undefined;
  setDialogOpen: (open: boolean) => void;
};

const PlannerDefaultsContext = createContext<
  PlannerDefaultsContextValue | undefined
>(undefined);

export function PlannerDefaultsProvider({
  result,
  children,
}: {
  result: PlannerDefaultsResult;
  children: ReactNode;
}) {
  const [dialog, setDialog] = useState<{
    open: boolean;
    openedAt?: Date;
  }>({ open: false });

  function setDialogOpen(open: boolean) {
    const openedAt = open ? new Date() : undefined;
    setDialog((current) => (open ? { open, openedAt } : { ...current, open }));
  }

  return (
    <PlannerDefaultsContext.Provider
      value={{
        result,
        dialogOpen: dialog.open,
        dialogOpenedAt: dialog.openedAt,
        setDialogOpen,
      }}
    >
      {children}
    </PlannerDefaultsContext.Provider>
  );
}

function usePlannerDefaultsContext() {
  const result = useContext(PlannerDefaultsContext);

  if (result === undefined) {
    throw new Error('Planner defaults require a PlannerDefaultsProvider.');
  }

  return result;
}

export function usePlannerDefaults() {
  return usePlannerDefaultsContext().result;
}

export function usePlannerDefaultsDialog() {
  return usePlannerDefaultsContext();
}
