import { type NavRoute } from "@packages/shared/types";
import { cn } from "@packages/shared/utils";
import { Menu } from "lucide-react";
import Link from "next/link";

interface MobileNavbarProps {
  closeDropdown: () => void;
  isActivePage: (href: string) => boolean;
  routes: NavRoute[];
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ closeDropdown, isActivePage, routes }) => {
  return (
    <div className="dropdown">
      <div className="btn btn-ghost btn-circle btn-md lg:hidden" role="button" tabIndex={0}>
        <Menu className="h-5 w-5" />
      </div>
      <ul
        className="menu menu-compact dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 text-base font-medium shadow md:text-lg"
        tabIndex={0}
      >
        {routes.map((route) => (
          <li key={route.href}>
            <Link
              className={cn({
                "active bg-primary text-primary-content": isActivePage(route.href),
              })}
              href={route.href}
              onClick={closeDropdown}
            >
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MobileNavbar;
