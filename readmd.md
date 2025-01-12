# 健身教練系統 (Fitness Trainer System)

一個基於 React + TypeScript 開發的健身教練管理系統，提供運動記錄、視頻管理和用戶管理等功能。

## 功能特點

- 🔐 多角色用戶系統

  - 管理員：完整系統管理權限
  - 教練：運動指導、學員課程管理和學員指導
  - 用戶：個人運動記錄和進度追蹤和和視頻訪問
- 📊 儀表板

  - 運動概覽
  - 飲食記錄
  - 教練留言
- 🎥 運動視頻庫

  - 分類瀏覽
  - 視頻搜索
  - 管理員可上傳管理
- 📝 運動記錄

  - 詳細的運動數據記錄
  - 照片上傳
  - 心率監測
  - 進度追蹤
- 👥 用戶管理（管理員專用）

  - 用戶新增/刪除
  - 角色分配
  - 帳號管理

## 技術棧

- 前端框架：React 18
- 開發語言：TypeScript
- 路由管理：React Router 6
- 樣式框架：Tailwind CSS
- 構建工具：Vite
- UI 組件：Headless UI
- 圖標：Heroicons

## 主要功能模塊:

* 用戶認證 (參考 LoginPage.tsx)
* 儀表板功能 (參考 DashboardPage.tsx)
* 運動記錄管理 (參考 WorkoutRecordsPage.tsx)
* 視頻管理 (參考 ExerciseVideosPage.tsx)
* 用戶管理 (參考 UserManagementPage.tsx)

## 開始使用

### 環境要求

- Node.js >= 16
- npm >= 8

### 安裝步驟

1. 克隆專案

### 預設帳號

- 管理員

  - 帳號：admin
  - 密碼：123
- 教練

  - 帳號：trainer
  - 密碼：123
- 普通用戶

  - 帳號：user
  - 密碼：123

## 項目結構

src/

├── api/ # API 請求

├── components/ # 可重用組件

│   ├── dashboard/ # 儀表板相關組件

│   ├── layout/ # 布局相關組件

│   └── tabs/ # 標籤頁組件

├── contexts/ # React Context

├── pages/ # 頁面組件

├── types/ # TypeScript 類型定義

└── utils/ # 工具函數

**## 響應式設計**

**- 支持桌面和移動設備**

**- 自適應佈局**

**- 觸摸友好的界面**

**## 開發指南**

**1. 組件開發**

**   - 使用 TypeScript 類型**

**   - 遵循函數式組件模式**

**   - 實現響應式設計**

**2. 樣式指南**

**   - 使用 Tailwind CSS 類名**

**   - 遵循移動優先原則**

**   - 保持一致的間距和顏色**

**3. 狀態管理**

**   - 使用 React Context**

**   - 本地存儲持久化**

**   - 類型安全的狀態更新**

**## 待開發功能**

**- [ ] 即時通訊功能**

**- [ ] 數據統計報表**

**- [ ] 飲食計劃管理**

**- [ ] 會員訂閱系統**

**- [ ] 多語言支持**

**## 貢獻指南**

**歡迎提交 Pull Request 或創建 Issue。**

**## 授權**

**MIT License**
