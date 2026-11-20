import AppBar from './_components/layout/app-bar';
import Footer from './_components/layout/footer';

export default function PlannerLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <AppBar />

      <main className='flex flex-1 flex-col'>
        <div className='gap-uniform pt-uniform container mx-auto flex h-full flex-1 flex-col px-4'>
          <div className='space-y-1'>
            <p className='text-eyebrow'>laboris culpa excepturi</p>

            <h1 className='text-heading'>
              Est nam dolor magna blanditiis dolor<span>.</span>
            </h1>

            <p className='text-body'>Eligendi quo assumenda at dignissimos</p>
          </div>

          {children}
        </div>
      </main>

      <Footer />
    </>
  );
}
