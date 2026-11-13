const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function makeElement() {
  return {
    innerHTML: '',
    textContent: '',
    value: '',
    className: '',
    disabled: false,
    style: {},
    dataset: {},
    listeners: {},
    children: [],
    classList: {
      add() {},
      remove() {},
      toggle() {}
    },
    addEventListener(type, callback) {
      this.listeners[type] = callback;
    },
    append(child) {
      this.children.push(child);
    },
    scrollIntoView() {}
  };
}

function createMission() {
  const elements = new Map();
  const getElementById = id => {
    if (!elements.has(id)) elements.set(id, makeElement());
    return elements.get(id);
  };
  const choiceButtons = Array.from({ length: 3 }, (_, index) => {
    const button = makeElement();
    button.dataset.choice = String(index);
    return button;
  });
  const document = {
    getElementById,
    createElement: () => makeElement(),
    querySelector: () => makeElement(),
    querySelectorAll: selector => selector === '[data-choice]' ? choiceButtons : []
  };
  const storage = new Map();
  const localStorage = {
    getItem: key => storage.has(key) ? storage.get(key) : null,
    setItem: (key, value) => storage.set(key, String(value))
  };
  const context = {
    document,
    localStorage,
    navigator: { onLine: true },
    location: { protocol: 'https:', hostname: 'example.test' },
    window: { addEventListener() {} },
    console
  };
  vm.createContext(context);
  const source = fs.readFileSync('app.js', 'utf8') +
    '\nglobalThis.__missionTest = { state, days, start, choose, advance, finish, showChallenge, getStats: () => missionStats };';
  vm.runInContext(source, context);
  return { api: context.__missionTest, elements };
}

test('mission contains exactly three daily challenges', () => {
  const { api } = createMission();
  assert.equal(api.days.length, 3);
  assert.match(api.days[0].tag, /DAY 01/);
  assert.match(api.days[1].tag, /DAY 02/);
  assert.match(api.days[2].tag, /DAY 03/);
});

test('a decision changes the correct resources and advances the mission', () => {
  const { api } = createMission();
  api.start();
  api.choose(0);
  assert.equal(api.state.resources.energy, 94);
  assert.equal(api.state.resources.oxygen, 74);
  assert.equal(api.state.decisions, 1);
  api.advance();
  assert.equal(api.state.day, 1);
  assert.equal(api.state.xp, 75);
});

test('a full three-day run produces a completed report and rewards', () => {
  const { api, elements } = createMission();
  api.start();
  api.choose(0);
  api.advance();
  api.showChallenge();
  api.choose(0);
  api.advance();
  api.showChallenge();
  api.choose(0);
  api.advance();

  assert.equal(api.state.over, true);
  assert.equal(api.state.history.length, 3);
  assert.equal(api.getStats().missions, 1);
  assert.equal(api.getStats().xp, 475);
  assert.match(elements.get('eventPanel').innerHTML, /MISSION SUCCESS|EXCEPTIONAL COMMAND/);
  assert.match(elements.get('eventPanel').innerHTML, /FINAL MISSION REPORT/);
});

test('a critical reserve ends the mission without falsely claiming completion', () => {
  const { api, elements } = createMission();
  api.start();
  api.choose(0);
  api.state.resources.oxygen = 0;
  api.advance();

  assert.equal(api.state.over, true);
  assert.equal(api.state.history.length, 1);
  assert.match(elements.get('eventPanel').innerHTML, /MISSION INTERRUPTED/);
  assert.match(elements.get('eventPanel').innerHTML, /LOCKED · MISSION COMPLETE/);
  assert.equal(api.missionStats.missions, 1);
});


test('a critical final reserve prevents a safe-handover badge', () => {
  const { api, elements } = createMission();
  api.start();
  api.choose(0);
  api.advance();
  api.showChallenge();
  api.choose(0);
  api.advance();
  api.showChallenge();
  api.choose(0);
  api.state.resources.shield = 0;
  api.advance();

  assert.equal(api.state.history.length, 3);
  assert.equal(api.state.over, true);
  assert.match(elements.get('eventPanel').innerHTML, /MISSION INTERRUPTED/);
  assert.match(elements.get('eventPanel').innerHTML, /LOCKED · MISSION COMPLETE/);
  assert.equal(api.getStats().xp, 200);
});
