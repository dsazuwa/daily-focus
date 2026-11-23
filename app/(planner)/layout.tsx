import { getPlannerDefaultsAction } from '@/app/actions/planner-defaults';

import AppBar from './_components/layout/app-bar';
import Footer from './_components/layout/footer';

import { PlannerDefaultsProvider } from './_components/planner-defaults-provider';

export default async function PlannerLayout({ children }: LayoutProps<'/'>) {
  const defaultsResult = await getPlannerDefaultsAction();

  return (
    <PlannerDefaultsProvider result={defaultsResult}>
      <AppBar />

      <main className='flex flex-1 flex-col'>
        <div className='gap-uniform pt-uniform container mx-auto flex h-full flex-1 flex-col px-4'>
          <div className='space-y-1'>
            <h1 className='text-heading'>
              Plan Your Progress<span>.</span>
            </h1>

            <p className='text-body'>
              Map out your priorities and where your hours actually go.
            </p>
          </div>

          {children}
        </div>
      </main>

      <Footer />
    </PlannerDefaultsProvider>
  );
}
