const fs = require('fs');
const vm = require('vm');

// Mock environment
class MockElement {
  constructor(id = "") {
    this.id = id;
    this.style = {};
    this.classList = {
      classes: new Set(),
      add: (c) => this.classList.classes.add(c),
      remove: (c) => this.classList.classes.delete(c),
      contains: (c) => this.classList.classes.has(c),
      toggle: (c, v) => v ? this.classList.classes.add(c) : this.classList.classes.delete(c)
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
  getContext() { return { fillRect: ()=>{}, strokeRect: ()=>{}, beginPath: ()=>{}, stroke: ()=>{}, fill: ()=>{}, arc: ()=>{}, roundRect: ()=>{}, moveTo: ()=>{}, lineTo: ()=>{}, save: ()=>{}, restore: ()=>{}, translate: ()=>{}, rotate: ()=>{}, fillText: ()=>{} }; }
}

const mockElements = {};
global.document = {
  getElementById: (id) => mockElements[id] || (mockElements[id] = new MockElement(id)),
  querySelector: () => new MockElement(),
  querySelectorAll: () => [],
  createElement: (tag) => new MockElement(tag),
  addEventListener: () => {},
  body: new MockElement("body")
};
global.window = {
  addEventListener: () => {},
  soundEngine: new Proxy({}, {
    get: (target, prop) => (...args) => {}
  }),
  location: { reload: () => console.log("[MOCK] Window reloaded!") }
};
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = v; },
  removeItem(k) { delete this.store[k]; }
};

const dbCode = fs.readFileSync('database.js', 'utf8');
const gameCode = fs.readFileSync('game.js', 'utf8');

vm.runInThisContext(dbCode);
vm.runInThisContext(gameCode);

console.log("=== RUNNING MASTER SIMULATION TESTS ===");

// Test 1: getDayDispatches strictly returns 7 dispatches per day
const seenIds = [];
for (let d = 1; d <= 5; d++) {
  const disps = getDayDispatches(d, seenIds);
  if (disps.length !== 7) {
    throw new Error(`Day ${d}: Expected 7 dispatches, got ${disps.length}`);
  }
  disps.forEach(item => {
    if (item.isProcedural && seenIds.includes(item.id)) {
      throw new Error(`Procedural dispatch ${item.id} repeated on Day ${d}!`);
    }
    if (item.id) seenIds.push(item.id);
  });
  console.log(`PASS: Day ${d} received exactly 7 dispatches (seenIds total: ${seenIds.length}).`);
}

// Test 2: BunkerGame instance initialization
const game = new BunkerGame();
game.day = 1;

// Test 3: Day 1 radio lock
game.openTorRadio();
const statusEl = document.getElementById("tor-signal-status");
if (!statusEl.textContent.includes("ОПЕЧАТАНО")) {
  throw new Error("Day 1 radio must be sealed/locked!");
}
console.log("PASS: Day 1 radio is sealed with command decree and cannot be tuned.");

// Test 4: Conduits state and toggles
if (!game.conduits || game.conduits.heat !== "mine") {
  throw new Error("Initial conduits state missing or invalid!");
}
console.log("PASS: Conduits initialized with modes:", game.conduits);

// Test 5: Waiting screen does NOT reveal exact counter and guards buttons
game.dayDispatchesQueue = [1, 2, 3];
game.dispatches = [];
game.renderWaitingForDispatch();

const counterEl = document.getElementById("disp-counter");
if (counterEl.textContent.includes("3") || counterEl.textContent.includes("осталось")) {
  throw new Error(`Counter revealed dispatches count: ${counterEl.textContent}`);
}
if (!counterEl.textContent.includes("ОЖИДАНИЕ ПАКЕТА СВЯЗИ")) {
  throw new Error(`Unexpected counter text: ${counterEl.textContent}`);
}

const btnReject = document.getElementById("btn-reject-dispatch");
if (btnReject.style.pointerEvents !== "none") {
  throw new Error("btnReject should have pointerEvents: none on waiting screen!");
}
console.log("PASS: Waiting screen hides exact dispatch count and disables action buttons.");

// Test 6: Omega Protocol negative screen toggle
game.openOmegaProtocolWindow();
if (!document.body.classList.contains("omega-negative-active")) {
  throw new Error("Opening Omega window should add omega-negative-active class to body!");
}
game.closeWindow("win-omega");
if (document.body.classList.contains("omega-negative-active")) {
  throw new Error("Closing Omega window should remove omega-negative-active class from body!");
}
console.log("PASS: Omega Protocol correctly inverts screen to negative and restores on close.");

// Test 7: Debtor arrest renders authentic Soviet folder with photo
game.playerProfile.balance = -2500;
game.debtorArrested = false;
game.triggerDebtorArrest();
const modal = document.getElementById("debtor-arrest-modal");
if (!modal.innerHTML.includes("soviet-arrest-folder") || !modal.innerHTML.includes("soviet_arrest_warrant.jpg")) {
  throw new Error("Debtor arrest must render authentic Soviet folder with warrant photo!");
}
console.log("PASS: Debtor arrest renders authentic Soviet archival document with mugshot photo.");

console.log("=== ALL MASTER TESTS PASSED SUCCESSFULLY! ===");
