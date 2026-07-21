import { type NavRoute } from "@packages/shared/types";
import { cn } from "@packages/shared/utils";
import Link from "next/link";

import type { NavigationMode } from "@/types/route.types";

interface DesktopNavbarProps {
  isActivePage: (href: string) => boolean;
  navigationMode?: NavigationMode;
  routes: NavRoute[];
}

const DesktopNavbar: React.FC<DesktopNavbarProps> = ({ isActivePage, navigationMode = "client", routes }) => {
  return (
    <div className="navbar-center hidden lg:flex">
      <ul className="menu menu-horizontal px-1 text-lg">
        {routes.map((route) => {
          const className = cn("text-xl", {
            "active bg-primary text-primary-content": isActivePage(route.href),
          });

          return (
            <li key={route.href}>
              {navigationMode === "document" ? (
                <a className={className} href={route.href}>
                  {route.label}
                </a>
              ) : (
                <Link className={className} href={route.href}>
                  {route.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DesktopNavbar;
