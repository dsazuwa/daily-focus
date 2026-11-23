'use client';

import { createContext, useContext, type ReactNode } from 'react';

import type { getPlannerDefaultsAction } from '@/app/actions/planner-defaults';

type PlannerDefaultsResult = Awaited<
  ReturnType<typeof getPlannerDefaultsAction>
>;

const PlannerDefaultsContext = createContext<PlannerDefaultsResult | undefined>(
  undefined,
);

export function PlannerDefaultsProvider({
  result,
  children,
}: {
  result: PlannerDefaultsResult;
  children: ReactNode;
}) {
  return (
    <PlannerDefaultsContext.Provider value={result}>
      {children}
    </PlannerDefaultsContext.Provider>
  );
}

export function usePlannerDefaults() {
  const result = useContext(PlannerDefaultsContext);

  if (result === undefined) {
    throw new Error('usePlannerDefaults requires a PlannerDefaultsProvider.');
  }

  return result;
}
