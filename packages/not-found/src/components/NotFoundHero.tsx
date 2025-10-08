"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import React from "react";

const NotFoundHero: React.FC = () => {
  return (
    <div className="card bg-base-100/80 shadow-2xl backdrop-blur-sm">
      <div className="card-body max-w-2xl text-center">
        {/* 404 數字 */}
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-primary text-8xl font-bold lg:text-9xl">404</h1>
        </motion.div>

        {/* 標題 */}
        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="text-base-content mb-4 text-3xl font-bold lg:text-4xl"
          initial={{ opacity: 0, y: 30 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          頁面不見了
        </motion.h2>

        {/* 描述 */}
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="text-base-content/70 mb-8 text-lg leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          看起來您要找的頁面已經搬家了，或者從來沒有存在過。
          <br />
          別擔心，讓我們一起找到正確的方向！
        </motion.p>

        {/* 按鈕組 */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.button
            className="btn btn-primary btn-lg group relative overflow-hidden shadow-md transition-all hover:shadow-xl"
            onClick={() => window.history.back()}
            whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)", scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span className="relative z-10">返回上頁</span>
            <motion.div
              className="from-primary to-secondary pointer-events-none absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20"
              initial={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              whileHover={{ x: "0%" }}
            />
          </motion.button>

          <Link href="/">
            <motion.button
              className="btn btn-outline btn-lg shadow-md transition-all hover:shadow-xl"
              whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)", scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="mr-2 h-5 w-5" />
              回到首頁
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundHero;
