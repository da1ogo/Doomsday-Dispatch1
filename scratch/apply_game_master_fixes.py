import re

game_path = r"c:\Users\Dalogo\Desktop\game\game.js"
with open(game_path, "r", encoding="utf-8") as f:
    code = f.read()

code = code.replace("\r\n", "\n")

# 1. Constructor additions
if "this.seenDispatchIds" not in code:
    code = code.replace(
        "    this.debtorArrested = false;",
        "    this.debtorArrested = false;\n    this.seenDispatchIds = [];\n    this.conduits = { heat: 'mine', power: 'water', hydro: 'hydro' };"
    )
    print("1. Added seenDispatchIds and conduits state to constructor.")

# 2. In init(), bind flappy, conduits, window scaling
init_target = """    this.bindMapDirectSupply();
    this.bindDesktopMarqueeSelection();
    this.checkSavedGame();
  }"""

init_replace = """    this.bindMapDirectSupply();
    this.bindDesktopMarqueeSelection();
    this.bindMapConduits();
    this.bindFlappyMinigame();
    this.bindOmegaTerminalActions();
    this.setupWindowResizeScaling();
    this.checkSavedGame();
  }"""

if init_target in code:
    code = code.replace(init_target, init_replace, 1)
    print("2. init() updated with bindMapConduits, bindFlappyMinigame, bindOmegaTerminalActions, setupWindowResizeScaling.")

# 3. Update loadDayDispatches to use getDayDispatches and strictly 7 dispatches without revealing counter
old_load_dispatches = """  loadDayDispatches(day) {
    if (this.dispatchTimer) {
      clearTimeout(this.dispatchTimer);
      this.dispatchTimer = null;
    }
    this.dayDispatchesQueue = DISPATCH_DATABASE.filter(d => d.day === day);
    this.dispatches = [];
    this.currentDispatchIdx = 0;
    this.stats.dispatchesApprovedToday = 0;
    this.radioFineGivenToday = false;
    this.generateDailyTorMarket();

    const planBadge = document.getElementById("shift-plan-badge");
    if (planBadge) planBadge.style.display = "none";

    // Show waiting state initially
    this.renderWaitingForDispatch();

    // Deliver first dispatch after authentic teletype warm-up delay (2.5s)
    if (this.dayDispatchesQueue.length > 0) {
      this.dispatchTimer = setTimeout(() => {
        this.deliverNextDispatch();
      }, 2500);
    }
  }"""

new_load_dispatches = """  loadDayDispatches(day) {
    if (this.dispatchTimer) {
      clearTimeout(this.dispatchTimer);
      this.dispatchTimer = null;
    }
    
    if (!this.seenDispatchIds) this.seenDispatchIds = [];
    
    // Exactly 7 dispatches per day using procedural template pool + fixed story dispatches
    if (typeof getDayDispatches === "function") {
      this.dayDispatchesQueue = getDayDispatches(day, this.seenDispatchIds);
    } else {
      this.dayDispatchesQueue = DISPATCH_DATABASE.filter(d => d.day === day);
    }

    // Record seen IDs so they never repeat in this playthrough
    this.dayDispatchesQueue.forEach(d => {
      if (d.id && !this.seenDispatchIds.includes(d.id)) {
        this.seenDispatchIds.push(d.id);
      }
    });

    this.dispatches = [];
    this.currentDispatchIdx = 0;
    this.stats.dispatchesApprovedToday = 0;
    this.radioFineGivenToday = false;
    this.generateDailyTorMarket();

    const planBadge = document.getElementById("shift-plan-badge");
    if (planBadge) planBadge.style.display = "none";

    // Show waiting state initially
    this.renderWaitingForDispatch();

    // Deliver first dispatch after authentic teletype warm-up delay (2.5s)
    if (this.dayDispatchesQueue.length > 0) {
      this.dispatchTimer = setTimeout(() => {
        this.deliverNextDispatch();
      }, 2500);
    }
  }"""

if old_load_dispatches in code:
    code = code.replace(old_load_dispatches, new_load_dispatches, 1)
    print("3. loadDayDispatches updated for 7 dispatches per day without repeats.")

# 4. Update renderWaitingForDispatch: clean header, NO counter, pointer-events: none on action buttons
old_render_waiting = """  renderWaitingForDispatch() {
    const elSender = document.getElementById("disp-sender");
    const elPriority = document.getElementById("disp-priority");
    const elCounter = document.getElementById("disp-counter");
    const elTopic = document.getElementById("disp-topic");
    const elText = document.getElementById("disp-text");
    const hintsContainer = document.getElementById("disp-telemetry-hints");
    const demandSummaryEl = document.getElementById("disp-demand-summary");

    if (elSender) elSender.textContent = "— ТЕЛЕТАЙП СВЯЗИ —";
    if (elPriority) elPriority.textContent = "ОЖИДАНИЕ";
    if (elCounter) elCounter.textContent = `В очереди смены: ${this.dayDispatchesQueue.length}`;
    if (elTopic) elTopic.textContent = "Формирование входящей депеши на узле связи...";
    if (elText) elText.textContent = 
      `Частота правительственной телеметрии чиста. Следующий пакет депеш формируется шифровальным отделом ЦК.\\n\\nОсталось входящих депеш в плане смены: ${this.dayDispatchesQueue.length}.\\n\\nИспользуйте паузу связи для оперативного контроля Тактической Карты, распределения аварийных запасов складов и чтения служебной почты BunkerMail.`;
    
    if (hintsContainer) hintsContainer.innerHTML = "<em>• Телеметрия: радиоканал чист, датчики секторов в штатном режиме.</em>";
    if (demandSummaryEl) demandSummaryEl.textContent = "— Ожидание запроса —";

    ["fuel", "food", "meds", "ammo", "water"].forEach(res => {
      const el = document.getElementById(`disp-alloc-${res}`);
      if (el) el.textContent = "0";
    });

    const btnApprove = document.getElementById("btn-approve-dispatch");
    const btnReject = document.getElementById("btn-reject-dispatch");
    const btnNext = document.getElementById("btn-next-dispatch");
    if (btnApprove) { btnApprove.disabled = true; btnApprove.style.opacity = "0.4"; btnApprove.style.cursor = "not-allowed"; }
    if (btnReject) { btnReject.disabled = true; btnReject.style.opacity = "0.4"; btnReject.style.cursor = "not-allowed"; }
    if (btnNext) { btnNext.disabled = true; btnNext.style.opacity = "0.4"; btnNext.style.cursor = "not-allowed"; }
  }"""

new_render_waiting = """  renderWaitingForDispatch() {
    const elSender = document.getElementById("disp-sender");
    const elPriority = document.getElementById("disp-priority");
    const elCounter = document.getElementById("disp-counter");
    const elTopic = document.getElementById("disp-topic");
    const elText = document.getElementById("disp-text");
    const hintsContainer = document.getElementById("disp-telemetry-hints");
    const demandSummaryEl = document.getElementById("disp-demand-summary");

    if (elSender) elSender.textContent = "— ТЕЛЕТАЙП СВЯЗИ —";
    if (elPriority) elPriority.textContent = "ОЖИДАНИЕ";
    if (elCounter) elCounter.textContent = "[ВХОДЯЩИЙ КАНАЛ]: ОЖИДАНИЕ ПАКЕТА СВЯЗИ...";
    if (elTopic) elTopic.textContent = "Формирование входящей депеши на узле связи...";
    if (elText) elText.textContent = 
      `Частота правительственной телеметрии чиста. Следующий пакет депеш формируется шифровальным отделом ЦК.\\n\\nИспользуйте паузу связи для оперативного контроля Тактической Карты, управления тумблерами магистралей и распределения аварийных запасов складов.`;
    
    if (hintsContainer) hintsContainer.innerHTML = "<em>• Телеметрия: радиоканал чист, датчики секторов в штатном режиме.</em>";
    if (demandSummaryEl) demandSummaryEl.textContent = "— Ожидание запроса —";

    ["fuel", "food", "meds", "ammo", "water"].forEach(res => {
      const el = document.getElementById(`disp-alloc-${res}`);
      if (el) el.textContent = "0";
    });

    const btnApprove = document.getElementById("btn-approve-dispatch");
    const btnReject = document.getElementById("btn-reject-dispatch");
    const btnNext = document.getElementById("btn-next-dispatch");
    if (btnApprove) {
      btnApprove.disabled = true;
      btnApprove.style.opacity = "0.3";
      btnApprove.style.cursor = "not-allowed";
      btnApprove.style.pointerEvents = "none";
    }
    if (btnReject) {
      btnReject.disabled = true;
      btnReject.style.opacity = "0.3";
      btnReject.style.cursor = "not-allowed";
      btnReject.style.pointerEvents = "none";
    }
    if (btnNext) {
      btnNext.disabled = true;
      btnNext.style.opacity = "0.3";
      btnNext.style.cursor = "not-allowed";
      btnNext.style.pointerEvents = "none";
    }
  }"""

if old_render_waiting in code:
    code = code.replace(old_render_waiting, new_render_waiting, 1)
    print("4. renderWaitingForDispatch updated with clean text and pointer-events disabled.")

# 5. Guard approveCurrentDispatch and rejectCurrentDispatch
old_reject_guard = """  rejectCurrentDispatch() {
    const disp = this.dispatches[this.currentDispatchIdx];
    if (!disp) return;"""

new_reject_guard = """  rejectCurrentDispatch() {
    if (this.dispatches.length === 0) return;
    const disp = this.dispatches[this.currentDispatchIdx];
    if (!disp) return;"""

if old_reject_guard in code:
    code = code.replace(old_reject_guard, new_reject_guard, 1)
    print("5. Guard added to rejectCurrentDispatch.")

# 6. Enable pointer-events in renderCurrentDispatch
old_render_curr_btns = """    // Enable dispatch action buttons (Approve disabled until at least 1 resource allocated)
    const btnApprove = document.getElementById("btn-approve-dispatch");
    const btnReject = document.getElementById("btn-reject-dispatch");
    const btnNext = document.getElementById("btn-next-dispatch");
    if (btnApprove) { btnApprove.disabled = true; btnApprove.style.opacity = "0.5"; btnApprove.style.cursor = "not-allowed"; }
    if (btnReject) { btnReject.disabled = false; btnReject.style.opacity = "1"; btnReject.style.cursor = "pointer"; }
    if (btnNext) { btnNext.disabled = false; btnNext.style.opacity = "1"; btnNext.style.cursor = "pointer"; }"""

new_render_curr_btns = """    // Enable dispatch action buttons (Approve disabled until at least 1 resource allocated)
    const btnApprove = document.getElementById("btn-approve-dispatch");
    const btnReject = document.getElementById("btn-reject-dispatch");
    const btnNext = document.getElementById("btn-next-dispatch");
    if (btnApprove) {
      btnApprove.disabled = true;
      btnApprove.style.opacity = "0.5";
      btnApprove.style.cursor = "not-allowed";
      btnApprove.style.pointerEvents = "auto";
    }
    if (btnReject) {
      btnReject.disabled = false;
      btnReject.style.opacity = "1";
      btnReject.style.cursor = "pointer";
      btnReject.style.pointerEvents = "auto";
    }
    if (btnNext) {
      btnNext.disabled = false;
      btnNext.style.opacity = "1";
      btnNext.style.cursor = "pointer";
      btnNext.style.pointerEvents = "auto";
    }"""

if old_render_curr_btns in code:
    code = code.replace(old_render_curr_btns, new_render_curr_btns, 1)
    print("6. renderCurrentDispatch restored pointer-events to auto.")

# 7. Day 1 radio lock
old_open_tor = """  openTorRadio() {
    this.openWindow("win-tor");"""

new_open_tor = """  openTorRadio() {
    this.openWindow("win-tor");
    if (this.day === 1) {
      const lockedMsg = document.getElementById("tor-market-locked");
      const unlockedMsg = document.getElementById("tor-market-unlocked");
      const signalStatus = document.getElementById("tor-signal-status");
      if (lockedMsg) {
        lockedMsg.style.display = "block";
        lockedMsg.innerHTML = `<div style="color: #ff9900; padding: 25px; text-align: center; font-family: monospace; font-size: 11px; line-height: 1.6;">
          <strong>[ПРИКАЗ КОМЕНДАТУРЫ №12]:</strong><br><br>
          Радиоузел законсервирован на регламентное техническое обслуживание до Смены №2.<br><br>
          Доступ к радиоэфиру в первый рабочий день строго воспрещен.
        </div>`;
      }
      if (unlockedMsg) unlockedMsg.style.display = "none";
      if (signalStatus) {
        signalStatus.textContent = "[ОПЕЧАТАНО] Радиоузел законсервирован до Смены №2";
        signalStatus.style.color = "#ff9900";
      }
      return;
    }"""

if old_open_tor in code:
    code = code.replace(old_open_tor, new_open_tor, 1)
    print("7. openTorRadio updated with Day 1 lock.")

# 8. Rating synchronization and fair inspection
old_mod_rating = """  modifyRating(target, delta) {
    if (target === "gos") {
      this.playerProfile.ratingGos = Math.max(0, Math.min(100, (this.playerProfile.ratingGos ?? 70) + delta));
      this.playerProfile.rating = this.playerProfile.ratingGos;
    }"""

# Check existing modifyRating
if "this.playerProfile.rating = this.playerProfile.ratingGos;" not in code:
    code = code.replace(
        "    if (target === \"gos\") {\n      this.playerProfile.ratingGos = Math.max(0, Math.min(100, (this.playerProfile.ratingGos ?? 70) + delta));",
        "    if (target === \"gos\") {\n      this.playerProfile.ratingGos = Math.max(0, Math.min(100, (this.playerProfile.ratingGos ?? 70) + delta));\n      this.playerProfile.rating = this.playerProfile.ratingGos;"
    )
    print("8. modifyRating synchronized ratingGos with rating.")

# Update triggerInspection in game.js
old_inspection = """    // Suspicion based on rating & illegal flags
    const hasIllegalDeals = this.flags.smugglersArmed || this.flags.rebelsFunded || this.flags.blackMarketPurchased;
    let suspicion = Math.max(0, 100 - this.playerProfile.rating);
    if (!hasIllegalDeals) {
      suspicion = Math.min(suspicion, 10); // Honest player has minimal risk of routine inspection fault
    } else {
      suspicion += 35;
    }

    const caught = Math.random() * 100 < suspicion;

    modal.style.display = "flex";
    window.soundEngine.playWarning();

    if (caught) {
      speechEl.textContent = "«Диспетчер Волков! Отдел Внутреннего Контроля вскрыл факт сомнительных манипуляций и контактов с подпольем!»";
      resultEl.style.color = "#990000";
      resultEl.innerHTML = `
        <strong>ИТОГ ПРОВЕРКИ: НАРУШЕНИЕ РЕГЛАМЕНТА</strong><br>
        • Наложен внеплановый штраф: <strong>-1200 руб.</strong><br>
        • Снижение индекса доверия: <strong>-20%</strong>
      `;
      this.applyFine("Внеплановый штраф Комендатуры СБ за подозрительную активность");
      this.playerProfile.balance -= 400; // Extra fine
      this.playerProfile.rating = Math.max(10, this.playerProfile.rating - 20);
    } else {
      speechEl.textContent = "«Сверка завершена. Расход энергоячеек и патронов находится в пределах служебной нормы. Продолжайте дежурство, товарищ Волков.»";
      resultEl.style.color = "#006600";
      resultEl.innerHTML = `
        <strong>ИТОГ ПРОВЕРКИ: НАРУШЕНИЙ НЕ ВЫЯВЛЕНО</strong><br>
        • Премия за безупречное ведение документации: <strong>+5% к рейтингу</strong>
      `;
      this.playerProfile.rating = Math.min(100, this.playerProfile.rating + 5);
    }"""

new_inspection = """    // Fair inspection: evaluates real casualties and skipped shift work
    modal.style.display = "flex";
    window.soundEngine.playWarning();

    const neglectedShift = (this.deadToday > 0) || (this.stats.dispatchesApprovedToday === 0);
    const hasIllegalDeals = this.flags.smugglersArmed || this.flags.rebelsFunded || this.flags.blackMarketPurchased;

    if (neglectedShift || hasIllegalDeals) {
      const reasonText = neglectedShift 
        ? "«Диспетчер Волков! Отдел Внутреннего Контроля зафиксировал гибель граждан и халатное распределение резервов!»"
        : "«Диспетчер Волков! СБ вскрыла факт несанкционированных контактов с подпольем!»";
      speechEl.textContent = reasonText;
      resultEl.style.color = "#990000";
      resultEl.innerHTML = `
        <strong>ИТОГ ПРОВЕРКИ: НАРУШЕНИЕ РЕГЛАМЕНТА</strong><br>
        • Наложен внеплановый штраф: <strong>-800 руб.</strong><br>
        • Снижение индекса лояльности Госплана: <strong>-15%</strong>
      `;
      this.applyFine("Взыскание инспекции Комендатуры за халатность и нарушение регламента");
      this.modifyRating("gos", -15);
    } else {
      speechEl.textContent = "«Сверка завершена. Расход запасов обоснован депешами, жертв не допущено. Объявляется служебная благодарность.»";
      resultEl.style.color = "#006600";
      resultEl.innerHTML = `
        <strong>ИТОГ ПРОВЕРКИ: БЕЗУПРЕЧНАЯ СЛУЖБА</strong><br>
        • Премия за бдительность: <strong>+5% к лояльности Госплана</strong>
      `;
      this.modifyRating("gos", 5);
    }"""

if old_inspection in code:
    code = code.replace(old_inspection, new_inspection, 1)
    print("9. triggerInspection rewritten for fair performance-based audit.")

# 10. Update triggerDebtorArrest with authentic Soviet warrant (Photo 1 fix) & clean exit to main menu
old_debtor_arrest = """  triggerDebtorArrest() {
    this.checkAchievement("ach_debtor");
    if (window.soundEngine && window.soundEngine.playSiren) {
      window.soundEngine.playSiren();
    } else if (window.soundEngine) {
      window.soundEngine.playWarning();
    }

    let modal = document.getElementById("debtor-arrest-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "debtor-arrest-modal";
      modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 999999; display: flex; align-items: center; justify-content: center;";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="window" style="width: 540px; box-shadow: 0 0 35px #ff0000; border: 3px solid #ff2222;">
        <div class="window-header" style="background: linear-gradient(90deg, #880000, #ff1111); color: #fff;">
          <div class="window-title">ЧРЕЗВЫЧАЙНЫЙ ВОЕННЫЙ ТРИБУНАЛ ГОСПЛАНА СССР</div>
        </div>
        <div class="window-content" style="background: #111; color: #ffcccc; font-family: 'VT323', monospace; padding: 20px;">
          <div style="font-size: 16px; font-weight: bold; color: #ff3333; margin-bottom: 12px; border-bottom: 1px solid #ff3333; padding-bottom: 6px;">
            ПОСТАНОВЛЕНИЕ О НЕЗАМЕДЛИТЕЛЬНОМ АРЕСТЕ №47-Б
          </div>
          <div style="font-size: 13px; line-height: 1.6; margin-bottom: 15px;">
            Диспетчер Волков Алексей (ДИСП-74Б)!<br><br>
            Ваш лицевой счет пробил критический порог задолженности: 
            <strong style="color: #ff5555; font-size: 15px;">${this.playerProfile.balance} руб.</strong> (Лимит: -2400 руб.).<br><br>
            Комендатура Госплана квалифицирует систематическую растрату государственных средств и критический долг как <strong>финансовую диверсию против стабильности Бункера «Омега»</strong>.<br><br>
            Решением Военного Трибунала вы немедленно отстранены от диспетчерского пульта. Опергруппа Службы Безопасности берет вас под стражу прямо на рабочем месте.
          </div>
          <div style="background: #220000; border: 1px dashed #ff3333; padding: 10px; color: #ff9999; font-size: 12px; margin-bottom: 20px;">
            Приговор: Бессрочное содержание в изоляторе строгого режима штрафного яруса до окончания военного положения без права переписки.
          </div>
          <div style="text-align: center;">
            <button id="btn-debtor-to-menu" class="btn-win" style="background: #ff2222; color: #fff; font-weight: bold; font-size: 13px; padding: 8px 24px; cursor: pointer; border: 2px outset #ff6666;">
              [ ВЕРНУТЬСЯ В ГЛАВНОЕ МЕНЮ ]
            </button>
          </div>
        </div>
      </div>
    `;

    modal.style.display = "flex";

    const btnMenu = document.getElementById("btn-debtor-to-menu");
    if (btnMenu) {
      btnMenu.onclick = () => {
        localStorage.removeItem("bunkeros_save");
        modal.style.display = "none";
        
        if (this.dispatchTimer) clearTimeout(this.dispatchTimer);
        if (this.virusInterval) clearInterval(this.virusInterval);
        
        const mainMenu = document.getElementById("main-menu-overlay");
        if (mainMenu) mainMenu.style.display = "flex";
        
        this.checkSavedGame();
        if (window.soundEngine) window.soundEngine.playClick();
      };
    }
  }"""

new_debtor_arrest = """  triggerDebtorArrest() {
    this.checkAchievement("ach_debtor");
    if (window.soundEngine && window.soundEngine.playSiren) {
      window.soundEngine.playSiren();
    } else if (window.soundEngine) {
      window.soundEngine.playWarning();
    }

    // Stop any pending day shift or dispatch timeouts
    if (this.dispatchTimer) {
      clearTimeout(this.dispatchTimer);
      this.dispatchTimer = null;
    }
    if (this.virusInterval) {
      clearInterval(this.virusInterval);
      this.virusInterval = null;
    }

    let modal = document.getElementById("debtor-arrest-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "debtor-arrest-modal";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="soviet-arrest-folder">
        <div class="arrest-paperclip"></div>
        <div class="arrest-stamp-purple">ТРИБУНАЛ ГОСПЛАНА<br>ПОСТАНОВЛЕНИЕ ИСПОЛНЕНО<br>АРЕСТ ОПЕРАТОРА</div>
        
        <div style="border-bottom: 2px solid #222; padding-bottom: 8px; margin-bottom: 14px;">
          <div style="font-size: 11px; letter-spacing: 2px; color: #444; text-transform: uppercase;">Особый отдел Службы Безопасности СССР</div>
          <div style="font-size: 16px; font-weight: bold; letter-spacing: 1px; color: #111; margin-top: 2px;">
            ПОСТАНОВЛЕНИЕ ЧРЕЗВЫЧАЙНОГО ТРИБУНАЛА №47-Б
          </div>
          <div style="font-size: 10px; color: #666;">Дело №74/ДИСП-Б • Спецхранение • Без срока давности</div>
        </div>

        <div class="arrest-mugshot-box" title="Алексей Волков (ДИСП-74Б)">
          <img src="img/soviet_arrest_warrant.jpg" alt="Фото заключенного" onerror="this.src='img/alexei_family.jpg'">
        </div>

        <div style="font-size: 12px; line-height: 1.6; color: #111;">
          <strong>ОБВИНЯЕМЫЙ:</strong> Волков Алексей Владимирович, 1960 г.р.<br>
          <strong>ДОЛЖНОСТЬ:</strong> Оператор центрального диспетчерского пульта пневмосети.<br><br>
          <strong>СУТЬ ПРЕСТУПЛЕНИЯ:</strong><br>
          Лицевой счет оператора допустил критический долг в размере 
          <strong style="color: #990000; font-size: 14px;">${this.playerProfile.balance} руб.</strong> при служебном лимите -2400 руб.<br>
          Комендатура квалифицирует растрату материальных резервов как <em>умышленную финансовую диверсию против обороноспособности Бункера «Омега»</em>.<br><br>
          <strong>ПРИГОВОР ВОЕННОГО ТРИБУНАЛА:</strong><br>
          Немедленно отстранить Волкова А.В. от пульта управления. Взять под стражу конвоем СБ на рабочем месте и этапировать в штрафной изолятор глубокого горизонта до окончания военного положения без права переписки.
        </div>

        <div style="margin-top: 22px; text-align: center; border-top: 1px dashed #888; padding-top: 14px;">
          <button id="btn-debtor-to-menu" class="btn-win" style="background: #2b1f16; color: #fff; font-size: 12px; padding: 7px 24px; font-weight: bold; cursor: pointer; border: 2px outset #554433;">
            [ ВЕРНУТЬСЯ В ГЛАВНОЕ МЕНЮ ]
          </button>
        </div>
      </div>
    `;

    modal.style.display = "flex";

    const btnMenu = document.getElementById("btn-debtor-to-menu");
    if (btnMenu) {
      btnMenu.onclick = () => {
        // Completely wipe save game and reload to clean main menu
        localStorage.removeItem("bunkeros_save");
        modal.style.display = "none";
        
        // Return cleanly to Soviet Bunker CRT main menu
        window.location.reload();
      };
    }
  }"""

if old_debtor_arrest in code:
    code = code.replace(old_debtor_arrest, new_debtor_arrest, 1)
    print("10. triggerDebtorArrest updated with authentic Soviet document and window.location.reload().")

# 11. Add new methods: bindMapConduits, bindFlappyMinigame, bindOmegaTerminalActions, setupWindowResizeScaling
new_methods = """  // =========================================================================
  // WINDOW RESIZE SCALING & ACCESSIBILITY
  // =========================================================================
  setupWindowResizeScaling() {
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const win = entry.target;
        if (win.offsetWidth > 620 || win.offsetHeight > 520) {
          win.classList.add("large-scale");
        } else {
          win.classList.remove("large-scale");
        }
      }
    });

    document.querySelectorAll(".window").forEach(win => {
      observer.observe(win);
    });
  }

  // =========================================================================
  // MAP CONDUITS & TOGGLE SWITCHES
  // =========================================================================
  bindMapConduits() {
    const btnHeat = document.getElementById("btn-conduit-heat");
    const btnPower = document.getElementById("btn-conduit-power");
    const btnHydro = document.getElementById("btn-conduit-hydro");

    if (btnHeat) {
      btnHeat.addEventListener("click", () => {
        if (!this.conduits) this.conduits = { heat: "mine", power: "water", hydro: "hydro" };
        this.conduits.heat = this.conduits.heat === "mine" ? "block" : "mine";
        window.soundEngine.playClick();
        
        const isMine = this.conduits.heat === "mine";
        btnHeat.textContent = isMine ? "В ШАХТУ [РЕЖИМ А]" : "В ЖИЛОЙ БЛОК [РЕЖИМ Б]";
        btnHeat.classList.toggle("active", isMine);

        const secMine = this.getSector("sec_mine");
        const secBlock = this.getSector("sec_block");
        if (isMine) {
          if (secMine) secMine.heat = Math.min(100, (secMine.heat || 70) + 10);
          if (secBlock) secBlock.heat = Math.max(10, (secBlock.heat || 70) - 8);
          this.logEvent("[ТЕПЛОТРАССА]: Поток пара направлен на обогрев горизонта Шахты.");
        } else {
          if (secBlock) secBlock.heat = Math.min(100, (secBlock.heat || 70) + 12);
          if (secMine) secMine.heat = Math.max(10, (secMine.heat || 70) - 8);
          this.logEvent("[ТЕПЛОТРАССА]: Поток пара перенаправлен в радиаторы Жилого Блока №4.");
        }
        this.renderTacticalMap();
        if (this.selectedSectorId) this.selectSector(this.selectedSectorId);
      });
    }

    if (btnPower) {
      btnPower.addEventListener("click", () => {
        if (!this.conduits) this.conduits = { heat: "mine", power: "water", hydro: "hydro" };
        this.conduits.power = this.conduits.power === "water" ? "radar" : "water";
        window.soundEngine.playClick();

        const isWater = this.conduits.power === "water";
        btnPower.textContent = isWater ? "ВОДООЧИСТКА [РЕЖИМ А]" : "РАДАР ПЕРИМЕТРА [РЕЖИМ Б]";
        btnPower.classList.toggle("active", isWater);

        const secWater = this.getSector("sec_water");
        const secRadar = this.getSector("sec_radar");
        if (isWater) {
          if (secWater) secWater.water = Math.min(100, (secWater.water || 70) + 10);
          this.logEvent("[ЭНЕРГОСЕТЬ]: Мощность реактора подана на глубинные насосы Водоочистки.");
        } else {
          if (secRadar) secRadar.riotRisk = Math.max(0, (secRadar.riotRisk || 15) - 15);
          this.logEvent("[ЭНЕРГОСЕТЬ]: Мощность переведена на внешние радары и турели Периметра.");
        }
        this.renderTacticalMap();
        if (this.selectedSectorId) this.selectSector(this.selectedSectorId);
      });
    }

    if (btnHydro) {
      btnHydro.addEventListener("click", () => {
        if (!this.conduits) this.conduits = { heat: "mine", power: "water", hydro: "hydro" };
        this.conduits.hydro = this.conduits.hydro === "hydro" ? "taps" : "hydro";
        window.soundEngine.playClick();

        const isHydro = this.conduits.hydro === "hydro";
        btnHydro.textContent = isHydro ? "ГИДРОПОНИКА [РЕЖИМ А]" : "ЖИЛЫЕ КРАНЫ [РЕЖИМ Б]";
        btnHydro.classList.toggle("active", isHydro);

        const secHydro = this.getSector("sec_hydro");
        const secBlock = this.getSector("sec_block");
        if (isHydro) {
          if (secHydro) secHydro.food = Math.min(100, (secHydro.food || 70) + 12);
          this.logEvent("[ГИДРОМАГИСТРАЛЬ]: Питательный раствор подается на стеллажи Теплиц.");
        } else {
          if (secBlock) {
            secBlock.water = Math.min(100, (secBlock.water || 70) + 15);
            secBlock.riotRisk = Math.max(0, (secBlock.riotRisk || 15) - 10);
          }
          this.logEvent("[ГИДРОМАГИСТРАЛЬ]: Чистая вода направлена в краны каморок Жилого Блока.");
        }
        this.renderTacticalMap();
        if (this.selectedSectorId) this.selectSector(this.selectedSectorId);
      });
    }
  }

  // =========================================================================
  // OMEGA PROTOCOL TERMINAL & MYSTICAL SCREEN NEGATIVE
  // =========================================================================
  bindOmegaTerminalActions() {
    const btnReroute = document.getElementById("btn-omega-reroute");
    const btnLeak = document.getElementById("btn-omega-leak");
    const btnPurge = document.getElementById("btn-omega-purge");

    const triggerOmegaEnding = (title, text, badge) => {
      document.body.classList.remove("omega-negative-active");
      this.closeWindow("win-omega");
      this.checkAchievement(badge);
      localStorage.removeItem("bunkeros_save");
      
      let modal = document.getElementById("debtor-arrest-modal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "debtor-arrest-modal";
        document.body.appendChild(modal);
      }

      modal.innerHTML = `
        <div class="soviet-arrest-folder" style="border-color: #00aa33;">
          <div class="arrest-stamp-purple" style="border-color: #00aa33; color: #00aa33;">ПРОТОКОЛ «ОМЕГА»<br>ИСПОЛНЕНО<br>АРХИВ ЗАКРЫТ</div>
          <div style="border-bottom: 2px solid #222; padding-bottom: 8px; margin-bottom: 14px;">
            <div style="font-size: 11px; letter-spacing: 2px; color: #008822; font-weight: bold;">АРХИВ ОСОБОЙ ПАПКИ ЦК КПСС 1989 Г.</div>
            <div style="font-size: 16px; font-weight: bold; color: #111; margin-top: 2px;">${title}</div>
          </div>
          <div style="font-size: 12px; line-height: 1.6; color: #222; margin-bottom: 20px; white-space: pre-wrap;">${text}</div>
          <div style="text-align: center; border-top: 1px dashed #888; padding-top: 14px;">
            <button id="btn-omega-exit-menu" class="btn-win" style="background: #113311; color: #33ff66; font-size: 12px; padding: 7px 24px; font-weight: bold; cursor: pointer; border: 2px outset #33aa33;">
              [ ВЕРНУТЬСЯ В ГЛАВНОЕ МЕНЮ ]
            </button>
          </div>
        </div>
      `;
      modal.style.display = "flex";
      document.getElementById("btn-omega-exit-menu").onclick = () => {
        window.location.reload();
      };
    };

    if (btnReroute) {
      btnReroute.onclick = () => {
        triggerOmegaEnding(
          "ФИНАЛ: ПОБЕГ НА «КОВЧЕГЕ» (ВЗЛОМ СТРЕЛКИ)",
          "Вы ввели директиву перевода стрелочного перевода №114.\\nЭвакопоезд «Ковчег» остановился у шахтерских платформ.\\nСотни рабочих, инженеров и их семей поднялись на борт бронепоезда.\\nРазбив внешние гермозатворы, бронепоезд вырвался сквозь хребет на чистую поверхность к восходящему солнцу.\\n\\nВы спасли бункер от вечного плена.",
          "ach_ark"
        );
      };
    }

    if (btnLeak) {
      btnLeak.onclick = () => {
        triggerOmegaEnding(
          "ФИНАЛ: ПРАВДА 1989 ГОДА (ВСЕОБЩЕЕ ВОССТАНИЕ)",
          "Вы нажали трансляцию протокола по всем мониторам бункера.\\nЛожь о ядерной войне рассыпалась в прах.\\nКомендатура Госплана пала за 40 минут без единого выстрела.\\nГраждане бункера открыли главные шлюзы наружу.\\nВпереди — долгий путь возрождения на свободной земле.",
          "ach_rebel_spy"
        );
      };
    }

    if (btnPurge) {
      btnPurge.onclick = () => {
        triggerOmegaEnding(
          "ФИНАЛ: ВИНТИК РЕЖИМА (САМООЧИСТКА)",
          "Вы стерли все сектора дискеты и сожгли микропленку.\\nПравда о 1989 годе умерла навсегда.\\nВы получили служебную премию и орден от Комендатуры.\\nВаша семья жива, но обречена до конца дней дышать ржавой пылью подземного склепа.\\nСлужба продолжается.",
          "ach_iron_fist"
        );
      };
    }
  }

  // =========================================================================
  // MINIGAME «ПНЕВМОЗОНД-98» (FLAPPY BIRD ENGINE)
  // =========================================================================
  bindFlappyMinigame() {
    const icon = document.getElementById("icon-flappy");
    const canvas = document.getElementById("flappy-canvas");
    const btnRestart = document.getElementById("btn-flappy-restart");
    const scoreEl = document.getElementById("flappy-score");
    const bestEl = document.getElementById("flappy-best");

    if (icon) {
      icon.addEventListener("click", () => {
        this.openWindow("win-flappy");
        startFlappy();
      });
    }

    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let probeY = 160;
    let probeVelocity = 0;
    let pipes = [];
    let score = 0;
    let bestScore = parseInt(localStorage.getItem("bunkeros_flappy_best") || "0", 10);
    if (bestEl) bestEl.textContent = `${bestScore} м`;

    let isPlaying = false;
    let isGameOver = false;
    let animFrame = null;

    const resetGame = () => {
      probeY = 160;
      probeVelocity = 0;
      pipes = [
        { x: 300, topH: 100, bottomH: 140, passed: false },
        { x: 480, topH: 130, bottomH: 110, passed: false }
      ];
      score = 0;
      isGameOver = false;
      isPlaying = true;
      if (scoreEl) scoreEl.textContent = "0 м";
    };

    const jump = () => {
      if (!isPlaying || isGameOver) {
        resetGame();
        return;
      }
      probeVelocity = -5.4;
      if (window.soundEngine) window.soundEngine.playKeyClick();
    };

    canvas.addEventListener("mousedown", jump);
    window.addEventListener("keydown", (e) => {
      const win = document.getElementById("win-flappy");
      if (win && win.style.display !== "none" && e.code === "Space") {
        e.preventDefault();
        jump();
      }
    });

    if (btnRestart) btnRestart.addEventListener("click", resetGame);

    const updateFlappy = () => {
      if (!isPlaying) return;

      ctx.fillStyle = "#0a140d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines (ventilation shaft)
      ctx.strokeStyle = "rgba(51, 255, 102, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      if (!isGameOver) {
        probeVelocity += 0.28; // gravity
        probeY += probeVelocity;

        if (probeY < 0) probeY = 0;
        if (probeY > canvas.height - 18) {
          isGameOver = true;
          probeY = canvas.height - 18;
          window.soundEngine?.playErrorChord();
        }

        // Move pipes
        pipes.forEach(p => {
          p.x -= 2.2;
          if (!p.passed && p.x + 36 < 60) {
            p.passed = true;
            score += 10;
            if (scoreEl) scoreEl.textContent = `${score} м`;
            if (score > bestScore) {
              bestScore = score;
              localStorage.setItem("bunkeros_flappy_best", String(bestScore));
              if (bestEl) bestEl.textContent = `${bestScore} м`;
            }
          }
        });

        // Add new pipe
        if (pipes.length > 0 && pipes[pipes.length - 1].x < canvas.width - 160) {
          const topH = 50 + Math.floor(Math.random() * 140);
          const gap = 95;
          const bottomH = canvas.height - topH - gap;
          pipes.push({ x: canvas.width, topH, bottomH, passed: false });
        }

        // Remove old pipes
        pipes = pipes.filter(p => p.x > -50);

        // Check collision
        const probeRect = { x: 55, y: probeY, w: 22, h: 14 };
        pipes.forEach(p => {
          // Top pipe
          if (probeRect.x + probeRect.w > p.x && probeRect.x < p.x + 36 && probeRect.y < p.topH) {
            isGameOver = true;
            window.soundEngine?.playErrorChord();
          }
          // Bottom pipe
          if (probeRect.x + probeRect.w > p.x && probeRect.x < p.x + 36 && probeRect.y + probeRect.h > canvas.height - p.bottomH) {
            isGameOver = true;
            window.soundEngine?.playErrorChord();
          }
        });
      }

      // Draw pipes (industrial ventilation conduits)
      pipes.forEach(p => {
        // Top pipe
        ctx.fillStyle = "#1e3a24";
        ctx.strokeStyle = "#33ff66";
        ctx.lineWidth = 1.5;
        ctx.fillRect(p.x, 0, 36, p.topH);
        ctx.strokeRect(p.x, 0, 36, p.topH);
        // Flange
        ctx.fillRect(p.x - 3, p.topH - 12, 42, 12);
        ctx.strokeRect(p.x - 3, p.topH - 12, 42, 12);

        // Bottom pipe
        const bY = canvas.height - p.bottomH;
        ctx.fillRect(p.x, bY, 36, p.bottomH);
        ctx.strokeRect(p.x, bY, 36, p.bottomH);
        // Flange
        ctx.fillRect(p.x - 3, bY, 42, 12);
        ctx.strokeRect(p.x - 3, bY, 42, 12);
      });

      // Draw Soviet pneumatic probe
      ctx.save();
      ctx.translate(65, probeY + 7);
      ctx.rotate(Math.min(0.6, Math.max(-0.6, probeVelocity * 0.08)));
      // Probe body
      ctx.fillStyle = "#ffcc00";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-12, -7, 24, 14, 4);
      ctx.fill(); ctx.stroke();
      // Lens
      ctx.fillStyle = "#00ffff";
      ctx.beginPath(); ctx.arc(7, 0, 3, 0, Math.PI * 2); ctx.fill();
      // Tail nozzle fire
      if (probeVelocity < 0) {
        ctx.fillStyle = "#ff3300";
        ctx.beginPath(); ctx.moveTo(-12, -3); ctx.lineTo(-19, 0); ctx.lineTo(-12, 3); ctx.fill();
      }
      ctx.restore();

      if (isGameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "20px 'VT323', monospace";
        ctx.fillStyle = "#ff3333";
        ctx.textAlign = "center";
        ctx.fillText("СТОЛКНОВЕНИЕ ЗОНДА!", canvas.width / 2, 140);
        ctx.font = "14px 'VT323', monospace";
        ctx.fillStyle = "#ffff00";
        ctx.fillText(`ДИСТАНЦИЯ: ${score} м`, canvas.width / 2, 175);
        ctx.fillStyle = "#aaffcc";
        ctx.fillText("[КЛИК ДЛЯ ПОВТОРНОГО ЗАПУСКА]", canvas.width / 2, 215);
      }

      animFrame = requestAnimationFrame(updateFlappy);
    };

    const startFlappy = () => {
      resetGame();
      if (!animFrame) animFrame = requestAnimationFrame(updateFlappy);
    };
  }
"""

if "bindMapConduits() {" not in code:
    code = code.replace("  // TACTICAL VECTOR MAP (PAN & ZOOM)", new_methods + "\n  // TACTICAL VECTOR MAP (PAN & ZOOM)")
    print("11. Added bindMapConduits, bindFlappyMinigame, bindOmegaTerminalActions, setupWindowResizeScaling.")

# 12. Update tutorial assistant steps (7 focused chapters)
old_tut_step = """    if (this.tutorialStep === 1) {
      if (stepEl) stepEl.textContent = "Шаг 1 из 6: Спецпочта и Лор";
      if (textEl) textEl.innerHTML = `
        <strong>Первым делом откройте Спецпочту!</strong><br>
        Перед началом распределения ресурсов диспетчер обязан ознакомиться с оперативной обстановкой. 
        В почте вас ждет предписание Наркомата с предысторией Бункера-74 и вашими персональными обязанностями. 
        Туда же будут приходить тайные послания от подполья и письма семьи.
      `;
      this.openWindow("win-mail");
      document.getElementById("win-mail")?.classList.add("tutorial-highlight");
    } else if (this.tutorialStep === 2) {
      if (stepEl) stepEl.textContent = "Шаг 2 из 6: Входящие депеши";
      if (textEl) textEl.innerHTML = `
        <strong>Окно «Депеши» — основа вашей работы!</strong><br>
        Сектора запрашивают ресурсы по радио. <em>Никогда не верьте на слово!</em>
        Всегда сверяйте слова заявителя с датчиками телеметрии внизу окна (температура, пары спирта, шум).
        Ложное одобрение списывает дефицит и карается <strong>штрафом -800 руб.</strong>, а отказ честным — гибелью сектора!
      `;
      this.openWindow("win-inbox");
      document.getElementById("win-inbox")?.classList.add("tutorial-highlight");
    } else if (this.tutorialStep === 3) {
      if (stepEl) stepEl.textContent = "Шаг 3 из 6: Склад пневмосвязи";
      if (textEl) textEl.innerHTML = `
        <strong>Окно «Склад» — баланс выживания бункера.</strong><br>
        Здесь отображаются 4 запаса: <em>Топливо, Медикаменты, Патроны, Вода</em>.
        Ресурсов всегда меньше, чем заявок! Рассчитывайте каждый выстрел и канистру.
        Когда список депеш за день иссякнет, нажмите здесь кнопку <strong>«[ Завершить смену ]»</strong>.
      `;
      this.openWindow("win-depot");
      document.getElementById("win-depot")?.classList.add("tutorial-highlight");
    } else if (this.tutorialStep === 4) {
      if (stepEl) stepEl.textContent = "Шаг 4 из 6: Карта секторов";
      if (textEl) textEl.innerHTML = `
        <strong>Карта Бункера показывает живучесть узлов.</strong><br>
        Карту можно двигать мышью и масштабировать колесиком. Кликнув по сектору, вы увидите число выживших и радиацию.
        Гибель критических секторов (Шахта, Водоочистка, Реактор) навсегда снизит суточный приток ресурсов в бункер!
      `;
      this.openWindow("win-map");
      document.getElementById("win-map")?.classList.add("tutorial-highlight");
    } else if (this.tutorialStep === 5) {
      if (stepEl) stepEl.textContent = "Шаг 5 из 6: Сирена ГО и ЧП";
      if (textEl) textEl.innerHTML = `
        <strong>Регламент экстренных аварий (ЧП):</strong><br>
        Внезапно в течение смены может взвыть аварийный ревун (пожар, мутанты, прорыв радиации).
        У вас будет ровно <strong>15 секунд</strong> на выбор действия! 
        Не медлите: если таймер истечет, терминал выберет наихудший вариант. Тратьте ресурсы ради спасения людей!
      `;
      document.getElementById("icon-tutorial")?.classList.add("tutorial-highlight");
    } else if (this.tutorialStep === 6) {
      if (stepEl) stepEl.textContent = "Шаг 6 из 6: Зарплата и Комендатура";
      if (textEl) textEl.innerHTML = `
        <strong>Финансы, штрафы и рейтинг доверия:</strong><br>
        Каждое утро начисляется оклад (+2000 руб.), но удерживаются штрафы ОВК за вчерашние ошибки.
        Следите за рейтингом лояльности в Личном деле: при падении ниже 40% к вам нагрянет допрос с пристрастием.
        Все инструкции ясны. За работу, Диспетчер Волков!
      `;
      document.getElementById("profile-balance")?.parentElement?.classList.add("tutorial-highlight");
    }"""

new_tut_step = """    if (this.tutorialStep === 1) {
      if (stepEl) stepEl.textContent = "Шаг 1 из 7: Телетайп и депеши";
      if (textEl) textEl.innerHTML = `
        <strong>Окно «Депеши» — основа вашей службы.</strong><br>
        Сюда по правительственному радиоканалу поступают запросы от шести аванпостов Бункера. В каждой депеше указан сектор, срочность и суть запроса на получение складских ресурсов.
      `;
      this.openWindow("win-inbox");
      document.getElementById("win-inbox")?.classList.add("tutorial-highlight");
    } else if (this.tutorialStep === 2) {
      if (stepEl) stepEl.textContent = "Шаг 2 из 7: Анализ телеметрии";
      if (textEl) textEl.innerHTML = `
        <strong>Никогда не верьте тексту на слово!</strong><br>
        Внизу бланка депеши отображаются объективные датчики секторов (температура, пары спирта, вибрация, шум). Если начальник заявляет о морозе, а на датчике +20°C — это наглая ложь! Выдача ресурсов лжецам карается штрафами.
      `;
      this.openWindow("win-inbox");
      document.getElementById("win-inbox")?.classList.add("tutorial-highlight");
    } else if (this.tutorialStep === 3) {
      if (stepEl) stepEl.textContent = "Шаг 3 из 7: Накладная и регуляторы [-][+]";
      if (textEl) textEl.innerHTML = `
        <strong>Регуляторы [-] и [+] дозируют выдачу.</strong><br>
        Кнопка «Подписать накладную» активируется только если вы выделили хотя бы 1 единицу ресурса. Пустую накладную подписать невозможно. Если заявка поддельная — жмите «Отказать».
      `;
      this.openWindow("win-inbox");
      document.getElementById("win-inbox")?.classList.add("tutorial-highlight");
    } else if (this.tutorialStep === 4) {
      if (stepEl) stepEl.textContent = "Шаг 4 из 7: Тактическая карта бункера";
      if (textEl) textEl.innerHTML = `
        <strong>Карта комплекса отображает жизнеобеспечение.</strong><br>
        Клик по сектору показывает его выживших и 5 шкал: Тепло, Сытость, Санитария, Вода и Риск бунта. Через панель отгрузки на карте можно направить ресурсы со склада прямо в сектор.
      `;
      this.openWindow("win-map");
      document.getElementById("win-map")?.classList.add("tutorial-highlight");
    } else if (this.tutorialStep === 5) {
      if (stepEl) stepEl.textContent = "Шаг 5 из 7: Магистрали и тумблеры";
      if (textEl) textEl.innerHTML = `
        <strong>Тумблеры перенаправляют потоки без расхода склада!</strong><br>
        • Теплотрасса: перенаправление пара (Шахта ⇄ Жилой Блок).<br>
        • Энергосеть: переключение мощности (Водоочистка ⇄ Радар).<br>
        • Гидросеть: подача воды (Теплицы ⇄ Жилые краны).
      `;
      this.openWindow("win-map");
      document.getElementById("win-map")?.classList.add("tutorial-highlight");
    } else if (this.tutorialStep === 6) {
      if (stepEl) stepEl.textContent = "Шаг 6 из 7: Склад Госрезерва";
      if (textEl) textEl.innerHTML = `
        <strong>Окно «Склад» ведет учет государственных запасов.</strong><br>
        Здесь хранятся Топливо, Пайки, Медпаки, Патроны и Вода. Каждое утро поступает пополнение. Когда все депеши за день рассмотрены, нажмите кнопку «[ Завершить смену и закрыть день ]».
      `;
      this.openWindow("win-depot");
      document.getElementById("win-depot")?.classList.add("tutorial-highlight");
    } else if (this.tutorialStep === 7) {
      if (stepEl) stepEl.textContent = "Шаг 7 из 7: Экономика и зарплата";
      if (textEl) textEl.innerHTML = `
        <strong>Финансы, взыскания и порог ареста:</strong><br>
        Каждое утро начисляется оклад (+700 руб.) и списываются штрафы за вчерашние ошибки. Внимание: падение баланса до -2400 руб. влечет немедленный арест Военным Трибуналом!
      `;
      document.getElementById("profile-balance")?.parentElement?.classList.add("tutorial-highlight");
    }"""

if old_tut_step in code:
    code = code.replace(old_tut_step, new_tut_step, 1)
    code = code.replace("if (this.tutorialStep > 6) {", "if (this.tutorialStep > 7) {")
    print("12. Updated tutorial assistant steps with 7 chapters.")

# 13. Screen negative toggle for Omega window
old_omega_open = """    this.openWindow("win-omega");
  }"""

new_omega_open = """    document.body.classList.add("omega-negative-active");
    this.openWindow("win-omega");
  }"""

if old_omega_open in code:
    code = code.replace(old_omega_open, new_omega_open, 1)
    print("13. openOmegaProtocolWindow added omega-negative-active body class.")

# Remove negative class when closing win-omega
old_close_win = """    if (win) {
      win.style.display = "none";
      win.classList.remove("minimized");
    }"""

new_close_win = """    if (win) {
      win.style.display = "none";
      win.classList.remove("minimized");
      if (winId === "win-omega") {
        document.body.classList.remove("omega-negative-active");
      }
    }"""

if old_close_win in code:
    code = code.replace(old_close_win, new_close_win, 1)
    print("14. closeWindow removes omega-negative-active when win-omega closed.")

# 15. Save and load seenDispatchIds
old_save = """      stats: this.stats,
      vpnActive: this.vpnActive
    };"""

new_save = """      stats: this.stats,
      vpnActive: this.vpnActive,
      seenDispatchIds: this.seenDispatchIds || [],
      conduits: this.conduits || { heat: 'mine', power: 'water', hydro: 'hydro' }
    };"""

if old_save in code:
    code = code.replace(old_save, new_save, 1)
    print("15. saveGame updated with seenDispatchIds and conduits.")

old_load = """      this.stats = data.stats || { correctFraudsDetected: 0, dispatchesApprovedToday: 0 };
      this.vpnActive = !!data.vpnActive;"""

new_load = """      this.stats = data.stats || { correctFraudsDetected: 0, dispatchesApprovedToday: 0 };
      this.vpnActive = !!data.vpnActive;
      this.seenDispatchIds = data.seenDispatchIds || [];
      this.conduits = data.conduits || { heat: 'mine', power: 'water', hydro: 'hydro' };"""

if old_load in code:
    code = code.replace(old_load, new_load, 1)
    print("16. loadGame updated with seenDispatchIds and conduits.")

with open(game_path, "w", encoding="utf-8") as f:
    f.write(code)

print("ALL GAME.JS MASTER FIXES APPLIED SUCCESSFULLY!")
