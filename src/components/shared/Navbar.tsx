"use client";

import Link from "next/link";
// import { Menu } from 'lucide-react';

const Navbar = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="navbar shadow-lg fixed top-0 w-full z-50 backdrop-blur-sm bg-base-100/95">
      <div className="navbar-start">
        {/* <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden btn-circle btn-md">
            <Menu className="h-5 w-5" />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow text-base md:text-lg font-medium"
          >
            <li><Link href="/">首頁</Link></li>
            <li><Link href="/projects">專案</Link></li>
            <li><Link href="/blog">部落格</Link></li>
            <li><Link href="/about">關於我</Link></li>
          </ul>
        </div> */}
        <Link href="/" className="btn btn-ghost text-xl">
          Henry Lee
        </Link>
      </div>
      {/* <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-lg">
          <li><Link href="/" className="text-xl">首頁</Link></li>
          <li><Link href="/projects" className="text-xl">專案</Link></li>
          <li><Link href="/blog" className="text-xl">部落格</Link></li>
          <li><Link href="/about" className="text-xl">關於我</Link></li>
        </ul>
      </div> */}
      <div className="navbar-end">
        <button onClick={scrollToContact} className="btn btn-primary btn-md">
          聯絡我
        </button>
      </div>
    </div>
  );
};

export default Navbar;
