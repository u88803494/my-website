"use client";

import { Menu } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <nav className="navbar bg-base-100/95 fixed top-0 z-50 w-full shadow-lg backdrop-blur-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div className="btn btn-ghost btn-circle btn-md lg:hidden" role="button" tabIndex={0}>
            <Menu className="h-5 w-5" />
          </div>
          <ul
            className="menu menu-compact dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 text-base font-medium shadow md:text-lg"
            tabIndex={0}
          >
            <li>
              <Link href="/">首頁</Link>
            </li>
            {/* <li><Link href="/projects">專案</Link></li> */}
            <li>
              <Link href="/blog">部落格</Link>
            </li>
            <li>
              <Link href="/about">關於我</Link>
            </li>
          </ul>
        </div>
        <Link className="btn btn-ghost text-xl" href="/">
          Henry Lee
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-lg">
          <li>
            <Link className="text-xl" href="/">
              首頁
            </Link>
          </li>
          {/* <li><Link href="/projects" className="text-xl">專案</Link></li> */}
          <li>
            <Link className="text-xl" href="/blog">
              部落格
            </Link>
          </li>
          <li>
            <Link className="text-xl" href="/about">
              關於我
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <button className="btn btn-primary btn-md" onClick={scrollToContact}>
          聯絡我
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
