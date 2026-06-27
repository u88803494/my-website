"use client";

import { routes } from "@packages/shared/constants";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";

import DesktopNavbar from "./DesktopNavbar";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileNavbar from "./MobileNavbar";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const t = useTranslations("Contact");

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
        <MobileNavbar closeDropdown={closeDropdown} isActivePage={isActivePage} routes={routes} />
        <Link className="btn btn-ghost text-xl" href="/">
          Henry Lee
        </Link>
      </div>

      <DesktopNavbar isActivePage={isActivePage} routes={routes} />

      <div className="navbar-end gap-2">
        <LanguageSwitcher />
        <button className="btn btn-primary btn-md" onClick={scrollToContact}>
          {t("title")}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
