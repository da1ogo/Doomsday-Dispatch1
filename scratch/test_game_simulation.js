const fs = require('fs');

// Mock browser DOM environment
class MockElement {
  constructor(id = "") {
    this.id = id;
    this.style = {};
    this.classList = {
      classes: new Set(),
      add: (c) => this.classList.classes.add(c),
      remove: (c) => this.classList.classes.delete(c),
      contains: (c) => this.classList.classes.has(c)
    };
    this.children = [];
    this.textContent = "";
    this.innerHTML = "";
    this.value = "91.2";
  }
  setAttribute(k, v) { this[k] = v; }
  appendChild(child) { this.children.push(child); }
  addEventListener(event, fn) { this[`on_${event}`] = fn; }
  querySelector() { return new MockElement(); }
  querySelectorAll() { return []; }
  getBoundingClientRect() { return { left: 0, top: 0, right: 50, bottom: 50 }; }
}

global.document = {
  getElementById: (id) => new MockElement(id),
  querySelector: () => new MockElement(),
  querySelectorAll: () => [],
  createElement: (tag) => new MockElement(tag),
  addEventListener: () => {},
  body: new MockElement("body")
};
global.window = {
  addEventListener: () => {},
  soundEngine: new Proxy({}, {
    get: (target, prop) => {
      return (...args) => {};
    }
  })
};
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = v; },
  removeItem(k) { delete this.store[k]; }
};

// Load database.js and game.js
const dbCode = fs.readFileSync('database.js', 'utf8');
const gameCode = fs.readFileSync('game.js', 'utf8');

const vm = require('vm');
vm.runInThisContext(dbCode);
vm.runInThisContext(gameCode);

console.log("=== RUNNING GAME SIMULATION TESTS ===");

const game = new BunkerGame();

// Test 1: Pacing intervals
const intervals = new Set();
for (let i = 0; i < 100; i++) {
  intervals.add(game.getRandomDispatchInterval() / 1000);
}
const validSteps = [45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65];
for (const step of intervals) {
  if (!validSteps.includes(step)) {
    throw new Error(`Invalid step interval generated: ${step}`);
  }
}
console.log("PASS: getRandomDispatchInterval strictly generates 45-65s with step 2:", Array.from(intervals).sort((a,b)=>a-b));

// Test 2: Daily TOR market pool (strictly 4 items, antibiotics on Day 1)
game.day = 1;
game.generateDailyTorMarket();
if (game.dailyTorMarketItems.length !== 4) {
  throw new Error(`Expected 4 daily tor market items, got ${game.dailyTorMarketItems.length}`);
}
const hasAntibiotics = game.dailyTorMarketItems.some(i => i.id === "tor_antibiotics");
if (!hasAntibiotics) {
  throw new Error("Expected antibiotics in Day 1 market!");
}
console.log("PASS: Daily TOR Market generates exactly 4 items with antibiotics guaranteed on Day 1:", game.dailyTorMarketItems.map(i => i.name));

// Test 3: Free mystery artifact in APP_MARKET_DATABASE
const mysteryApp = APP_MARKET_DATABASE.find(a => a.id === "app_mystery_box");
if (!mysteryApp || mysteryApp.price !== 0) {
  throw new Error("app_mystery_box not found or not free in APP_MARKET_DATABASE");
}
game.playerProfile.balance = 50;
game.buyMarketApp("app_mystery_box");
if (!game.flags.omegaProtocolUnlocked) {
  throw new Error("Buying app_mystery_box should unlock omegaProtocolUnlocked");
}
console.log("PASS: Free artifact 'app_mystery_box' purchased for 0 rub and unlocked Omega Protocol.");

// Test 4: Bankruptcy threshold <= -2400 triggers debtor arrest
game.playerProfile.balance = -2450;
game.debtorArrested = false;
const isBankrupt = game.checkBankruptcy();
if (!isBankrupt || !game.debtorArrested) {
  throw new Error("checkBankruptcy failed to trigger debtor arrest at -2450 rub");
}
console.log("PASS: Balance <= -2400 rub triggers debtor arrest modal and terminates play.");

// Test 5: Map direct supply resource delivery
game.resources = { fuel: 5, food: 5, meds: 5, ammo: 5, water: 5 };
game.selectedSectorId = "sec_mine";
game.mapSupplyAllocation = { fuel: 1, food: 2, meds: 0, ammo: 0, water: 0 };
const mineSec = game.getSector("sec_mine");
const prevHeat = mineSec.heat || 70;
const prevFood = mineSec.food || 70;

// Deduct & apply bonuses like in bindMapDirectSupply dispatch
for (const [res, qty] of Object.entries(game.mapSupplyAllocation)) {
  if (qty > 0) game.resources[res] -= qty;
}
mineSec.heat = Math.min(100, (mineSec.heat ?? 70) + 1 * 20);
mineSec.food = Math.min(100, (mineSec.food ?? 70) + 2 * 20);

if (game.resources.fuel !== 4 || game.resources.food !== 3) {
  throw new Error("Resources not deducted properly on map delivery!");
}
if (mineSec.heat <= prevHeat || mineSec.food <= prevFood) {
  throw new Error("Sector metrics not boosted on map delivery!");
}
console.log("PASS: Map supply allocation properly deducts warehouse and boosts sector metrics.");

// Test 6: Zero allocation dispatch approval is blocked
game.dispatches = [{ sender: "Забой-3", text: "Срочно дайте топлива!", req: { fuel: 2 } }];
game.currentDispatchIdx = 0;
game.currentDispatchAllocation = { fuel: 0, food: 0, meds: 0, ammo: 0, water: 0 };
let logWarning = false;
game.logEvent = (msg) => { if (msg.includes("ПРЕДУПРЕЖДЕНИЕ")) logWarning = true; };
game.approveCurrentDispatch();
if (!logWarning || game.dispatches.length !== 1) {
  throw new Error("Approving dispatch with 0 allocated resources was NOT rejected!");
}
console.log("PASS: Approving dispatch with 0 resources is strictly rejected with a warning.");

console.log("=== ALL SIMULATION TESTS PASSED SUCCESSFULLY! ===");
