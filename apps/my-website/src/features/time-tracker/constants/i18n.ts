/**
 * 時間追蹤器 i18n 常量
 * 集中管理所有繁體中文介面文字
 */

export const TIME_TRACKER_I18N = {
  // 空狀態
  EMPTY_STATE: {
    ALL_DESCRIPTION: "開始記錄你的時間，查看詳細統計資料",
    ALL_TITLE: "尚無時間記錄",
    WEEKLY_DESCRIPTION: "開始記錄你的時間，查看本週統計資料",
    WEEKLY_TITLE: "本週尚無時間記錄",
  },

  // 統計相關
  STATISTICS: {
    ALL_TITLE: "全部統計",
    CHARACTER_LABEL: "品格",
    READING_LABEL: "閱讀",
    STUDY_LABEL: "學習",
    TOTAL_HOURS_LABEL: "總時數",
    // 週統計摘要
    WEEKLY_SUMMARY: {
      ACTIVITY_TYPES: "活動類型：",
      AVERAGE_TIME: "平均時長：",
      HOURS_UNIT: "小時",
      MINUTES_UNIT: "分鐘",
      TITLE: "本週摘要",
      TOP_ACTIVITY: "最多時間：",
      TOTAL_HOURS: "總時數：",
      TYPES_UNIT: "種",
    },
    WEEKLY_TITLE: "週統計",

    WORKING_LABEL: "工作",
  },

  // 摘要配置文字
  SUMMARY: {
    ACTIVITY_COUNT: "活動類型：",
    AVERAGE_TIME: "平均時長：",
    TOP_ACTIVITY: "最常進行：",
    TOTAL_HOURS: "總時數：",
    TRACKING_START_DATE: "追蹤開始時間：",
  },

  // 頁籤標籤
  TABS: {
    ALL_STATISTICS: "全部統計",
    MAIN: "主要功能",
    WEEKLY_STATS: "週統計",
  },

  // 一般介面
  UI: {
    ADD_RECORD_TITLE: "新增時間記錄",
    COMPLETE: "完成",
    ERROR_MESSAGE: "發生錯誤：{{error}}",
    MAIN_DESCRIPTION: "記錄和分析你的時間分配，提升效率管理",
    MAIN_TITLE: "時間追蹤器",
    OPEN_SETTINGS: "開啟設定",
    RECENT_RECORDS_TITLE: "最近記錄",
    REMAINING_RECORDS: "還有 {{count}} 筆記錄",
    SETTINGS_TITLE: "應用設定",
    SHOW_LESS: "顯示較少",
    SHOW_MORE: "顯示全部",
  },
} as const;
