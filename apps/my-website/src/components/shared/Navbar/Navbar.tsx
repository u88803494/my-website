"use client";

import type { NavRoute } from "@packages/shared/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavigationMode } from "@/types/route.types";

import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

interface NavbarProps {
  contactLabel: string;
  navigationMode?: NavigationMode;
  routes: NavRoute[];
}

const Navbar: React.FC<NavbarProps> = ({ contactLabel, navigationMode = "client", routes }) => {
  const pathname = usePathname();

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // 關閉 dropdown 的函數
  const closeDropdown = () => {
    const dropdown = document.activeElement as HTMLElement;
    dropdown?.blur();
  };

  // 判斷是否為當前頁面的輔助函數
  const isActivePage = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="navbar bg-base-100/95 fixed top-0 z-50 w-full shadow-lg backdrop-blur-sm">
      <div className="navbar-start">
        <MobileNavbar
          closeDropdown={closeDropdown}
          isActivePage={isActivePage}
          navigationMode={navigationMode}
          routes={routes}
        />
        {navigationMode === "document" ? (
          // global-not-found renders outside App Router, so this must trigger a document navigation.
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a className="btn btn-ghost text-xl" href="/">
            Henry Lee
          </a>
        ) : (
          <Link className="btn btn-ghost text-xl" href="/">
            Henry Lee
          </Link>
        )}
      </div>

      <DesktopNavbar isActivePage={isActivePage} navigationMode={navigationMode} routes={routes} />

      <div className="navbar-end">
        {navigationMode === "document" ? (
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a className="btn btn-primary btn-md" href="/#contact">
            {contactLabel}
          </a>
        ) : (
          <button className="btn btn-primary btn-md" onClick={scrollToContact} type="button">
            {contactLabel}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
