"use client";

import { ContactLinks } from "@/components/shared";
import { SOCIAL_LINKS } from "@packages/shared/constants";
import { cn } from "@packages/shared/utils";
import { motion } from "framer-motion";
import { CheckCircle, Copy, Heart, Mail } from "lucide-react";
import React, { useState } from "react";

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
    <section className={cn("py-20", backgroundClass)} id={sectionId}>
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-base-content mb-4 text-4xl font-bold">讓我們一起工作</h2>
          <div className="bg-primary mx-auto mb-6 h-1 w-20" />
          <p className="text-base-content/80 mx-auto max-w-2xl text-lg">
            如果您對我的經歷感興趣，或者有任何工作機會，歡迎與我聊聊！我正在尋找遠端工作或全職職位。
          </p>
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
              <h3 className="text-base-content text-xl font-semibold">Email</h3>
            </div>
            <p className="text-base-content/70 mb-4">最佳的聯絡方式，我通常會在24小時內回覆</p>
            <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className={cn("text-base-content/80 font-mono text-sm break-all md:text-base")}>{email}</span>
                <button className={cn("btn btn-sm ml-2", copied ? "btn-success" : "btn-primary")} onClick={copyEmail}>
                  {copied ? (
                    <>
                      <CheckCircle className="mr-1 h-4 w-4" />
                      已複製
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1 h-4 w-4" />
                      複製
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
              <h3 className="text-base-content text-xl font-semibold">其他平台</h3>
            </div>
            <p className="text-base-content/70 mb-6">也可以透過以下平台了解更多關於我的資訊</p>
            <div className="flex justify-center gap-4">
              <ContactLinks variant="circle" />
            </div>
            <div className="mt-6 text-center">
              <div className="text-base-content/60 grid grid-cols-2 gap-2 text-sm">
                <div>GitHub - 程式碼</div>
                <div>LinkedIn - 履歷</div>
                <div>Medium - 文章</div>
                <div>Email - 直接聯絡</div>
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
