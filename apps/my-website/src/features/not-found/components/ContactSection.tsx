"use client";

import { m } from "framer-motion";

import ContactLinks from "@/components/shared/ContactLinks";

const ContactSection: React.FC = () => {
  return (
    <m.div
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
      initial={{ opacity: 0, y: 30 }}
      transition={{ delay: 1.4, duration: 0.6 }}
    >
      <p className="text-base-content/60 mb-4 text-sm">如果這是個錯誤，歡迎聯絡我</p>
      <ContactLinks variant="circle" />
    </m.div>
  );
};

export default ContactSection;
