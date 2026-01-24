"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import ContactLinks from "@/components/shared/ContactLinks";

const ContactSection: React.FC = () => {
  const t = useTranslations("NotFound");

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
      initial={{ opacity: 0, y: 30 }}
      transition={{ delay: 1.4, duration: 0.6 }}
    >
      <p className="text-base-content/60 mb-4 text-sm">{t("contactIfError")}</p>
      <ContactLinks variant="circle" />
    </motion.div>
  );
};

export default ContactSection;
