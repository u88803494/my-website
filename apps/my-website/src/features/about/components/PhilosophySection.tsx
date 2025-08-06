"use client";

import { m } from "framer-motion";
import { BrainCircuit, MessageSquareQuote, Share2, Users } from "lucide-react";
import React from "react";

interface Philosophy {
  description: string;
  icon: React.ReactNode;
  title: string;
}

const philosophies: Philosophy[] = [
  {
    description:
      "我相信最好的程式碼本身就是最好的文件。我致力於撰寫清晰、結構化且易於理解的程式碼，不僅是為了讓機器執行，更是為了促進團隊成員之間以及與未來自己之間的高效溝通。",
    icon: <MessageSquareQuote className="text-primary h-8 w-8" />,
    title: "程式碼即溝通",
  },
  {
    description:
      "技術的最終目的是服務於人。我堅持從使用者的角度出發，思考每一個互動細節，打造不僅功能強大，而且直觀、易用的產品。",
    icon: <Users className="text-primary h-8 w-8" />,
    title: "使用者中心的設計",
  },
  {
    description:
      "我積極擁抱 AI 工具來提升開發效率，將重複性工作自動化，讓我能更專注於解決複雜的業務邏輯與創造性的挑戰。",
    icon: <BrainCircuit className="text-primary h-8 w-8" />,
    title: "AI 協作新範式",
  },
  {
    description: "我相信分享是最好的學習方式。我樂於將我的學習心得與實踐經驗發表在 Medium 上，與社群一同成長。",
    icon: <Share2 className="text-primary h-8 w-8" />,
    title: "分享與成長",
  },
];

const PhilosophyCard: React.FC<{ index: number; item: Philosophy }> = ({ index, item }) => (
  <m.div
    animate={{ opacity: 1, y: 0 }}
    className="card border-base-300 bg-base-100 h-full border shadow-sm transition-all duration-300"
    initial={{ opacity: 0, y: 30 }}
    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
    whileHover={{
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      scale: 1.02,
      transition: { duration: 0.3 },
    }}
  >
    <div className="card-body">
      <m.div className="mb-4" transition={{ duration: 0.3 }} whileHover={{ rotate: 5, scale: 1.1 }}>
        {item.icon}
      </m.div>
      <h4 className="card-title mb-2">{item.title}</h4>
      <p className="text-base-content/80">{item.description}</p>
    </div>
  </m.div>
);

const PhilosophySection = () => {
  return (
    <section className="mb-12">
      <m.h3
        animate={{ opacity: 1, y: 0 }}
        className="border-primary/20 mb-6 border-b-2 pb-2 text-2xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        我的開發理念
      </m.h3>
      <div className="grid gap-6 sm:grid-cols-2">
        {philosophies.map((item, index) => (
          <PhilosophyCard index={index} item={item} key={item.title} />
        ))}
      </div>
    </section>
  );
};

export default PhilosophySection;
