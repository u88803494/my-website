"use client";

import { useTranslations } from "next-intl";

import ContactLinks from "@/components/shared/ContactLinks";

const Footer = () => {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="from-base-300/30 via-base-200 to-base-100/50 text-base-content w-full bg-gradient-to-br">
      <div className="container mx-auto px-6 py-12">
        {/* Main content area */}
        <div className="flex flex-col items-center space-y-8">
          {/* Personal info section */}
          <div className="text-center">
            <h3 className="mb-2 text-2xl font-bold">Henry Lee</h3>
            <p className="text-base-content/70 text-lg">{t("jobTitle")}</p>
            <p className="text-base-content/60 mt-1 max-w-md text-sm">{t("bio")}</p>
          </div>

          {/* Divider */}
          <div className="bg-primary h-1 w-24 rounded-full" />

          {/* Social links */}
          <div className="flex flex-col items-center space-y-4">
            <p className="text-base-content/70 font-medium">{t("letsConnect")}</p>
            <div className="flex justify-center gap-6">
              <ContactLinks variant="circle" />
            </div>
          </div>

          {/* Divider */}
          <div className="border-base-content/10 w-full border-t" />

          {/* Copyright */}
          <div className="text-base-content/60 text-center text-sm">
            <p>{t("copyright", { year: currentYear })}</p>
            <p className="mt-1">{t("builtWith")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
