import { type NavRoute } from "@packages/shared/types";
import { cn } from "@packages/shared/utils";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

interface DesktopNavbarProps {
  isActivePage: (href: string) => boolean;
  routes: NavRoute[];
}

const DesktopNavbar: React.FC<DesktopNavbarProps> = ({ isActivePage, routes }) => {
  const t = useTranslations("Navigation");

  return (
    <div className="navbar-center hidden lg:flex">
      <ul className="menu menu-horizontal px-1 text-lg">
        {routes.map((route) => (
          <li key={route.href}>
            <Link
              className={cn("text-xl", {
                "active bg-primary text-primary-content": isActivePage(route.href),
              })}
              href={route.href}
            >
              {t(route.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DesktopNavbar;
