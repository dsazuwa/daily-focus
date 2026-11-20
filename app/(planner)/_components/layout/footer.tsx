export default function Footer() {
  return (
    <footer className='flex items-center justify-center'>
      <span className='border-border text-muted-foreground container w-full border-t border-solid p-4 text-center text-sm'>
        &copy; {new Date().getFullYear()} Daily Focus. No rights reserved.
      </span>
    </footer>
  );
}
