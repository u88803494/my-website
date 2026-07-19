/**
 * AI Chat Layout
 *
 * 獨立的 layout，讓 AI Chat 頁面有沉浸式體驗，
 * 輸入框始終可見不需要捲動。
 * 使用 calc(100vh - navbar height) 來填滿可見視窗。
 * Footer 會被 ConditionalFooter 自動隱藏。
 */
const AIChatLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="bg-base-100 flex h-[calc(100vh-4rem)] flex-col">{children}</div>;
};

export default AIChatLayout;
