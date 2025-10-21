import { type NavRoute } from "@packages/shared/types";
import { cn } from "@packages/shared/utils";
import Link from "next/link";

interface DesktopNavbarProps {
  isActivePage: (href: string) => boolean;
  routes: NavRoute[];
}

const DesktopNavbar: React.FC<DesktopNavbarProps> = ({ isActivePage, routes }) => {
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
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DesktopNavbar;
