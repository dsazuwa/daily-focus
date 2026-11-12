export default function Footer() {
  return (
    <footer className='flex items-center justify-center'>
      <span className='container w-full border-t border-solid border-black/8 text-center text-sm text-zinc-600 dark:border-white/[.145] dark:text-zinc-400 p-4'>
        &copy; {new Date().getFullYear()} Daily Focus. All rights reserved.
      </span>
    </footer>
  );
}
