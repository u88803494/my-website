import Link from 'next/link';
import ContactLinks from '@/components/shared/ContactLinks';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-base-200 text-base-content p-6 flex flex-col items-center gap-4 md:flex-row md:justify-between md:items-center md:gap-0">
      <nav className="w-full flex flex-row items-center justify-center gap-4">
        <Link href="/" className="link link-hover">首頁</Link>
        <Link href="/projects" className="link link-hover">專案</Link>
        <Link href="/blog" className="link link-hover">部落格</Link>
        <Link href="/about" className="link link-hover">關於我</Link>
      </nav>
      <nav className="w-full flex flex-row justify-center gap-6 md:w-auto md:justify-center">
        <ContactLinks variant="link" />
      </nav>
      <aside className="w-full text-center text-sm md:w-auto md:text-right">
        <p>Copyright © {currentYear} - All rights reserved</p>
      </aside>
    </footer>
  );
};

export default Footer; 
