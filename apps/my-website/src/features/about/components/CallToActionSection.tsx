"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import React from "react";

import { SOCIAL_LINKS } from "@/constants/socialLinks";

const CallToActionSection = () => {
  const t = useTranslations("About");

  return (
    <section className="from-primary/10 via-base-100 to-secondary/10 rounded-lg bg-gradient-to-br p-8 text-center">
      <h3 className="mb-4 text-2xl font-bold">{t("cta.title")}</h3>
      <p className="text-base-content/80 mb-6">{t("cta.description")}</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link className="btn btn-primary" href={SOCIAL_LINKS.LINKEDIN} target="_blank">
          {t("cta.linkedinButton")}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link className="btn btn-outline" href={`mailto:${SOCIAL_LINKS.EMAIL}`}>
          {t("cta.emailButton")}
        </Link>
      </div>
    </section>
  );
};

export default CallToActionSection;
