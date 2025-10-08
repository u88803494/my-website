// 該文件提供時間追蹤功能的本地型別定義
// 以避免與共享包中的型別衝突

export interface TimeCalculationResult {
  duration: number;
  isValid: boolean;
  error?: string;
}

export interface Tab {
  id: string;
  label: string;
}
