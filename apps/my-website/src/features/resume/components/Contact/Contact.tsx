"use client";

import { SOCIAL_LINKS } from "@packages/shared/constants";
import { cn } from "@packages/shared/utils";
import { motion } from "framer-motion";
import { CheckCircle, Copy, Heart, Mail } from "lucide-react";
import React, { useState } from "react";

import { ContactLinks } from "@/components/shared";

import type { ContactContent } from "../../types/resumeContent.types";

interface ContactProps {
  backgroundClass: string;
  contactLinkLocale: "en" | "zh-Hant";
  content: ContactContent;
  sectionId: string;
}

const Contact: React.FC<ContactProps> = ({ backgroundClass, contactLinkLocale, content, sectionId }) => {
  const [copied, setCopied] = useState(false);
  const email = SOCIAL_LINKS.EMAIL;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    <section className={cn("py-20", backgroundClass)} id={sectionId}>
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-base-content mb-4 text-4xl font-bold">{content.heading}</h2>
          <div className="bg-primary mx-auto mb-6 h-1 w-20" />
          <p className="text-base-content/80 mx-auto max-w-2xl text-lg">{content.description}</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            className="bg-base-100 border-base-content/10 rounded-2xl border p-6 shadow-lg"
            initial={{ opacity: 0, x: -30 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <Mail className="text-primary h-6 w-6" />
              <h3 className="text-base-content text-xl font-semibold">{content.emailHeading}</h3>
            </div>
            <p className="text-base-content/70 mb-4">{content.emailDescription}</p>
            <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className={cn("text-base-content/80 font-mono text-sm break-all md:text-base")}>{email}</span>
                <button className={cn("btn btn-sm ml-2", copied ? "btn-success" : "btn-primary")} onClick={copyEmail}>
                  {copied ? (
                    <>
                      <CheckCircle className="mr-1 h-4 w-4" />
                      {content.copiedLabel}
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1 h-4 w-4" />
                      {content.copyLabel}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-base-100 border-base-content/10 rounded-2xl border p-6 shadow-lg"
            initial={{ opacity: 0, x: 30 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <Heart className="text-primary h-6 w-6" />
              <h3 className="text-base-content text-xl font-semibold">{content.platformsHeading}</h3>
            </div>
            <p className="text-base-content/70 mb-6">{content.platformsDescription}</p>
            <div className="flex justify-center gap-4">
              <ContactLinks locale={contactLinkLocale} variant="circle" />
            </div>
            <div className="mt-6 text-center">
              <div className="text-base-content/60 grid grid-cols-2 gap-2 text-sm">
                {content.platformDescriptions.map((description) => (
                  <div key={description}>{description}</div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="bg-base-100 border-base-content/10 mx-auto max-w-2xl rounded-xl border p-6">
            <p className="text-base-content/70 text-sm leading-relaxed">
              <strong>{content.availability.rolesLabel}</strong> {content.availability.rolesValue}
              <br />
              <strong>{content.availability.skillsLabel}</strong> {content.availability.skillsValue}
              <br />
              <strong>{content.availability.responseLabel}</strong> {content.availability.responseValue}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
