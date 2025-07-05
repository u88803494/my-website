import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

import { SOCIAL_LINKS } from "@/constants/socialLinks";

const CallToActionSection = () => {
  return (
    <section className="from-primary/10 via-base-100 to-secondary/10 rounded-lg bg-gradient-to-br p-8 text-center">
      <h3 className="mb-4 text-2xl font-bold">感興趣嗎？</h3>
      <p className="text-base-content/80 mb-6">
        我對新的工作機會、專案合作或單純的技術交流都抱持開放態度。期待與您聊聊！
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link className="btn btn-primary" href={SOCIAL_LINKS.LINKEDIN} target="_blank">
          透過 LinkedIn 聯繫
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link className="btn btn-outline" href={`mailto:${SOCIAL_LINKS.EMAIL}`}>
          寄送 Email
        </Link>
      </div>
    </section>
  );
};

export default CallToActionSection;
