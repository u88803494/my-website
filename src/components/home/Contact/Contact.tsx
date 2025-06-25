"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Copy, CheckCircle, Mail, Heart } from "lucide-react";
import ContactLinks from "@/components/shared/ContactLinks";
import { SOCIAL_LINKS } from "@/constants/socialLinks";

interface ContactProps {
  backgroundClass: string;
  sectionId: string;
}

const Contact: React.FC<ContactProps> = ({ backgroundClass, sectionId }) => {
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
    <section id={sectionId} className={clsx("py-20", backgroundClass)}>
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-base-content mb-4">讓我們一起工作</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
            如果您對我的經歷感興趣，或者有任何工作機會，歡迎與我聊聊！我正在尋找遠端工作或全職職位。
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            className="bg-base-100 p-6 rounded-2xl shadow-lg border border-base-content/10"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold text-base-content">Email</h3>
            </div>
            <p className="text-base-content/70 mb-4">最佳的聯絡方式，我通常會在24小時內回覆</p>
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <span className={clsx("font-mono text-base-content/80 text-sm md:text-base break-all")}>{email}</span>
                <button onClick={copyEmail} className={clsx("btn btn-sm ml-2", copied ? "btn-success" : "btn-primary")}>
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      已複製
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      複製
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-base-100 p-6 rounded-2xl shadow-lg border border-base-content/10"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold text-base-content">其他平台</h3>
            </div>
            <p className="text-base-content/70 mb-6">也可以透過以下平台了解更多關於我的資訊</p>
            <div className="flex justify-center gap-4">
              <ContactLinks variant="circle" />
            </div>
            <div className="mt-6 text-center">
              <div className="grid grid-cols-2 gap-2 text-sm text-base-content/60">
                <div>GitHub - 程式碼</div>
                <div>LinkedIn - 履歷</div>
                <div>Medium - 文章</div>
                <div>Email - 直接聯絡</div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-base-100 p-6 rounded-xl border border-base-content/10 max-w-2xl mx-auto">
            <p className="text-base-content/70 text-sm leading-relaxed">
              <strong>尋找職位：</strong> 前端工程師、全端工程師（遠端或現場皆可）
              <br />
              <strong>技能專長：</strong> React、Next.js、TypeScript、前端開發
              <br />
              <strong>回覆時間：</strong> 通常在24小時內回覆郵件
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
