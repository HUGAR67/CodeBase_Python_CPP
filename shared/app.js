(() => {
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const progressKey = "codebase-progress-v2";
  const taskProgressKey = "codebase-coding-tasks-v1";
  const readProgress = () => { try { return JSON.parse(localStorage.getItem(progressKey) || '{"python":[],"cpp":[]}'); } catch { return {python:[], cpp:[]}; } };
  const saveProgress = data => localStorage.setItem(progressKey, JSON.stringify(data));
  const allUnits = {python:27, cpp:27};
  const refreshProgress = () => {
    const data = readProgress(); let total = 0;
    Object.keys(allUnits).forEach(lang => {
      const count = (data[lang] || []).length; total += count;
      const bar = $(`#${lang}Progress`), label = $(`#${lang}ProgressText`);
      if (bar) bar.style.width = `${Math.min(100, count / allUnits[lang] * 100)}%`;
      if (label) label.textContent = `${count} / ${allUnits[lang]}`;
    });
    const complete = $("#completedCount"); if (complete) complete.textContent = total;
    $$(".unit-card[data-lang][data-unit]").forEach(card => {
      const done = (data[card.dataset.lang] || []).includes(card.dataset.unit);
      const status = $(".unit-status", card); if (status) status.textContent = done ? "✓ 已完成" : "○ 尚未完成";
      card.classList.toggle("is-complete", done);
    });
  };
  const markComplete = (lang, unit) => { const data = readProgress(); if (!data[lang]) data[lang] = []; if (!data[lang].includes(unit)) data[lang].push(unit); saveProgress(data); refreshProgress(); };
  const themeButton = $("#themeToggle");
  const applyTheme = theme => { document.body.classList.toggle("light-mode", theme === "light"); if (themeButton) themeButton.textContent = theme === "light" ? "☀ 淺色" : "☾ 深色"; localStorage.setItem("codebase-theme", theme); };
  applyTheme(localStorage.getItem("codebase-theme") || "dark");
  if (themeButton) themeButton.addEventListener("click", () => applyTheme(document.body.classList.contains("light-mode") ? "dark" : "light"));
  // Keep the lesson table of contents synchronized with the actual unit URL.
  const unitMatch = location.pathname.match(/unit(\d{2})\.html$/i);
  if (unitMatch) {
    const currentUnit = unitMatch[1];
    $$(".lesson-toc a[data-current-unit]").forEach(link => {
      const active = link.dataset.currentUnit === currentUnit;
      link.classList.toggle("is-current", active);
      if (active) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current");
    });
    const indicator = $(".toc-current"); if (indicator) indicator.textContent = `UNIT ${currentUnit} / 27`;
  }
  const menuToggle = $("#menuToggle"), sidebar = $("#sidebar");
  const setMenu = open => { if (!sidebar) return; sidebar.classList.toggle("closed", !open); sidebar.classList.toggle("open", open); document.body.classList.toggle("sidebar-closed", !open); if (menuToggle) menuToggle.setAttribute("aria-expanded", String(open)); };
  if (sidebar) $$(".side-link", sidebar).forEach(link => link.addEventListener("click", () => { if (window.matchMedia("(max-width: 800px)").matches) { sidebar.classList.remove("open"); if (menuToggle) menuToggle.setAttribute("aria-expanded", "false"); } }));
  if (menuToggle && sidebar) {
    const saved = localStorage.getItem("codebase-sidebar"); setMenu(saved !== "closed");
    menuToggle.addEventListener("click", () => { const open = sidebar.classList.contains("closed") || !sidebar.classList.contains("open"); setMenu(open); localStorage.setItem("codebase-sidebar", open ? "open" : "closed"); });
    document.addEventListener("click", event => { if (window.innerWidth <= 800 && sidebar.classList.contains("open") && !sidebar.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false); });
    $$(".sidebar a").forEach(link => link.addEventListener("click", () => { if (window.innerWidth <= 800) { setMenu(false); localStorage.setItem("codebase-sidebar", "closed"); } }));
  }
  const dailyQuestions = [
    {lang:"PYTHON · 入門",q:"執行 print(2 + 3) 時，畫面會顯示什麼？",opts:["2 + 3","5","23","發生錯誤"],answer:"b",why:"+ 會先把兩個數字相加，print() 再顯示結果 5。"},
    {lang:"PYTHON · 變數",q:"x = 4; x += 3 之後，x 是多少？",opts:["1","4","7","12"],answer:"c",why:"x += 3 等同於 x = x + 3，所以結果是 7。"},
    {lang:"PYTHON · 迴圈",q:"for i in range(3) 會依序取得哪些值？",opts:["1, 2, 3","0, 1, 2","0, 1, 2, 3","3"],answer:"b",why:"range(3) 從 0 開始，並且不包含終點 3。"},
    {lang:"C++ · 輸出",q:"C++ 中要將文字輸出到螢幕，通常使用？",opts:["cin","cout","input","printfline"],answer:"b",why:"cout 搭配 << 將內容輸出；cin 則通常用來讀取輸入。"},
    {lang:"PYTHON · 條件",q:"判斷 a 是否等於 10，應該使用？",opts:["a = 10","a == 10","a => 10","a === 10"],answer:"b",why:"== 是比較運算子，單一 = 是指定值。"},
    {lang:"C++ · 陣列",q:"C++ 陣列第一個元素的索引通常是？",opts:["0","1","-1","由編譯器決定"],answer:"a",why:"C++ 陣列索引從 0 開始。"},
    {lang:"PYTHON · 串列",q:"想把 8 加到 nums 串列末尾，常用哪個方法？",opts:["nums.add(8)","nums.append(8)","nums.push(8)","nums.end(8)"],answer:"b",why:"Python 串列使用 append() 在末尾新增元素。"},
    {lang:"C++ · 整數除法",q:"int x = 7 / 2; 最後 x 的值是？",opts:["3.5","4","3","2"],answer:"c",why:"兩個運算元都是整數時，結果會是整數 3。"},
    {lang:"PYTHON · 函式",q:"函式要回傳結果，通常使用？",opts:["show","return","input","break"],answer:"b",why:"return 將結果交回呼叫函式的位置。"},
    {lang:"C++ · 迴圈",q:"要立刻離開目前的迴圈，可以使用？",opts:["continue","break","case","next"],answer:"b",why:"break 會結束目前所在的迴圈。"}
  ];
  const dailyQuiz = $("#lobbyQuiz");
  if (dailyQuiz) {
    const today = new Date(); const day = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000), item = dailyQuestions[day % dailyQuestions.length];
    const heading = $("#dailyQuestion"), tag = $(".quiz-meta .tag", dailyQuiz), options = $(".quiz-options", dailyQuiz), feedback = $("#lobbyFeedback"), dateLabel = $("#dailyDate");
    if (heading) heading.textContent = item.q;
    if (tag) tag.textContent = item.lang;
    if (dateLabel) dateLabel.textContent = new Date().toLocaleDateString("zh-TW", {month:"numeric",day:"numeric"});
    if (options) options.innerHTML = item.opts.map((opt,i) => `<button class="quiz-option" data-answer="${String.fromCharCode(97+i)}">${String.fromCharCode(65+i)}. ${opt}</button>`).join("");
    dailyQuiz.dataset.answer = item.answer; dailyQuiz.dataset.explanation = item.why;
    const bindDaily = () => $$(".quiz-option", dailyQuiz).forEach(option => {
      option.setAttribute("aria-pressed", "false");
      option.addEventListener("click", () => {
        $$(".quiz-option", dailyQuiz).forEach(btn => { btn.classList.remove("correct","incorrect","chosen"); btn.setAttribute("aria-pressed", "false"); });
        const correct = option.dataset.answer === item.answer; option.classList.add(correct ? "correct" : "incorrect", "chosen"); option.setAttribute("aria-pressed", "true");
        if (feedback) feedback.textContent = (correct ? "答對了！" : "這個答案不正確，可以直接改選其他選項。") + item.why;
      });
    });
    bindDaily();
    const reset = $("#resetDailyQuiz"); if (reset) reset.addEventListener("click", () => { $$(".quiz-option",dailyQuiz).forEach(btn => { btn.classList.remove("correct","incorrect","chosen"); btn.setAttribute("aria-pressed", "false"); }); if (feedback) feedback.textContent = "答案已清除，再選一次吧！"; });
  }
  // 單一按鈕完成本單元並前往下一個單元；完成時顯示綠色光效與粒子。
  $$(".lesson-next-complete").forEach(button => button.addEventListener("click", () => {
    if (button.dataset.busy === "true") return;
    button.dataset.busy = "true";
    markComplete(button.dataset.lang, button.dataset.unit);
    button.classList.add("completed-button");
    button.textContent = "✓ 已完成！正在前往…";
    const lesson = $(".lesson-main");
    if (lesson) lesson.classList.add("lesson-just-completed");
    const rect = button.getBoundingClientRect();
    const colors = ["#35df91", "#83f5b8", "#19b878", "#b4ffd6", "#4cc9a2"];
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (let i = 0; i < 22; i++) {
        const spark = document.createElement("span");
        spark.className = "completion-spark";
        spark.style.setProperty("--spark-x", `${rect.left + rect.width * 0.5}px`);
        spark.style.setProperty("--spark-y", `${rect.top + rect.height * 0.5}px`);
        spark.style.setProperty("--spark-dx", `${Math.round((Math.random() - 0.5) * 240)}px`);
        spark.style.setProperty("--spark-dy", `${Math.round((Math.random() - 0.75) * 190)}px`);
        spark.style.setProperty("--spark-color", colors[i % colors.length]);
        document.body.appendChild(spark);
        window.setTimeout(() => spark.remove(), 900);
      }
    }
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 760;
    window.setTimeout(() => { window.location.href = button.dataset.next; }, delay);
  }));
  const resetQuestion = question => {
    $$(".quiz-option", question).forEach(btn => { btn.classList.remove("correct", "incorrect", "chosen"); btn.setAttribute("aria-pressed", "false"); });
    const box = $(".answer-explanation",question); if (box) { box.classList.remove("show"); box.textContent = ""; }
    question.dataset.answered = "false";
  };
  // 選擇題永遠可以改選；每次點擊都重新判斷，不必先按「重新作答」。
  $$(".practice-question").forEach(question => {
    const answer = question.dataset.answer;
    $$(".quiz-option", question).forEach(option => {
      option.setAttribute("aria-pressed", "false");
      option.addEventListener("click", () => {
        $$(".quiz-option", question).forEach(item => { item.classList.remove("correct", "incorrect", "chosen"); item.setAttribute("aria-pressed", "false"); });
        const correct = option.dataset.answer === answer;
        option.classList.add(correct ? "correct" : "incorrect", "chosen");
        option.setAttribute("aria-pressed", "true");
        question.dataset.answered = "true";
        const explanation = $(".answer-explanation", question);
        if (explanation) { explanation.classList.add("show"); explanation.textContent = (correct ? "答對了！" : "這次選的是這個答案；你可以直接再點其他選項修改。") + (question.dataset.explanation || "繼續保持！"); }
      });
    });
    const reset = $(".quiz-reset", question); if (reset) reset.addEventListener("click", () => resetQuestion(question));
  });
  const resetAll = $("#resetAllQuestions"); if (resetAll) resetAll.addEventListener("click", () => $$(".practice-question").forEach(resetQuestion));
  const resetLearningProgress = $("#resetLearningProgress");
  if (resetLearningProgress) resetLearningProgress.addEventListener("click", () => {
    const ok = window.confirm("確定要清除已讀完的單元與實作題完成紀錄嗎？這不會更改你的主題設定。此操作無法復原。");
    if (!ok) return;
    localStorage.removeItem(progressKey);
    localStorage.removeItem(taskProgressKey);
    refreshProgress();
    $$(".coding-task[data-task]").forEach(card => { const button = $(".task-done", card); if (button) { button.classList.remove("done"); button.setAttribute("aria-pressed", "false"); button.textContent = "○ 標記完成"; } });
    resetLearningProgress.textContent = "✓ 已重設紀錄";
    window.setTimeout(() => { resetLearningProgress.textContent = "↺ 重設學習紀錄"; }, 1800);
  });

  // 首頁程式應用動畫：每隔數秒輪播一種真實的程式應用，也可手動點選下方圓點。
  const showcase = $("#showcaseStage");
  if (showcase) {
    const scenes = [
      {emoji:"🎮",title:"遊戲開發",desc:"讓規則變成可以玩的世界",a:"🕹️",la:"遊戲角色",b:"⚡",lb:"互動邏輯",c:"🏆",lc:"玩家成就"},
      {emoji:"🌐",title:"網站開發",desc:"打造自己的網站與網路工具",a:"🎨",la:"畫面設計",b:"🧩",lb:"互動功能",c:"🚀",lc:"正式上線"},
      {emoji:"📊",title:"資料分析",desc:"用資料找出規律、做出判斷",a:"📈",la:"趨勢圖表",b:"🔎",lb:"找出規律",c:"💡",lc:"數據洞察"},
      {emoji:"🤖",title:"自動化與 AI",desc:"讓重複工作自動完成，探索智慧應用",a:"⚙️",la:"自動流程",b:"🧠",lb:"智慧模型",c:"✨",lc:"節省時間"}
    ];
    let sceneIndex = 0;
    const renderScene = index => {
      sceneIndex = index;
      const scene = scenes[index];
      [["showcaseEmoji",scene.emoji],["showcaseTitle",scene.title],["showcaseDescription",scene.desc],["showcaseTagA",scene.a],["showcaseLabelA",scene.la],["showcaseTagB",scene.b],["showcaseLabelB",scene.lb],["showcaseTagC",scene.c],["showcaseLabelC",scene.lc]].forEach(([id,value]) => { const node = $("#"+id); if (node) node.textContent = value; });
      $$(".showcase-dot").forEach((dot,i) => { dot.classList.toggle("active",i===index); dot.setAttribute("aria-pressed",String(i===index)); });
      showcase.classList.remove("scene-enter"); void showcase.offsetWidth; showcase.classList.add("scene-enter");
    };
    $$(".showcase-dot").forEach(dot => dot.addEventListener("click", () => renderScene(Number(dot.dataset.showcase))));
    let sceneTimer = window.setInterval(() => renderScene((sceneIndex + 1) % scenes.length), 4200);
    showcase.addEventListener("mouseenter", () => window.clearInterval(sceneTimer));
    showcase.addEventListener("mouseleave", () => { window.clearInterval(sceneTimer); sceneTimer = window.setInterval(() => renderScene((sceneIndex + 1) % scenes.length), 4200); });
    renderScene(0);
  }

  // 單元範例：一鍵複製第一個範例程式，方便貼到線上編輯器。
  $$(".copy-code-btn").forEach(button => button.addEventListener("click", async () => {
    const lesson = button.closest(".lesson-main");
    const codeNode = lesson ? $("pre.code-block code", lesson) : null;
    if (!codeNode) return;
    const code = codeNode.textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(code);
      else {
        const area = document.createElement("textarea");
        area.value = code; area.setAttribute("readonly", "");
        area.style.position = "fixed"; area.style.opacity = "0";
        document.body.appendChild(area); area.select();
        const ok = document.execCommand("copy"); area.remove();
        if (!ok) throw new Error("copy failed");
      }
      button.textContent = "✓ 已複製範例程式"; button.classList.add("copied");
      window.setTimeout(() => { button.textContent = "複製範例程式"; button.classList.remove("copied"); }, 1800);
    } catch { button.textContent = "請手動選取程式碼複製"; }
  }));

  // 實作題：顯示／隱藏參考解答、複製程式碼到線上編輯器。
  $$(".coding-task[data-task]").forEach(card => {
    const toggle = $(".solution-toggle", card);
    const panel = $(".solution-panel", card);
    if (toggle && panel) {
      toggle.addEventListener("click", () => {
        const opening = panel.hidden;
        panel.hidden = !opening;
        toggle.setAttribute("aria-expanded", String(opening));
        toggle.textContent = opening ? "隱藏答案與解析" : "顯示答案與解析";
      });
    }
    const copyButton = $(".copy-solution", card);
    const codeNode = $(".solution-code code", card);
    if (copyButton && codeNode) {
      copyButton.addEventListener("click", async () => {
        const code = codeNode.textContent;
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(code);
          } else {
            const area = document.createElement("textarea");
            area.value = code; area.setAttribute("readonly", "");
            area.style.position = "fixed"; area.style.opacity = "0";
            document.body.appendChild(area); area.select();
            const ok = document.execCommand("copy"); area.remove();
            if (!ok) throw new Error("copy failed");
          }
          copyButton.textContent = "✓ 已複製程式碼";
          copyButton.classList.add("copied");
        } catch (error) {
          copyButton.textContent = "請手動選取程式碼複製";
        }
      });
    }
  });

  refreshProgress();

  const readTaskProgress = () => { try { return JSON.parse(localStorage.getItem(taskProgressKey) || "[]"); } catch { return []; } };
  const completedTasks = readTaskProgress();
  const refreshTaskButtons = () => $$(".coding-task[data-task]").forEach(card => {
    const button = $(".task-done", card); if (!button) return;
    const done = completedTasks.includes(card.dataset.task);
    button.classList.toggle("done", done); button.setAttribute("aria-pressed", String(done)); button.textContent = done ? "✓ 已完成" : "○ 標記完成";
  });
  $$(".coding-task[data-task]").forEach(card => {
    const button = $(".task-done", card); if (!button) return;
    button.addEventListener("click", () => {
      const id = card.dataset.task, index = completedTasks.indexOf(id);
      if (index >= 0) completedTasks.splice(index, 1); else completedTasks.push(id);
      localStorage.setItem(taskProgressKey, JSON.stringify(completedTasks)); refreshTaskButtons();
    });
  });
  refreshTaskButtons();
})();