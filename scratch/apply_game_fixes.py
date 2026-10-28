import re

game_path = r"c:\Users\Dalogo\Desktop\game\game.js"
with open(game_path, "r", encoding="utf-8") as f:
    code = f.read()

# Normalize CRLF to LF for easier manipulation, then we can write back
code = code.replace("\r\n", "\n")

# 1. Update init()
if "this.bindMapDirectSupply();" not in code:
    code = code.replace(
        "    this.bindTrayControls();\n    this.initDraggableIcons();\n    this.checkSavedGame();",
        "    this.bindTrayControls();\n    this.initDraggableIcons();\n    this.bindMapDirectSupply();\n    this.bindDesktopMarqueeSelection();\n    this.checkSavedGame();"
    )
    print("1. init() updated with bindMapDirectSupply & bindDesktopMarqueeSelection.")

# 2. Add properties to constructor if needed
if "this.dayDispatchesQueue" not in code:
    code = code.replace(
        "    this.openWindows = new Set([\"win-map\", \"win-inbox\", \"win-depot\"]);",
        "    this.openWindows = new Set([\"win-map\", \"win-inbox\", \"win-depot\"]);\n    this.dayDispatchesQueue = [];\n    this.dispatchTimer = null;\n    this.dailyTorMarketItems = [];\n    this.radioFineGivenToday = false;\n    this.debtorArrested = false;"
    )
    print("2. Constructor initialized with dispatch queue and market state.")

# 3. Update loadDayDispatches
old_load_dispatches = """  loadDayDispatches(day) {
    this.dispatches = DISPATCH_DATABASE.filter(d => d.day === day);
    this.currentDispatchIdx = 0;
    this.stats.dispatchesApprovedToday = 0;
    this.renderCurrentDispatch();
  }"""

new_load_dispatches = """  getRandomDispatchInterval() {
    const steps = [45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65];
    const sec = steps[Math.floor(Math.random() * steps.length)];
    return sec * 1000;
  }

  loadDayDispatches(day) {
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
  }

  deliverNextDispatch() {
    this.dispatchTimer = null;
    if (this.dayDispatchesQueue.length === 0) return;

    const nextDisp = this.dayDispatchesQueue.shift();
    this.dispatches.push(nextDisp);
    this.currentDispatchIdx = this.dispatches.length - 1;

    window.soundEngine.playTeletype();
    this.flashTaskbarDispatch();
    this.logEvent(`[ВХОДЯЩАЯ ДЕПЕША]: Поступил правительственный пакет от [${nextDisp.sender}]!`);

    this.renderCurrentDispatch();

    // Schedule subsequent dispatch from the queue
    if (this.dayDispatchesQueue.length > 0) {
      const delay = this.getRandomDispatchInterval();
      this.dispatchTimer = setTimeout(() => {
        this.deliverNextDispatch();
      }, delay);
    }
  }

  flashTaskbarDispatch() {
    const btns = document.querySelectorAll(".taskbar-task-btn");
    btns.forEach(btn => {
      if (btn.textContent.includes("Входящие") || btn.textContent.includes("Депеши")) {
        btn.style.animation = "blink 0.5s 4";
        setTimeout(() => { if (btn) btn.style.animation = ""; }, 2000);
      }
    });
  }

  renderWaitingForDispatch() {
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

if old_load_dispatches in code:
    code = code.replace(old_load_dispatches, new_load_dispatches, 1)
    print("3. loadDayDispatches & pacing queue implemented.")
else:
    print("WARNING: old_load_dispatches pattern not matched exactly!")

# 4. Update renderCurrentDispatch: btnApprove must be disabled initially!
old_render_buttons = """    // Enable dispatch action buttons
    const btnApprove = document.getElementById("btn-approve-dispatch");
    const btnReject = document.getElementById("btn-reject-dispatch");
    const btnNext = document.getElementById("btn-next-dispatch");
    if (btnApprove) { btnApprove.disabled = false; btnApprove.style.opacity = "1"; btnApprove.style.cursor = "pointer"; }
    if (btnReject) { btnReject.disabled = false; btnReject.style.opacity = "1"; btnReject.style.cursor = "pointer"; }
    if (btnNext) { btnNext.disabled = false; btnNext.style.opacity = "1"; btnNext.style.cursor = "pointer"; }"""

new_render_buttons = """    // Enable dispatch action buttons (Approve disabled until at least 1 resource allocated)
    const btnApprove = document.getElementById("btn-approve-dispatch");
    const btnReject = document.getElementById("btn-reject-dispatch");
    const btnNext = document.getElementById("btn-next-dispatch");
    if (btnApprove) { btnApprove.disabled = true; btnApprove.style.opacity = "0.5"; btnApprove.style.cursor = "not-allowed"; }
    if (btnReject) { btnReject.disabled = false; btnReject.style.opacity = "1"; btnReject.style.cursor = "pointer"; }
    if (btnNext) { btnNext.disabled = false; btnNext.style.opacity = "1"; btnNext.style.cursor = "pointer"; }"""

if old_render_buttons in code:
    code = code.replace(old_render_buttons, new_render_buttons, 1)
    print("4. renderCurrentDispatch updated with disabled initial approve button.")

# 5. Update bindDispatchActions to recheck allocation and toggle btnApprove
old_spinner_bind = """        const valEl = document.getElementById(`disp-alloc-${res}`);
        if (valEl) valEl.textContent = this.currentDispatchAllocation[res];
      });
    });"""

new_spinner_bind = """        const valEl = document.getElementById(`disp-alloc-${res}`);
        if (valEl) valEl.textContent = this.currentDispatchAllocation[res];

        // Check if at least 1 resource is allocated to activate "Подписать накладную"
        const currentTotal = Object.values(this.currentDispatchAllocation).reduce((a, b) => a + b, 0);
        if (btnApprove) {
          if (currentTotal > 0) {
            btnApprove.disabled = false;
            btnApprove.style.opacity = "1";
            btnApprove.style.cursor = "pointer";
          } else {
            btnApprove.disabled = true;
            btnApprove.style.opacity = "0.5";
            btnApprove.style.cursor = "not-allowed";
          }
        }
      });
    });"""

if old_spinner_bind in code:
    code = code.replace(old_spinner_bind, new_spinner_bind, 1)
    print("5. bindDispatchActions spinners updated to toggle btnApprove dynamically.")

# 6. Update approveCurrentDispatch to prevent approving with 0 allocation
old_approve_alloc = """    const alloc = { ...this.currentDispatchAllocation };
    const totalAlloc = Object.values(alloc).reduce((a, b) => a + b, 0);

    // If player didn't allocate anything, default to req if available, or warn
    if (totalAlloc === 0) {
      const defaultReq = disp.req || {};
      let canDefault = true;
      for (const [r, qty] of Object.entries(defaultReq)) {
        if ((this.resources[r] ?? 0) < qty) canDefault = false;
      }
      if (canDefault && Object.values(defaultReq).reduce((a, b) => a + b, 0) > 0) {
        Object.assign(alloc, defaultReq);
      } else {
        window.soundEngine.playErrorChord();
        this.logEvent("[ПРЕДУПРЕЖДЕНИЕ]: Выберите количество выдаваемых ресурсов регуляторами [-] [+]!");
        return;
      }
    }"""

new_approve_alloc = """    const alloc = { ...this.currentDispatchAllocation };
    const totalAlloc = Object.values(alloc).reduce((a, b) => a + b, 0);

    // Strictly forbidden to approve without allocating at least 1 item!
    if (totalAlloc <= 0) {
      window.soundEngine.playErrorChord();
      this.logEvent("[ПРЕДУПРЕЖДЕНИЕ]: Добавьте хотя бы один ресурс в накладную регуляторами [-] [+]!");
      return;
    }"""

if old_approve_alloc in code:
    code = code.replace(old_approve_alloc, new_approve_alloc, 1)
    print("6. approveCurrentDispatch updated to forbid 0 resource allocation.")

# 7. Update removeCurrentDispatch for pacing and queue
old_remove_disp = """  removeCurrentDispatch() {
    this.dispatches.splice(this.currentDispatchIdx, 1);
    if (this.currentDispatchIdx >= this.dispatches.length) {
      this.currentDispatchIdx = Math.max(0, this.dispatches.length - 1);
    }
    if (this.dispatches.length === 0) {
      const planBadge = document.getElementById("shift-plan-badge");
      if (planBadge) planBadge.style.display = "block";
    }
    this.renderCurrentDispatch();
    this.saveGame();
  }"""

new_remove_disp = """  removeCurrentDispatch() {
    this.dispatches.splice(this.currentDispatchIdx, 1);
    if (this.currentDispatchIdx >= this.dispatches.length) {
      this.currentDispatchIdx = Math.max(0, this.dispatches.length - 1);
    }

    if (this.dispatches.length > 0) {
      this.renderCurrentDispatch();
    } else if (this.dayDispatchesQueue && this.dayDispatchesQueue.length > 0) {
      // Waiting for next scheduled dispatch in queue
      this.renderWaitingForDispatch();
      if (!this.dispatchTimer) {
        this.dispatchTimer = setTimeout(() => {
          this.deliverNextDispatch();
        }, this.getRandomDispatchInterval());
      }
    } else {
      // Shift dispatches completely processed!
      this.renderEmptyDispatch();
      const planBadge = document.getElementById("shift-plan-badge");
      if (planBadge) planBadge.style.display = "block";
    }
    this.saveGame();
  }"""

if old_remove_disp in code:
    code = code.replace(old_remove_disp, new_remove_disp, 1)
    print("7. removeCurrentDispatch updated for pacing transitions.")

# 8. Add generateDailyTorMarket and update bindTorRadio and renderTorMarket
old_bind_tor = """  bindTorRadio() {
    const iconTor = document.getElementById("icon-tor");
    const freqSlider = document.getElementById("tor-freq-slider");
    const freqDisplay = document.getElementById("tor-freq-display");
    const lockedMsg = document.getElementById("tor-market-locked");
    const unlockedMsg = document.getElementById("tor-market-unlocked");
    const signalStatus = document.getElementById("tor-signal-status");

    if (iconTor) iconTor.addEventListener("click", () => this.openWindow("win-tor"));

    if (freqSlider) {
      freqSlider.addEventListener("input", () => {
        const val = parseFloat(freqSlider.value).toFixed(1);
        this.torFrequency = val;
        freqDisplay.textContent = `${val} МГц`;
        window.soundEngine.playRadioStatic();

        // Secret tuning to 94.4 MHz!
        if (Math.abs(val - 94.4) < 0.3) {
          lockedMsg.style.display = "none";
          unlockedMsg.style.display = "block";
          signalStatus.textContent = "[ЧИСТЫЙ СИГНАЛ] Канал «Лис» активен. Связь установлена.";
          signalStatus.style.color = "#33ff66";
          this.renderTorMarket();
        } else if (Math.abs(val - 66.6) < 0.25) {
          lockedMsg.style.display = "block";
          unlockedMsg.style.display = "none";
          lockedMsg.innerHTML = `<span style="color: #ff2222; font-weight: bold; font-size: 13px;">[АНОМАЛЬНАЯ ЧАСТОТА 66.6 МГц]</span><br><br><span style="color: #ff9999;">&gt; Голос из глубин: «ВНИЗУ... ОНИ ИДУТ... ТЫСЯЧИ ГЛАЗ...»</span>`;
          signalStatus.textContent = "[КРИТИЧЕСКИЙ СИГНАЛ] АНОМАЛИЯ 66.6 МГц";
          signalStatus.style.color = "#ff2222";
          this.triggerDemonicAnomaly("radio");
          this.checkAchievement("ach_ghost_signal");
        } else {
          this.clearDemonicAnomaly("radio");
          lockedMsg.style.display = "block";
          unlockedMsg.style.display = "none";
          signalStatus.textContent = "[ШИПЕНИЕ ПОМЕХ...] Вращайте настройку для поиска сигнала в эфире";
          signalStatus.style.color = "#ffb000";
        }
      });
    }
  }

  renderTorMarket() {
    const container = document.getElementById("tor-items-container");
    if (!container) return;
    container.innerHTML = "";

    TOR_MARKET_DATABASE.forEach(item => {
      // Antibiotics guaranteed on Days 1, 2, 3; then random or stay if not bought
      if (item.id === "tor_antibiotics" && this.day > 3 && item.purchased) {
        return; // already bought
      }

      const row = document.createElement("div");
      row.className = "tor-market-item";

      let btnLabel = item.price < 0 ? 'СБЫТЬ' : 'КУПИТЬ';
      let btnDisabled = false;
      if (item.purchased) {
        btnLabel = '[ВЫКУПЛЕНО]';
        btnDisabled = true;
      }

      const priceText = item.purchased ? 'ВЫКУПЛЕНО' : (item.price < 0 ? `+${Math.abs(item.price)} руб. (ВЫПЛАТА)` : `${item.price} руб.`);
      row.innerHTML = `
        <div style="flex: 1;">
          <div style="font-weight: bold; color: #000080; font-size: 11px;">${item.name}</div>
          <div style="font-size: 10px; color: #555;">${item.desc}</div>
        </div>
        <div style="text-align: right; margin-left: 10px;">
          <div style="font-weight: bold; font-size: 11px; margin-bottom: 4px; color: ${item.price < 0 ? '#006600' : '#8b0000'};">
            ${priceText}
          </div>
          <button class="btn-win btn-tor-buy" data-id="${item.id}" ${btnDisabled ? 'disabled style="opacity: 0.5;"' : ''} style="font-size: 10px; padding: 2px 8px;">
            ${btnLabel}
          </button>
        </div>
      `;

      container.appendChild(row);
    });

    container.querySelectorAll(".btn-tor-buy").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.buyTorItem(id);
      });
    });
  }"""

new_bind_tor = """  generateDailyTorMarket() {
    const pool = TOR_MARKET_DATABASE.filter(item => {
      if (item.purchased && (item.type === "family_cure" || item.type === "omega_protocol" || item.type === "ksr_booster" || item.type === "escape_pass")) {
        return false;
      }
      return true;
    });

    const selected = [];
    const antibiotics = TOR_MARKET_DATABASE.find(i => i.id === "tor_antibiotics");
    // Days 1, 2, 3: Antibiotics guaranteed if not purchased
    if (this.day <= 3 && antibiotics && !antibiotics.purchased) {
      selected.push(antibiotics);
    }

    const remaining = pool.filter(i => !selected.some(s => s.id === i.id));
    const shuffled = [...remaining].sort(() => Math.random() - 0.5);
    while (selected.length < 4 && shuffled.length > 0) {
      selected.push(shuffled.pop());
    }

    this.dailyTorMarketItems = selected;
  }

  bindTorRadio() {
    const iconTor = document.getElementById("icon-tor");
    const freqSlider = document.getElementById("tor-freq-slider");

    if (iconTor) {
      iconTor.addEventListener("click", () => {
        this.openTorRadio();
      });
    }

    if (freqSlider) {
      freqSlider.addEventListener("input", () => {
        const val = parseFloat(freqSlider.value).toFixed(1);
        this.torFrequency = val;
        window.soundEngine.playRadioStatic();
        this.updateTorRadioDisplay();
      });
    }
  }

  openTorRadio() {
    this.openWindow("win-tor");
    
    // 15% random chance of KGB/State Security radio interception fine (-500 rub) once per shift
    if (!this.radioFineGivenToday && Math.random() < 0.15) {
      this.radioFineGivenToday = true;
      this.playerProfile.balance -= 500;
      const fineObj = {
        amount: 500,
        date: GAME_DATES[this.day - 1] || "1998",
        reason: "Перехват несанкционированного радиоэфира в жилом отсеке оператора"
      };
      this.playerProfile.fines.unshift(fineObj);
      this.playerProfile.bankHistory.unshift(`${fineObj.date} [ШТРАФ СБ]: -500 руб. Несанкционированный радиоэфир.`);
      this.modifyRating("gos", -10);
      window.soundEngine.playWarning();
      this.updateProfileUI();
      this.updateBankUI();
      this.showMessageBox("[ДЕПЕША ОСОБОГО ОТДЕЛА СБ ГОСПЛАНА]\\n\\nРадиопеленгатор зафиксировал всплеск несанкционированного радиосигнала на вашем терминале!\\nНаложен внеплановый штраф: -500 руб.\\nИндекс лояльности снижен.");
      this.checkBankruptcy();
    }

    this.updateTorRadioDisplay();
  }

  updateTorRadioDisplay() {
    const freqDisplay = document.getElementById("tor-freq-display");
    const lockedMsg = document.getElementById("tor-market-locked");
    const unlockedMsg = document.getElementById("tor-market-unlocked");
    const signalStatus = document.getElementById("tor-signal-status");
    if (!lockedMsg || !unlockedMsg || !signalStatus) return;

    const val = parseFloat(this.torFrequency || 91.2).toFixed(1);
    if (freqDisplay) freqDisplay.textContent = `${val} МГц`;

    // Without VPN, TOR radio traffic is completely blocked
    if (!this.vpnActive) {
      lockedMsg.style.display = "block";
      unlockedMsg.style.display = "none";
      lockedMsg.innerHTML = `<div style="color: #ff4444; padding: 20px; text-align: center; font-family: monospace; font-size: 11px;">[ОШИБКА СВЯЗИ]: Шлюз TOR заблокирован брандмауэром Госплана. Требуется защищенное соединение.</div>`;
      signalStatus.textContent = "[СЕТЕВАЯ ОШИБКА] Пакет сброшен брандмауэром Госплана";
      signalStatus.style.color = "#ff4444";
      return;
    }

    // Secret tuning to 94.4 MHz!
    if (Math.abs(val - 94.4) < 0.3) {
      if (!this.flags.blackMarketUnlocked) {
        lockedMsg.style.display = "block";
        unlockedMsg.style.display = "none";
        signalStatus.textContent = "[СИГНАЛ 94.4 МГц] Зафиксирована зашифрованная несущая частота КСР";
        signalStatus.style.color = "#ffb000";
        lockedMsg.innerHTML = `<div style="color: #ffcc00; padding: 15px; font-size: 11px; line-height: 1.5; font-family: monospace;">
          <strong>[ШИФРОВАННЫЙ КАНАЛ КСР «ЛИС»]</strong><br><br>
          Приемник зафиксировал секретную волну подполья.<br>
          Шифровальный ключ терминала не активирован.<br><br>
          В почтовую программу <strong>BunkerMail</strong> отправлено закрытое сообщение от абонента «Лиса (КСР)».<br>
          Откройте почту и согласуйте условия сотрудничества, чтобы получить доступ к закрытому каталогу.
        </div>`;

        // Deliver Fox's first contact email if not sent yet
        if (!this.flags.foxFirstContactSent) {
          this.flags.foxFirstContactSent = true;
          this.receivedEmails.unshift({
            id: `mail_fox_contact_${Date.now()}`,
            day: this.day,
            from: "Лиса (КСР) <fox@underground.ksr>",
            date: `${GAME_DATES[this.day - 1] || '1998'} 11:20`,
            subject: "Ты настроил 94.4. Поговорим о деле.",
            unread: true,
            hasReplies: true,
            replied: false,
            body: `Привет, Волков.\\n\\nМы засекли твой приемник на волне 94.4.\\nМы знаем, что твоя девочка Настя задыхается от серой пыли в 4-м блоке, а на твоем балансе не хватает на лекарства.\\nГосАппарат спишет ее как «убыль фонда», но у нашего подполья есть нужные ампулы.\\n\\nМы готовы открыть тебе шифрованный терминал снабжения Черного Рынка прямо через радиоприемник. Но нам нужны гарантии, что ты не сдашь наш канал особистам.\\n\\nТы готов к сотрудничеству, Диспетчер?`,
            replies: [
              {
                text: "«Я согласен сотрудничать. Открывайте доступ к каталогу снабжения, мне нужно спасти дочь.»",
                responseBody: "Лиса: «Разумный выбор. Канал снабжения на частоте 94.4 открыт. Держи язык за зубами — и мы сработаемся.»",
                effects: { ratingKsr: 15, ratingGos: -5, unlockBlackMarket: true, ksrDealAccepted: true }
              },
              {
                text: "«Мне плевать на вашу политику. Мне нужны только медикаменты для семьи. Открывайте канал.»",
                responseBody: "Лиса: «Все мы заложники ситуации. Доступ к черному рынку на 94.4 предоставлен. Забирай товар, если есть деньги.»",
                effects: { ratingKsr: 5, ratingGos: 0, unlockBlackMarket: true, ksrDealAccepted: true }
              },
              {
                text: "«Я давал присягу Госплану. Я подумаю, но ничего не обещаю.»",
                responseBody: "Лиса: «Не тяни резину, Волков. Время идет. Доступ на 94.4 открыт, но цены будут строгими.»",
                effects: { ratingKsr: 0, ratingGos: 0, unlockBlackMarket: true }
              }
            ]
          });
          this.updateMailUI();
          window.soundEngine.playIncomingMail();
          this.logEvent("[ПОЧТА]: Поступило входящее шифрованное сообщение от абонента «Лиса (КСР)»!");
        }
      } else {
        lockedMsg.style.display = "none";
        unlockedMsg.style.display = "block";
        signalStatus.textContent = "[ЧИСТЫЙ СИГНАЛ] Канал «Лис» активен. Связь установлена.";
        signalStatus.style.color = "#33ff66";
        this.renderTorMarket();
      }
    } else if (Math.abs(val - 66.6) < 0.25) {
      lockedMsg.style.display = "block";
      unlockedMsg.style.display = "none";
      lockedMsg.innerHTML = `<span style="color: #ff2222; font-weight: bold; font-size: 13px;">[АНОМАЛЬНАЯ ЧАСТОТА 66.6 МГц]</span><br><br><span style="color: #ff9999;">&gt; Голос из глубин: «ВНИЗУ... ОНИ ИДУТ... ТЫСЯЧИ ГЛАЗ...»</span>`;
      signalStatus.textContent = "[КРИТИЧЕСКИЙ СИГНАЛ] АНОМАЛИЯ 66.6 МГц";
      signalStatus.style.color = "#ff2222";
      this.triggerDemonicAnomaly("radio");
      this.checkAchievement("ach_ghost_signal");
    } else {
      this.clearDemonicAnomaly("radio");
      lockedMsg.style.display = "block";
      unlockedMsg.style.display = "none";
      lockedMsg.innerHTML = "СИГНАЛ НЕ ПОЙМАН.<br>ВРАЩАЙТЕ НАСТРОЙКУ ЧАСТОТЫ ДЛЯ ПОИСКА ТОРГОВЦЕВ.";
      signalStatus.textContent = "[ШИПЕНИЕ ПОМЕХ...] Вращайте настройку для поиска сигнала в эфире";
      signalStatus.style.color = "#ffb000";
    }
  }

  renderTorMarket() {
    const container = document.getElementById("tor-items-container");
    if (!container) return;
    container.innerHTML = "";

    if (!this.dailyTorMarketItems || this.dailyTorMarketItems.length === 0) {
      this.generateDailyTorMarket();
    }

    // Render strictly the 4 items for today
    this.dailyTorMarketItems.forEach(item => {
      const row = document.createElement("div");
      row.className = "tor-market-item";

      let btnLabel = item.price < 0 ? 'СБЫТЬ' : 'КУПИТЬ';
      let btnDisabled = false;
      if (item.purchased) {
        btnLabel = '[ВЫКУПЛЕНО]';
        btnDisabled = true;
      }

      const priceText = item.purchased ? 'ВЫКУПЛЕНО' : (item.price < 0 ? `+${Math.abs(item.price)} руб. (ВЫПЛАТА)` : `${item.price} руб.`);
      row.innerHTML = `
        <div style="flex: 1;">
          <div style="font-weight: bold; color: #000080; font-size: 11px;">${item.name}</div>
          <div style="font-size: 10px; color: #555;">${item.desc}</div>
        </div>
        <div style="text-align: right; margin-left: 10px;">
          <div style="font-weight: bold; font-size: 11px; margin-bottom: 4px; color: ${item.price < 0 ? '#006600' : '#8b0000'};">
            ${priceText}
          </div>
          <button class="btn-win btn-tor-buy" data-id="${item.id}" ${btnDisabled ? 'disabled style="opacity: 0.5;"' : ''} style="font-size: 10px; padding: 2px 8px;">
            ${btnLabel}
          </button>
        </div>
      `;

      container.appendChild(row);
    });

    container.querySelectorAll(".btn-tor-buy").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.buyTorItem(id);
      });
    });
  }"""

if old_bind_tor in code:
    code = code.replace(old_bind_tor, new_bind_tor, 1)
    print("8. bindTorRadio & renderTorMarket updated with Fox email gating, 4 daily items, and VPN checks.")

# 9. Update email reply handler to unlock black market
old_mail_reply = """                  if (rep.effects.ksrDealAccepted) {
                    this.flags.ksrDealAccepted = true;
                    const ab = TOR_MARKET_DATABASE.find(item => item.id === "tor_antibiotics");
                    if (ab) ab.price = ab.discountPrice || 1200;
                  }"""

new_mail_reply = """                  if (rep.effects.ksrDealAccepted) {
                    this.flags.ksrDealAccepted = true;
                    const ab = TOR_MARKET_DATABASE.find(item => item.id === "tor_antibiotics");
                    if (ab) ab.price = ab.discountPrice || 1200;
                  }
                  if (rep.effects.unlockBlackMarket || rep.effects.ksrDealAccepted) {
                    this.flags.blackMarketUnlocked = true;
                    this.updateTorRadioDisplay();
                  }"""

if old_mail_reply in code:
    code = code.replace(old_mail_reply, new_mail_reply, 1)
    print("9. Mail reply handler updated to unlock black market.")

# 10. Update buyMarketApp to handle free app_mystery_box testing item
old_buy_app = """    } else if (app.id === "app_power_key") {
      this.resources.fuel += 1;
      this.updateResourceUI();
      this.showMessageBox("Служебный ключ активирован. В резерв пневмосети добавлена 1 Топливная Ячейка!");
    } else {"""

new_buy_app = """    } else if (app.id === "app_power_key") {
      this.resources.fuel += 1;
      this.updateResourceUI();
      this.showMessageBox("Служебный ключ активирован. В резерв пневмосети добавлена 1 Топливная Ячейка!");
    } else if (app.id === "app_mystery_box") {
      this.flags.omegaProtocolUnlocked = true;
      this.checkAchievement("ach_shadow_deal");
      this.openOmegaProtocolWindow();
      this.showMessageBox("Артефакт «???» [Спецхранение КСР] получен бесплатно!\\nСекретный протокол «ОМЕГА» запущен на терминале.");
    } else {"""

if old_buy_app in code:
    code = code.replace(old_buy_app, new_buy_app, 1)
    print("10. buyMarketApp updated for free test item app_mystery_box.")

# 11. Add triggerDebtorArrest and checkBankruptcy
old_bankruptcy_trigger = """    // Critical bankruptcy threshold: Debt over -2400 rub triggers instant debtor ending!
    if (this.playerProfile.balance <= -2400) {
      this.checkAchievement("ach_debtor");
      this.triggerEnding();
    }"""

new_bankruptcy_trigger = """    // Critical bankruptcy threshold: Debt over -2400 rub triggers instant debtor arrest!
    this.checkBankruptcy();"""

if old_bankruptcy_trigger in code:
    code = code.replace(old_bankruptcy_trigger, new_bankruptcy_trigger, 1)
    print("11. Replaced simple triggerEnding() with checkBankruptcy() in updateProfileUI.")

# Add methods checkBankruptcy, triggerDebtorArrest, bindDesktopMarqueeSelection
helper_methods = """  checkBankruptcy() {
    if (this.playerProfile.balance <= -2400 && !this.debtorArrested) {
      this.debtorArrested = true;
      this.triggerDebtorArrest();
      return true;
    }
    return false;
  }

  triggerDebtorArrest() {
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
  }

  bindDesktopMarqueeSelection() {
    const desktop = document.getElementById("desktop");
    if (!desktop) return;

    let marquee = document.getElementById("desktop-marquee-box");
    if (!marquee) {
      marquee = document.createElement("div");
      marquee.id = "desktop-marquee-box";
      desktop.appendChild(marquee);
    }

    let isSelecting = false;
    let startX = 0;
    let startY = 0;

    desktop.addEventListener("mousedown", (e) => {
      // Only trigger if clicking directly on desktop or desktop-grid, not on windows, icons, taskbar
      if (e.target !== desktop && !e.target.classList.contains("desktop-grid") && e.target.id !== "desktop-grid") {
        return;
      }
      if (e.button !== 0) return; // left click only

      isSelecting = true;
      startX = e.clientX;
      startY = e.clientY;

      marquee.style.left = `${startX}px`;
      marquee.style.top = `${startY}px`;
      marquee.style.width = "0px";
      marquee.style.height = "0px";
      marquee.style.display = "block";

      if (!e.ctrlKey) {
        document.querySelectorAll(".desktop-icon.selected").forEach(ic => ic.classList.remove("selected"));
      }
    });

    window.addEventListener("mousemove", (e) => {
      if (!isSelecting) return;

      const currentX = e.clientX;
      const currentY = e.clientY;

      const left = Math.min(startX, currentX);
      const top = Math.min(startY, currentY);
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);

      marquee.style.left = `${left}px`;
      marquee.style.top = `${top}px`;
      marquee.style.width = `${width}px`;
      marquee.style.height = `${height}px`;

      const marqueeRect = { left, top, right: left + width, bottom: top + height };
      document.querySelectorAll(".desktop-icon").forEach(icon => {
        const iconRect = icon.getBoundingClientRect();
        const intersects = !(
          iconRect.right < marqueeRect.left ||
          iconRect.left > marqueeRect.right ||
          iconRect.bottom < marqueeRect.top ||
          iconRect.top > marqueeRect.bottom
        );
        if (intersects && width > 4 && height > 4) {
          icon.classList.add("selected");
        } else if (!e.ctrlKey && width > 4 && height > 4) {
          icon.classList.remove("selected");
        }
      });
    });

    window.addEventListener("mouseup", () => {
      if (!isSelecting) return;
      isSelecting = false;
      marquee.style.display = "none";
    });
  }
"""

if "bindDesktopMarqueeSelection() {" not in code:
    code = code.replace("  // TACTICAL VECTOR MAP (PAN & ZOOM)", helper_methods + "\n  // TACTICAL VECTOR MAP (PAN & ZOOM)")
    print("12. Added helper_methods (checkBankruptcy, triggerDebtorArrest, bindDesktopMarqueeSelection).")

# 13. Update inspection suspicion logic so clean players aren't accused of underground ties
old_suspicion = """    // Suspicion based on rating & illegal flags
    let suspicion = 100 - this.playerProfile.rating;
    if (this.flags.smugglersArmed) suspicion += 35;
    if (this.flags.rebelsFunded) suspicion += 30;

    const caught = Math.random() * 100 < suspicion;"""

new_suspicion = """    // Suspicion based on rating & illegal flags
    const hasIllegalDeals = this.flags.smugglersArmed || this.flags.rebelsFunded || this.flags.blackMarketPurchased;
    let suspicion = Math.max(0, 100 - this.playerProfile.rating);
    if (!hasIllegalDeals) {
      suspicion = Math.min(suspicion, 10); // Honest player has minimal risk of routine inspection fault
    } else {
      suspicion += 35;
    }

    const caught = Math.random() * 100 < suspicion;"""

if old_suspicion in code:
    code = code.replace(old_suspicion, new_suspicion, 1)
    print("13. triggerInspection suspicion logic updated.")

# 14. In updateBankUI and closeDayShift, call checkBankruptcy
old_bank_ui = """    if (balanceEl) {
      balanceEl.textContent = `${this.playerProfile.balance} руб.`;
      balanceEl.style.color = this.playerProfile.balance < 0 ? "#8b0000" : "#004080";
    }"""

new_bank_ui = """    if (balanceEl) {
      balanceEl.textContent = `${this.playerProfile.balance} руб.`;
      balanceEl.style.color = this.playerProfile.balance < 0 ? "#8b0000" : "#004080";
    }
    this.checkBankruptcy();"""

if old_bank_ui in code:
    code = code.replace(old_bank_ui, new_bank_ui, 1)
    print("14. updateBankUI updated with checkBankruptcy.")

# 15. In bindTrayControls, update radio display if vpn toggled
old_vpn_toggle = """        if (this.vpnActive) {
          vpnText.textContent = "[НОБ:ВКЛ]";
          vpnText.style.color = "#33ff66";
          if (iconTor) iconTor.style.display = "flex";
          this.openWindow("win-nob-warning");
        } else {
          vpnText.textContent = "[НОБ:ВЫКЛ]";
          vpnText.style.color = "#888";
          if (iconTor) iconTor.style.display = "none";
        }"""

new_vpn_toggle = """        if (this.vpnActive) {
          vpnText.textContent = "[НОБ:ВКЛ]";
          vpnText.style.color = "#33ff66";
          if (iconTor) iconTor.style.display = "flex";
          this.openWindow("win-nob-warning");
        } else {
          vpnText.textContent = "[НОБ:ВЫКЛ]";
          vpnText.style.color = "#888";
          if (iconTor) iconTor.style.display = "none";
        }
        if (this.updateTorRadioDisplay) this.updateTorRadioDisplay();"""

if old_vpn_toggle in code:
    code = code.replace(old_vpn_toggle, new_vpn_toggle, 1)
    print("15. bindTrayControls updated to sync radio display on VPN toggle.")

with open(game_path, "w", encoding="utf-8") as f:
    f.write(code)

print("ALL CHANGES WRITTEN TO GAME.JS!")
