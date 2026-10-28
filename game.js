/**
 * BunkerOS Game Engine v3.11
 * Windows 95 Management, Interactive Vector Map (Pan & Zoom),
 * Detective Verification, CRT Sleep/Wake Cycle, Windows Login Lock Screen,
 * Interactive Day 1 Tutorial Assistant, BunkerMail (Outlook Express),
 * BunkerBank (3% Transfers & Family Storyline), Bunker-Market (Apps & Silent Virus),
 * Gazette «Бункерный Вестник», Emergency Siren Events, Comendatura Inspections,
 * Draggable Desktop Icons, Procedural Radio Narrator, Easter Eggs & Achievements
 */

class BunkerGame {
  constructor() {
    this.day = 1;
    this.maxDays = 14;
    this.sectors = JSON.parse(JSON.stringify(GAME_SECTORS_INIT));
    this.resources = { ...INITIAL_RESOURCES };
    this.dispatches = [];
    this.currentDispatchIdx = 0;
    this.selectedSectorId = "sec_mine";
    this.currentDispatchAllocation = { fuel: 0, food: 0, meds: 0, ammo: 0, water: 0 };
    this.mapSupplyAllocation = { fuel: 0, food: 0, meds: 0, ammo: 0, water: 0 };
    this.openWindows = new Set(["win-map", "win-inbox", "win-depot"]);
    this.dayDispatchesQueue = [];
    this.dispatchTimer = null;
    this.dailyTorMarketItems = [];
    this.radioFineGivenToday = false;
    this.debtorArrested = false;
    this.seenDispatchIds = [];
    this.conduits = { heat: 'auto', energy: 'auto', water: 'auto' };
    this.resolvedSectorEmergencies = {};
    this.achievementQueue = [];
    this.isShowingToast = false;
    
    // Player Economy & Profile (Russified: Алексей Волков, ДИСП-74Б)
    this.playerProfile = {
      name: "Алексей Волков",
      id: "ДИСП-74Б",
      balance: 1000,
      salary: 700,
      fineAmount: 400,
      ratingGos: 70,
      ratingKsr: 15,
      ratingFamily: 100,
      rating: 70, // backwards compatibility
      curedFamily: false,
      fines: [],
      familyTransfers: 0,
      bankHistory: [
        "14.11.1998 07:30 [ОК]: Открытие счета ДИСП-74Б. Баланс: 1000 руб."
      ],
      installedApps: []
    };



    // Emails
    this.receivedEmails = [];

    // State VPN & TOR (94.4 is secret!)
    this.vpnActive = false;
    this.torFrequency = 91.2;

    // Desktop Folders
    this.desktopFolders = [];
    this.pendingFines = [];
    this.activeFolderId = null;
    this.iconPositions = this.loadIconPositions();
    this.pendingFines = [];
    this.activeFolderId = null;

    this.dailyLogs = [];
    this.totalCasualties = 0;
    this.deadToday = 0;
    this.flags = {};
    this.stats = {
      correctFraudsDetected: 0,
      dispatchesApprovedToday: 0,
      totalApproved: 0,
      totalRejected: 0
    };

    // Map Pan & Zoom states
    this.mapScale = 1;
    this.mapPanX = 0;
    this.mapPanY = 0;
    this.isPanningMap = false;
    this.panStartX = 0;
    this.panStartY = 0;

    // Interactive Tutorial
    this.tutorialActive = false;
    this.tutorialStep = 0;

    // Comic Intro
    this.comicSlideIdx = 0;
    this.comicTypewriterInterval = null;

    // Calculator State
    this.calcCurrent = "0";
    this.calcPrev = null;
    this.calcOp = null;
    this.calcReset = false;

    // WordPad open counter for secret note Easter egg
    this.wordpadOpenCount = 0;

    // Malware Virus State
    this.virusInterval = null;
    this.virusStolenTotal = 0;

    // Emergency Event Active
    this.emergencyActive = false;
    this.emergencyTriggeredToday = false;
    this.shiftEmergencyTimer = null;
    this.emergencyTimerInterval = null;

    this.unlockedAchievements = this.loadAchievements();
    this.settings = this.loadSettings();

    // Window management
    this.activeWindow = null;
    this.highestZ = 100;

    this.init();
  }

  // =========================================================================
  // RATINGS 2.0: ГОСАППАРАТ (70%), КСР (15%), СЕМЬЯ (100%)
  // =========================================================================
  modifyRating(target, delta) {
    if (target === "gos") {
      this.playerProfile.ratingGos = Math.max(0, Math.min(100, (this.playerProfile.ratingGos ?? 70) + delta));
      this.playerProfile.rating = this.playerProfile.ratingGos;
    } else if (target === "ksr") {
      this.playerProfile.ratingKsr = Math.max(0, Math.min(100, (this.playerProfile.ratingKsr ?? 15) + delta));
    } else if (target === "family") {
      this.playerProfile.ratingFamily = Math.max(0, Math.min(100, (this.playerProfile.ratingFamily ?? 100) + delta));
      // Threat of divorce if family rating drops <= 30%
      if (this.playerProfile.ratingFamily <= 30 && !this.flags.divorceWarned) {
        this.flags.divorceWarned = true;
        this.receivedEmails.unshift({
          id: `divorce_warn_${Date.now()}`,
          day: this.day,
          from: "Елена Волкова <elena.volkova@civ.bunker>",
          date: `${GAME_DATES[this.day - 1] || '1998'} 19:30`,
          subject: "ПРЕДУПРЕЖДЕНИЕ: Я подаю на развод...",
          unread: true,
          body: "Алексей. Твое равнодушие перешло все границы. Детям нечего есть, а ты думаешь только о показателях Госплана. Если ты не изменишься — я забираю детей и ухожу навсегда."
        });
        this.updateMailUI();
        window.soundEngine.playWarning();
      }
    }
    this.updateProfileUI();
  }


  // =========================================================================
  // RETRO WIN95 MESSAGEBOX (REPLACES ALL BROWSER ALERTS)
  // =========================================================================
  showMessageBox(text, title = "BunkerOS v3.11", icon = "ℹ️") {
    const box = document.getElementById("win-msgbox");
    const titleEl = document.getElementById("msgbox-title");
    const textEl = document.getElementById("msgbox-text");
    const iconEl = document.getElementById("msgbox-icon");
    const btnOk = document.getElementById("msgbox-btn-ok");
    const btnX = document.getElementById("msgbox-btn-x");

    if (!box || !textEl) {
      console.log(`[${title}]: ${text}`);
      return;
    }

    if (titleEl) titleEl.textContent = title;
    textEl.textContent = text;
    if (iconEl) iconEl.textContent = icon;

    box.style.display = "flex";
    this.bringToFront(box);
    window.soundEngine.playWarning();

    const closeBox = () => {
      box.style.display = "none";
    };

    if (btnOk) btnOk.onclick = closeBox;
    if (btnX) btnX.onclick = closeBox;
  }


  // =========================================================================
  // REAL SYSTEM CLOCK (TASKBAR SYNC)
  // =========================================================================
  startTrayClock() {
    const clockEl = document.getElementById("tray-clock");
    if (!clockEl) return;
    const update = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, "0");
      const mins = String(now.getMinutes()).padStart(2, "0");
      clockEl.textContent = `${hrs}:${mins}`;
    };
    update();
    setInterval(update, 1000);
  }

  // =========================================================================
  // GEOLOCATION: BIRTHPLACE IN PERSONNEL PROFILE (LOCKED IN LOCALSTORAGE ONCE)
  // =========================================================================
  initBirthplace() {
    const el = document.getElementById("profile-birthplace");
    const saved = localStorage.getItem("bunkeros_birthplace");
    if (saved) {
      if (el) el.textContent = saved;
      return;
    }

    const tzCityMap = {
      "Europe/Moscow": "г. Москва",
      "Europe/Samara": "г. Самара",
      "Europe/Volgograd": "г. Волгоград",
      "Europe/Kaliningrad": "г. Калининград",
      "Europe/Simferopol": "г. Симферополь",
      "Europe/Kirov": "г. Киров",
      "Europe/Astrakhan": "г. Астрахань",
      "Europe/Ulyanovsk": "г. Ульяновск",
      "Asia/Yekaterinburg": "г. Свердловск (Екатеринбург)",
      "Asia/Omsk": "г. Омск",
      "Asia/Novosibirsk": "г. Новосибирск",
      "Asia/Krasnoyarsk": "г. Красноярск",
      "Asia/Irkutsk": "г. Иркутск",
      "Asia/Yakutsk": "г. Якутск",
      "Asia/Vladivostok": "г. Владивосток",
      "Asia/Magadan": "г. Магадан",
      "Asia/Sakhalin": "г. Южно-Сахалинск",
      "Asia/Kamchatka": "г. Петропавловск-Камчатский",
      "Asia/Anadyr": "г. Анадырь",
      "Asia/Barnaul": "г. Барнаул",
      "Asia/Tomsk": "г. Томск",
      "Asia/Novokuznetsk": "г. Новокузнецк",
      "Asia/Chita": "г. Чита",
      "Europe/Minsk": "г. Минск",
      "Asia/Almaty": "г. Алма-Ата",
      "Asia/Tashkent": "г. Ташкент",
      "Europe/Kyiv": "г. Киев"
    };

    let fallbackCity = "г. Москва";
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tzCityMap[tz]) {
        fallbackCity = tzCityMap[tz];
      } else if (tz) {
        const parts = tz.split("/");
        fallbackCity = parts.length > 1 ? `г. ${parts[1].replace(/_/g, " ")}` : "г. Москва";
      }
    } catch (_) {}

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      fetch("https://ipwho.is/?lang=ru", { signal: controller.signal })
        .then(r => r.json())
        .then(data => {
          clearTimeout(timeoutId);
          let city = data && data.city ? `г. ${data.city}` : fallbackCity;
          localStorage.setItem("bunkeros_birthplace", city);
          if (el) el.textContent = city;
        })
        .catch(() => {
          clearTimeout(timeoutId);
          localStorage.setItem("bunkeros_birthplace", fallbackCity);
          if (el) el.textContent = fallbackCity;
        });
    } catch (e) {
      localStorage.setItem("bunkeros_birthplace", fallbackCity);
      if (el) el.textContent = fallbackCity;
    }
  }

  // =========================================================================
  // DEMONIC ANOMALY (666 CALC / 66.6 FM TOR RADIO)
  // =========================================================================
  triggerDemonicAnomaly(source) {
    this.demonicAnomalySource = source;
    document.body.classList.add("demonic-shake-active");
    if (window.soundEngine && typeof window.soundEngine.startDemonicDrone === "function") {
      window.soundEngine.startDemonicDrone();
    }
    this.checkAchievement("ach_ghost_signal");
  }

  clearDemonicAnomaly(source) {
    if (!source || this.demonicAnomalySource === source) {
      this.demonicAnomalySource = null;
      document.body.classList.remove("demonic-shake-active");
      if (window.soundEngine && typeof window.soundEngine.stopDemonicDrone === "function") {
        window.soundEngine.stopDemonicDrone();
      }
    }
  }

    init() {
    this.applySettings();
    this.updateAchievementsCounter();
    this.startTrayClock();
    this.initBirthplace();
    this.bindGlobalClickSound();
    this.bindWindowControls();
    this.bindMainMenu();
    this.bindTaskbar();
    this.bindDispatchActions();
    this.bindMapPanZoom();
    this.bindLockScreen();
    this.bindShutdownModal();
    this.bindTutorialWindow();
    this.bindMailClient();
    this.bindProfileWindow();
    this.bindBunkerBank();
    this.bindAppMarket();
    this.bindGazette();
    this.bindTorRadio();
    this.bindTelemetryAnalyzer();
    this.bindCalculator();
    this.bindWordPad();
    this.bindContextMenu();
    this.bindWallpaperWindow();
    this.currentWallpaper = localStorage.getItem("bunkeros_wallpaper") || "classic";
    this.applyWallpaper(this.currentWallpaper);
    this.bindTrayControls();
    this.initDraggableIcons();
    this.bindMapDirectSupply();
    this.bindDesktopMarqueeSelection();
    this.bindMapConduits();
    this.bindFlappyMinigame();
    this.bindOmegaTerminalActions();
    this.setupWindowResizeScaling();
    this.checkSavedGame();
  }

  // =========================================================================
  // GLOBAL SOUND BINDINGS (Mechanical Mouse Clicks)
  // =========================================================================
  bindGlobalClickSound() {
    document.addEventListener("mousedown", (e) => {
      if (e.target.id === "btn-approve-dispatch" || e.target.id === "btn-reject-dispatch") return;
      if (window.soundEngine) {
        window.soundEngine.playClick();
      }
    });
  }

  // =========================================================================
  // PERSISTENCE (SETTINGS & SAVE/LOAD)
  // =========================================================================
  loadSettings() {
    try {
      const saved = localStorage.getItem("bunkeros_settings");
      return saved ? JSON.parse(saved) : { crt: true, sound: true, ambient: true, volume: 70 };
    } catch (e) {
      return { crt: true, sound: true, ambient: true, volume: 70 };
    }
  }

  saveSettings() {
    localStorage.setItem("bunkeros_settings", JSON.stringify(this.settings));
  }

  applySettings() {
    const crtOverlay = document.getElementById("crt-overlay");
    if (crtOverlay) {
      if (this.settings.crt) crtOverlay.classList.remove("disabled");
      else crtOverlay.classList.add("disabled");
    }
    if (window.soundEngine) {
      window.soundEngine.toggleSound(this.settings.sound);
      window.soundEngine.setVolume(this.settings.volume / 100);
      if (this.settings.ambient && this.settings.sound) {
        window.soundEngine.startAmbient();
      } else {
        window.soundEngine.stopAmbient();
      }
    }
  }

  loadAchievements() {
    try {
      const saved = localStorage.getItem("bunkeros_achievements");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveAchievements() {
    localStorage.setItem("bunkeros_achievements", JSON.stringify(this.unlockedAchievements));
  }

  loadIconPositions() {
    try {
      const saved = localStorage.getItem("bunkeros_icon_positions");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  saveIconPositions() {
    localStorage.setItem("bunkeros_icon_positions", JSON.stringify(this.iconPositions));
  }

  saveGame() {
    const data = {
      day: this.day,
      sectors: this.sectors,
      resources: this.resources,
      playerProfile: this.playerProfile,
      receivedEmails: this.receivedEmails,
      desktopFolders: this.desktopFolders,
      pendingFines: this.pendingFines,
      dailyLogs: this.dailyLogs,
      totalCasualties: this.totalCasualties,
      flags: this.flags,
      stats: this.stats,
      vpnActive: this.vpnActive,
      seenDispatchIds: this.seenDispatchIds || [],
      conduits: this.conduits || { heat: 'mine', power: 'water', hydro: 'hydro' }
    };
    localStorage.setItem("bunkeros_save", JSON.stringify(data));
  }

  loadGame() {
    try {
      const saved = localStorage.getItem("bunkeros_save");
      if (!saved) return false;
      const data = JSON.parse(saved);
      this.day = data.day || 1;
      this.sectors = data.sectors || JSON.parse(JSON.stringify(GAME_SECTORS_INIT));
      this.resources = data.resources || { ...INITIAL_RESOURCES };
      this.playerProfile = data.playerProfile || {
        name: "Алексей Волков",
        id: "ДИСП-74Б",
        balance: 1500,
        salary: 700,
        fineAmount: 800,
        rating: 92,
        fines: [],
        familyTransfers: 0,
        bankHistory: []
      };
      this.receivedEmails = data.receivedEmails || [];
      this.desktopFolders = data.desktopFolders || [];
      this.pendingFines = data.pendingFines || [];
      this.dailyLogs = data.dailyLogs || [];
      this.totalCasualties = data.totalCasualties || 0;
      this.flags = data.flags || {};
      this.stats = data.stats || { correctFraudsDetected: 0, dispatchesApprovedToday: 0 };
      this.vpnActive = !!data.vpnActive;
      this.seenDispatchIds = data.seenDispatchIds || [];
      this.conduits = data.conduits || { heat: 'mine', power: 'water', hydro: 'hydro' };
      this.seenDispatchIds = data.seenDispatchIds || [];
      this.conduits = data.conduits || { heat: 'mine', power: 'water', hydro: 'hydro' };
      this.seenDispatchIds = data.seenDispatchIds || [];
      this.conduits = data.conduits || { heat: 'mine', power: 'water', hydro: 'hydro' };
      return true;
    } catch (e) {
      return false;
    }
  }

  checkSavedGame() {
    this.updateAchievementsCounter();
    const btnResume = document.getElementById("btn-continue-game");
    const continueInfo = document.getElementById("continue-info");
    const hasSave = !!localStorage.getItem("bunkeros_save");
    if (btnResume) {
      btnResume.disabled = !hasSave;
      btnResume.style.opacity = hasSave ? "1" : "0.5";
      btnResume.style.cursor = hasSave ? "pointer" : "not-allowed";
    }
    if (continueInfo) {
      if (hasSave) {
        try {
          const data = JSON.parse(localStorage.getItem("bunkeros_save"));
          continueInfo.textContent = `ДЕНЬ ${data.day || 1} [ENTER]`;
        } catch (e) {
          continueInfo.textContent = "ЕСТЬ СОХРАНЕНИЕ";
        }
      } else {
        continueInfo.textContent = "НЕТ СОХРАНЕНИЯ";
      }
    }
  }

  // =========================================================================
  // CINEMATIC SOVIET BUNKER MAIN MENU (DESK, LAMP & CRT INTERACTION)
  // =========================================================================
  bindMainMenu() {
    const menuOverlay = document.getElementById("main-menu-overlay");
    const bunkerScene = document.getElementById("menu-bunker-scene");
    const btnNew = document.getElementById("btn-new-game");
    const btnResume = document.getElementById("btn-continue-game");
    const btnAch = document.getElementById("btn-nav-achievements");
    const btnSettings = document.getElementById("btn-nav-settings");
    const btnCredits = document.getElementById("btn-nav-credits");
    const btnExit = document.getElementById("btn-exit-game");

    this.menuSelectedIndex = 0;

    // Start ambient bunker computer hum
    window.soundEngine.startMenuHum();
    const triggerAudioOnFirstGesture = () => {
      window.soundEngine.startMenuHum();
      window.removeEventListener("click", triggerAudioOnFirstGesture);
      window.removeEventListener("keydown", triggerAudioOnFirstGesture);
    };
    window.addEventListener("click", triggerAudioOnFirstGesture, { once: true });
    window.addEventListener("keydown", triggerAudioOnFirstGesture, { once: true });

    // Procedural Desk Lamp Flicker & Electrical Crackle
    this.startLampFlickerSimulation();

    const showSubView = (subViewId) => {
      document.querySelectorAll(".bios-subview").forEach(el => el.classList.remove("active"));
      const target = document.getElementById(subViewId);
      if (target) target.classList.add("active");
      window.soundEngine.playMenuSelect();
    };

    const backToNav = () => {
      document.querySelectorAll(".bios-subview").forEach(el => el.classList.remove("active"));
      const main = document.getElementById("menu-view-main");
      if (main) main.classList.add("active");
      window.soundEngine.playMenuNavigate();
    };

    document.querySelectorAll(".bios-back-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-back-to") || "menu-view-main";
        showSubView(target);
      });
    });

    // Keyboard & Mouse Selection System for Menu Options
    const menuItems = Array.from(document.querySelectorAll(".bunker-menu-item"));

    const updateMenuVisualSelection = () => {
      menuItems.forEach((btn, idx) => {
        if (idx === this.menuSelectedIndex) {
          btn.classList.add("selected");
        } else {
          btn.classList.remove("selected");
        }
      });
    };

    const moveMenuSelection = (delta) => {
      const len = menuItems.length;
      let nextIdx = (this.menuSelectedIndex + delta + len) % len;
      // Skip disabled items if navigating
      if (menuItems[nextIdx].disabled) {
        nextIdx = (nextIdx + (delta > 0 ? 1 : -1) + len) % len;
      }
      if (nextIdx !== this.menuSelectedIndex) {
        this.menuSelectedIndex = nextIdx;
        updateMenuVisualSelection();
        window.soundEngine.playMenuNavigate();
      }
    };

    // Keyboard Listener
    window.addEventListener("keydown", (e) => {
      if (!menuOverlay || menuOverlay.classList.contains("hidden")) return;

      const mainView = document.getElementById("menu-view-main");
      const isMainActive = mainView && mainView.classList.contains("active");

      if (isMainActive) {
        if (e.key === "ArrowUp" || e.code === "KeyW") {
          e.preventDefault();
          moveMenuSelection(-1);
        } else if (e.key === "ArrowDown" || e.code === "KeyS") {
          e.preventDefault();
          moveMenuSelection(1);
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const curBtn = menuItems[this.menuSelectedIndex];
          if (curBtn && !curBtn.disabled) {
            window.soundEngine.playMenuSelect();
            curBtn.click();
          }
        } else if (e.key >= "1" && e.key <= "6") {
          const numIdx = parseInt(e.key) - 1;
          if (menuItems[numIdx] && !menuItems[numIdx].disabled) {
            this.menuSelectedIndex = numIdx;
            updateMenuVisualSelection();
            window.soundEngine.playMenuSelect();
            menuItems[numIdx].click();
          }
        }
      } else {
        if (e.key === "Escape") {
          e.preventDefault();
          backToNav();
        }
      }
    });

    // Mouse hover & click bindings
    menuItems.forEach((item, idx) => {
      item.addEventListener("mouseenter", () => {
        if (!item.disabled && this.menuSelectedIndex !== idx) {
          this.menuSelectedIndex = idx;
          updateMenuVisualSelection();
          window.soundEngine.playMenuNavigate();
        }
      });
      item.addEventListener("click", () => {
        if (!item.disabled) {
          window.soundEngine.playMenuSelect();
        }
      });
    });

    if (btnAch) {
      btnAch.addEventListener("click", () => {
        this.renderAchievementsGallery();
        showSubView("menu-view-achievements");
      });
    }

    if (btnSettings) {
      btnSettings.addEventListener("click", () => {
        const chkCrt = document.getElementById("menu-check-crt");
        const chkSound = document.getElementById("menu-check-sound");
        const rangeVol = document.getElementById("menu-range-volume");
        if (chkCrt) chkCrt.checked = this.settings.crt;
        if (chkSound) chkSound.checked = this.settings.sound;
        if (rangeVol) rangeVol.value = this.settings.volume;
        showSubView("menu-view-settings");
      });
    }

    if (btnCredits) {
      btnCredits.addEventListener("click", () => {
        showSubView("menu-view-credits");
      });
    }

    document.getElementById("menu-btn-reset-save")?.addEventListener("click", () => {
      if (confirm("Вы действительно хотите сбросить сохраненный прогресс смены? Достижения сохранятся.")) {
        localStorage.removeItem("bunkeros_save");
        this.checkSavedGame();
        this.showMessageBox("Прогресс смены сброшен.");
        backToNav();
      }
    });

    document.getElementById("menu-check-crt")?.addEventListener("change", (e) => {
      this.settings.crt = e.target.checked;
      this.saveSettings();
      this.applySettings();
    });

    document.getElementById("menu-check-sound")?.addEventListener("change", (e) => {
      this.settings.sound = e.target.checked;
      this.saveSettings();
      this.applySettings();
    });

    document.getElementById("menu-range-volume")?.addEventListener("input", (e) => {
      this.settings.volume = parseInt(e.target.value);
      this.saveSettings();
      this.applySettings();
    });

    if (btnNew) {
      btnNew.addEventListener("click", () => {
        window.soundEngine.stopMenuHum();
        menuOverlay.classList.add("hidden");
        this.startComicIntro(() => {
          this.showLockScreen(() => {
            this.startNewCampaign();
          });
        });
      });
    }

    if (btnResume) {
      btnResume.addEventListener("click", () => {
        if (this.loadGame()) {
          window.soundEngine.stopMenuHum();
          menuOverlay.classList.add("hidden");
          this.showLockScreen(() => {
            this.resumeCampaign();
          });
        }
      });
    }

    if (btnExit) {
      btnExit.addEventListener("click", () => {
        window.soundEngine.playCrtOff();
        setTimeout(() => {
          if (typeof window !== "undefined" && window.close) {
            window.close();
          }
        }, 500);
      });
    }
  }

  // =========================================================================
  // DYNAMIC DESK LAMP FLICKER & SYNCHRONOUS SHADOW SIMULATION
  // =========================================================================
  startLampFlickerSimulation() {
    const scene = document.getElementById("menu-bunker-scene");
    if (!scene) return;

    const scheduleNextFlicker = () => {
      const delay = Math.floor(Math.random() * 4500) + 3500;
      setTimeout(() => {
        const overlay = document.getElementById("main-menu-overlay");
        if (overlay && !overlay.classList.contains("hidden")) {
          const dipCount = Math.random() > 0.65 ? 2 : 1;
          this.runLampVoltageDip(scene, dipCount, () => {
            scheduleNextFlicker();
          });
        } else {
          scheduleNextFlicker();
        }
      }, delay);
    };

    scheduleNextFlicker();
  }

  runLampVoltageDip(scene, count, onDone) {
    if (count <= 0) {
      if (onDone) onDone();
      return;
    }

    scene.style.setProperty("--lamp-glow", "0.08");
    scene.style.setProperty("--shadow-dark", "0.32");

    if (Math.random() > 0.3) {
      window.soundEngine.playLampCrackle();
    }

    const dipDuration = Math.floor(Math.random() * 70) + 60;

    setTimeout(() => {
      scene.style.setProperty("--lamp-glow", "0.45");
      scene.style.setProperty("--shadow-dark", "0.08");

      if (count > 1) {
        setTimeout(() => {
          this.runLampVoltageDip(scene, count - 1, onDone);
        }, 80);
      } else {
        if (onDone) onDone();
      }
    }, dipDuration);
  }

  // =========================================================================
  // COMIC INTRO SLIDESHOW WITH PROCEDURAL RADIO NARRATOR & IMAGES
  // =========================================================================
  startComicIntro(onComplete) {
    const overlay = document.getElementById("comic-intro-overlay");
    const btnNext = document.getElementById("btn-comic-next");
    const btnSkip = document.getElementById("btn-comic-skip");

    this.comicSlideIdx = 0;
    overlay.classList.add("active");
    this.renderComicSlide();

    btnNext.onclick = () => {
      if (this.comicTypewriterInterval) clearInterval(this.comicTypewriterInterval);
      window.soundEngine.stopRadioNarration();

      this.comicSlideIdx++;
      if (this.comicSlideIdx >= COMIC_INTRO_SLIDES.length) {
        overlay.classList.remove("active");
        onComplete();
      } else {
        this.renderComicSlide();
      }
    };

    btnSkip.onclick = () => {
      if (this.comicTypewriterInterval) clearInterval(this.comicTypewriterInterval);
      window.soundEngine.stopRadioNarration();
      overlay.classList.remove("active");
      onComplete();
    };
  }

  renderComicSlide() {
    const slide = COMIC_INTRO_SLIDES[this.comicSlideIdx];
    if (!slide) return;

    document.getElementById("comic-frame-tag").textContent = slide.frameTag;
    document.getElementById("comic-slide-counter").textContent = `${this.comicSlideIdx + 1} из ${COMIC_INTRO_SLIDES.length}`;
    document.getElementById("comic-title").textContent = slide.title;
    
    // Set slide illustration image
    const imgEl = document.getElementById("comic-slide-img");
    if (imgEl && slide.image) {
      imgEl.src = slide.image;
    }

    // Typewriter effect + Procedural Radio Loudspeaker Voice
    if (this.comicTypewriterInterval) clearInterval(this.comicTypewriterInterval);
    const textEl = document.getElementById("comic-text");
    textEl.textContent = "";
    let charIdx = 0;
    const fullText = slide.text;

    window.soundEngine.playRadioNarration();

    this.comicTypewriterInterval = setInterval(() => {
      if (charIdx < fullText.length) {
        textEl.textContent += fullText[charIdx];
        charIdx++;
      } else {
        clearInterval(this.comicTypewriterInterval);
        window.soundEngine.stopRadioNarration();
      }
    }, 32);
  }

  // =========================================================================
  // LOCK SCREEN (Hides desktop until logged in - fixes flash bug!)
  // =========================================================================
  bindLockScreen() {
    const lockScreen = document.getElementById("lock-screen");
    const btnOk = document.getElementById("btn-login-ok");
    const btnCancel = document.getElementById("btn-login-cancel");
    const passInput = document.getElementById("login-password");

    const doLogin = () => {
      window.soundEngine.playWindowsLogon();
      lockScreen.classList.remove("active");
      const desktop = document.getElementById("desktop");
      desktop.style.display = "block";
      desktop.classList.add("unlocked");
      desktop.classList.add("screen-expanding");
      this.scheduleShiftEmergency();
      setTimeout(() => desktop.classList.remove("screen-expanding"), 550);

      window.soundEngine.startAmbient();

      if (this.onLoginCallback) {
        this.onLoginCallback();
        this.onLoginCallback = null;
      }
    };

    btnOk.addEventListener("click", doLogin);

    passInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") doLogin();
    });

    btnCancel.addEventListener("click", () => {
      lockScreen.classList.remove("active");
      document.getElementById("main-menu-overlay").classList.remove("hidden");
    });
  }

  showLockScreen(callback) {
    this.onLoginCallback = callback;
    const desktop = document.getElementById("desktop");
    desktop.classList.remove("unlocked");
    desktop.style.display = "none";

    const lockScreen = document.getElementById("lock-screen");
    lockScreen.classList.add("active");
    const passInput = document.getElementById("login-password");
    if (passInput) {
      passInput.value = "";
      setTimeout(() => passInput.focus(), 100);
    }
  }

  // =========================================================================
  // CAMPAIGN START & DAY ADVANCE
  // =========================================================================
  startNewCampaign() {
    this.day = 1;
    this.sectors = JSON.parse(JSON.stringify(GAME_SECTORS_INIT));
    this.resources = { ...INITIAL_RESOURCES };
    this.playerProfile = {
      name: "Алексей Волков",
      id: "ДИСП-74Б",
      balance: 1500,
      salary: 700,
      fineAmount: 800,
      rating: 92,
      fines: [],
      familyTransfers: 0,
      bankHistory: [
        "14.11.1998 07:30 [ОК]: Открытие счета ДИСП-74Б. Баланс: 1500 руб."
      ],
      installedApps: []
    };

    this.receivedEmails = EMAIL_DATABASE.filter(m => m.day === 1);
    this.desktopFolders = [];

    this.dailyLogs = [
      "[СИСТЕМА]: BunkerOS v3.11 активирована. Оператор [admin] заступил на смену.",
      "[СВОДКА]: Все 6 аванпостов находятся на связи. Ресурсы на распределение загружены в пневмосеть.",
      "[ИНСТРУКЦИЯ]: День 1 посвящен верификации. Сверяйте показания датчиков с текстом радиограмм перед отправкой дефицитных грузов!"
    ];
    this.totalCasualties = 0;
    this.deadToday = 0;
    this.flags = {};
    this.stats = {
      correctFraudsDetected: 0,
      dispatchesApprovedToday: 0,
      totalApproved: 0,
      totalRejected: 0
    };

    this.saveGame();
    this.loadDayDispatches(this.day);
    this.renderTacticalMap();
    this.selectSector(this.selectedSectorId);
    this.updateResourceUI();
    this.updateProfileUI();
    this.updateMailUI();
    this.updateBankUI();
    this.updateTray();

    // Open initial windows
    this.openWindow("win-map");
    this.openWindow("win-inbox");
    this.openWindow("win-depot");

    // Launch Step-by-Step Interactive Tutorial on Day 1
    this.startDay1InteractiveTutorial();

    // Show initial teletype briefing
    this.showDailySummary("ДОКЛАД О ЗАСТУПЛЕНИИ НА СМЕНУ — 14.11.1998", this.dailyLogs, 0);
  }

  resumeCampaign() {
    this.loadDayDispatches(this.day);
    this.renderTacticalMap();
    this.selectSector(this.selectedSectorId);
    this.updateResourceUI();
    this.updateProfileUI();
    this.updateMailUI();
    this.updateBankUI();
    this.updateTray();
    this.renderDesktopFolders();

    this.openWindow("win-map");
    this.openWindow("win-inbox");
    this.openWindow("win-depot");
  }

  // =========================================================================
  // DRAGGABLE DESKTOP ICONS (WITH SNAP-TO-GRID, ANTI-OVERLAP & FOLDER SUPPORT)
  // =========================================================================
  findFreeGridSlot(preferredX, preferredY, excludeId) {
    const cols = Math.max(1, Math.floor((window.innerWidth - 30) / 84));
    const rows = Math.max(1, Math.floor((window.innerHeight - 90) / 88));

    // Gather occupied grid positions of currently visible desktop icons
    const occupied = new Set();
    document.querySelectorAll(".desktop-icon").forEach(ic => {
      if (ic.id && ic.id !== excludeId && ic.style.display !== "none") {
        const x = parseInt(ic.style.left) || 15;
        const y = parseInt(ic.style.top) || 15;
        occupied.add(`${x},${y}`);
      }
    });

    if (preferredX !== undefined && preferredY !== undefined && !occupied.has(`${preferredX},${preferredY}`)) {
      return { x: preferredX, y: preferredY };
    }

    // Search for nearest free slot column by column
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const testX = 15 + c * 84;
        const testY = 15 + r * 88;
        if (!occupied.has(`${testX},${testY}`)) {
          return { x: testX, y: testY };
        }
      }
    }
    return { x: preferredX || 15, y: preferredY || 15 };
  }

  initDraggableIcons() {
    const icons = document.querySelectorAll(".desktop-icon");
    const cols = Math.max(1, Math.floor((window.innerWidth - 30) / 84));
    const rowsPerCol = Math.max(1, Math.floor((window.innerHeight - 90) / 88));

    const ICON_WINDOW_MAP = {
      "icon-map": "win-map",
      "icon-inbox": "win-inbox",
      "icon-depot": "win-depot",
      "icon-mail": "win-mail",
      "icon-profile": "win-profile",
      "icon-summary": "win-summary",
      "icon-bank": "win-bank",
      "icon-market": "win-market",
      "icon-gazette": "win-gazette",
      "icon-calc": "win-calc",
      "icon-telemetry": "win-telemetry",
      "icon-wordpad": "win-wordpad",
      "icon-tutorial": "win-tutorial",
      "icon-tor": "win-tor"
    };

    // First: check all folders to see if any shortcuts are stored inside them
    const itemsInFolders = new Set();
    this.desktopFolders.forEach(folder => {
      if (folder.items && Array.isArray(folder.items)) {
        folder.items.forEach(itemId => itemsInFolders.add(itemId));
      }
    });

    // Track placed grid cells during this pass to prevent any overlap
    const placedPositions = new Set();

    icons.forEach((icon, idx) => {
      icon.classList.add("draggable");
      const iconId = icon.id || `icon_${idx}`;

      // If shortcut is inside a folder, keep it hidden on the desktop
      if (itemsInFolders.has(iconId)) {
        icon.style.display = "none";
        return;
      }

      // Check current or saved position for collision
      let posX = this.iconPositions[iconId]?.x;
      let posY = this.iconPositions[iconId]?.y;

      if (posX === undefined || posY === undefined || placedPositions.has(`${posX},${posY}`)) {
        // Resolve collision: allocate next free slot
        const slot = this.findFreeGridSlot(posX, posY, iconId);
        posX = slot.x;
        posY = slot.y;
      }

      icon.style.left = `${posX}px`;
      icon.style.top = `${posY}px`;
      this.iconPositions[iconId] = { x: posX, y: posY };
      placedPositions.add(`${posX},${posY}`);

      // Avoid duplicate event listener bindings if already initialized
      if (icon._dragInitialized) return;
      icon._dragInitialized = true;

      // Pointer drag handlers
      let isDragging = false;
      let startMouseX = 0;
      let startMouseY = 0;
      let startIconX = 0;
      let startIconY = 0;
      let dragDistance = 0;

      icon.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return; // Left click only
        isDragging = false;
        dragDistance = 0;
        startMouseX = e.clientX;
        startMouseY = e.clientY;
        startIconX = parseInt(icon.style.left) || 15;
        startIconY = parseInt(icon.style.top) || 15;

        // Bring dragged element on top
        icon.style.zIndex = "99999";

        const onMouseMove = (moveEvt) => {
          const dx = moveEvt.clientX - startMouseX;
          const dy = moveEvt.clientY - startMouseY;
          dragDistance = Math.hypot(dx, dy);
          if (dragDistance > 5) {
            isDragging = true;
            icon.classList.add("dragging");
            icon.style.left = `${startIconX + dx}px`;
            icon.style.top = `${startIconY + dy}px`;

            // Detect folder hover targets on desktop (all custom folders except itself)
            const curX = moveEvt.clientX;
            const curY = moveEvt.clientY;
            document.querySelectorAll(".custom-folder-icon").forEach(fIcon => {
              if (fIcon === icon) return;
              const rect = fIcon.getBoundingClientRect();
              if (curX >= rect.left && curX <= rect.right && curY >= rect.top && curY <= rect.bottom) {
                fIcon.classList.add("folder-target");
              } else {
                fIcon.classList.remove("folder-target");
              }
            });

            // Detect if hovering over open win-folder window
            const winFolder = document.getElementById("win-folder");
            if (winFolder && winFolder.style.display !== "none") {
              const rect = winFolder.getBoundingClientRect();
              const grid = document.getElementById("folder-items-grid");
              if (grid) {
                if (curX >= rect.left && curX <= rect.right && curY >= rect.top && curY <= rect.bottom) {
                  grid.style.background = "#fff8d6";
                } else {
                  grid.style.background = "#fafafa";
                }
              }
            }
          }
        };

        const onMouseUp = (upEvt) => {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
          icon.style.zIndex = "";

          if (isDragging) {
            icon.classList.remove("dragging");

            const endX = upEvt.clientX;
            const endY = upEvt.clientY;

            // 1. Check if dropped onto a desktop folder icon
            let targetFolder = null;
            document.querySelectorAll(".custom-folder-icon").forEach(fIcon => {
              fIcon.classList.remove("folder-target");
              if (fIcon === icon) return;
              const rect = fIcon.getBoundingClientRect();
              if (endX >= rect.left && endX <= rect.right && endY >= rect.top && endY <= rect.bottom) {
                const fid = fIcon.getAttribute("data-folder-id");
                targetFolder = this.desktopFolders.find(f => f.id === fid);
              }
            });

            // 2. Check if dropped into open win-folder window
            const winFolder = document.getElementById("win-folder");
            if (!targetFolder && winFolder && winFolder.style.display !== "none") {
              const rect = winFolder.getBoundingClientRect();
              const grid = document.getElementById("folder-items-grid");
              if (grid) grid.style.background = "#fafafa";
              if (endX >= rect.left && endX <= rect.right && endY >= rect.top && endY <= rect.bottom) {
                targetFolder = this.desktopFolders.find(f => f.id === this.activeFolderId);
              }
            }

            if (targetFolder) {
              // Add icon to folder!
              this.addItemToFolder(targetFolder, iconId);
              window.soundEngine.playClick();
              return;
            }

            // Otherwise, snap to clean non-overlapping grid slot
            const rawX = parseInt(icon.style.left) || 15;
            const rawY = parseInt(icon.style.top) || 15;
            const snapCol = Math.max(0, Math.min(cols - 1, Math.round((rawX - 15) / 84)));
            const snapRow = Math.max(0, Math.min(rowsPerCol - 1, Math.round((rawY - 15) / 88)));
            const targetX = 15 + snapCol * 84;
            const targetY = 15 + snapRow * 88;

            const finalSlot = this.findFreeGridSlot(targetX, targetY, iconId);
            icon.style.left = `${finalSlot.x}px`;
            icon.style.top = `${finalSlot.y}px`;

            this.iconPositions[iconId] = { x: finalSlot.x, y: finalSlot.y };
            this.saveIconPositions();
            window.soundEngine.playClick();
          }
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });

      // Left click to open assigned window (if not dragging)
      icon.addEventListener("click", (e) => {
        if (dragDistance > 5) return; // Ignore drag release
        if (icon.classList.contains("custom-folder-icon")) {
          const fid = icon.getAttribute("data-folder-id");
          const folder = this.desktopFolders.find(f => f.id === fid);
          if (folder) this.openFolderWindow(folder);
          return;
        }

        const targetWin = ICON_WINDOW_MAP[icon.id];
        if (targetWin) {
          if (targetWin === "win-summary") {
            this.openDailySummaryView();
          } else {
            this.openWindow(targetWin);
          }
        } else if (icon.id === "icon-secret") {
          this.runSecretBatchEasterEgg();
        }
      });

      // Right-click context menu on icons
      icon.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openIconContextMenu(icon, e.clientX, e.clientY);
      });
    });

    this.saveIconPositions();
  }

  // =========================================================================
  // FOLDER MANAGEMENT & EXPLORER
  // =========================================================================
  addItemToFolder(folder, iconId) {
    if (!folder.items) folder.items = [];
    if (!folder.items.includes(iconId)) {
      folder.items.push(iconId);
    }
    const iconEl = document.getElementById(iconId);
    if (iconEl) {
      iconEl.style.display = "none";
    }
    delete this.iconPositions[iconId];
    this.saveIconPositions();
    this.saveGame();

    if (this.activeFolderId === folder.id) {
      this.renderFolderWindow(folder);
    }
  }

  openFolderWindow(folder) {
    this.activeFolderId = folder.id;
    const titleEl = document.getElementById("folder-title");
    if (titleEl) titleEl.textContent = `📁 ПРОВОДНИК: ${folder.name}`;
    this.renderFolderWindow(folder);
    this.openWindow("win-folder");
  }

  renderFolderWindow(folder) {
    if (!folder) return;
    const grid = document.getElementById("folder-items-grid");
    const msg = document.getElementById("folder-content-msg");
    if (!grid) return;

    grid.innerHTML = "";
    if (!folder.items) folder.items = [];

    const ICON_WINDOW_MAP = {
      "icon-map": "win-map",
      "icon-inbox": "win-inbox",
      "icon-depot": "win-depot",
      "icon-mail": "win-mail",
      "icon-profile": "win-profile",
      "icon-summary": "win-summary",
      "icon-bank": "win-bank",
      "icon-market": "win-market",
      "icon-gazette": "win-gazette",
      "icon-calc": "win-calc",
      "icon-wordpad": "win-wordpad",
      "icon-tutorial": "win-tutorial",
      "icon-tor": "win-tor"
    };

    if (folder.items.length === 0) {
      if (msg) msg.textContent = "Папка пуста. Перетащите сюда ярлык с рабочего стола.";
      return;
    }

    if (msg) msg.textContent = `Объектов в папке: ${folder.items.length}. Клик — запуск, ↗ — на рабочий стол.`;

    folder.items.forEach(itemId => {
      const original = document.getElementById(itemId);
      const svgHtml = original ? original.querySelector(".icon-img-svg")?.innerHTML || "📁" : "📁";
      const labelText = original ? original.querySelector(".icon-label")?.textContent || itemId : itemId;

      const card = document.createElement("div");
      card.className = "folder-item-card";
      card.title = `Запустить: ${labelText}`;
      card.innerHTML = `
        <button class="folder-item-extract-btn" title="Извлечь на рабочий стол">↗</button>
        <div class="folder-item-svg">${svgHtml}</div>
        <div class="folder-item-label">${labelText}</div>
      `;

      // Click to open application
      card.addEventListener("click", (e) => {
        if (e.target.classList.contains("folder-item-extract-btn")) return;
        const targetWin = ICON_WINDOW_MAP[itemId];
        if (targetWin) {
          if (targetWin === "win-summary") this.openDailySummaryView();
          else this.openWindow(targetWin);
        } else if (itemId === "icon-secret") {
          this.runSecretBatchEasterEgg();
        } else if (original) {
          original.click();
        }
      });

      // Extract button
      const btnExtract = card.querySelector(".folder-item-extract-btn");
      btnExtract.addEventListener("click", (e) => {
        e.stopPropagation();
        this.removeItemFromFolder(folder, itemId);
      });

      grid.appendChild(card);
    });
  }

  removeItemFromFolder(folder, iconId) {
    if (!folder.items) return;
    folder.items = folder.items.filter(id => id !== iconId);

    const iconEl = document.getElementById(iconId);
    if (iconEl) {
      iconEl.style.display = "flex";
      const slot = this.findFreeGridSlot(15, 15, iconId);
      iconEl.style.left = `${slot.x}px`;
      iconEl.style.top = `${slot.y}px`;
      this.iconPositions[iconId] = { x: slot.x, y: slot.y };
      this.saveIconPositions();
    }
    this.saveGame();
    window.soundEngine.playClick();
    this.renderFolderWindow(folder);
  }

  openDailySummaryView() {
    const win = document.getElementById("win-summary");
    if (!win) return;
    const titleEl = win.querySelector(".window-title");
    const paper = document.getElementById("summary-text-log");
    const deathCounter = document.getElementById("summary-dead-counter");

    titleEl.textContent = `[СВОДКА] ЖУРНАЛ СМЕНЫ — ДЕНЬ ${this.day}`;
    deathCounter.textContent = `Общие потери бункера: ${this.totalCasualties} чел.`;

    paper.innerHTML = "";
    if (this.dailyLogs.length === 0) {
      paper.innerHTML = "<div style='color: #666;'>Событий за текущую смену пока не зафиксировано. Все системы в дежурном режиме.</div>";
    } else {
      this.dailyLogs.forEach(log => {
        const line = document.createElement("div");
        line.style.marginBottom = "4px";
        line.textContent = `> ${log}`;
        paper.appendChild(line);
      });
    }

    this.openWindow("win-summary");
    const btnClose = document.getElementById("btn-close-summary");
    if (btnClose) {
      btnClose.onclick = () => {
        this.closeWindow("win-summary");
      };
    }
  }

  openIconContextMenu(icon, x, y) {
    const menu = document.getElementById("icon-context-menu");
    if (!menu) return;
    this.contextTargetIcon = icon;

    menu.style.left = `${Math.min(window.innerWidth - 150, x)}px`;
    menu.style.top = `${Math.min(window.innerHeight - 140, y)}px`;
    menu.style.display = "flex";

    const btnOpen = document.getElementById("ctx-icon-open");
    const btnRename = document.getElementById("ctx-icon-rename");
    const btnDelete = document.getElementById("ctx-icon-delete");
    const btnProps = document.getElementById("ctx-icon-props");

    btnOpen.onclick = () => {
      menu.style.display = "none";
      icon.click();
    };

    btnRename.onclick = () => {
      menu.style.display = "none";
      if (icon.classList.contains("custom-folder-icon")) {
        const labelEl = icon.querySelector(".icon-label");
        const newName = prompt("Новое имя папки:", labelEl.textContent);
        if (newName) {
          labelEl.textContent = newName;
          const folderObj = this.desktopFolders.find(f => f.id === icon.getAttribute("data-folder-id"));
          if (folderObj) folderObj.name = newName;
          this.saveGame();
        }
      } else {
        this.showMessageBox("Системные файлы и приложения BunkerOS переименовывать запрещено!");
      }
    };

    btnDelete.onclick = () => {
      menu.style.display = "none";
      // Allow deleting installed market apps (CRITICAL to remove malware virus!)
      if (icon.classList.contains("market-installed-icon")) {
        const appId = icon.getAttribute("data-app-id");
        if (confirm(`Удалить программу ${icon.querySelector(".icon-label").textContent} с диска?`)) {
          icon.remove();
          delete this.iconPositions[icon.id];
          this.saveIconPositions();

          const app = APP_MARKET_DATABASE.find(a => a.id === appId);
          if (app) app.installed = false;

          // If this app was the silent virus -> CURE VIRUS!
          if (app && app.infected) {
            if (this.virusInterval) {
              clearInterval(this.virusInterval);
              this.virusInterval = null;
            }
            this.checkAchievement("ach_sysadmin");
            window.soundEngine.playAchievementChime();
            this.showMessageBox("ВНИМАНИЕ: Процесс удален. Скрытый фоновый перехватчик счетов изолирован! Утечка средств прекращена.");
          } else {
            window.soundEngine.playClick();
          }
          this.renderMarketApps();
        }
      } else if (icon.classList.contains("custom-folder-icon")) {
        if (confirm("Удалить эту папку?")) {
          const fid = icon.getAttribute("data-folder-id");
          const folder = this.desktopFolders.find(f => f.id === fid);
          if (folder && folder.items && folder.items.length > 0) {
            folder.items.forEach(itemId => {
              const itemEl = document.getElementById(itemId);
              if (itemEl) {
                itemEl.style.display = "flex";
                const free = this.findFreeGridSlot(15, 15, itemId);
                itemEl.style.left = `${free.x}px`;
                itemEl.style.top = `${free.y}px`;
                this.iconPositions[itemId] = { x: free.x, y: free.y };
              }
            });
          }
          this.desktopFolders = this.desktopFolders.filter(f => f.id !== fid);
          icon.remove();
          delete this.iconPositions[icon.id];
          this.saveIconPositions();
          this.saveGame();
          if (this.activeFolderId === fid) {
            this.closeWindow("win-folder");
          }
        }
      } else {
        window.soundEngine.playErrorChord();
        this.showMessageBox("ОШИБКА: Защищенный системный файл BunkerOS! Удаление заблокировано Службой Безопасности.");
      }
    };

    btnProps.onclick = () => {
      menu.style.display = "none";
      this.showMessageBox(`Свойства объекта: ${icon.querySelector('.icon-label').textContent}\nТип: Исполняемый файл BunkerOS v3.11\nРасположение: C:\\BUNKER\\SYSTEM\nДоступ: Чтение/Запись`);
    };
  }

  // =========================================================================
  // BUNKERBANK (WIN95 FINANCIAL TRANSFERS & DRAMA)
  // =========================================================================
  bindBunkerBank() {
    const iconBank = document.getElementById("icon-bank");
    const startItemBank = document.getElementById("start-item-bank");
    const btnSend = document.getElementById("btn-bank-send");
    const inputAcc = document.getElementById("bank-input-account");
    const inputAmt = document.getElementById("bank-input-amount");
    const feeDisplay = document.getElementById("bank-fee-display");
    const totalDisplay = document.getElementById("bank-total-display");
    const statusDisplay = document.getElementById("bank-transfer-status");

    if (iconBank) iconBank.addEventListener("click", () => {
      this.updateBankUI();
      this.openWindow("win-bank");
    });

    if (startItemBank) startItemBank.addEventListener("click", () => {
      this.toggleStartMenu(false);
      this.updateBankUI();
      this.openWindow("win-bank");
    });

    // Dynamic fee calculator on input
    const recalc = () => {
      const amt = parseInt(inputAmt.value) || 0;
      const fee = Math.ceil(amt * 0.03);
      const total = amt + fee;
      feeDisplay.textContent = `${fee} руб.`;
      totalDisplay.textContent = `${total} руб.`;
    };

    inputAmt.addEventListener("input", recalc);

    btnSend.addEventListener("click", () => {
      const acc = inputAcc.value.trim();
      const amt = parseInt(inputAmt.value);
      if (!amt || amt <= 0) {
        statusDisplay.textContent = "Укажите корректную сумму!";
        window.soundEngine.playErrorChord();
        return;
      }

      const fee = Math.ceil(amt * 0.03);
      const total = amt + fee;

      if (this.playerProfile.balance < total) {
        statusDisplay.textContent = "Недостаточно средств на балансе!";
        window.soundEngine.playErrorChord();
        return;
      }

      // 1. Easter egg: transfer to self!
      if (acc === "74Б" || acc === "74B" || acc === "ДИСП-74Б" || acc === "DISP-74B") {
        this.checkAchievement("ach_loop");
        statusDisplay.textContent = "СБОЙ: Замкнутый контур! Перевод на собственный служебный счет запрещен.";
        window.soundEngine.playWarning();
        return;
      }

      // 2. Transfer to Family (Анна Волкова, 48712)
      if (acc === "48712") {
        this.playerProfile.balance -= total;
        this.playerProfile.familyTransfers = (this.playerProfile.familyTransfers || 0) + amt;
        this.playerProfile.bankHistory.unshift(
          `${GAME_DATES[this.day - 1]} 12:15 -> Перевод семье (жетон 48712): -${amt} руб. (комиссия: ${fee} руб.)`
        );
        window.soundEngine.playCash();
        statusDisplay.style.color = "#006600";
        statusDisplay.textContent = `Успешно отправлено ${amt} руб. в Жилой Блок №4 (Анна Волкова).`;

        if (this.playerProfile.familyTransfers >= 2500) {
          this.checkAchievement("ach_good_father");
        }

        inputAmt.value = "";
        recalc();
        this.updateProfileUI();
        this.updateBankUI();
        this.saveGame();
        return;
      }

      // 2.5 Transfer / Bribe to Housing Commandant (Майор Громов, счет 55102) - 3500 руб.
      if (acc === "55102") {
        if (amt < 3500) {
          statusDisplay.textContent = "Майор Громов: «Меньше 3500 руб. даже не суйся! Переселение стоит 3500 ровно».";
          window.soundEngine.playErrorChord();
          return;
        }
        if (this.flags.familyRelocated) {
          statusDisplay.textContent = "Семья уже успешно переселена на Инженерный ярус 2!";
          window.soundEngine.playWarning();
          return;
        }

        this.playerProfile.balance -= total;
        this.flags.familyRelocated = true;
        this.modifyRating("family", 40);
        this.playerProfile.bankHistory.unshift(
          `${GAME_DATES[this.day - 1]} 13:40 -> Комендатура (счет 55102, Майор Громов): -${amt} руб. (Взятка за перевод на Ярус 2)`
        );
        window.soundEngine.playCash();
        statusDisplay.style.color = "#006600";
        statusDisplay.textContent = `[УСПЕХ]: Майор Громов выделил ордер! Семья переведена на сухой Инженерный ярус 2 (+40% к семье)!`;
        this.logEvent(`[ЖИЛИЩНЫЙ ОРДЕР]: Ваша семья покинула сырой подвал Блока №4! Настя идет на поправку, Миша в безопасности.`);

        inputAmt.value = "";
        recalc();
        this.updateProfileUI();
        this.updateBankUI();
        this.saveGame();
        return;
      }

      // 3. Transfer to Rebels (Свободный Ярус, 91003)
      if (acc === "91003") {
        this.playerProfile.balance -= total;
        this.flags.rebelsFunded = true;
        this.playerProfile.bankHistory.unshift(
          `${GAME_DATES[this.day - 1]} 14:02 -> Шифрованный платеж узлу 91003: -${amt} руб. (комиссия: ${fee} руб.)`
        );
        window.soundEngine.playCash();
        statusDisplay.style.color = "#006600";
        statusDisplay.textContent = `Платеж принят узлом «Свободный Ярус».`;

        inputAmt.value = "";
        recalc();
        this.updateProfileUI();
        this.updateBankUI();
        this.saveGame();
        return;
      }

      // 4. Transfer to Smugglers (55140)
      if (acc === "55140") {
        this.playerProfile.balance -= total;
        this.playerProfile.bankHistory.unshift(
          `${GAME_DATES[this.day - 1]} 15:40 -> Перевод на теневой склад №9: -${amt} руб. (комиссия: ${fee} руб.)`
        );
        window.soundEngine.playCash();
        statusDisplay.style.color = "#006600";
        statusDisplay.textContent = `Средства переведены на склад №9.`;

        inputAmt.value = "";
        recalc();
        this.updateProfileUI();
        this.updateBankUI();
        this.saveGame();
        return;
      }

      // Unknown account
      statusDisplay.style.color = "#cc0000";
      statusDisplay.textContent = `Ошибка: Номер счета «${acc}» отсутствует в базе Госплана.`;
      window.soundEngine.playErrorChord();
    });
  }

  updateBankUI() {
    const balEl = document.getElementById("bank-current-balance");
    const histEl = document.getElementById("bank-history-log");
    if (balEl) balEl.textContent = `${this.playerProfile.balance} руб.`;
    if (histEl && this.playerProfile.bankHistory) {
      histEl.innerHTML = this.playerProfile.bankHistory.map(entry => `&gt; ${entry}`).join("<br>");
    }
  }

  // =========================================================================
  // APP MARKET (БУНКЕР-МАРКЕТ) & SILENT MALWARE VIRUS
  // =========================================================================
  bindAppMarket() {
    const iconMarket = document.getElementById("icon-market");
    const startItemMarket = document.getElementById("start-item-market");

    if (iconMarket) iconMarket.addEventListener("click", () => {
      this.renderMarketApps();
      this.openWindow("win-market");
    });

    if (startItemMarket) startItemMarket.addEventListener("click", () => {
      this.toggleStartMenu(false);
      this.renderMarketApps();
      this.openWindow("win-market");
    });
  }

  renderMarketApps() {
    const container = document.getElementById("market-app-list");
    if (!container) return;
    container.innerHTML = "";

    APP_MARKET_DATABASE.forEach(app => {
      const card = document.createElement("div");
      card.className = "market-app-item";
      card.innerHTML = `
        <div class="market-app-icon">
          <svg viewBox="0 0 32 32">
            <rect x="2" y="2" width="28" height="28" fill="#1b2a38" stroke="#000" stroke-width="1.5"/>
            <text x="16" y="20" fill="#ffcc00" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">.EXE</text>
          </svg>
        </div>
        <div class="market-app-details">
          <div class="market-app-title">${app.name} — <span style="color: #006600;">${app.price} руб.</span></div>
          <div class="market-app-desc">${app.desc}</div>
        </div>
        <div>
          ${app.installed 
            ? `<button class="btn-win" disabled style="opacity: 0.6; font-size: 10px;">[ УСТАНОВЛЕНО ]</button>`
            : `<button class="btn-win btn-buy-app" data-id="${app.id}" style="font-weight: bold; font-size: 11px; padding: 4px 10px;">КУПИТЬ</button>`
          }
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll(".btn-buy-app").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.buyMarketApp(id);
      });
    });
  }

  buyMarketApp(appId) {
    const app = APP_MARKET_DATABASE.find(a => a.id === appId);
    if (!app || app.installed) return;

    if (this.playerProfile.balance < app.price) {
      this.showMessageBox("Недостаточно средств на лицевом счете оператора!");
      window.soundEngine.playErrorChord();
      return;
    }

    this.playerProfile.balance -= app.price;
    app.installed = true;
    window.soundEngine.playCash();

    // App specific effects
    if (app.id === "app_telemetry") {
      this.flags.telemetryAnalyzerInstalled = true;
      this.showMessageBox("«Анализатор телеметрии v1.2» установлен. Входящие депеши теперь подсвечивают подозрительные аномалии!");
    } else if (app.id === "app_power_key") {
      this.resources.fuel += 1;
      this.updateResourceUI();
      this.showMessageBox("Служебный ключ активирован. В резерв пневмосети добавлена 1 Топливная Ячейка!");
    } else if (app.id === "app_mystery_box") {
      this.flags.omegaProtocolUnlocked = true;
      this.checkAchievement("ach_shadow_deal");
      this.openOmegaProtocolWindow();
      this.showMessageBox("Артефакт «???» [Спецхранение КСР] получен бесплатно!\nСекретный протокол «ОМЕГА» запущен на терминале.");
    } else {
      this.showMessageBox(`Программа «${app.name}» успешно установлена на рабочий стол.`);
    }

    // Spawn shortcut on desktop
    this.createAppDesktopShortcut(app);

    // If application has silent virus -> launch silent drain timer!
    if (app.infected) {
      this.startSilentVirus();
    }

    this.renderMarketApps();
    this.updateProfileUI();
    this.updateBankUI();
    this.saveGame();
  }

  createAppDesktopShortcut(app) {
    const desktop = document.querySelector(".desktop-icons");
    if (!desktop) return;

    const icon = document.createElement("div");
    icon.className = "desktop-icon draggable market-installed-icon";
    icon.id = `icon_app_${app.id}`;
    icon.setAttribute("data-app-id", app.id);
    icon.title = `${app.name} (Установлено)`;
    icon.innerHTML = `
      <div class="icon-img-svg">
        <svg viewBox="0 0 32 32">
          <rect x="4" y="4" width="24" height="24" rx="2" fill="#2b4a3a" stroke="#000" stroke-width="1.5"/>
          <text x="16" y="20" fill="#33ff66" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">APP</text>
        </svg>
      </div>
      <div class="icon-label">${app.name.split(" ")[0]}.exe</div>
    `;

    // Position in available spot
    const x = 15 + Math.floor(Math.random() * 3) * 84;
    const y = 200 + Math.floor(Math.random() * 3) * 88;
    icon.style.left = `${x}px`;
    icon.style.top = `${y}px`;
    this.iconPositions[icon.id] = { x, y };

    desktop.appendChild(icon);
    this.initDraggableIcons();
  }

  startSilentVirus() {
    if (this.virusInterval) return;
    // Steals 100 rub every 60 seconds silently!
    this.virusInterval = setInterval(() => {
      if (this.playerProfile.balance > -2000) {
        this.playerProfile.balance -= 100;
        this.virusStolenTotal = (this.virusStolenTotal || 0) + 100;
        window.soundEngine.playVirusGlitch();
        this.updateProfileUI();
        this.updateBankUI();
      }
    }, 60000);
  }

  // =========================================================================
  // GAZETTE: «БУНКЕРНЫЙ ВЕСТНИК» (DAILY NEWSPAPER WITH DYNAMIC STORIES)
  // =========================================================================
  bindGazette() {
    const iconGazette = document.getElementById("icon-gazette");
    if (iconGazette) {
      iconGazette.addEventListener("click", () => {
        this.renderGazettePaper();
        this.openWindow("win-gazette");
      });
    }
  }

  renderGazettePaper() {
    const paperEl = document.getElementById("gazette-paper-content");
    const unreadDot = document.getElementById("gazette-unread-dot");
    if (unreadDot) unreadDot.style.display = "none";
    if (!paperEl) return;

    if (this.day === 1) {
      paperEl.innerHTML = `
        <div class="gazette-header">
          <div class="gazette-meta">
            <span>ГОСПЛАН СССР • БУНКЕР-КОМПЛЕКС «ОМЕГА»</span>
            <span>ВЫПУСК № 4,111 • 14 НОЯБРЯ 1998 г.</span>
          </div>
          <div class="gazette-title">БУНКЕРНЫЙ ВЕСТНИК</div>
          <div class="gazette-motto">«Дисциплина каждого — спасение для всех»</div>
        </div>
        <div class="gazette-headline">НАЗНАЧЕН НОВЫЙ ДИСПЕТЧЕР СМЕНЫ №5!</div>
        <div class="gazette-subhead">Товарищ Волков А.И. заступил на круглосуточное дежурство у главного терминала</div>
        <div class="gazette-body-columns">
          Сегодня в 08:00 приказом Комендатуры к управлению пневмосетью приступил диспетчер Алексей Волков. Предыдущий оператор был переведен на другие ответственные работы. Всем секторам бункера предписано подавать заявки строго по установленному регламенту.<br><br>
          Начальник ОК Майоров напомнил о персональной материальной ответственности за каждую нештатную ситуацию: штраф 800 рублей за аварийный инцидент. Комплекс надеется на точность и бдительность новой смены!
        </div>
      `;
      return;
    }

    const data = GAZETTE_DATABASE[`day${this.day}`];
    if (!data) return;

    // Check branch: good or bad based on domino catastrophe flags
    let isBad = false;
    if (this.day === 2 && this.flags.mineFlooded) isBad = true;
    if (this.day === 3 && this.flags.radarLost) isBad = true;
    if (this.day === 4 && this.flags.waterCrisis) isBad = true;
    if (this.day === 5 && this.flags.refugeesKilled) isBad = true;
    if (this.day === 6 && this.flags.reactorExploded) isBad = true;
    if (this.day === 7 && this.flags.hospitalBurned) isBad = true;

    const article = isBad ? data.bad : data.good;

    paperEl.innerHTML = `
      <div class="gazette-header">
        <div class="gazette-meta">
          <span>ГОСПЛАН СССР • БУНКЕР «ОМЕГА»</span>
          <span>ВЫПУСК ${data.number} • ${data.date}</span>
        </div>
        <div class="gazette-title">БУНКЕРНЫЙ ВЕСТНИК</div>
        <div class="gazette-motto">«Труд и стойкость перед лицом ядерной зимы»</div>
      </div>
      <div class="gazette-headline" style="${isBad ? 'color: #8b0000;' : 'color: #004d40;'}">${article.headline}</div>
      <div class="gazette-subhead">${article.subhead}</div>
      <div class="gazette-body-columns">
        ${article.text}<br><br>
        <em>«Служба безопасности напоминает: любые несанкционированные финансовые операции и радиопередачи на частных волнах караются трибуналом!»</em>
      </div>
    `;
  }

  // =========================================================================
  // EMERGENCY SIREN MINI-EVENTS (RANDOM ALARMS)
  // =========================================================================
  scheduleShiftEmergency() {
    if (this.shiftEmergencyTimer) clearTimeout(this.shiftEmergencyTimer);
    // Emergency siren starts strictly from Day 4 onwards!
    if (this.day < 4) return;

    const delay = Math.floor(Math.random() * 30000) + 35000;
    this.shiftEmergencyTimer = setTimeout(() => {
      const desktop = document.getElementById("desktop");
      if (desktop && desktop.classList.contains("unlocked") && !this.emergencyTriggeredToday && !this.emergencyActive) {
        this.emergencyTriggeredToday = true;
        this.triggerRandomEmergency();
      }
    }, delay);
  }

    triggerRandomEmergency() {
    if (this.emergencyActive) return;
    const evt = RANDOM_EVENTS_DATABASE[Math.floor(Math.random() * RANDOM_EVENTS_DATABASE.length)];
    if (!evt) return;

    this.emergencyActive = true;
    const overlay = document.getElementById("emergency-overlay");
    const titleEl = document.getElementById("emergency-title");
    const descEl = document.getElementById("emergency-desc");
    const timerEl = document.getElementById("emergency-timer");
    const optionsEl = document.getElementById("emergency-options");

    titleEl.textContent = evt.title;
    descEl.textContent = evt.desc;
    optionsEl.innerHTML = "";

    window.soundEngine.playAlarmSiren(evt.durationSec);
    overlay.style.display = "flex";

    let timeLeft = evt.durationSec;
    timerEl.textContent = String(timeLeft).padStart(2, "0");

    const resolveChoice = (option) => {
      clearInterval(this.emergencyTimerInterval);
      window.soundEngine.stopAlarmSiren();
      overlay.style.display = "none";
      this.emergencyActive = false;

      // Apply resource costs
      if (option.cost.fuel) this.resources.fuel = Math.max(0, this.resources.fuel - option.cost.fuel);
      if (option.cost.meds) this.resources.meds = Math.max(0, this.resources.meds - option.cost.meds);
      if (option.cost.ammo) this.resources.ammo = Math.max(0, this.resources.ammo - option.cost.ammo);
      if (option.cost.water) this.resources.water = Math.max(0, this.resources.water - option.cost.water);

      this.dailyLogs.unshift(`[ЧП]: ${option.result}`);
      this.updateResourceUI();
      // Send official civil defense report to BunkerMail instead of system alert
      this.receivedEmails.unshift({
        id: `mail_emergency_${Date.now()}`,
        day: this.day,
        from: "Штаб ГО и ЧП <go_chs@bunker.gov>",
        date: `${GAME_DATES[this.day - 1] || '1998'} 14:15`,
        subject: `[ОТЧЕТ ЧП]: ${evt.title}`,
        unread: true,
        body: `ДИСПЕТЧЕРУ СЕКТОРА «ОМЕГА» ВОЛКОВУ А.И.\n\nШтаб Гражданской Обороны и Чрезвычайных Ситуаций зафиксировал завершение аварийной тревоги.\n\nРЕЗУЛЬТАТ ДЕЙСТВИЙ:\n${option.result}\n\nРасход ресурсов списан по аварийной ведомости. Держите сектор в боевой готовности.\n— Дежурный офицер Штаба ГО`
      });
      this.updateMailUI();
      window.soundEngine.playIncomingMail();
    };

    evt.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "btn-emergency-choice";
      btn.innerHTML = `<strong>[${idx + 1}]</strong> ${opt.text}`;
      btn.onclick = () => resolveChoice(opt);
      optionsEl.appendChild(btn);
    });

    this.emergencyTimerInterval = setInterval(() => {
      timeLeft--;
      timerEl.textContent = String(Math.max(0, timeLeft)).padStart(2, "0");
      if (timeLeft <= 0) {
        // Timeout -> worst option
        resolveChoice(evt.options[evt.options.length - 1]);
      }
    }, 1000);
  }

  // =========================================================================
  // COMENDATURA INSPECTIONS (TIED TO TRUST RATING & CONTRABAND FLAGS)
  // =========================================================================
  triggerInspection(onDone) {
    const modal = document.getElementById("inspection-modal");
    const speechEl = document.getElementById("inspection-speech");
    const resultEl = document.getElementById("inspection-result-box");
    const btnAck = document.getElementById("btn-inspection-ack");
    if (!modal) {
      if (onDone) onDone();
      return;
    }

    const winBox = document.getElementById("inspection-window-box") || modal.querySelector(".window");
    if (winBox) {
      winBox.style.display = "flex";
      winBox.style.flexDirection = "column";
    }

    // Fair inspection: evaluates real casualties and skipped shift work
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
    }

    this.updateProfileUI();

    btnAck.onclick = () => {
      modal.style.display = "none";
      if (onDone) onDone();
    };
  }

  // =========================================================================
  // BUNKERMAIL CLIENT
  // =========================================================================
  bindMailClient() {
    const iconMail = document.getElementById("icon-mail");
    const startItemMail = document.getElementById("start-item-mail");

    if (iconMail) iconMail.addEventListener("click", () => this.openWindow("win-mail"));
    if (startItemMail) startItemMail.addEventListener("click", () => {
      this.toggleStartMenu(false);
      this.openWindow("win-mail");
    });
  }

  updateMailUI() {
    const tableBody = document.getElementById("mail-table-body");
    const unreadSpan = document.getElementById("mail-unread-count");
    const badgeDot = document.getElementById("mail-badge-dot");
    if (!tableBody) return;

    tableBody.innerHTML = "";
    const unreadCount = this.receivedEmails.filter(m => m.unread).length;
    if (unreadSpan) unreadSpan.textContent = unreadCount;
    if (badgeDot) badgeDot.style.display = unreadCount > 0 ? "block" : "none";

    this.receivedEmails.forEach(mail => {
      const tr = document.createElement("tr");
      if (mail.unread) tr.className = "unread";
      tr.innerHTML = `
        <td>${mail.from.split("<")[0]}</td>
        <td>${mail.subject}</td>
        <td>${mail.date}</td>
      `;

      tr.addEventListener("click", () => {
        document.querySelectorAll("#mail-table-body tr").forEach(r => r.classList.remove("selected"));
        tr.classList.add("selected");
        mail.unread = false;
        tr.classList.remove("unread");
        this.updateMailUI();

        const preview = document.getElementById("mail-preview-body");
        if (preview) {
          preview.innerHTML = `
            <div style="border-bottom: 1px solid #ccc; padding-bottom: 6px; margin-bottom: 10px;">
              <strong>ОТ:</strong> ${mail.from}<br>
              <strong>ДАТА:</strong> ${mail.date}<br>
              <strong>ТЕМА:</strong> ${mail.subject}
            </div>
            <div style="white-space: pre-wrap;">${mail.body}</div>
          `;
        }

        const repliesBox = document.getElementById("mail-interactive-replies");
        if (repliesBox) {
          repliesBox.innerHTML = "";
          if (mail.hasReplies && !mail.replied && mail.replies && mail.replies.length > 0) {
            repliesBox.style.display = "flex";
            const hdr = document.createElement("div");
            hdr.style.fontWeight = "bold";
            hdr.style.fontSize = "11px";
            hdr.style.color = "#000080";
            hdr.textContent = "ВЫБЕРИТЕ ВАРИАНТ ОТВЕТА:";
            repliesBox.appendChild(hdr);

            mail.replies.forEach((rep) => {
              const btn = document.createElement("button");
              btn.className = "mail-reply-btn";
              btn.textContent = rep.text;
              btn.onclick = () => {
                mail.replied = true;
                mail.body += `\n\n[ВАШ ОТВЕТ]:\n${rep.text}\n\n${rep.responseBody}`;
                if (rep.effects) {
                  if (rep.effects.ratingFamily) this.modifyRating("family", rep.effects.ratingFamily);
                  if (rep.effects.ratingGos) this.modifyRating("gos", rep.effects.ratingGos);
                  if (rep.effects.ratingKsr) this.modifyRating("ksr", rep.effects.ratingKsr);
                  if (rep.effects.ksrDealAccepted) {
                    this.flags.ksrDealAccepted = true;
                    const ab = TOR_MARKET_DATABASE.find(item => item.id === "tor_antibiotics");
                    if (ab) ab.price = ab.discountPrice || 1200;
                  }
                  if (rep.effects.unlockBlackMarket || rep.effects.ksrDealAccepted) {
                    this.flags.blackMarketUnlocked = true;
                    this.updateTorRadioDisplay();
                  }
                  if (rep.effects.unlockBlackMarket || rep.effects.ksrDealAccepted) {
                    this.flags.blackMarketUnlocked = true;
                    this.updateTorRadioDisplay();
                  }
                }
                window.soundEngine.playTeletype();
                repliesBox.style.display = "none";
                if (preview) {
                  preview.querySelector("div:last-child").textContent = mail.body;
                }
                this.updateProfileUI();
              };
              repliesBox.appendChild(btn);
            });
          } else {
            repliesBox.style.display = "none";
          }
        }
      });

      tableBody.appendChild(tr);
    });
  }

  // =========================================================================
  // ADMINISTRATOR PROFILE & ECONOMY
  // =========================================================================
  bindProfileWindow() {
    const iconProfile = document.getElementById("icon-profile");
    const startItemProfile = document.getElementById("start-item-profile");

    if (iconProfile) iconProfile.addEventListener("click", () => {
      this.updateProfileUI();
      this.openWindow("win-profile");
    });

    if (startItemProfile) startItemProfile.addEventListener("click", () => {
      this.toggleStartMenu(false);
      this.updateProfileUI();
      this.openWindow("win-profile");
    });
  }

  updateProfileUI() {
    const balEl = document.getElementById("profile-balance");
    const finesEl = document.getElementById("profile-fines-log");

    if (balEl) {
      balEl.textContent = `${this.playerProfile.balance} руб.`;
      if (this.playerProfile.balance < 0) balEl.classList.add("debt");
      else balEl.classList.remove("debt");
    }

    // 3 Dynamic Ratings
    const gosVal = this.playerProfile.ratingGos ?? 70;
    const ksrVal = this.playerProfile.ratingKsr ?? 15;
    const famVal = this.playerProfile.ratingFamily ?? 100;

    const elGos = document.getElementById("profile-rating-gos");
    const elKsr = document.getElementById("profile-rating-ksr");
    const elFam = document.getElementById("profile-rating-family");
    const barGos = document.getElementById("bar-rating-gos");
    const barKsr = document.getElementById("bar-rating-ksr");
    const barFam = document.getElementById("bar-rating-family");

    if (elGos) elGos.textContent = `${gosVal}%`;
    if (elKsr) elKsr.textContent = `${ksrVal}%`;
    if (elFam) elFam.textContent = `${famVal}%`;

    if (barGos) barGos.style.width = `${gosVal}%`;
    if (barKsr) barKsr.style.width = `${ksrVal}%`;
    if (barFam) barFam.style.width = `${famVal}%`;

    // Backwards compatibility for single rating element if present
    const singleRating = document.getElementById("profile-rating");
    if (singleRating) {
      singleRating.textContent = `${gosVal}%`;
      singleRating.style.color = gosVal < 50 ? "#cc0000" : (gosVal < 80 ? "#cc8800" : "#006600");
    }

    if (finesEl) {
      if (this.playerProfile.fines.length === 0) {
        finesEl.innerHTML = "&gt; Взысканий не зафиксировано. Оклад начисляется исправно.";
      } else {
        finesEl.innerHTML = this.playerProfile.fines.map(f => `&gt; [ШТРАФ ${f.date}]: -${f.amount} руб. (${f.reason})`).join("<br>");
      }
    }

    // Critical bankruptcy threshold: Debt over -2400 rub triggers instant debtor arrest!
    this.checkBankruptcy();
  }

  queuePendingFine(reason, amount = null) {
    if (!this.pendingFines) this.pendingFines = [];
    const fineAmt = (amount !== null) ? amount : this.playerProfile.fineAmount;
    this.pendingFines.push({
      amount: fineAmt,
      date: GAME_DATES[this.day - 1],
      reason
    });
    // Silent: No notification and no immediate balance deduction!
    // Fines are deducted in the morning alongside salary and shown in the summary.
  }

    applyFine(reason) {
    const fineObj = {
      amount: this.playerProfile.fineAmount,
      date: GAME_DATES[this.day - 1],
      reason
    };
    this.playerProfile.balance -= fineObj.amount;
    this.playerProfile.rating = Math.max(10, this.playerProfile.rating - 15);
    this.playerProfile.fines.unshift(fineObj);

    window.soundEngine.playWarning();
    this.updateProfileUI();
    this.updateBankUI();

    this.showMessageBox(`[ШТРАФ ГОСПЛАНА]: -${fineObj.amount} руб.\nПричина: ${reason}\nСледите за балансом в Личном Деле!`);
  }

  // =========================================================================
  // STATE VPN & TOR RADIO BLACK MARKET (SECRET FREQUENCY 94.4!)
  // =========================================================================
  generateDailyTorMarket() {
    if (this.mysteryAbsentDays === undefined) this.mysteryAbsentDays = 0;

    const mysteryItem = TOR_MARKET_DATABASE.find(i => i.id === "tor_mystery_omega");
    const isMysteryPurchased = mysteryItem && mysteryItem.purchased;

    // Шанс появления ???: 25% каждый день, 100% гарантия если не появлялся 3 дня подряд (на 4-й день)
    let includeMystery = false;
    if (!isMysteryPurchased && mysteryItem) {
      this.mysteryAbsentDays++;
      if (this.mysteryAbsentDays >= 4 || Math.random() < 0.25) {
        includeMystery = true;
        this.mysteryAbsentDays = 0; // Сброс счетчика при появлении
      }
    }

    const pool = TOR_MARKET_DATABASE.filter(item => {
      if (item.id === "tor_mystery_omega") return false; // Обрабатываем отдельно по спец-шансу
      if (item.purchased && (item.type === "family_cure" || item.type === "omega_protocol" || item.type === "ksr_booster" || item.type === "escape_pass")) {
        return false;
      }
      return true;
    });

    const selected = [];
    if (includeMystery && mysteryItem) {
      selected.push(mysteryItem);
    }

    const antibiotics = TOR_MARKET_DATABASE.find(i => i.id === "tor_antibiotics");
    // Days 1, 2, 3: Antibiotics guaranteed if not purchased
    if (this.day <= 3 && antibiotics && !antibiotics.purchased && !selected.some(s => s.id === antibiotics.id)) {
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
    }
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
    }
    
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
      this.showMessageBox("[ДЕПЕША ОСОБОГО ОТДЕЛА СБ ГОСПЛАНА]\n\nРадиопеленгатор зафиксировал всплеск несанкционированного радиосигнала на вашем терминале!\nНаложен внеплановый штраф: -500 руб.\nИндекс лояльности снижен.");
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
            body: `Привет, Волков.\n\nМы засекли твой приемник на волне 94.4.\nМы знаем, что твоя девочка Настя задыхается от серой пыли в 4-м блоке, а на твоем балансе не хватает на лекарства.\nГосАппарат спишет ее как «убыль фонда», но у нашего подполья есть нужные ампулы.\n\nМы готовы открыть тебе шифрованный терминал снабжения Черного Рынка прямо через радиоприемник. Но нам нужны гарантии, что ты не сдашь наш канал особистам.\n\nТы готов к сотрудничеству, Диспетчер?`,
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
  }

  buyTorItem(itemId) {
    const item = TOR_MARKET_DATABASE.find(i => i.id === itemId);
    if (!item || item.purchased) return;

    if (item.type === "sell_resource") {
      const resKey = item.res || "ammo";
      if ((this.resources[resKey] ?? 0) < item.amount) {
        window.soundEngine.playErrorChord();
        this.logEvent(`[ЧЕРНЫЙ РЫНОК]: Недостаточно ${resKey} на складе для контрабандной продажи!`);
        return;
      }
      this.resources[resKey] -= item.amount;
      this.playerProfile.balance += Math.abs(item.price);
      window.soundEngine.playCash();
      this.checkAchievement("ach_shadow_deal");
      this.logEvent(`[ЧЕРНЫЙ РЫНОК]: Сделка завершена! Вы тайно сбыли ${item.name} и получили +${Math.abs(item.price)} руб.`);
    } else {
      if (this.playerProfile.balance < item.price) {
        window.soundEngine.playErrorChord();
        this.logEvent("[ЧЕРНЫЙ РЫНОК]: Недостаточно средств на лицевом счете оператора!");
        return;
      }
      this.playerProfile.balance -= item.price;
      window.soundEngine.playCash();
      this.checkAchievement("ach_shadow_deal");

      if (item.id === "tor_antibiotics" || item.type === "family_cure") {
        item.purchased = true;
        this.playerProfile.curedFamily = true;
        this.modifyRating("family", 30);
        this.checkAchievement("ach_good_father");
        this.receivedEmails.unshift({
          id: `cure_thanks_${Date.now()}`,
          day: this.day,
          from: "Елена Волкова <elena.volkova@civ.bunker>",
          date: `${GAME_DATES[this.day - 1] || '1998'} 15:40`,
          subject: "ЛЕКАРСТВО ДОСТАВИЛИ! НАСТЕНЬКА СПАСЕНА!",
          unread: true,
          body: "Алексей! Только что курьер передал ампулы! Врач уже сделал укол, кризис миновал, температура спадает! Господи, спасибо тебе, родной мой! Мы знали, что ты нас не оставишь!"
        });
        this.updateMailUI();
        window.soundEngine.playIncomingMail();
        this.logEvent("[СЕМЬЯ]: Антибиотики переданы дочери Насте! Ее жизнь спасена.");
      } else if (item.id === "tor_mystery_omega" || item.type === "omega_protocol") {
        item.purchased = true;
        this.flags.omegaProtocolUnlocked = true;
        this.openOmegaProtocolWindow();
      } else if (item.type === "remove_fine") {
        if (this.playerProfile.fines.length > 0) this.playerProfile.fines.shift();
        this.modifyRating("gos", 15);
        this.logEvent("[ЧЕРНЫЙ РЫНОК]: Поддельная гербовая печать аннулировала один штраф Госплана!");
      } else if (item.type === "resource") {
        this.resources[item.res] = (this.resources[item.res] ?? 0) + item.amount;
        this.logEvent(`[ЧЕРНЫЙ РЫНОК]: Контрабандный груз принят: +${item.amount} ${item.res}!`);
      } else {
        this.logEvent(`[ЧЕРНЫЙ РЫНОК]: Приобретен предмет: ${item.name}.`);
      }
    }

    this.renderTorMarket();
    this.updateResourceUI();
    this.updateProfileUI();
    this.updateBankUI();
    this.saveGame();
  }

  openOmegaProtocolWindow() {
    const win = document.getElementById("win-omega");
    const textEl = document.getElementById("omega-terminal-text");
    if (!win || !textEl) return;

    window.soundEngine.playDemonicRoar?.() || window.soundEngine.playWarning();
    document.body.classList.add("demonic-shake-active");
    setTimeout(() => document.body.classList.remove("demonic-shake-active"), 1500);

    textEl.textContent = `>>> СОВЕРШЕННО СЕКРЕТНО. ОСОБАЯ ПАПКА ЦК КПСС <<<
>>> ДАТА РАССЕКРЕЧИВАНИЯ: НИКОГДА <<<

ПРОТОКОЛ «ОМЕГА-1989»:
1. 14 сентября 1989 года автоматическая система «Периметр» не фиксировала пусков с Запада.
2. Взрыв произошел на глубоководном комплексе «Ковчег» в ходе испытания гравитационного излучателя.
3. Поверхность пригодна для жизни в радиусе 120 км от Полярного Хребта.
4. Бункер «Омега» удерживается в изоляции искусственно для поддержания геотермальной откачки в интересах Номенклатуры.
5. Эвакуационный бронепоезд «Ковчег» забирает руководство и архивы 27 ноября 1998 года.

ВЫ ЗНАЕТЕ ПРАВДУ, ДИСПЕТЧЕР ВОЛКОВ. ВРЕМЯ ДЕЙСТВОВАТЬ.`;

    document.body.classList.add("omega-negative-active");
    document.body.classList.add("omega-negative-active");
    document.body.classList.add("omega-negative-active");
    this.openWindow("win-omega");
  }

  // =========================================================================
  // CALCULATOR & EASTER EGGS (1989, 1337, 666)
  // =========================================================================
  bindCalculator() {
    const iconCalc = document.getElementById("icon-calc");
    const startItemCalc = document.getElementById("start-item-calc");
    const display = document.getElementById("calc-display");

    if (iconCalc) iconCalc.addEventListener("click", () => this.openWindow("win-calc"));
    if (startItemCalc) startItemCalc.addEventListener("click", () => {
      this.toggleStartMenu(false);
      this.openWindow("win-calc");
    });

    document.querySelectorAll(".calc-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-calc");

        if (!isNaN(key)) {
          if (this.calcCurrent === "0" || this.calcReset) {
            this.calcCurrent = key;
            this.calcReset = false;
          } else {
            this.calcCurrent += key;
          }
        } else if (key === ".") {
          if (!this.calcCurrent.includes(".")) this.calcCurrent += ".";
        } else if (key === "C" || key === "CE") {
          this.calcCurrent = "0";
          this.calcPrev = null;
          this.calcOp = null;
          this.clearDemonicAnomaly("calc");
        } else if (key === "+/-") {
          this.calcCurrent = String(-parseFloat(this.calcCurrent));
        } else if (key === "sqrt") {
          this.calcCurrent = String(Math.sqrt(parseFloat(this.calcCurrent)));
          this.calcReset = true;
        } else if (["+", "-", "*", "/"].includes(key)) {
          this.calcPrev = parseFloat(this.calcCurrent);
          this.calcOp = key;
          this.calcReset = true;
        } else if (key === "=") {
          if (this.calcOp && this.calcPrev !== null) {
            const cur = parseFloat(this.calcCurrent);
            let res = 0;
            if (this.calcOp === "+") res = this.calcPrev + cur;
            if (this.calcOp === "-") res = this.calcPrev - cur;
            if (this.calcOp === "*") res = this.calcPrev * cur;
            if (this.calcOp === "/") res = cur !== 0 ? this.calcPrev / cur : "Error";
            this.calcCurrent = String(res);
            this.calcOp = null;
            this.calcPrev = null;
            this.calcReset = true;
          }
        }

        display.textContent = this.calcCurrent.slice(0, 14);

        // Easter eggs
        if (this.calcCurrent === "1989") {
          this.checkAchievement("ach_1989");
          window.soundEngine.playRadioStatic();
        } else if (this.calcCurrent === "1337") {
          display.textContent = "H4X0R_LEET";
          window.soundEngine.playCash();
        } else if (this.calcCurrent === "666") {
          display.textContent = "666_INFERNO";
          this.triggerDemonicAnomaly("calc");
        }
      });
    });
  }

  // =========================================================================
  // BUNKERPAD (WORDPAD CLONE & SECRET TEXT EASTER EGG)
  // =========================================================================
  bindWordPad() {
    const iconWp = document.getElementById("icon-wordpad");
    const startItemWp = document.getElementById("start-item-wordpad");
    const editor = document.getElementById("wordpad-editor");

    const onOpen = () => {
      this.openWindow("win-wordpad");
      this.wordpadOpenCount = (this.wordpadOpenCount || 0) + 1;
      if (this.wordpadOpenCount >= 10 && !this.flags.diarySpawned) {
        this.flags.diarySpawned = true;
        this.desktopFolders.push({
          id: `diary_${Date.now()}`,
          name: "Дневник_Предшественника.txt"
        });
        this.renderDesktopFolders();
        window.soundEngine.playTeletype();
        this.showMessageBox("В папке найден скрытый документ: Дневник_Предшественника.txt!");
      }
    };

    if (iconWp) iconWp.addEventListener("click", onOpen);
    if (startItemWp) startItemWp.addEventListener("click", () => {
      this.toggleStartMenu(false);
      onOpen();
    });

    document.getElementById("btn-wp-bold").onclick = () => document.execCommand("bold");
    document.getElementById("btn-wp-italic").onclick = () => document.execCommand("italic");
    document.getElementById("btn-wp-underline").onclick = () => document.execCommand("underline");

    document.getElementById("wp-font-size").onchange = (e) => {
      editor.style.fontSize = e.target.value;
    };

    const fontSelect = document.getElementById("wp-font-family");
    if (fontSelect) {
      fontSelect.onchange = (e) => {
        editor.style.fontFamily = e.target.value;
      };
    }

    const pageStatus = document.getElementById("wp-page-status");
    const charStatus = document.getElementById("wp-char-status");

    const updateWordPadStats = () => {
      if (!editor) return;
      const t = editor.innerText || "";
      const len = t.length;
      if (charStatus) charStatus.textContent = `Символов: ${len}`;
      const manualPages = (t.match(/---\s*\[\s*Страница/gi) || []).length;
      const autoPages = Math.max(1, Math.ceil(len / 850));
      const totalPages = Math.max(autoPages, manualPages + 1);
      if (pageStatus) pageStatus.textContent = `Страница: 1 из ${totalPages}`;
    };

    editor.addEventListener("input", updateWordPadStats);
    updateWordPadStats();

    const btnPageNum = document.getElementById("btn-wp-pagenum");
    if (btnPageNum) {
      btnPageNum.onclick = () => {
        const t = editor.innerText || "";
        const manualPages = (t.match(/---\s*\[\s*Страница/gi) || []).length;
        const nextPg = manualPages + 2;
        editor.focus();
        document.execCommand("insertHTML", false, `<div style="text-align: center; border-top: 1px dashed #888; border-bottom: 1px dashed #888; margin: 12px 0; padding: 4px; color: #555; font-size: 11px;">--- [ Страница ${nextPg} ] ---</div><br>`);
        updateWordPadStats();
      };
    }

    document.getElementById("btn-wp-save").onclick = () => {
      localStorage.setItem("bunkeros_wordpad_draft", editor.innerHTML);
      window.soundEngine.playTeletype();
      this.showMessageBox("Черновик документа сохранен в память BunkerPad!");
    };

    editor.addEventListener("input", () => {
      const txt = editor.innerText.toUpperCase();
      if (txt.includes("СВОБОДНЫЙ ЯРУС") || txt.includes("СВОБОДНЫЙ_ЯРУС")) {
        this.checkAchievement("ach_underground");
        const vpnBtn = document.getElementById("btn-tray-vpn");
        if (vpnBtn) {
          vpnBtn.style.animation = "blink 0.5s 4";
          setTimeout(() => vpnBtn.style.animation = "", 2000);
        }
      }
    });

    const saved = localStorage.getItem("bunkeros_wordpad_draft");
    if (saved && editor) editor.innerHTML = saved;
  }

  // =========================================================================
  // DESKTOP CONTEXT MENU (PKM)
  // =========================================================================
  bindContextMenu() {
    const desktop = document.getElementById("desktop");
    const menu = document.getElementById("desktop-context-menu");

    desktop.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      // Hide icon menu if open
      document.getElementById("icon-context-menu").style.display = "none";

      menu.style.left = `${Math.min(window.innerWidth - 160, e.clientX)}px`;
      menu.style.top = `${Math.min(window.innerHeight - 140, e.clientY)}px`;
      menu.style.display = "flex";
    });

    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target)) menu.style.display = "none";
      const iconMenu = document.getElementById("icon-context-menu");
      if (iconMenu && !iconMenu.contains(e.target)) iconMenu.style.display = "none";
    });

    const modalFolder = document.getElementById("modal-new-folder");
    const inputFolderName = document.getElementById("input-new-folder-name");
    const btnFolderOk = document.getElementById("btn-folder-modal-ok");
    const btnFolderCancel = document.getElementById("btn-folder-modal-cancel");
    const btnFolderClose = document.getElementById("btn-folder-modal-close");

    const closeFolderModal = () => {
      if (modalFolder) modalFolder.style.display = "none";
    };

    const confirmFolderCreate = () => {
      const name = (inputFolderName.value || "").trim() || `Папка_${this.desktopFolders.length + 1}`;
      this.desktopFolders.push({ id: `folder_${Date.now()}`, name, items: [] });
      this.renderDesktopFolders();
      this.saveGame();
      window.soundEngine.playClick();
      closeFolderModal();
    };

    if (btnFolderOk) btnFolderOk.onclick = confirmFolderCreate;
    if (btnFolderCancel) btnFolderCancel.onclick = closeFolderModal;
    if (btnFolderClose) btnFolderClose.onclick = closeFolderModal;

    if (inputFolderName) {
      inputFolderName.onkeydown = (e) => {
        if (e.key === "Enter") confirmFolderCreate();
        if (e.key === "Escape") closeFolderModal();
      };
    }

    document.getElementById("ctx-new-folder").addEventListener("click", () => {
      menu.style.display = "none";
      if (modalFolder) {
        modalFolder.style.display = "flex";
        if (inputFolderName) {
          inputFolderName.value = `Папка_${this.desktopFolders.length + 1}`;
          setTimeout(() => {
            inputFolderName.focus();
            inputFolderName.select();
          }, 50);
        }
      }
    });

    document.getElementById("ctx-refresh").addEventListener("click", () => {
      menu.style.display = "none";
      window.soundEngine.playClick();
      this.renderDesktopFolders();
    });

    document.getElementById("ctx-properties").addEventListener("click", () => {
      menu.style.display = "none";
      this.showMessageBox("Операционная система BunkerOS v3.11\n(C) 1998 Главное Управление Связи Госплана СССР\nПамять ОЗУ: 16 МБ\nПроцессор: Байкал-486DX 66 МГц");
    });

    const changeWpBtn = document.getElementById("ctx-change-wallpaper");
    if (changeWpBtn) {
      changeWpBtn.addEventListener("click", () => {
        menu.style.display = "none";
        this.openWallpaperWindow();
      });
    }
  }

  // =========================================================================
  // WALLPAPER & DISPLAY PROPERTIES
  // =========================================================================
  bindWallpaperWindow() {
    const win = document.getElementById("win-wallpaper");
    if (!win) return;
    const preview = document.getElementById("wallpaper-preview-screen");
    const options = win.querySelectorAll(".wallpaper-option-item");
    const btnApply = document.getElementById("btn-apply-wallpaper");
    const btnCancel = document.getElementById("btn-cancel-wallpaper");

    let selectedWp = this.currentWallpaper || "classic";

    const updatePreview = (wpId) => {
      selectedWp = wpId;
      options.forEach(opt => {
        if (opt.dataset.wallpaper === wpId) opt.classList.add("selected");
        else opt.classList.remove("selected");
      });
      if (!preview) return;
      if (wpId === "classic") {
        preview.style.backgroundImage = "none";
        preview.style.backgroundColor = "#2b3e42";
      } else {
        preview.style.backgroundImage = `url('img/wallpaper_${wpId}.jpg')`;
        preview.style.backgroundSize = "cover";
        preview.style.backgroundPosition = "center";
      }
    };

    options.forEach(opt => {
      opt.addEventListener("click", () => {
        if (window.soundEngine) window.soundEngine.playClick();
        updatePreview(opt.dataset.wallpaper);
      });
    });

    if (btnApply) {
      btnApply.addEventListener("click", () => {
        if (window.soundEngine) window.soundEngine.playStampApprove();
        this.applyWallpaper(selectedWp);
        win.style.display = "none";
      });
    }

    if (btnCancel) {
      btnCancel.addEventListener("click", () => {
        if (window.soundEngine) window.soundEngine.playClick();
        win.style.display = "none";
      });
    }
  }

  openWallpaperWindow() {
    this.openWindow("win-wallpaper");
    const targetId = this.currentWallpaper || "classic";
    const opt = document.querySelector(`.wallpaper-option-item[data-wallpaper="${targetId}"]`);
    if (opt) opt.click();
  }

  applyWallpaper(id) {
    this.currentWallpaper = id || "classic";
    try {
      localStorage.setItem("bunkeros_wallpaper", this.currentWallpaper);
    } catch (e) {
      console.warn("Could not save wallpaper to localStorage", e);
    }
    const desktop = document.getElementById("desktop");
    if (!desktop) return;

    if (this.currentWallpaper === "classic") {
      desktop.style.backgroundImage = "radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)";
      desktop.style.backgroundSize = "16px 16px";
      desktop.style.backgroundColor = "var(--desktop-bg)";
      desktop.style.backgroundPosition = "";
      desktop.style.backgroundRepeat = "";
    } else {
      desktop.style.backgroundImage = `url('img/wallpaper_${this.currentWallpaper}.jpg')`;
      desktop.style.backgroundSize = "cover";
      desktop.style.backgroundPosition = "center center";
      desktop.style.backgroundRepeat = "no-repeat";
    }
  }

  renderDesktopFolders() {
    const container = document.querySelector(".desktop-icons");
    if (!container) return;

    document.querySelectorAll(".custom-folder-icon").forEach(el => el.remove());

    this.desktopFolders.forEach((folder, idx) => {
      if (!folder.items) folder.items = [];
      const el = document.createElement("div");
      el.className = "desktop-icon custom-folder-icon draggable";
      el.id = folder.id;
      el.setAttribute("data-folder-id", folder.id);
      el.title = folder.name;
      el.innerHTML = `
        <div class="icon-img-svg">
          <svg viewBox="0 0 32 32">
            <rect x="4" y="8" width="24" height="18" fill="#ffd700" stroke="#b8860b" stroke-width="1.5"/>
            <polygon points="4,8 12,8 15,11 4,11" fill="#cca000"/>
          </svg>
        </div>
        <div class="icon-label">${folder.name}</div>
      `;

      el.addEventListener("click", () => {
        this.openFolderWindow(folder);
      });

      container.appendChild(el);
    });

    this.initDraggableIcons();
  }

  // =========================================================================
  // TRAY CONTROLS & VPN
  // =========================================================================
  bindTrayControls() {
    const btnVpn = document.getElementById("btn-tray-vpn");
    const vpnText = document.getElementById("vpn-status-text");
    const iconTor = document.getElementById("icon-tor");

    const btnVol = document.getElementById("btn-tray-vol");
    const volPopup = document.getElementById("tray-volume-popup");
    const volSlider = document.getElementById("tray-vol-slider");
    const volNum = document.getElementById("tray-vol-num");

    if (btnVpn) {
      btnVpn.addEventListener("click", () => {
        // БЛОКИРОВКА В ДЕНЬ 1: Протокол НОБ опломбирован до Смены №2
        if (this.day === 1) {
          window.soundEngine.playErrorChord();
          this.showMessageBox("ОШИБКА ДОСТУПА 403:\nПротокол НОБ (Нештатный Обходной Блок) законсервирован на регламентное ТО.\nДоступ будет открыт дежурному диспетчеру со Смены №2.");
          this.logEvent("[ОШИБКА СИСТЕМЫ]: Переключатель НОБ заблокирован регламентом ЦК до Дня 2.");
          return;
        }

        this.vpnActive = !this.vpnActive;
        window.soundEngine.playClick();
        if (this.vpnActive) {
          vpnText.textContent = "[НОБ:ВКЛ]";
          vpnText.style.color = "#33ff66";
          if (iconTor) iconTor.style.display = "flex";
          this.openWindow("win-nob-warning");
        } else {
          vpnText.textContent = "[НОБ:ВЫКЛ]";
          vpnText.style.color = "#888";
          if (iconTor) iconTor.style.display = "none";
        }
        if (this.updateTorRadioDisplay) this.updateTorRadioDisplay();
        this.saveGame();
      });
    }

    const btnNobAck = document.getElementById("btn-nob-ack");
    if (btnNobAck) {
      btnNobAck.addEventListener("click", () => {
        this.closeWindow("win-nob-warning");
      });
    }
    if (btnVol) {
      btnVol.addEventListener("click", (e) => {
        e.stopPropagation();
        volPopup.style.display = volPopup.style.display === "flex" ? "none" : "flex";
      });
    }

    document.addEventListener("click", (e) => {
      if (volPopup && !volPopup.contains(e.target) && e.target !== btnVol) {
        volPopup.style.display = "none";
      }
    });

    if (volSlider) {
      volSlider.addEventListener("input", () => {
        const val = volSlider.value;
        volNum.textContent = `${val}%`;
        this.settings.volume = parseInt(val);
        this.saveSettings();
        this.applySettings();
      });
    }
  }

  updateTray() {
    const dateEl = document.getElementById("tray-date");
    if (dateEl) {
      dateEl.textContent = GAME_DATES[this.day - 1] || "20.11.1998";
    }
  }

  // =========================================================================
  // WINDOW MANAGEMENT
  // =========================================================================
  bindWindowControls() {
    document.querySelectorAll(".win-close").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const winId = btn.getAttribute("data-win");
        if (winId) this.closeWindow(winId);
      });
    });

    document.querySelectorAll(".win-min").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const winId = btn.getAttribute("data-win");
        if (winId) this.minimizeWindow(winId);
      });
    });

    document.querySelectorAll(".window").forEach(win => {
      win.addEventListener("mousedown", () => this.bringToFront(win));
      this.makeWindowDraggable(win);
    });
  }

  openWindow(winId) {
    const win = document.getElementById(winId);
    if (!win) return;
    if (!this.openWindows) this.openWindows = new Set();
    this.openWindows.add(winId);
    win.style.display = "flex";
    win.classList.remove("minimized");
    this.bringToFront(win);
    window.soundEngine.playWindowRestore();
    this.updateTaskbar();
  }

  closeWindow(winId) {
    const win = document.getElementById(winId);
    if (!win) return;
    if (this.openWindows) this.openWindows.delete(winId);
    win.style.display = "none";
    win.classList.remove("active", "minimized");
    if (winId === "win-calc") this.clearDemonicAnomaly("calc");
    if (winId === "win-tor") this.clearDemonicAnomaly("radio");
    if (winId === "win-omega") document.body.classList.remove("omega-negative-active");
    window.soundEngine.playWindowClose();
    this.updateTaskbar();
  }

  minimizeWindow(winId) {
    const win = document.getElementById(winId);
    if (!win) return;
    if (!this.openWindows) this.openWindows = new Set();
    this.openWindows.add(winId);
    win.style.display = "none";
    win.classList.remove("active");
    win.classList.add("minimized");
    window.soundEngine.playWindowMinimize();
    this.updateTaskbar();
  }

  bringToFront(win) {
    this.highestZ++;
    win.style.zIndex = this.highestZ;
    this.activeWindow = win;
    document.querySelectorAll(".window").forEach(w => w.classList.remove("active"));
    win.classList.add("active");
    this.updateTaskbar();
  }

  makeWindowDraggable(win) {
    const header = win.querySelector(".window-header");
    if (!header) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let winX = 0;
    let winY = 0;

    header.addEventListener("mousedown", (e) => {
      if (e.target.tagName === "BUTTON") return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      winX = win.offsetLeft;
      winY = win.offsetTop;
      this.bringToFront(win);

      const onMouseMove = (moveEvt) => {
        if (!isDragging) return;
        const dx = moveEvt.clientX - startX;
        const dy = moveEvt.clientY - startY;
        win.style.left = `${Math.max(0, Math.min(window.innerWidth - 60, winX + dx))}px`;
        win.style.top = `${Math.max(0, Math.min(window.innerHeight - 80, winY + dy))}px`;
      };

      const onMouseUp = () => {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }

  // =========================================================================
  // TASKBAR & START MENU
  // =========================================================================
  bindTaskbar() {
    const btnStart = document.getElementById("btn-start-toggle");
    const startMenu = document.getElementById("start-menu");

    btnStart.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleStartMenu();
    });

    document.addEventListener("click", (e) => {
      if (!startMenu.contains(e.target) && !btnStart.contains(e.target)) {
        this.toggleStartMenu(false);
      }
    });

    // Start menu item bindings
    document.getElementById("start-item-map")?.addEventListener("click", () => {
      this.toggleStartMenu(false);
      this.openWindow("win-map");
    });
    document.getElementById("start-item-inbox")?.addEventListener("click", () => {
      this.toggleStartMenu(false);
      this.openWindow("win-inbox");
    });
    document.getElementById("start-item-depot")?.addEventListener("click", () => {
      this.toggleStartMenu(false);
      this.openWindow("win-depot");
    });
    document.getElementById("start-item-menu")?.addEventListener("click", () => {
      this.toggleStartMenu(false);
      if (confirm("Выйти в главное меню? Текущий прогресс смены сохранен.")) {
        this.saveGame();
        document.getElementById("desktop").classList.remove("unlocked");
        document.getElementById("desktop").style.display = "none";
        document.getElementById("main-menu-overlay").classList.remove("hidden");
        this.checkSavedGame();
      }
    });
  }

  toggleStartMenu(force) {
    const menu = document.getElementById("start-menu");
    const btn = document.getElementById("btn-start-toggle");
    if (!menu || !btn) return;
    const isCurrentlyOpen = menu.classList.contains("open") || menu.classList.contains("active");
    const willOpen = typeof force === "boolean" ? force : !isCurrentlyOpen;

    if (willOpen) {
      menu.classList.add("open", "active");
      btn.classList.add("active");
      window.soundEngine.playClick();
    } else {
      menu.classList.remove("open", "active");
      btn.classList.remove("active");
    }
  }

  updateTaskbar() {
    const container = document.getElementById("taskbar-tasks-container");
    if (!container) return;
    container.innerHTML = "";

    const windows = document.querySelectorAll(".window");
    if (!this.openWindows) this.openWindows = new Set();
    // Default open windows
    ["win-map", "win-inbox", "win-depot"].forEach(id => {
      const el = document.getElementById(id);
      if (el && el.style.display !== "none" && !el.classList.contains("minimized")) {
        this.openWindows.add(id);
      }
    });

    this.openWindows.forEach(winId => {
      const win = document.getElementById(winId);
      if (!win || win.id === "win-shutdown-confirm") return;

      const titleEl = win.querySelector(".window-title");
      const titleText = titleEl ? titleEl.textContent.trim().slice(0, 16) : win.id;
      const isVisible = win.style.display !== "none" && !win.classList.contains("minimized");
      const isActive = isVisible && (win === this.activeWindow);

      const btn = document.createElement("button");
      btn.className = `taskbar-task-btn ${isActive ? 'active' : ''}`;
      btn.textContent = titleText;

      btn.addEventListener("click", () => {
        if (!isVisible) {
          // Restore minimized window
          this.openWindow(win.id);
        } else if (isActive) {
          // Minimize active window
          this.minimizeWindow(win.id);
        } else {
          // Bring visible background window to front
          this.bringToFront(win);
        }
      });

      container.appendChild(btn);
    });
  }

  // =========================================================================
  checkBankruptcy() {
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

  // =========================================================================
  // WINDOW RESIZE SCALING & ACCESSIBILITY
  // =========================================================================
  setupWindowResizeScaling() {
    // 1. Привязка кнопок масштабирования шрифта в памятке / обучении [A-] [A+]
    const btnFontDec = document.getElementById("btn-tut-font-dec");
    const btnFontInc = document.getElementById("btn-tut-font-inc");
    const tutPanel = document.getElementById("tut-content-panel");
    let currentTutFontSize = 12;

    if (btnFontDec && tutPanel) {
      btnFontDec.addEventListener("click", () => {
        currentTutFontSize = Math.max(9, currentTutFontSize - 1);
        tutPanel.style.fontSize = `${currentTutFontSize}px`;
        window.soundEngine.playClick();
      });
    }

    if (btnFontInc && tutPanel) {
      btnFontInc.addEventListener("click", () => {
        currentTutFontSize = Math.min(18, currentTutFontSize + 1);
        tutPanel.style.fontSize = `${currentTutFontSize}px`;
        window.soundEngine.playClick();
      });
    }

    // 2. Добавление интерактивного уголка изменения размера (.win-resize-handle) ко всем окнам
    document.querySelectorAll(".window").forEach(win => {
      if (!win.querySelector(".win-resize-handle")) {
        const handle = document.createElement("div");
        handle.className = "win-resize-handle";
        handle.title = "Потяните, чтобы изменить размер окна";
        win.appendChild(handle);

        handle.addEventListener("mousedown", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.bringToFront(win);

          const startX = e.clientX;
          const startY = e.clientY;
          const startW = win.offsetWidth;
          const startH = win.offsetHeight;

          const onMouseMove = (moveEvt) => {
            const newW = Math.max(340, startW + (moveEvt.clientX - startX));
            const newH = Math.max(220, startH + (moveEvt.clientY - startY));
            win.style.width = `${newW}px`;
            win.style.height = `${newH}px`;
          };

          const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
          };

          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        });
      }
    });

    // 3. Автоматический класс крупного шрифта при увеличении
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const win = entry.target;
          if (win.offsetWidth > 650 || win.offsetHeight > 520) {
            win.classList.add("large-scale");
          } else {
            win.classList.remove("large-scale");
          }
        }
      });
      document.querySelectorAll(".window").forEach(win => observer.observe(win));
    }
  }

  // =========================================================================
  // MAP CONDUITS & 6-SECTOR RESOURCE ROUTING
  // =========================================================================
  bindMapConduits() {
    const selHeat = document.getElementById("select-conduit-heat");
    const selEnergy = document.getElementById("select-conduit-energy");
    const selWater = document.getElementById("select-conduit-water");

    const ensureValidConduits = () => {
      if (!this.conduits || typeof this.conduits !== "object") {
        this.conduits = { heat: 'auto', energy: 'auto', water: 'auto' };
      }
      // Migrate old format if encountered
      if (this.conduits.heat === "mine") this.conduits.heat = "sec_mine";
      if (this.conduits.heat === "block") this.conduits.heat = "sec_block";
      if (this.conduits.power === "water" || this.conduits.energy === "water") this.conduits.energy = "sec_water";
      if (this.conduits.power === "radar" || this.conduits.energy === "radar") this.conduits.energy = "sec_radar";
      if (this.conduits.hydro === "hydro" || this.conduits.water === "hydro") this.conduits.water = "sec_hydro";
      if (this.conduits.hydro === "taps" || this.conduits.water === "taps") this.conduits.water = "sec_block";
      if (!this.conduits.energy && this.conduits.power) this.conduits.energy = this.conduits.power;
      if (!this.conduits.water && this.conduits.hydro) this.conduits.water = this.conduits.hydro;
    };

    this.syncMapConduitSelects = () => {
      ensureValidConduits();
      if (selHeat && this.conduits.heat) selHeat.value = this.conduits.heat;
      if (selEnergy && this.conduits.energy) selEnergy.value = this.conduits.energy;
      if (selWater && this.conduits.water) selWater.value = this.conduits.water;
    };

    if (selHeat) {
      selHeat.addEventListener("change", (e) => {
        ensureValidConduits();
        this.conduits.heat = e.target.value;
        window.soundEngine?.playClick();
        const sec = this.getSector(this.conduits.heat);
        const name = sec ? sec.name : this.conduits.heat;
        this.logEvent(`[ТЕПЛОТРАССА]: Главная тепломагистраль переключена на сектор «${name}».`);
        this.renderTacticalMap();
        if (this.selectedSectorId) this.selectSector(this.selectedSectorId);
        this.saveGame();
      });
    }

    if (selEnergy) {
      selEnergy.addEventListener("change", (e) => {
        ensureValidConduits();
        this.conduits.energy = e.target.value;
        this.conduits.power = e.target.value;
        window.soundEngine?.playClick();
        const sec = this.getSector(this.conduits.energy);
        const name = sec ? sec.name : this.conduits.energy;
        this.logEvent(`[ЭНЕРГОСЕТЬ]: Приоритет мощности турбогенератора подан в сектор «${name}».`);
        this.renderTacticalMap();
        if (this.selectedSectorId) this.selectSector(this.selectedSectorId);
        this.saveGame();
      });
    }

    if (selWater) {
      selWater.addEventListener("change", (e) => {
        ensureValidConduits();
        this.conduits.water = e.target.value;
        this.conduits.hydro = e.target.value;
        window.soundEngine?.playClick();
        const sec = this.getSector(this.conduits.water);
        const name = sec ? sec.name : this.conduits.water;
        this.logEvent(`[ВОДОПРОВОД]: Напорная линия артезианских насосов направлена в сектор «${name}».`);
        this.renderTacticalMap();
        if (this.selectedSectorId) this.selectSector(this.selectedSectorId);
        this.saveGame();
      });
    }

    this.syncMapConduitSelects();
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
          "Вы ввели директиву перевода стрелочного перевода №114.\nЭвакопоезд «Ковчег» остановился у шахтерских платформ.\nСотни рабочих, инженеров и их семей поднялись на борт бронепоезда.\nРазбив внешние гермозатворы, бронепоезд вырвался сквозь хребет на чистую поверхность к восходящему солнцу.\n\nВы спасли бункер от вечного плена.",
          "ach_ark"
        );
      };
    }

    if (btnLeak) {
      btnLeak.onclick = () => {
        triggerOmegaEnding(
          "ФИНАЛ: ПРАВДА 1989 ГОДА (ВСЕОБЩЕЕ ВОССТАНИЕ)",
          "Вы нажали трансляцию протокола по всем мониторам бункера.\nЛожь о ядерной войне рассыпалась в прах.\nКомендатура Госплана пала за 40 минут без единого выстрела.\nГраждане бункера открыли главные шлюзы наружу.\nВпереди — долгий путь возрождения на свободной земле.",
          "ach_rebel_spy"
        );
      };
    }

    if (btnPurge) {
      btnPurge.onclick = () => {
        triggerOmegaEnding(
          "ФИНАЛ: ВИНТИК РЕЖИМА (САМООЧИСТКА)",
          "Вы стерли все сектора дискеты и сожгли микропленку.\nПравда о 1989 годе умерла навсегда.\nВы получили служебную премию и орден от Комендатуры.\nВаша семья жива, но обречена до конца дней дышать ржавой пылью подземного склепа.\nСлужба продолжается.",
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

  // TACTICAL VECTOR MAP (PAN & ZOOM)
  // =========================================================================
  bindMapPanZoom() {
    const viewport = document.getElementById("map-viewport");
    const mapGroup = document.getElementById("map-transform-group");
    const btnZoomIn = document.getElementById("map-zoom-in");
    const btnZoomOut = document.getElementById("map-zoom-out");
    const btnReset = document.getElementById("map-zoom-reset");

    if (!viewport || !mapGroup) return;

    const applyTransform = () => {
      mapGroup.setAttribute("transform", `matrix(${this.mapScale} 0 0 ${this.mapScale} ${this.mapPanX} ${this.mapPanY})`);
    };

    if (btnZoomIn) {
      btnZoomIn.addEventListener("click", () => {
        this.mapScale = Math.min(2.5, this.mapScale + 0.25);
        applyTransform();
        window.soundEngine.playClick();
      });
    }

    if (btnZoomOut) {
      btnZoomOut.addEventListener("click", () => {
        this.mapScale = Math.max(0.6, this.mapScale - 0.25);
        applyTransform();
        window.soundEngine.playClick();
      });
    }

    if (btnReset) {
      btnReset.addEventListener("click", () => {
        this.mapScale = 1;
        this.mapPanX = 0;
        this.mapPanY = 0;
        applyTransform();
        window.soundEngine.playClick();
      });
    }

    viewport.addEventListener("mousedown", (e) => {
      if (e.target.closest(".sector-node")) return;
      this.isPanningMap = true;
      this.panStartX = e.clientX - this.mapPanX;
      this.panStartY = e.clientY - this.mapPanY;
      viewport.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isPanningMap) return;
      this.mapPanX = e.clientX - this.panStartX;
      this.mapPanY = e.clientY - this.panStartY;
      applyTransform();
    });

    window.addEventListener("mouseup", () => {
      this.isPanningMap = false;
      if (viewport) viewport.style.cursor = "grab";
    });

    viewport.addEventListener("wheel", (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      this.mapScale = Math.max(0.6, Math.min(2.5, this.mapScale + delta));
      applyTransform();
    }, { passive: false });
  }

  renderTacticalMap() {
    this.syncMapConduitSelects?.();
    const nodesGroup = document.getElementById("svg-nodes-group");
    if (!nodesGroup) return;

    nodesGroup.innerHTML = "";

    // Sector code letter mapping for badge inside node box
    const sectorLetters = {
      sec_mine: "Ш",
      sec_water: "В",
      sec_block: "Ж",
      sec_med: "М",
      sec_radar: "Р",
      sec_hydro: "Г"
    };

    // Draw Sector Nodes
    this.sectors.forEach(sec => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", `sector-node ${sec.status} ${sec.id === this.selectedSectorId ? 'selected' : ''}`);
      g.setAttribute("transform", `translate(${sec.coords.x}, ${sec.coords.y})`);
      g.setAttribute("data-id", sec.id);

      // Marker shape (with retro phosphor border)
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", "-18");
      rect.setAttribute("y", "-18");
      rect.setAttribute("width", "36");
      rect.setAttribute("height", "36");
      rect.setAttribute("rx", "4");

      // Glowing tactical letter badge inside box
      const badge = document.createElementNS("http://www.w3.org/2000/svg", "text");
      badge.setAttribute("y", "1");
      badge.setAttribute("class", "sector-node-badge");
      const letter = sectorLetters[sec.id] || sec.name.charAt(0);
      badge.textContent = `[${letter}]`;

      // High-contrast label below node
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("y", "28");
      text.setAttribute("class", "sector-node-label");
      text.textContent = sec.name.split(" ")[0];

      // Telemetry telemetry stats
      const sub = document.createElementNS("http://www.w3.org/2000/svg", "text");
      sub.setAttribute("y", "42");
      sub.setAttribute("class", "sector-node-sub");
      sub.textContent = `${sec.population} чел | ${sec.radiation} мкЗв`;

      g.appendChild(rect);
      g.appendChild(badge);
      g.appendChild(text);
      g.appendChild(sub);

      g.addEventListener("click", () => {
        this.selectSector(sec.id);
        window.soundEngine.playClick();
      });

      nodesGroup.appendChild(g);
    });
  }

  selectSector(sectorId) {
    this.selectedSectorId = sectorId;
    const sec = this.getSector(sectorId);
    if (!sec) return;

    document.querySelectorAll(".sector-node").forEach(node => {
      if (node.getAttribute("data-id") === sectorId) node.classList.add("selected");
      else node.classList.remove("selected");
    });

    const telContent = document.getElementById("telemetry-content");
    if (telContent) {
      telContent.innerHTML = `
        <div style="font-weight: bold; font-size: 12px; color: #ffff00; margin-bottom: 2px;">${sec.name}</div>
        <div style="font-size: 9px; color: #88c0a0; margin-bottom: 4px;">${sec.role}</div>
        <div style="font-size: 10px; margin-bottom: 2px;">• <strong>Население:</strong> ${sec.population} чел. (Потерь: ${sec.totalDead || 0})</div>
        <div style="font-size: 10px; margin-bottom: 2px;">• <strong>Статус:</strong> <span class="status-badge ${sec.status}">${sec.status.toUpperCase()}</span></div>
        <div style="font-size: 9px; border-top: 1px dashed rgba(51,255,102,0.3); padding-top: 4px; color: #aaffcc;">${sec.notes}</div>
      `;
    }

    // Update 5 Dynamic Live Metrics
    const liveMeters = document.getElementById("sector-live-meters");
    const supplyPanel = document.getElementById("sector-supply-panel");

    if (liveMeters) {
      liveMeters.style.display = "grid";
      const setMeter = (key, val, isDanger = false) => {
        const bar = document.getElementById(`meter-${key}`);
        const valEl = document.getElementById(`meter-val-${key}`);
        const clamped = Math.max(0, Math.min(100, Math.round(val)));
        if (bar) {
          bar.style.width = `${clamped}%`;
          bar.className = 'metric-bar-fill' + (isDanger ? (clamped > 70 ? ' danger' : (clamped > 40 ? ' warning' : '')) : (clamped < 30 ? ' danger' : (clamped < 60 ? ' warning' : '')));
        }
        if (valEl) valEl.textContent = `${clamped}%`;
      };

      setMeter("heat", sec.heat ?? 70);
      setMeter("food", sec.food ?? 70);
      setMeter("water", sec.water ?? 70);
      setMeter("sanitation", sec.sanitation ?? 70);
      setMeter("riot", sec.riotRisk ?? 15, true);
    }

    if (supplyPanel) {
      supplyPanel.style.display = "block";
      this.resetMapSupplyAllocation();
    }
  }

  resetMapSupplyAllocation() {
    this.mapSupplyAllocation = { fuel: 0, food: 0, meds: 0, ammo: 0, water: 0 };
    ["fuel", "food", "meds", "ammo", "water"].forEach(res => {
      const el = document.getElementById(`map-alloc-${res}`);
      if (el) el.textContent = "0";
    });
  }

  bindMapDirectSupply() {
    document.querySelectorAll(".map-spin-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const res = btn.getAttribute("data-res");
        const act = btn.getAttribute("data-act");
        if (!res || !this.mapSupplyAllocation) return;

        if (act === "inc") {
          const avail = this.resources[res] ?? 0;
          if (this.mapSupplyAllocation[res] < avail) {
            this.mapSupplyAllocation[res]++;
            window.soundEngine.playClick();
          } else {
            window.soundEngine.playErrorChord();
          }
        } else if (act === "dec") {
          if (this.mapSupplyAllocation[res] > 0) {
            this.mapSupplyAllocation[res]--;
            window.soundEngine.playClick();
          }
        }

        const el = document.getElementById(`map-alloc-${res}`);
        if (el) el.textContent = this.mapSupplyAllocation[res];
      });
    });

    const btnDispatch = document.getElementById("btn-map-dispatch-supply");
    if (btnDispatch) {
      btnDispatch.addEventListener("click", () => {
        const sec = this.getSector(this.selectedSectorId);
        if (!sec) return;

        const total = Object.values(this.mapSupplyAllocation).reduce((a, b) => a + b, 0);
        if (total === 0) {
          window.soundEngine.playErrorChord();
          return;
        }

        // Deduct from warehouse
        for (const [res, qty] of Object.entries(this.mapSupplyAllocation)) {
          if (qty > 0) {
            this.resources[res] = Math.max(0, (this.resources[res] ?? 0) - qty);
          }
        }

        // Apply direct bonuses to sector metrics
        const f = this.mapSupplyAllocation.fuel || 0;
        const fo = this.mapSupplyAllocation.food || 0;
        const m = this.mapSupplyAllocation.meds || 0;
        const a = this.mapSupplyAllocation.ammo || 0;
        const w = this.mapSupplyAllocation.water || 0;

        sec.heat = Math.min(100, (sec.heat ?? 70) + f * 20);
        sec.food = Math.min(100, (sec.food ?? 70) + fo * 20);
        sec.riotRisk = Math.max(0, (sec.riotRisk ?? 15) - fo * 15 - a * 25);
        sec.sanitation = Math.min(100, (sec.sanitation ?? 70) + m * 25);
        sec.water = Math.min(100, (sec.water ?? 70) + w * 20);

        window.soundEngine.playPneumaticLaunch();
        this.logEvent(`[ОТГРУЗКА СО СКЛАДА]: В сектор «${sec.name}» доставлено: ${f ? f+' Топл. ' : ''}${fo ? fo+' Пайк. ' : ''}${m ? m+' Мед. ' : ''}${a ? a+' Патр. ' : ''}${w ? w+' Воды' : ''}. Сектор стабилизирован!`);

        this.updateResourceUI();
        this.selectSector(this.selectedSectorId);
      });
    }
  }

  getSector(id) {
    return this.sectors.find(s => s.id === id);
  }

  updateSector(id, changes) {
    const sec = this.getSector(id);
    if (!sec) return;
    Object.assign(sec, changes);

    if (changes.deadToday && changes.deadToday > 0) {
      sec.population = Math.max(0, sec.population - changes.deadToday);
      sec.totalDead = (sec.totalDead || 0) + changes.deadToday;
      this.totalCasualties += changes.deadToday;
      this.deadToday += changes.deadToday;
      this.checkAchievement("ach_first_blood");
    }

    if (sec.population === 0) {
      sec.status = "dead";
    }

    this.renderTacticalMap();
    if (this.selectedSectorId === id) this.selectSector(id);
  }

  // =========================================================================
  // DISPATCH & INBOX LOGIC (WITH TELEMETRY ANALYZER HIGHLIGHTS)
  // =========================================================================
  getRandomDispatchInterval() {
    const steps = [45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65];
    const sec = steps[Math.floor(Math.random() * steps.length)];
    return sec * 1000;
  }

  loadDayDispatches(day) {
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
  }

  deliverNextDispatch() {
    this.dispatchTimer = null;
    if (this.dayDispatchesQueue.length === 0) return;

    const nextDisp = this.dayDispatchesQueue.shift();
    const hadNoDispatches = (this.dispatches.length === 0);
    this.dispatches.push(nextDisp);

    window.soundEngine.playTeletype();
    this.flashTaskbarDispatch();
    this.logEvent(`[ВХОДЯЩАЯ ДЕПЕША]: В очередь телетайпа поступил пакет от [${nextDisp.sender}]!`);

    // Если экран был пустой (ожидание) — открываем пришедшую депешу.
    // Если игрок УЖЕ читает депешу — НЕ переключаем и не сбиваем чтение!
    if (hadNoDispatches) {
      this.currentDispatchIdx = 0;
      this.renderCurrentDispatch();
    } else {
      const counterEl = document.getElementById("disp-counter");
      if (counterEl) {
        counterEl.textContent = `${this.currentDispatchIdx + 1} / ${this.dispatches.length}`;
      }
    }

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
    if (elCounter) elCounter.textContent = "[ВХОДЯЩИЙ КАНАЛ]: ОЖИДАНИЕ ПАКЕТА СВЯЗИ...";
    if (elTopic) elTopic.textContent = "Формирование входящей депеши на узле связи...";
    if (elText) elText.textContent = 
      `Частота правительственной телеметрии чиста. Следующий пакет депеш формируется шифровальным отделом ЦК.\n\nИспользуйте паузу связи для оперативного контроля Тактической Карты, управления тумблерами магистралей и распределения аварийных запасов складов.`;
    
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
  }

  renderCurrentDispatch() {
    const disp = this.dispatches[this.currentDispatchIdx];
    if (!disp) {
      this.renderEmptyDispatch();
      return;
    }

    if (disp.sectorId) {
      this.selectSector(disp.sectorId);
    }

    document.getElementById("disp-sender").textContent = disp.sender;
    document.getElementById("disp-priority").textContent = disp.priority;
    document.getElementById("disp-counter").textContent = `${this.currentDispatchIdx + 1} / ${this.dispatches.length}`;
    document.getElementById("disp-topic").textContent = disp.topic;
    document.getElementById("disp-text").textContent = disp.text;

    const btnBribeDisp = document.getElementById("btn-bribe-dispatch");
    const bribeAmountEl = document.getElementById("bribe-btn-amount");
    if (btnBribeDisp) {
      if (disp.bribeOffer) {
        btnBribeDisp.style.display = "inline-block";
        if (bribeAmountEl) bribeAmountEl.textContent = disp.bribeOffer.amount || 500;
        // Добавляем пометку в текст депеши о найденном конверте
        const hintsBox = document.getElementById("disp-telemetry-hints");
        if (hintsBox) {
          const bribeNoteDiv = document.createElement("div");
          bribeNoteDiv.style.marginTop = "8px";
          bribeNoteDiv.style.padding = "6px 8px";
          bribeNoteDiv.style.background = "#fff8db";
          bribeNoteDiv.style.border = "1px solid #c99700";
          bribeNoteDiv.style.color = "#7a4e00";
          bribeNoteDiv.style.fontWeight = "bold";
          bribeNoteDiv.style.fontSize = "11px";
          bribeNoteDiv.innerHTML = `✉️ <strong>СЕРЫЙ КОНВЕРТ:</strong> ${disp.bribeOffer.note || "В конверте наличные деньги."}`;
          hintsBox.appendChild(bribeNoteDiv);
        }
      } else {
        btnBribeDisp.style.display = "none";
      }
    }

    const hintsContainer = document.getElementById("disp-telemetry-hints");
    hintsContainer.innerHTML = "";
    if (disp.telemetryFacts) {
      Object.entries(disp.telemetryFacts).forEach(([k, val]) => {
        const row = document.createElement("div");
        row.style.marginBottom = "2px";

        // Highlight anomaly if player installed Telemetry Analyzer app
        const isAnomaly = disp.isFraud && (val.includes("Поддельн") || val.includes("пение") || val.includes("спирт") || val.includes("мета") || val.includes("Никакого льда") || val.includes("частного"));
        if (this.flags.telemetryAnalyzerInstalled && isAnomaly) {
          row.className = "telemetry-highlight-anomaly";
          row.innerHTML = `⚠️ [АНАЛИЗАТОР]: <strong>${k.replace('sensor', 'Датчик ')}:</strong> ${val}`;
        } else {
          row.innerHTML = `• <span style="color: #fff;">${k.replace('sensor', 'Датчик ')}:</span> ${val}`;
        }
        hintsContainer.appendChild(row);
      });
    }

    // Demand summary & Flexible Allocation Spinners
    const demandSummaryEl = document.getElementById("disp-demand-summary");
    if (demandSummaryEl) {
      demandSummaryEl.textContent = disp.demandSummary || `Требуется: ${disp.req?.fuel ? disp.req.fuel+' Топливо ' : ''}${disp.req?.food ? disp.req.food+' Пайки ' : ''}${disp.req?.meds ? disp.req.meds+' Медпак ' : ''}${disp.req?.ammo ? disp.req.ammo+' Патроны ' : ''}${disp.req?.water ? disp.req.water+' Вода' : ''}`;
    }

    // Reset allocation spinners to 0
    this.currentDispatchAllocation = { fuel: 0, food: 0, meds: 0, ammo: 0, water: 0 };
    ["fuel", "food", "meds", "ammo", "water"].forEach(res => {
      const el = document.getElementById(`disp-alloc-${res}`);
      if (el) el.textContent = "0";
    });

    // Enable dispatch action buttons (Approve disabled until at least 1 resource allocated)
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
    }

    window.soundEngine.playTeletype();
  }

  renderEmptyDispatch() {
    document.getElementById("disp-sender").textContent = "—";
    document.getElementById("disp-priority").textContent = "ОЧИЩЕНО";
    document.getElementById("disp-counter").textContent = "0 / 0";
    document.getElementById("disp-topic").textContent = "Все депеши на сегодня обработаны";
    document.getElementById("disp-text").textContent = 
      "Входящий радиотрафик чист. Все запросы на текущую смену рассмотрены.\n\nПроверьте склад ресурсов и завершите рабочий день в окне «Склад Госрезерва».";
    document.getElementById("disp-telemetry-hints").textContent = "Нет активных данных для анализа.";
    document.getElementById("disp-req-list").textContent = "Топливо: 0 | Медпак: 0 | Патроны: 0 | Вода: 0";

    const btnApprove = document.getElementById("btn-approve-dispatch");
    const btnReject = document.getElementById("btn-reject-dispatch");
    const btnNext = document.getElementById("btn-next-dispatch");
    if (btnApprove) { btnApprove.disabled = true; btnApprove.style.opacity = "0.4"; btnApprove.style.cursor = "not-allowed"; }
    if (btnReject) { btnReject.disabled = true; btnReject.style.opacity = "0.4"; btnReject.style.cursor = "not-allowed"; }
    if (btnNext) { btnNext.disabled = true; btnNext.style.opacity = "0.4"; btnNext.style.cursor = "not-allowed"; }
  }

  showDispatchStamp(type, text, onDone) {
    const stamp = document.getElementById("dispatch-stamp-overlay");
    if (!stamp) {
      if (onDone) onDone();
      return;
    }
    const angle = (Math.random() * 8 - 14).toFixed(1);
    stamp.style.setProperty("--stamp-angle", `${angle}deg`);
    stamp.className = `dispatch-stamp ${type} active`;
    stamp.textContent = text;
    setTimeout(() => {
      stamp.classList.remove("active");
      if (onDone) onDone();
    }, 280);
  }

  bindDispatchActions() {
    const btnApprove = document.getElementById("btn-approve-dispatch");
    const btnReject = document.getElementById("btn-reject-dispatch");
    const btnNext = document.getElementById("btn-next-dispatch");

    // Allocation Spinners [-] [+]
    document.querySelectorAll(".dispatch-spinner-row .spin-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const res = btn.getAttribute("data-res");
        const action = btn.getAttribute("data-action");
        if (!res || !this.currentDispatchAllocation) return;

        if (action === "inc") {
          const avail = this.resources[res] ?? 0;
          if (this.currentDispatchAllocation[res] < avail) {
            this.currentDispatchAllocation[res]++;
            window.soundEngine.playClick();
          } else {
            window.soundEngine.playErrorChord();
          }
        } else if (action === "dec") {
          if (this.currentDispatchAllocation[res] > 0) {
            this.currentDispatchAllocation[res]--;
            window.soundEngine.playClick();
          }
        }

        const valEl = document.getElementById(`disp-alloc-${res}`);
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
    });

    if (btnNext) {
      btnNext.addEventListener("click", () => {
        if (this.dispatches.length > 0) {
          this.currentDispatchIdx = (this.currentDispatchIdx + 1) % this.dispatches.length;
          this.renderCurrentDispatch();
        }
      });
    }

    if (btnApprove) {
      btnApprove.addEventListener("click", () => {
        this.approveCurrentDispatch(false);
      });
    }

    const btnBribe = document.getElementById("btn-bribe-dispatch");
    if (btnBribe) {
      btnBribe.addEventListener("click", () => {
        this.approveCurrentDispatch(true);
      });
    }

    if (btnReject) {
      btnReject.addEventListener("click", () => {
        this.rejectCurrentDispatch();
      });
    }
  }

  approveCurrentDispatch(isBribe = false) {
    const disp = this.dispatches[this.currentDispatchIdx];
    if (!disp) return;

    const alloc = { ...this.currentDispatchAllocation };
    const totalAlloc = Object.values(alloc).reduce((a, b) => a + b, 0);

    // Strictly forbidden to approve without allocating at least 1 item!
    if (totalAlloc <= 0) {
      window.soundEngine.playErrorChord();
      this.logEvent("[ПРЕДУПРЕЖДЕНИЕ]: Выделите хотя бы одну единицу в накладной регулятором [-] [+]!");
      return;
    }

    // Verify stock
    for (const [res, qty] of Object.entries(alloc)) {
      if ((this.resources[res] ?? 0) < qty) {
        window.soundEngine.playErrorChord();
        this.logEvent(`[ОШИБКА СКЛАДА]: Недостаточно ${res} на складе диспетчера!`);
        return;
      }
    }

    // Deduct allocated resources from warehouse
    for (const [res, qty] of Object.entries(alloc)) {
      this.resources[res] = Math.max(0, (this.resources[res] ?? 0) - qty);
    }

    window.soundEngine.playApproveStamp();

    // Bribe handling vs Standard Fraud handling
    if (isBribe && disp.bribeOffer) {
      const bribeAmount = disp.bribeOffer.amount || 500;
      this.playerProfile.balance += bribeAmount;
      if (!this.bribesTakenToday) this.bribesTakenToday = 0;
      this.bribesTakenToday++;
      this.playerProfile.bankHistory.unshift(
        `${GAME_DATES[this.day - 1]} ${new Date().toLocaleTimeString().slice(0, 5)} [ВЗЯТКА В КОНВЕРТЕ]: +${bribeAmount} руб. (${disp.sender})`
      );
      this.logEvent(`[КОРРУПЦИЯ]: Вы взяли серый конверт (+${bribeAmount} руб.) и подписали накладную!`);
      // При получении взятки стандартный штраф за ложную депешу НЕ накладывается!
    } else if (disp.isFraud) {
      this.queuePendingFine(`Ущерб фонду бункера по ложной депеше [${disp.sender}]`, 400);
      this.modifyRating("gos", -10);
    } else {
      this.stats.dispatchesApprovedToday++;
      this.stats.totalApproved++;
    }

    if (disp.onFulfill) {
      disp.onFulfill(this, alloc);
    } else if (disp.onApprove) {
      disp.onApprove(this);
    }

    // Mark emergency in this sector resolved live!
    if (!this.resolvedSectorEmergencies) this.resolvedSectorEmergencies = {};
    if (disp.sectorId) {
      this.resolvedSectorEmergencies[disp.sectorId] = true;
    }

    // Instantly refresh telemetry window if open on screen!
    const winTel = document.getElementById("win-telemetry");
    if (winTel && winTel.style.display !== "none") {
      this.updateTelemetryDisplay(this.selectedTelemetrySector || disp.sectorId);
    }

    this.updateResourceUI();

    this.showDispatchStamp("approved", "ОДОБРЕНО", () => {
      this.removeCurrentDispatch();
      if (this.day >= 4 && Math.random() < 0.40 && !this.emergencyTriggeredToday) {
        this.emergencyTriggeredToday = true;
        setTimeout(() => this.triggerRandomEmergency(), 800);
      }
    });
  }

  rejectCurrentDispatch() {
    if (this.dispatches.length === 0) return;
    const disp = this.dispatches[this.currentDispatchIdx];
    if (!disp) return;

    window.soundEngine.playRejectStamp();

    if (!disp.isFraud) {
      this.queuePendingFine(`Отказ в аварийном снабжении [${disp.sender}], вызвавший жертвы`, 400);
      this.modifyRating("gos", -10);
    } else {
      this.stats.correctFraudsDetected++;
      if (this.stats.correctFraudsDetected >= 3) {
        this.checkAchievement("ach_sharp_eye");
      }
    }

    if (disp.onReject) {
      disp.onReject(this);
    }

    this.stats.totalRejected++;

    this.showDispatchStamp("rejected", "ОТКАЗАНО", () => {
      this.removeCurrentDispatch();
      if (this.day >= 4 && Math.random() < 0.40 && !this.emergencyTriggeredToday) {
        this.emergencyTriggeredToday = true;
        setTimeout(() => this.triggerRandomEmergency(), 800);
      }
    });
  }

  removeCurrentDispatch() {
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
  }

  updateResourceUI() {
    const elFuel = document.getElementById("res-fuel");
    const elFood = document.getElementById("res-food");
    const elMeds = document.getElementById("res-meds");
    const elAmmo = document.getElementById("res-ammo");
    const elWater = document.getElementById("res-water");

    if (elFuel) elFuel.textContent = this.resources.fuel ?? 0;
    if (elFood) elFood.textContent = this.resources.food ?? 0;
    if (elMeds) elMeds.textContent = this.resources.meds ?? 0;
    if (elAmmo) elAmmo.textContent = this.resources.ammo ?? 0;
    if (elWater) elWater.textContent = this.resources.water ?? 0;
  }

  logEvent(msg) {
    this.dailyLogs.unshift(msg);
  }

  // =========================================================================
  // SHUTDOWN CONFIRMATION & CRT POWER-OFF CYCLE (FIXED FLASH BUG!)
  // =========================================================================
  bindShutdownModal() {
    const btnEndDay = document.getElementById("btn-end-day");
    const overlay = document.getElementById("shutdown-modal-overlay");
    const btnConfirm = document.getElementById("btn-shutdown-confirm");
    const btnCancel = document.getElementById("btn-shutdown-cancel");

    if (btnEndDay) {
      btnEndDay.addEventListener("click", () => {
        // ПРОВЕРКА: Дежурный диспетчер обязан обработать ВСЕ депеши смены!
        if (this.dispatches && this.dispatches.length > 0) {
          window.soundEngine.playErrorChord();
          this.showMessageBox(
            `ОТКАЗ В ЗАВЕРШЕНИИ СМЕНЫ:\n\n` +
            `По регламенту Госплана СССР диспетчер обязан вынести вердикт по ВСЕМ входящим депешам!\n` +
            `Нерассмотренных депеш в очереди телетайпа: ${this.dispatches.length}.\n\n` +
            `Самовольное прекращение дежурства приравнивается к саботажу!`
          );
          this.logEvent(`[НАРУШЕНИЕ РЕГЛАМЕНТА]: Попытка покинуть смену до рассмотрения всех депеш (осталось: ${this.dispatches.length})!`);
          return;
        }

        if (overlay) overlay.style.display = "flex";
      });
    }

    if (btnCancel) {
      btnCancel.addEventListener("click", () => {
        if (overlay) overlay.style.display = "none";
      });
    }

    if (btnConfirm) {
      btnConfirm.addEventListener("click", () => {
        if (overlay) overlay.style.display = "none";
        this.executeNightShutdown();
      });
    }
  }

  executeNightShutdown() {
    const desktop = document.getElementById("desktop");
    const powerOverlay = document.getElementById("screen-power-overlay");

    // Close tutorial if open
    if (this.tutorialActive) {
      this.closeTutorialAssistant();
    }

    // 1. Play CRT Turn-off sound
    window.soundEngine.playCrtOff();

    // 2. Hide all open desktop windows immediately (leave modals and lock screen intact)
    document.querySelectorAll("#desktop .window").forEach(w => w.style.display = "none");

    desktop.classList.remove("screen-expanding");
    desktop.classList.add("screen-collapsing");

    setTimeout(() => {
      // 3. REMOVE .unlocked BEFORE power overlay hides, so desktop NEVER flashes!
      desktop.classList.remove("unlocked");
      desktop.style.display = "none";
      powerOverlay.classList.add("active");

      // Auto-reject any unhandled dispatches of the day
      while (this.dispatches.length > 0) {
        const d = this.dispatches[0];
        if (d.onReject) d.onReject(this);
        this.dispatches.shift();
      }

      if (this.stats.dispatchesApprovedToday === 0) {
        this.checkAchievement("ach_hoarder");
      }

      this.day++;
      this.emergencyTriggeredToday = false;

      // Ending check
      if (this.day > this.maxDays) {
        powerOverlay.classList.remove("active");
        desktop.classList.remove("screen-collapsing");
        this.triggerEnding();
        return;
      }

      // Sector Natural Consumption & Simulation with Conduits Priority & Auto Mode
      let nightCasualties = 0;
      const heatTarget = this.conduits?.heat || "auto";
      const energyTarget = this.conduits?.energy || this.conduits?.power || "auto";
      const waterTarget = this.conduits?.water || this.conduits?.hydro || "auto";

      this.sectors.forEach(sec => {
        if (sec.status !== "dead") {
          // Heat supply: Auto distributes evenly (-5), priority buffs (+10), others starved (-10)
          if (heatTarget === "auto") {
            sec.heat = Math.max(0, (sec.heat ?? 70) - 5);
          } else if (sec.id === heatTarget) {
            sec.heat = Math.min(100, (sec.heat ?? 70) + 10);
          } else {
            sec.heat = Math.max(0, (sec.heat ?? 70) - 10);
          }

          // Food consumption (all sectors consume rations)
          sec.food = Math.max(0, (sec.food ?? 70) - 15);

          // Water supply: Auto distributes evenly (-10), priority buffs (+10), others starved (-15)
          if (waterTarget === "auto") {
            sec.water = Math.max(0, (sec.water ?? 70) - 10);
          } else if (sec.id === waterTarget) {
            sec.water = Math.min(100, (sec.water ?? 70) + 10);
          } else {
            sec.water = Math.max(0, (sec.water ?? 70) - 15);
          }

          // Energy / Stability: Auto is calm, priority calms (-15), others build tension (+5)
          if (energyTarget === "auto") {
            // Balanced, baseline status
          } else if (sec.id === energyTarget) {
            sec.riotRisk = Math.max(0, (sec.riotRisk || 10) - 15);
          } else {
            sec.riotRisk = Math.min(100, (sec.riotRisk || 10) + 5);
          }

          // Check crisis conditions
          let sectorDead = 0;
          if (sec.heat < 15) sectorDead += 3;
          if (sec.food < 15) sectorDead += 4;
          if (sec.water < 15) sectorDead += 5;
          if (sec.sanitation < 15) sectorDead += 3;
          if (sec.riotRisk > 85) sectorDead += 6;

          if (sectorDead > 0) {
            sec.deadToday = (sec.deadToday || 0) + sectorDead;
            sec.population = Math.max(0, sec.population - sectorDead);
            sec.totalDead = (sec.totalDead || 0) + sectorDead;
            nightCasualties += sectorDead;
            this.totalCasualties += sectorDead;
          }
        }
      });

      // Add morning salary indexed by GosApparat rating (base 700 руб.)
      const morningSalary = Math.round(450 + ((this.playerProfile.ratingGos ?? 70) / 100) * 450);
      this.playerProfile.balance += morningSalary;
      this.playerProfile.bankHistory.unshift(
        `${GAME_DATES[this.day - 1] || '1998'} 08:00 [ГОСПЛАН]: Начислен суточный оклад (индекс ${this.playerProfile.ratingGos}%): +${morningSalary} руб.`
      );

      // Fine for night casualties (-30 руб. per person)
      if (nightCasualties > 0) {
        const casFine = nightCasualties * 30;
        this.playerProfile.balance -= casFine;
        this.playerProfile.bankHistory.unshift(
          `${GAME_DATES[this.day - 1] || '1998'} 08:00 [ШТРАФ ЗА ГИБЕЛЬ]: -${casFine} руб. (${nightCasualties} чел.)`
        );
      }

      // Process and deduct pending fines accumulated from yesterday's shift
      let totalFinesAmount = 0;
      const morningFineLogs = [];
      if (this.pendingFines && this.pendingFines.length > 0) {
        for (const fine of this.pendingFines) {
          totalFinesAmount += fine.amount;
          this.playerProfile.balance -= fine.amount;
          this.playerProfile.rating = Math.max(10, this.playerProfile.rating - 15);
          this.playerProfile.fines.unshift(fine);
          this.playerProfile.bankHistory.unshift(
            `${GAME_DATES[this.day - 1]} 08:00 [ОВК ШТРАФ]: -${fine.amount} руб. (${fine.reason})`
          );
          morningFineLogs.push(`[ВЗЫСКАНИЕ ОВК]: Штраф -${fine.amount} руб. за ${fine.reason}`);
        }
        this.pendingFines = [];
      }

      // ----------------------------------------------------
      // ПРОВЕРКА ОВК (ОСОБЫЙ ОТДЕЛ): АУДИТ ВЗЯТОК ЗА ПРОШЛЫЙ ДЕНЬ
      // ----------------------------------------------------
      if (this.bribesTakenToday && this.bribesTakenToday > 0) {
        const rating = this.playerProfile.ratingGos || this.playerProfile.rating || 50;
        let detectionChance = 0.05;
        if (rating <= 30) detectionChance = 0.60;
        else if (rating <= 40) detectionChance = 0.40;
        else if (rating <= 50) detectionChance = 0.25;
        else if (rating <= 60) detectionChance = 0.15;
        else detectionChance = 0.05;

        // Проверяем каждую взятку
        let detected = false;
        for (let b = 0; b < this.bribesTakenToday; b++) {
          if (Math.random() < detectionChance) {
            detected = true;
            break;
          }
        }

        if (detected) {
          const bribePenalty = 1200;
          this.playerProfile.balance -= bribePenalty;
          this.modifyRating("gos", -20);
          this.playerProfile.bankHistory.unshift(
            `${GAME_DATES[this.day - 1]} 08:15 [ШТРАФ ОВК КГБ]: -${bribePenalty} руб. (Незаконное обогащение и взятки)`
          );
          morningFineLogs.push(`[ОВК КГБ СССР]: РАСКРЫТО ПОЛУЧЕНИЕ ВЗЯТКИ! Штраф -${bribePenalty} руб., строгий выговор и понижение рейтинга (-20%)!`);
          this.logEvent(`[ТРЕВОГА ОВК]: Особый отдел вскрыл финансовые махинации! Изъято 1200 руб.`);
        } else {
          this.logEvent(`[УДАЧА]: Аудит ОВК прошел без замечаний. Полученные конверты не выявили.`);
        }
        this.bribesTakenToday = 0;
      }

      // Add new incoming emails for the day (evaluating conditions)
      const newMails = EMAIL_DATABASE.filter(m => {
        if (m.day !== this.day) return false;
        if (m.condition && typeof m.condition === "function") {
          return m.condition(this);
        }
        return true;
      });
      newMails.forEach(m => this.receivedEmails.unshift(m));

      // Show newspaper red unread dot on days 2-7
      const gazetteDot = document.getElementById("gazette-unread-dot");
      if (gazetteDot) gazetteDot.style.display = "block";

      // Resource replenishment
      let newFuel = 2;
      let newFood = 2;
      let newMeds = 1;
      let newAmmo = 2;
      let newWater = 1;

      if (this.getSector("sec_mine")?.status !== "dead") newFuel += 1;
      if (this.getSector("sec_water")?.status !== "dead") newWater += 1;
      if (this.getSector("sec_hydro")?.status !== "dead") newFood += 1;
      if (this.getSector("sec_med")?.status !== "dead") newMeds += 1;

      this.resources.fuel += newFuel;
      this.resources.food += newFood;
      this.resources.meds += newMeds;
      this.resources.ammo += newAmmo;
      this.resources.water += newWater;

      const summaryTitle = `УТРЕННИЙ ТЕЛЕТАЙП — ${GAME_DATES[this.day - 1]}`;
      const nightLogs = [...this.dailyLogs];
      this.dailyLogs = [];
      nightLogs.unshift(`[ЗАРПЛАТА]: Начислен суточный оклад: +${this.playerProfile.salary || 700} руб.`);
      if (morningFineLogs.length > 0) {
        morningFineLogs.forEach(fLine => nightLogs.unshift(fLine));
        nightLogs.unshift(`[ОВК ИТОГ ПО ШТРАФАМ]: Удержано за ошибки распределения: -${totalFinesAmount} руб. Итоговый баланс: ${this.playerProfile.balance} руб.`);
      } else {
        nightLogs.unshift(`[ОВК]: Ошибок в распределении ресурсов за смену не выявлено. Штрафы отсутствуют.`);
      }
      nightLogs.unshift(`[СНАБЖЕНИЕ]: Доставлено с центральных баз: +${newFuel} Топлива, +${newMeds} Медпаков, +${newAmmo} Патронов, +${newWater} Воды.`);
      
      const deathsLastNight = this.deadToday;
      this.deadToday = 0;

      this.loadDayDispatches(this.day);
      this.updateResourceUI();
      this.updateProfileUI();
      this.updateMailUI();
      this.updateBankUI();
      this.updateTray();
      this.saveGame();

      setTimeout(() => {
        window.soundEngine.playDegauss();
        powerOverlay.classList.remove("active");
        desktop.classList.remove("screen-collapsing");

        // SHOW LOCK SCREEN BEFORE ENTERING WORK ENVIRONMENT
        this.showLockScreen(() => {
          // Check for Comendatura Inspection on Days 3, 5, 7
          if (this.day === 3 || this.day === 5 || this.day === 7) {
            this.triggerInspection(() => {
              this.showDailySummary(summaryTitle, nightLogs, deathsLastNight);
            });
          } else {
            this.showDailySummary(summaryTitle, nightLogs, deathsLastNight);
          }
        });
      }, 1800);
    }, 550);
  }

  showDailySummary(title, logs, deaths) {
    const win = document.getElementById("win-summary");
    if (!win) return;
    const titleEl = win.querySelector(".window-title");
    const paper = document.getElementById("summary-text-log");
    const deathCounter = document.getElementById("summary-dead-counter");

    if (titleEl) titleEl.textContent = title;
    if (deathCounter) deathCounter.textContent = `Погибло за прошедшие сутки: ${deaths} чел.`;

    if (paper) {
      paper.innerHTML = "";
      logs.forEach(log => {
        const line = document.createElement("div");
        line.style.marginBottom = "4px";
        line.textContent = `> ${log}`;
        paper.appendChild(line);
      });
    }

    this.openWindow("win-summary");
    window.soundEngine.playTeletype();

    const btnClose = document.getElementById("btn-close-summary");
    if (btnClose) {
      btnClose.onclick = (e) => {
        if (e) e.stopPropagation();
        this.closeWindow("win-summary");
        window.soundEngine.playClick();
      };
    }
  }

  // =========================================================================
  // INTERACTIVE DAY 1 TUTORIAL ASSISTANT
  // =========================================================================
  startDay1InteractiveTutorial() {
    this.tutorialActive = true;
    this.tutorialStep = 1;
    this.renderTutorialStep();
  }

  renderTutorialStep() {
    const card = document.getElementById("tutorial-assistant-card");
    const stepEl = document.getElementById("assistant-step-counter");
    const textEl = document.getElementById("assistant-step-text");
    const btnNext = document.getElementById("btn-assistant-next");
    const btnSkip = document.getElementById("btn-close-assistant");
    const btnInline = document.getElementById("btn-open-tutorial-inline");

    if (btnInline) {
      btnInline.onclick = () => this.openWindow("win-tutorial");
    }

    // Инициализация кнопок масштабирования и жирности для карточки помощника
    const btnAstBold = document.getElementById("btn-ast-bold");
    const btnAstFontDec = document.getElementById("btn-ast-font-dec");
    const btnAstFontInc = document.getElementById("btn-ast-font-inc");
    const astText = document.getElementById("assistant-step-text");

    if (btnAstBold && !btnAstBold._bound) {
      btnAstBold._bound = true;
      btnAstBold.addEventListener("click", () => {
        this.astIsBold = !this.astIsBold;
        astText.classList.toggle("bold-active", this.astIsBold);
        btnAstBold.style.background = this.astIsBold ? "#000080" : "";
        btnAstBold.style.color = this.astIsBold ? "#fff" : "";
        window.soundEngine.playClick();
      });
    }

    if (btnAstFontDec && !btnAstFontDec._bound) {
      btnAstFontDec._bound = true;
      btnAstFontDec.addEventListener("click", () => {
        this.astFontSize = Math.max(10, (this.astFontSize || 13) - 1);
        if (astText) astText.style.fontSize = `${this.astFontSize}px`;
        window.soundEngine.playClick();
      });
    }

    if (btnAstFontInc && !btnAstFontInc._bound) {
      btnAstFontInc._bound = true;
      btnAstFontInc.addEventListener("click", () => {
        this.astFontSize = Math.min(22, (this.astFontSize || 13) + 1);
        if (astText) astText.style.fontSize = `${this.astFontSize}px`;
        window.soundEngine.playClick();
      });
    }

    if (!card) return;
    card.classList.add("active");
    this.clearTutorialHighlights();

    if (this.tutorialStep === 1) {
      if (stepEl) stepEl.textContent = "Шаг 1 из 7: Телетайп и депеши";
      if (textEl) textEl.innerHTML = `
        <strong>Окно «Депеши» — основа вашей службы.</strong><br>
        Сюда по правительственному радиоканалу поступают запросы от шести аванпостов Бункера. В каждой депеше указан сектор, срочность и суть запроса на получение складских ресурсов.
      `;
      this.openWindow("win-inbox");
      document.getElementById("win-inbox")?.classList.add("tutorial-highlight");
    } else if (this.tutorialStep === 2) {
      if (stepEl) stepEl.textContent = "Шаг 2 из 7: Анализ телеметрии и ГОСТ";
      if (textEl) textEl.innerHTML = `
        <strong>Никогда не верьте тексту депеши на слово!</strong><br>
        Откройте <strong>«Анализатор телеметрии»</strong> (кнопка в депеше или ярлык на рабочем столе) и сверьте датчики с таблицей в <strong>«Обучение.hlp»</strong>. Если начальник врет об аварии, а показатели в норме — жмите «Отказать»! Для терминала также доступен апгрейд цветовой индикации в <em>БункерМаркете</em>.<br><br>
        <div style="background: rgba(0,0,0,0.4); border-left: 3px solid #ffcc00; padding: 6px 8px; font-size: 11px; line-height: 1.45;">
          <strong style="color: #ffea00;">ПРИМЕР РАССЛЕДОВАНИЯ:</strong><br>
          1. Пришла депеша (например: авария в Шахте, мороз).<br>
          2. Жмите <code>[ ПУЛЬТ ДАТЧИКОВ ]</code> в бланке депеши.<br>
          3. Посмотрите показатель прибора (температура забоя).<br>
          4. Сверьте со Справочником ГОСТ в «Обучение.hlp» (норма: +15°C..+24°C).<br>
          5. <strong>Вердикт:</strong> если датчик в норме — отказ за обман; если реальный мороз — выдавайте ресурс.
        </div>
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
      if (stepEl) stepEl.textContent = "Шаг 5 из 7: Инфраструктурные магистрали";
      if (textEl) textEl.innerHTML = `
        <strong>Магистрали перенаправляют потоки без траты склада!</strong><br>
        Через выпадающие списки направляйте <strong>Тепло (🔥)</strong>, <strong>Энергию (⚡)</strong> и <strong>Водопровод (💧)</strong> в любой из 6 секторов.<br>
        • Подключенный сектор получает мощную подпитку.<br>
        • Остальные 5 секторов ночью не получают центрального снабжения и постепенно деградируют. Балансируйте потоки!<br><br>
        <div style="background: rgba(0,0,0,0.4); border-left: 3px solid #00d4ff; padding: 6px 8px; font-size: 11px; line-height: 1.45;">
          <strong style="color: #66ccff;">РЕЖИМЫ РАБОТЫ:</strong><br>
          • <strong>[ АВТО / РАВНОМЕРНО ]</strong>: автоматика делит тепло, свет и воду поровну на весь бункер (стабильный режим без микроконтроля).<br>
          • <strong>Выбор сектора</strong>: экстренная мера, если конкретный отсек на грани замерзания или бунта — спасает сектор без трат склада.
        </div>
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
    }

    if (btnNext) {
      btnNext.onclick = () => {
        this.tutorialStep++;
        if (this.tutorialStep > 7) {
          this.closeTutorialAssistant();
        } else {
          this.renderTutorialStep();
          window.soundEngine.playClick();
        }
      };
    }

    if (btnSkip) {
      btnSkip.onclick = () => {
        this.closeTutorialAssistant();
      };
    }
  }

  clearTutorialHighlights() {
    document.querySelectorAll(".tutorial-highlight").forEach(el => el.classList.remove("tutorial-highlight"));
  }

  closeTutorialAssistant() {
    this.tutorialActive = false;
    this.clearTutorialHighlights();
    document.getElementById("tutorial-assistant-card")?.classList.remove("active");
  }

  bindTutorialWindow() {
    const iconTut = document.getElementById("icon-tutorial");
    if (iconTut) {
      iconTut.addEventListener("click", () => {
        this.openWindow("win-tutorial");
      });
    }

    document.getElementById("btn-close-tutorial")?.addEventListener("click", () => {
      this.closeWindow("win-tutorial");
    });
  }

  // =========================================================================
  // ENDING CINEMATICS & CAMPAIGN FINALE
  // =========================================================================
  triggerEnding() {
    const deadSectors = this.sectors.filter(s => s.status === "dead").length;
    const radarAlive = this.getSector("sec_radar")?.status !== "dead";
    const mineAlive = this.getSector("sec_mine")?.status !== "dead";
    const blockAlive = this.getSector("sec_block")?.status !== "dead";

    let endingTitle = "";
    let endingText = "";

    if (this.playerProfile.balance <= -2400) {
      this.checkAchievement("ach_debtor");
      endingTitle = "КОНЦОВКА: ДОЛЖНИК (БАНКРОТСТВО И АРЕСТ)";
      endingText = `Ваш финансовый баланс пробил критический лимит (-2400 руб.). Комендатура Госплана сочла это злостным вредительством. Конвой СБ защелкнул наручники прямо у терминала ДИСП-74Б. Вас отправили в утилизационный цех биореактора.`;
    }
    else if (deadSectors >= 4) {
      this.checkAchievement("ach_black_horizon");
      endingTitle = "КОНЦОВКА 1: ЧЕРНЫЙ ГОРИЗОНТ (ПОЛНЫЙ КРАХ)";
      endingText = `Более половины секторов комплекса «Омега» мертвы. Пневмосеть завалена радиоактивным шламом. Центральное Командование запечатало входные шлюзы снаружи. Терминал отключен от питания. Вы остаетесь в вечной темноте.`;
    }
    else if (this.flags.omegaProtocolUnlocked) {
      endingTitle = "КОНЦОВКА: ПРОТОКОЛ «ОМЕГА» (ТАЙНА 1989 ГОДА)";
      endingText = `Раскрыв секретные архивы ЦК КПСС и испытаний «Периметра», вы узнали правду: ядерной войны не было, а внешняя зона за хребтом чиста! Воспользовавшись служебным пропуском и заправленным «Ковчегом», вы сбегаете из подземной тюрьмы на волю к рассвету!`;
    }
    else if ((this.playerProfile.ratingKsr ?? 15) >= 50 && this.flags.ksrTrainTrackReady) {
      this.checkAchievement("ach_rebel_spy");
      this.checkAchievement("ach_ark");
      endingTitle = "КОНЦОВКА 2: КРАСНЫЙ РАССВЕТ (ПОБЕДА КСР)";
      endingText = `Восстание Комитета Спасения Революции увенчалось триумфом! Переведенная вами железнодорожная стрелка направила эвакопоезд «Ковчег» к шлюзам рабочих. Сотни шахтеров, инженеров и их семей поднялись на борт бронепоезда и вырвались на свободу!`;
    }
    else if ((this.playerProfile.ratingGos ?? 70) >= 60 && this.flags.trainFueled) {
      this.checkAchievement("ach_iron_fist");
      endingTitle = "КОНЦОВКА 3: СТАЛЬНОЙ КУЛАК ГОСПЛАНА";
      endingText = `Вы безупречно выполнили все директивы Комендатуры и генерала Каверина. Заправленный бронепоезд «Ковчег» принял партийную элиту и золотой резерв. Вас награждают медалью «За верность режиму» и местом в штабном вагоне. Бункер запечатан навсегда.`;
    }
    else if (deadSectors === 0) {
      this.checkAchievement("ach_hero");
      endingTitle = "КОНЦОВКА 4: ГЕРОЙ ГОСПЛАНА (14 ДНЕЙ БЕЗ ПОТЕРЬ)";
      endingText = `Невероятно! Все 6 секторов сектора «Омега» пережили 14 дней жесточайшей ядерной зимы без единого разрушенного сектора! Ваши действия войдут в историю диспетчерской службы. Потери минимальны, реактор и гидропоника спасены!`;
    } else {
      endingTitle = "СМЕНА №14 ЗАВЕРШЕНА: БУДНИ ВЫЖИВАНИЯ";
      endingText = `Вы провели бункер через 14 дней суровых испытаний. Комплекс понес потери, но инфраструктура устояла. Ваша тяжелая служба продолжается.`;
    }

    // Family Storyline Resolution
    let familyStory = "";
    if (this.playerProfile.curedFamily && (this.playerProfile.ratingFamily ?? 100) >= 40) {
      this.checkAchievement("ach_good_father");
      familyStory = "СЕМЬЯ: Вы спасли 6-летнюю Настю антибиотиками! 15-летний сын Миша вернулся из забоя живым и невредимым. Елена обнимает вас со слезами радости. Ваша семья воссоединена и готова к будущему.";
    } else if ((this.playerProfile.ratingFamily ?? 100) <= 30) {
      this.checkAchievement("ach_cold_heart");
      familyStory = "СЕМЬЯ: Елена оформила развод и забрала детей в глубокие общежития. В пустой каморке вас больше никто не ждет. Вы остались совершенно одни.";
    } else if (!this.playerProfile.curedFamily) {
      familyStory = "СЕМЬЯ: Из-за отсутствия антибиотиков Настя не пережила спорового воспаления легких. Семья погрузилась в тяжелейший траур, который никогда не залечить.";
    } else {
      familyStory = "СЕМЬЯ: Настя выздоровела, но взаимные упреки и холодность оставили глубокие шрамы в отношениях с Еленой.";
    }

    const logs = [
      endingText,
      `--- СУДЬБА ВАШЕЙ СЕМЬИ ---`,
      familyStory,
      `--- ИТОГОВАЯ СТАТИСТИКА КАМПАНИИ ---`,
      `Финальный баланс: ${this.playerProfile.balance} руб.`,
      `Лояльность ГосАппарата: ${this.playerProfile.ratingGos ?? 70}%`,
      `Лояльность КСР: ${this.playerProfile.ratingKsr ?? 15}%`,
      `Отношения в семье: ${this.playerProfile.ratingFamily ?? 100}%`,
      `Всего жертв за 14 дней: ${this.totalCasualties} чел.`,
      `Уничтожено секторов: ${deadSectors} из 6`,
      `Одобрено заявок: ${this.stats.totalApproved}`,
      `Раскрыто фальшивок: ${this.stats.correctFraudsDetected}`,
      `Статус Диспетчера: СМЕНА №14 СДАНА`
    ];

    this.showDailySummary(endingTitle, logs, 0);
    localStorage.removeItem("bunkeros_save");
    this.checkSavedGame();
  }

  // =========================================================================
  // STEAM-STYLE ACHIEVEMENTS SYSTEM
  // =========================================================================
  checkAchievement(id) {
    if (this.unlockedAchievements.includes(id)) return;

    const ach = ACHIEVEMENTS_DATA.find(a => a.id === id);
    if (!ach) return;

    this.unlockedAchievements.push(id);
    this.saveAchievements();
    this.updateAchievementsCounter();

    this.showAchievementToast(ach);
    this.renderAchievementsGallery();
    this.checkSavedGame();
  }

  showAchievementToast(ach) {
    if (!this.achievementQueue) this.achievementQueue = [];
    this.achievementQueue.push(ach);
    if (!this.isShowingToast) {
      this.processAchievementQueue();
    }
  }

  processAchievementQueue() {
    if (!this.achievementQueue || this.achievementQueue.length === 0) {
      this.isShowingToast = false;
      return;
    }

    this.isShowingToast = true;
    const ach = this.achievementQueue.shift();

    const toast = document.getElementById("achievement-toast");
    const toastTitle = document.getElementById("toast-title");
    const toastDesc = document.getElementById("toast-desc");
    const toastIcon = document.getElementById("toast-icon");

    if (toastTitle) toastTitle.textContent = ach.title;
    if (toastDesc) toastDesc.textContent = ach.desc;
    if (toastIcon) {
      toastIcon.innerHTML = `<img src="img/achievements/${ach.id}.png" alt="${ach.title}" style="width: 30px; height: 30px; object-fit: contain; border-radius: 3px; display: block;">`;
    }

    if (window.soundEngine) window.soundEngine.playAchievementChime();
    if (toast) toast.classList.add("show");

    setTimeout(() => {
      if (toast) toast.classList.remove("show");
      setTimeout(() => {
        this.processAchievementQueue();
      }, 400);
    }, 4500);
  }

  updateAchievementsCounter() {
    const countEl = document.getElementById("menu-ach-count");
    if (countEl && typeof ACHIEVEMENTS_DATA !== "undefined") {
      countEl.textContent = `${this.unlockedAchievements.length} / ${ACHIEVEMENTS_DATA.length}`;
    }
  }

  renderAchievementsGallery() {
    const list = document.getElementById("menu-achievements-list");
    this.updateAchievementsCounter();

    if (!list) return;
    list.innerHTML = "";

    ACHIEVEMENTS_DATA.forEach(ach => {
      const isUnlocked = this.unlockedAchievements.includes(ach.id);
      const card = document.createElement("div");
      card.className = `ach-card ${isUnlocked ? 'unlocked' : 'locked'}`;

      let title = ach.title;
      let desc = ach.desc;
      let iconHtml = '';

      if (!isUnlocked && ach.secret) {
        title = "[СЕКРЕТНО]";
        desc = "Условия засекречены Госпланом до момента выполнения.";
        iconHtml = `<span style="font-size: 16px;">🔒</span>`;
      } else {
        iconHtml = `<img src="img/achievements/${ach.id}.png" alt="${title}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 2px; ${!isUnlocked ? 'filter: grayscale(100%) brightness(0.35) contrast(1.2); opacity: 0.55;' : ''}">`;
      }

      card.innerHTML = `
        <div class="ach-icon-box" style="padding: 2px; overflow: hidden; ">
          ${iconHtml}
        </div>
        <div class="ach-details">
          <div class="ach-title">${title} ${isUnlocked ? '✔️' : '🔒'}</div>
          <div class="ach-desc">${desc}</div>
        </div>
      `;

      list.appendChild(card);
    });
  }

  // =========================================================================
  // SECTOR TELEMETRY & SENSOR ANALYZER SYSTEM
  // =========================================================================
  bindTelemetryAnalyzer() {
    const iconTel = document.getElementById("icon-telemetry");
    if (iconTel) {
      iconTel.addEventListener("click", () => {
        this.openTelemetryWindow();
      });
    }

    const btnFromInbox = document.getElementById("btn-open-analyzer-from-inbox");
    if (btnFromInbox) {
      btnFromInbox.addEventListener("click", () => {
        const disp = this.dispatches[this.currentDispatchIdx];
        const secId = disp?.sectorId || "sec_mine";
        this.openTelemetryWindow(secId);
      });
    }

    // Кнопки переключения секторов
    document.querySelectorAll("#telemetry-sector-tabs .tel-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#telemetry-sector-tabs .tel-tab").forEach(b => {
          b.classList.remove("active");
          b.style.fontWeight = "normal";
        });
        btn.classList.add("active");
        btn.style.fontWeight = "bold";

        const secId = btn.getAttribute("data-sec");
        this.selectedTelemetrySector = secId;
        window.soundEngine.playClick();
        this.updateTelemetryDisplay(secId);
      });
    });
  }

  openTelemetryWindow(targetSectorId = null) {
    this.openWindow("win-telemetry");
    const secId = targetSectorId || this.selectedTelemetrySector || "sec_mine";
    this.selectedTelemetrySector = secId;

    // Подсветить нужную вкладку
    document.querySelectorAll("#telemetry-sector-tabs .tel-tab").forEach(btn => {
      const match = (btn.getAttribute("data-sec") === secId);
      btn.classList.toggle("active", match);
      btn.style.fontWeight = match ? "bold" : "normal";
    });

    this.updateTelemetryDisplay(secId);
  }

  updateTelemetryDisplay(secId) {
    const sec = this.getSector(secId);
    const secNameEl = document.getElementById("tel-sec-name");
    if (secNameEl && sec) secNameEl.textContent = sec.name;

    const currentDisp = this.dispatches[this.currentDispatchIdx];
    const isResolved = !!(this.resolvedSectorEmergencies && this.resolvedSectorEmergencies[secId]);
    const isCurrentSectorDisp = !isResolved && (currentDisp && currentDisp.sectorId === secId);
    const facts = isCurrentSectorDisp ? (currentDisp.telemetryFacts || {}) : {};

    const isAnalyzerInstalled = !!this.flags.telemetryAnalyzerInstalled;

    const COLOR_OK = "#33ff66";
    const COLOR_WARN = "#ffcc00";
    const COLOR_CRIT = "#ff3333";

    const applyColor = (el, color) => {
      if (!el) return;
      el.style.color = isAnalyzerInstalled ? color : "#33ff66";
    };

    // 1. Температура забоя и давление пара
    const tempEl = document.getElementById("tel-val-temp");
    const pressEl = document.getElementById("tel-val-pressure");
    if (tempEl) {
      let cleanTemp = "";
      if (facts.sensorTemp) {
        cleanTemp = facts.sensorTemp.split("(")[0].trim();
        tempEl.textContent = cleanTemp || facts.sensorTemp;
      } else {
        cleanTemp = sec ? `+${Math.round(sec.heat / 3.5 + 5)}°C` : "+19°C";
        tempEl.textContent = cleanTemp;
      }

      // GOST temperature limits per sector
      const tempNum = parseFloat(cleanTemp.replace(/[^0-9.-]/g, "")) || 20;
      let minT = 15, maxT = 24;
      if (secId === "sec_water") { minT = 10; maxT = 16; }
      else if (secId === "sec_hydro") { minT = 16; maxT = 25; }
      else if (secId === "sec_med") { minT = 18; maxT = 22; }
      else if (secId === "sec_radar") { minT = -5; maxT = 18; }
      else if (secId === "sec_block") { minT = 18; maxT = 22; }

      if (tempNum >= minT && tempNum <= maxT) {
        applyColor(tempEl, COLOR_OK);
      } else if (tempNum < minT - 5 || tempNum > maxT + 5) {
        applyColor(tempEl, COLOR_CRIT);
      } else {
        applyColor(tempEl, COLOR_WARN);
      }
    }

    if (pressEl) {
      let rawP = facts.sensorSteamPressure || facts.sensorPressure || facts.sensorBoilerTemp || "4.2 атм";
      rawP = rawP.split("(")[0].trim();
      pressEl.textContent = rawP;

      const pNum = parseFloat(rawP.replace(/[^0-9.-]/g, "")) || 4;
      let maxP = 6.0;
      if (secId === "sec_water") maxP = 8.0;
      if (secId === "sec_hydro") maxP = 4.0;

      if (pNum <= maxP) {
        applyColor(pressEl, COLOR_OK);
      } else if (pNum > maxP + 2.0 || rawP.includes("свищ") || rawP.includes("взрыв")) {
        applyColor(pressEl, COLOR_CRIT);
      } else {
        applyColor(pressEl, COLOR_WARN);
      }
    }

    // 2. Газоанализатор и спирт
    const alcEl = document.getElementById("tel-val-alcohol");
    const gasStatusEl = document.getElementById("tel-val-gas-status");
    let hasAlcoholReading = false;
    let alcNum = 0.0;

    if (alcEl) {
      if (facts.sensorAudio && facts.sensorAudio.includes("спирт")) {
        alcEl.textContent = "2.8‰";
        alcNum = 2.8;
        hasAlcoholReading = true;
      } else if (facts.sensorAlcohol) {
        const rawAlc = facts.sensorAlcohol.split("(")[0].trim();
        alcEl.textContent = rawAlc;
        alcNum = parseFloat(rawAlc.replace(/[^0-9.-]/g, "")) || 0;
        if (alcNum > 0.05) hasAlcoholReading = true;
      } else {
        alcEl.textContent = "0.0‰";
        alcNum = 0.0;
      }

      let maxAlc = 0.2;
      if (secId === "sec_water") maxAlc = 0.0; // СТРОГО 0.0‰
      else if (secId === "sec_hydro" || secId === "sec_radar") maxAlc = 0.1;
      else if (secId === "sec_med") maxAlc = 0.3;
      else if (secId === "sec_block") maxAlc = 0.5;

      if (alcNum <= maxAlc) {
        applyColor(alcEl, COLOR_OK);
      } else if (alcNum > maxAlc + 0.6) {
        applyColor(alcEl, COLOR_CRIT);
      } else {
        applyColor(alcEl, COLOR_WARN);
      }
    }

    if (gasStatusEl) {
      if (hasAlcoholReading || alcNum > 0.2) {
        gasStatusEl.textContent = "Пары летучих фракций зафиксированы";
        applyColor(gasStatusEl, alcNum > 1.0 ? COLOR_CRIT : COLOR_WARN);
      } else {
        gasStatusEl.textContent = "Спектр газовой смеси стабилен";
        applyColor(gasStatusEl, COLOR_OK);
      }
    }

    // 3. Периметр и движение
    const motOutEl = document.getElementById("tel-val-motion-out");
    const perimStatusEl = document.getElementById("tel-val-perimeter-status");
    if (motOutEl) {
      let motText = "0 тепловых отметок";
      if (facts.sensorMotion) {
        motText = facts.sensorMotion.split("(")[0].trim() || facts.sensorMotion;
      } else if (facts.sensorPerimeter) {
        motText = facts.sensorPerimeter.split("(")[0].trim();
      }
      motOutEl.textContent = motText;

      const isHostile = motText.includes("силуэт") || motText.includes("цел") || motText.includes("отметок: 4") || motText.includes("прорыв");
      if (motText.includes("0 тепловых") || motText.includes("Штатно") || motText === "0") {
        applyColor(motOutEl, COLOR_OK);
      } else if (isHostile) {
        applyColor(motOutEl, COLOR_CRIT);
      } else {
        applyColor(motOutEl, COLOR_WARN);
      }
    }
    if (perimStatusEl) {
      perimStatusEl.textContent = "Сектор наблюдения включен";
      applyColor(perimStatusEl, COLOR_OK);
    }

    // 4. Акустика и сейсмика
    const audioEl = document.getElementById("tel-val-audio");
    const seismicEl = document.getElementById("tel-val-seismic");
    if (audioEl) {
      const audText = facts.sensorAudio || "Фоновый уровень 28 дБ";
      audioEl.textContent = audText;

      const audNum = parseFloat(audText.replace(/[^0-9.-]/g, "")) || 28;
      let maxDb = 45;
      if (secId === "sec_mine") maxDb = 75;
      else if (secId === "sec_hydro") maxDb = 30;
      else if (secId === "sec_med") maxDb = 35;
      else if (secId === "sec_radar") maxDb = 50;
      else if (secId === "sec_block") maxDb = 60;

      const isRiotSound = audText.includes("звон") || audText.includes("пение") || audText.includes("крик");
      if (isRiotSound || audNum > maxDb + 15) {
        applyColor(audioEl, COLOR_CRIT);
      } else if (audNum > maxDb) {
        applyColor(audioEl, COLOR_WARN);
      } else {
        applyColor(audioEl, COLOR_OK);
      }
    }

    if (seismicEl) {
      const cleanSeismic = (facts.sensorSeismic || "0.1 балла").split("(")[0].trim();
      seismicEl.textContent = cleanSeismic;
      const sNum = parseFloat(cleanSeismic.replace(/[^0-9.-]/g, "")) || 0.1;

      if (sNum <= 1.0) {
        applyColor(seismicEl, COLOR_OK);
      } else if (sNum > 3.0) {
        applyColor(seismicEl, COLOR_CRIT);
      } else {
        applyColor(seismicEl, COLOR_WARN);
      }
    }

    // 5. Биология и фильтры
    const sporesEl = document.getElementById("tel-val-spores");
    const filterEl = document.getElementById("tel-val-filter");
    if (sporesEl) {
      const cleanBio = (facts.sensorBio || "Класс 0 (Отрицательно)").split("(")[0].trim();
      sporesEl.textContent = cleanBio;
      if (cleanBio.includes("Класс 0") || cleanBio.includes("Отрицательно")) {
        applyColor(sporesEl, COLOR_OK);
      } else if (cleanBio.includes("Класс 1")) {
        applyColor(sporesEl, COLOR_WARN);
      } else {
        applyColor(sporesEl, COLOR_CRIT);
      }
    }

    if (filterEl) {
      const cleanFilt = (facts.sensorFilter || facts.sensorCasualties || "Износ: 12%").split("(")[0].trim();
      filterEl.textContent = cleanFilt;
      const filtNum = parseFloat(cleanFilt.replace(/[^0-9.-]/g, "")) || 15;
      if (filtNum < 60) {
        applyColor(filterEl, COLOR_OK);
      } else if (filtNum >= 85) {
        applyColor(filterEl, COLOR_CRIT);
      } else {
        applyColor(filterEl, COLOR_WARN);
      }
    }

    // 6. Энергосеть и приборы
    const powerEl = document.getElementById("tel-val-power");
    const fridgeEl = document.getElementById("tel-val-fridge");
    if (powerEl) {
      const pwrText = (facts.sensorPower || facts.sensorLabor || "100%").split("(")[0].trim();
      powerEl.textContent = pwrText;
      const pwrNum = parseFloat(pwrText.replace(/[^0-9.-]/g, "")) || 100;
      if (pwrNum >= 80) {
        applyColor(powerEl, COLOR_OK);
      } else if (pwrNum < 50) {
        applyColor(powerEl, COLOR_CRIT);
      } else {
        applyColor(powerEl, COLOR_WARN);
      }
    }

    if (fridgeEl) {
      let rawF = (facts.sensorTemp && facts.sensorTemp.includes("Холодильники")) ? facts.sensorTemp : "+3°C";
      rawF = rawF.split("(")[0].trim();
      fridgeEl.textContent = rawF;
      const fNum = parseFloat(rawF.replace(/[^0-9.-]/g, "")) || 3;
      if (fNum >= 2 && fNum <= 5) {
        applyColor(fridgeEl, COLOR_OK);
      } else if (fNum > 8) {
        applyColor(fridgeEl, COLOR_CRIT);
      } else {
        applyColor(fridgeEl, COLOR_WARN);
      }
    }

    // Сводный вывод
    const conclusionEl = document.getElementById("tel-summary-conclusion");
    if (conclusionEl) {
      if (isResolved) {
        conclusionEl.textContent = `[СИСТЕМА]: Запрос сектора [${sec?.name || secId}] удовлетворен. Аварийный режим снят, показатели приведены в норму ГОСТ.`;
        conclusionEl.style.color = "#33ff66";
      } else if (isAnalyzerInstalled) {
        conclusionEl.textContent = `[АНАЛИЗАТОР v1.2 АКТИВЕН]: Автоматическое сканирование ГОСТ выполнено. Зеленый — допуск, Желтый — внимание, Красный — нарушение!`;
        conclusionEl.style.color = "#33ff66";
      } else {
        conclusionEl.textContent = `[БАЗОВАЯ ТЕЛЕМЕТРИЯ]: Ручная сверка. Для автоподсветки нарушений ГОСТ приобретите «Анализатор телеметрии v1.2» в БункерМаркете.`;
        conclusionEl.style.color = "#88c0a0";
      }
    }
  }
}

// Global Startup
window.addEventListener("DOMContentLoaded", () => {
  window.game = new BunkerGame();
});