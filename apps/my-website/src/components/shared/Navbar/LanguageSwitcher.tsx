"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";

const languages = [
  { code: "en", label: "EN", fullName: "English" },
  { code: "zh-TW", label: "中文", fullName: "繁體中文" },
] as const;

const LanguageSwitcher: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  return (
    <div className="dropdown dropdown-end">
      <div className="btn btn-ghost btn-sm gap-1" role="button" tabIndex={0}>
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLanguage.label}</span>
      </div>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-10 mt-3 w-40 p-2 shadow" tabIndex={0}>
        {languages.map((lang) => (
          <li key={lang.code}>
            <button
              className={locale === lang.code ? "active" : ""}
              onClick={() => switchLocale(lang.code)}
              type="button"
            >
              <span className="font-medium">{lang.label}</span>
              <span className="text-base-content/60 text-sm">{lang.fullName}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
