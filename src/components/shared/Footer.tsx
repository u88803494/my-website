// import Link from 'next/link';
import ContactLinks from "@/components/shared/ContactLinks";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-br from-base-300/30 via-base-200 to-base-100/50 text-base-content">
      <div className="container mx-auto px-6 py-12">
        {/* 主要內容區 */}
        <div className="flex flex-col items-center space-y-8">
          {/* 個人資訊區塊 */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Henry Lee</h3>
            <p className="text-base-content/70 text-lg">前端工程師</p>
            <p className="text-base-content/60 text-sm mt-1 max-w-md">
              專精於 Next.js、React、TypeScript 開發，致力於打造高效能、高可維護性的網頁應用
            </p>
          </div>

          {/* 分隔線 */}
          <div className="w-24 h-1 bg-primary rounded-full"></div>

          {/* 社交連結 */}
          <div className="flex flex-col items-center space-y-4">
            <p className="text-base-content/70 font-medium">讓我們保持聯繫</p>
            <div className="flex justify-center gap-6">
              <ContactLinks variant="circle" />
            </div>
          </div>

          {/* 分隔線 */}
          <div className="w-full border-t border-base-content/10"></div>

          {/* 版權資訊 */}
          <div className="text-center text-sm text-base-content/60">
            <p>© {currentYear} Henry Lee. All rights reserved.</p>
            <p className="mt-1">Built with Next.js & TypeScript</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
