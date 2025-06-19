'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden btn-circle">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow text-base md:text-lg font-medium"
          >
            <li><Link href="/">首頁</Link></li>
            <li><Link href="/projects">專案</Link></li>
            <li><Link href="/blog">部落格</Link></li>
            <li><Link href="/about">關於我</Link></li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">我的作品集</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-lg">
          <li><Link href="/" className="text-xl">首頁</Link></li>
          <li><Link href="/projects" className="text-xl">專案</Link></li>
          <li><Link href="/blog" className="text-xl">部落格</Link></li>
          <li><Link href="/about" className="text-xl">關於我</Link></li>
        </ul>
      </div>
      <div className="navbar-end">
        <button className="btn btn-primary">聯絡我</button>
      </div>
    </div>
  );
} 