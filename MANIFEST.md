# CodeBase｜Python × C++ 學習站 v3.12

## 目錄架構
```text
/
├── index.html
├── README.md
├── MANIFEST.md
├── shared/ (style.css, app.js, README.md)
├── topics/ (website-guide.html, cybersecurity.html, linux-apcs.html)
├── security/ (password-lab.html, password-gate.html, field-notes.html, crack-tutorial.html)
├── python/ (index.html, unit01.html ... unit27.html, practice.html)
└── cpp/ (index.html, unit01.html ... unit27.html, practice.html)
```

## v3.5 課程擴充
- Python 與 C++ 各 27 個單元，共 54 個講義頁。
- 每單元包含學習目標、觀念、範例、輸出、逐步閱讀方式、常見錯誤、挑戰與自我檢查。
- 01–10 基礎；11–15 中階；16–20 中高階；21–27 高階挑戰。
- Python 涵蓋遞迴、生成式、stack/queue、前綴和、雙指標、二分搜尋、貪心、DP、圖論、OOP、數論與位元運算。
- C++ 涵蓋 vector、pair、自訂排序、stack/queue、map/set、遞迴回溯、前綴和、滑動視窗、二分搜尋、貪心、DP、圖論與複雜度。
- 預設深色模式，保留多色主題、選擇題、實作題答案與進度保存。

## 線上編輯器
- Python：<https://www.programiz.com/python-programming/online-compiler>
- C++：<https://www.onlinegdb.com/online_c++_compiler>

## 部署
GitHub Pages 設為 `main` 分支的 `/(root)`。靜態網站的程式執行由外部編輯器提供。


## v3.3 更新
- 針對手機、平板與桌面版改善教學頁響應式排版。
- 每個 Unit 的右側「本課程單元」完整列出 27 個單元，並自動標示目前單元。
- 為相關入門單元加入已核對的 ZeroJudge 延伸實作連結。


## v3.5 UI 更新
- 導覽按鈕獨立放在 Logo 下方，不再與品牌標誌同列。
- 更新頂部列高度、側邊欄起點及主要內容留白。
- 桌機、平板、手機皆保留深色主題並調整響應式間距。

- `linux-apcs.html`：APCS 考場 Linux 操作入門（終端機、Python、C++ 編譯、測試與錯誤排查）。


## v3.8 更新
- 首頁程式碼逐行動畫（約 5 秒，播放一次）。
- 深色／淺色模式切換增加平滑過渡效果。
- 支援減少動態效果的系統偏好設定。


## v3.11 更新
- 每日一題作答狀態按本機日期保存；當日完成後顯示「今日題目已作答」，刷新頁面仍保留狀態。
- 新增網站如何運作、資訊安全入門、密碼設計與安全測試三個完整教學頁。
- 新單元加入首頁學習卡片與側邊導覽，使用共用樣式並支援深淺色模式。
- 密碼範例檢查只在瀏覽器中執行；教學限於虛構資料與授權測試，不提供攻擊真實帳號的流程。


## v3.11 更新
- ZIP 解壓縮後直接看到網站檔案，不再多包一層專案資料夾。
- 整理分類：`python/`、`cpp/`、`topics/`（網站運作、資安、Linux）、`security/`（密碼實驗與解謎）、`shared/`（共用 CSS/JS）。
- 新增 `security/password-gate.html` 前端密碼鎖解謎，以及 `security/field-notes.html` 分段式教學筆記。
- 明確說明靜態前端密碼鎖不適用於真實機密；教學僅供授權練習。

- `security/crack-tutorial.html`：一步一步拆解密碼鎖，包含瀏覽器原始碼檢視、SHA-256 說明與純瀏覽器互動式候選清單比對教學。


## v3.12 更新
- 密碼拆解教學完全改用 HTML、CSS、JavaScript 與瀏覽器 Web Crypto API，不需要 Python。
- 互動功能包括 SHA-256 計算、固定虛構候選清單比對、程式碼逐行解說。
- GitHub Pages HTTPS 部署後可直接操作。
- 移除 ZIP 中重複的舊版巢狀專案資料夾。
