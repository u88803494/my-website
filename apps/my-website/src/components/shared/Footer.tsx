import ContactLinks from "@/components/shared/ContactLinks";
import type { FooterContent } from "@/components/shared/siteChromeContent";

interface FooterProps {
  content: FooterContent;
  locale: "en" | "zh-Hant";
}

const Footer: React.FC<FooterProps> = ({ content, locale }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="from-base-300/30 via-base-200 to-base-100/50 text-base-content w-full bg-gradient-to-br">
      <div className="container mx-auto px-6 py-12">
        {/* 主要內容區 */}
        <div className="flex flex-col items-center space-y-8">
          {/* 個人資訊區塊 */}
          <div className="text-center">
            <h3 className="mb-2 text-2xl font-bold">Henry Lee</h3>
            <p className="text-base-content/70 text-lg">{content.role}</p>
            <p className="text-base-content/60 mt-1 max-w-md text-sm">{content.summary}</p>
          </div>

          {/* 分隔線 */}
          <div className="bg-primary h-1 w-24 rounded-full" />

          {/* 社交連結 */}
          <div className="flex flex-col items-center space-y-4">
            <p className="text-base-content/70 font-medium">{content.connectLabel}</p>
            <div className="flex justify-center gap-6">
              <ContactLinks locale={locale} variant="circle" />
            </div>
          </div>

          {/* 分隔線 */}
          <div className="border-base-content/10 w-full border-t" />

          {/* 版權資訊 */}
          <div className="text-base-content/60 text-center text-sm">
            <p>© {currentYear} Henry Lee. All rights reserved.</p>
            <p className="mt-1">Built with Next.js & TypeScript</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
