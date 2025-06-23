import Image from "next/image";
import ContactLinks from "@/components/shared/ContactLinks";

const HeroSection = () => {
  return (
    <section className="hero min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
      <div className="hero-content flex-col lg:flex-row-reverse gap-8 lg:gap-16">
        {/* Profile Image */}
        <div className="avatar">
          <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full ring-4 ring-primary/20 shadow-2xl overflow-hidden">
            <Image
              src="/images/my-photo.jpeg"
              alt="Henry Lee's photo"
              width={256}
              height={256}
              className="w-full h-full object-cover object-top"
              priority
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="text-center lg:text-left max-w-2xl flex flex-col gap-6">
          <h1 className="text-4xl lg:text-6xl font-bold mb-2">
            <span>
              {"Hi, I'm "}
            </span>
            <span className="text-primary">Henry Lee</span>
          </h1>
          <h2 className="text-xl lg:text-2xl font-semibold text-secondary mb-2">
            前端工程師
          </h2>
          <div className="text-base lg:text-lg text-base-content/80 leading-relaxed space-y-4">
            <p>
              具備四年 Web 開發經驗，專精於使用 <b>Next.js</b> 與 <b>TypeScript</b> 打造高效能、高可維護性的應用。
            </p>
            <p>
              擅長主導前端架構與效能優化，曾透過創新開發方式，成功將專案成本降低 <b>50%</b>，並將關鍵頁面讀取時間由 <b>5 秒以上</b> 縮短至 <b>1 秒內</b>。
            </p>
            <p>
              團隊協作方面，負責指導兩名團隊成員導入新技術、建立標準化開發流程以提升程式碼品質，也致力於提升團隊整體生產力。
            </p>
            <p>
              經歷一段個人成長與沉澱後，對職涯方向有了更清晰的規劃，已準備好重返職場，期待貢獻我的技術與經驗，為團隊創造實質價值。
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-2">
            <button className="btn btn-primary btn-lg">
              View My Work
            </button>
            <button className="btn btn-outline btn-lg">
              Download Resume
            </button>
          </div>
          
          {/* Social Links */}
          <div className="flex justify-center lg:justify-start gap-4 mt-6">
            <ContactLinks variant="circle" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 
