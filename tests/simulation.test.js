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
    '\nglobalThis.__missionTest = { state, days, start, choose, advance, finish, showChallenge, showTrainingBriefing, showLaunchBriefing, getStats: () => missionStats };';
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
  assert.equal(api.getStats().missions, 1);
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


test('commander training comes before pre-flight and does not consume a mission day', () => {
  const { api, elements } = createMission();
  api.showTrainingBriefing();

  assert.equal(api.state.started, false);
  assert.equal(api.state.day, 0);
  assert.match(elements.get('eventPanel').innerHTML, /COMMANDER TRAINING/);
  assert.match(elements.get('eventPanel').innerHTML, /2026 LUNAR LIGHT MODEL/);

  elements.get('trainingComplete').listeners.click();
  assert.match(elements.get('eventPanel').innerHTML, /PRE-FLIGHT AUTHORIZATION/);
  assert.equal(api.state.started, false);
});


test('choice effects stay within the displayed resource range and cannot be submitted twice', () => {
  const { api } = createMission();
  api.start();
  api.choose(0);
  const afterFirstChoice = { ...api.state.resources };
  api.choose(0);
  assert.deepEqual({ ...api.state.resources }, afterFirstChoice);
  for (const value of Object.values(api.state.resources)) {
    assert.ok(value >= 0 && value <= 100);
  }
});

test('solar alert is identified as a fictional training scenario, not live telemetry', () => {
  const { api } = createMission();
  assert.match(api.days[1].science, /fictional training scenario/i);
  assert.match(api.days[1].story, /training scenario/i);
});

test('the food challenge links to a real educational space-food resource', () => {
  const { api, elements } = createMission();
  api.start();
  api.choose(0);
  api.advance();
  api.showChallenge();
  api.choose(0);
  api.advance();
  elements.get('continueDay').listeners.click();
  assert.match(elements.get('scienceNote').innerHTML, /CSA \/ FOOD PRODUCTION LEARNING TOOLKIT/);
});


test('mission science and NOVA companion render in separate panels', () => {
  const { api, elements } = createMission();
  api.start();
  assert.match(elements.get('scienceNote').innerHTML, /Oxygen systems in a closed habitat/);
  assert.match(elements.get('novaNote').innerHTML, /NOVA · MISSION COMPANION/);
  assert.match(elements.get('novaNote').innerHTML, /Check both oxygen and energy/);
});

test('Day 3 includes the CSA food-production source in the mission science panel', () => {
  const { api, elements } = createMission();
  api.start();
  api.choose(0);
  api.advance();
  api.showChallenge();
  api.choose(0);
  api.advance();
  elements.get('continueDay').listeners.click();
  assert.match(elements.get('scienceNote').innerHTML, /CSA \/ FOOD PRODUCTION LEARNING TOOLKIT/);
  assert.match(elements.get('novaNote').innerHTML, /A combined recycling-and-growing strategy/);
});
