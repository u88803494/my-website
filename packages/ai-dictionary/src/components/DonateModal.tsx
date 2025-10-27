"use client";

import { X } from "lucide-react";
import Image from "next/image";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box relative max-w-4xl">
        {/* 關閉按鈕 */}
        <button aria-label="關閉" className="btn btn-sm btn-circle absolute top-2 right-2" onClick={onClose}>
          <X className="h-4 w-4" />
        </button>

        {/* 標題 */}
        <h3 className="mb-8 pr-8 text-center text-2xl font-bold">感謝您的支持！</h3>

        {/* QR Code 容器 */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* 街口支付 */}
          <div className="text-center">
            <div className="mb-4 inline-block rounded-lg bg-white p-4 shadow-md">
              <Image
                alt="街口支付 QR Code"
                className="mx-auto"
                height={200}
                priority
                src="/images/donate/jkopay-barcode.png"
                width={200}
              />
            </div>
            <h4 className="mb-2 text-lg font-semibold">街口支付</h4>
            <p className="text-sm text-slate-600">推薦台灣用戶使用街口支付</p>
          </div>

          {/* Buy Me a Coffee */}
          <div className="text-center">
            <div className="mb-4 inline-block rounded-lg bg-white p-4 shadow-md">
              <Image
                alt="Buy Me a Coffee QR Code"
                className="mx-auto"
                height={200}
                priority
                src="/images/donate/bmc-qr.png"
                width={200}
              />
            </div>
            <h4 className="mb-2 text-lg font-semibold">Buy Me a Coffee</h4>
            <p className="text-sm text-slate-600">海外或信用卡用戶推薦</p>
          </div>
        </div>

        {/* 分隔線 */}
        <div className="divider" />

        {/* 備用連結 */}
        <div className="text-center">
          <p className="mb-4 text-slate-600">QR Code 掃描有問題？試試直接連結：</p>
          <a
            className="link link-primary text-lg"
            href="https://www.buymeacoffee.com/henryleelab"
            rel="noopener noreferrer"
            target="_blank"
          >
            Buy Me a Coffee - henryleelab
          </a>
        </div>
      </div>

      {/* Modal 背景 */}
      <div className="modal-backdrop" onClick={onClose}>
        <button className="cursor-default">close</button>
      </div>
    </div>
  );
};

export default DonateModal;
