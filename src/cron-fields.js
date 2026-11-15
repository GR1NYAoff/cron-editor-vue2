/**
 * Pure, framework-agnostic helpers for converting between individual cron
 * field values (minutes/hours/day/week/month) and the UI state objects used
 * by `vue-cron-editor.vue`. Kept free of Vue so the parsing/formatting rules
 * can be unit tested directly and reused.
 */

export const DEFAULT_CRON_EXPRESSION = "* * * * *";

const NUMBER_ONLY = /^\d+$/;
const WEEKDAY_TOKEN = /^(\d{1,2}|SUN|MON|TUE|WED|THU|FRI|SAT)$/i;

/**
 * Splits a cron string into its 5 fields, falling back to the default
 * expression when the value is empty or incomplete.
 */
export function parseCronExpression(value, fallback = DEFAULT_CRON_EXPRESSION.split(" ")) {
  const parts = (value || "").trim().split(/\s+/).filter(Boolean);
  return parts.length === 5 ? parts : fallback;
}

export function buildCronExpression({
  minutesText,
  hoursText,
  daysText,
  monthsText,
  weeksText,
}) {
  return `${minutesText || "*"} ${hoursText || "*"} ${daysText || "*"} ${
    monthsText || "*"
  } ${weeksText || "*"}`;
}

// ---------------------------------------------------------------------------
// Minutes / Hours (self-contained fields, no shared state with other tabs)
// ---------------------------------------------------------------------------

function formatStep(state, first, last) {
  const start = Number(state.incrementStart);
  const range = start === first ? "*" : `${start}-${last}`;
  return `${range}/${state.incrementIncrement}`;
}

function parseStep(state, value, first, last) {
  const match = /^(\*|\d+)(?:-(\d+))?\/(\d+)$/.exec(value);
  if (!match) return false;

  const [, start, end, step] = match;
  const numericStart = start === "*" ? first : Number(start);
  if (
    (end && (start === "*" || Number(end) !== last)) ||
    numericStart < first || numericStart > last ||
    Number(step) < 1 || Number(step) > last
  ) return false;

  state.incrementStart = String(numericStart);
  state.incrementIncrement = step;
  return true;
}

function formatIncrementField(state, first, last) {
  switch (String(state.cronEvery)) {
    case "1":
      return "*";
    case "2":
      return formatStep(state, first, last);
    case "3":
      return state.specificSpecific.join(",");
    case "4":
      return `${state.rangeStart}-${state.rangeEnd}`;
    default:
      return "";
  }
}

function parseIncrementField(state, value, first, last) {
  if (!value) return;
  if (value === "*") {
    // A bare "*" unambiguously means "every", regardless of prior state.
    state.cronEvery = "1";
    return;
  }
  if (parseStep(state, value, first, last)) {
    state.cronEvery = "2";
    return;
  }
  const range = /^(\d+)-(\d+)$/.exec(value);
  if (range && Number(range[1]) >= first && Number(range[2]) <= last &&
      Number(range[1]) < Number(range[2])) {
    const [, start, end] = range;
    state.rangeStart = start;
    state.rangeEnd = end;
    state.cronEvery = "4";
    return;
  }
  const values = value.split(",");
  if (values.every(token => NUMBER_ONLY.test(token) && Number(token) >= first && Number(token) <= last)) {
    state.specificSpecific = values;
    state.cronEvery = "3";
  }
}

export function formatMinutesText(minute) {
  return formatIncrementField(minute, 0, 59);
}

export function parseMinutesText(minute, value) {
  parseIncrementField(minute, value, 0, 59);
}

export function formatHoursText(hour) {
  return formatIncrementField(hour, 0, 23);
}

export function parseHoursText(hour, value) {
  parseIncrementField(hour, value, 0, 23);
}

export function formatMonthsText(month) {
  return formatIncrementField(month, 1, 12);
}

export function parseMonthsText(month, value) {
  parseIncrementField(month, value, 1, 12);
}

// ---------------------------------------------------------------------------
// Day of month / Day of week (share the `day.cronEvery` selector, so the two
// parse functions must not blindly overwrite each other on "*")
// ---------------------------------------------------------------------------

export function formatDaysText(day) {
  switch (String(day.cronEvery)) {
    case "1":
    case "2":
    case "4":
    case "10":
      return "*";
    case "3":
      return formatStep(day, 1, 31);
    case "5":
      return day.specificSpecific.join(",");
    case "6":
      return "L";
    case "7":
      return "LW";
    case "8":
      return `L-${day.cronDaysBeforeEomMinus}`;
    case "9":
      return `${day.cronDaysNearestWeekday}W`;
    default:
      return "";
  }
}

export function parseDaysText(day, value) {
  if (!value || value === "*") return;

  if (parseStep(day, value, 1, 31)) {
    day.cronEvery = "3";
    return;
  }
  const values = value.split(",");
  if (values.every(token => NUMBER_ONLY.test(token) && Number(token) >= 1 && Number(token) <= 31)) {
    day.specificSpecific = values;
    day.cronEvery = "5";
    return;
  }
  if (value === "L") {
    day.cronEvery = "6";
    return;
  }
  if (value === "LW") {
    day.cronEvery = "7";
    return;
  }
  let match = /^L-([1-9]|[12]\d|3[01])$/.exec(value);
  if (match) {
    day.cronEvery = "8";
    day.cronDaysBeforeEomMinus = match[1];
    return;
  }
  match = /^([1-9]|[12]\d|3[01])W$/.exec(value);
  if (match) {
    day.cronEvery = "9";
    day.cronDaysNearestWeekday = match[1];
    return;
  }
}

export function formatWeeksText(day, week) {
  switch (String(day.cronEvery)) {
    case "1":
    case "3":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      return "*";
    case "2":
      return formatStep(week, 0, 7);
    case "4":
      return week.specificSpecific.join(",");
    case "10":
      return `${week.cronNthDayDay}#${week.cronNthDayNth}`;
    default:
      return "";
  }
}

export function parseWeeksText(day, week, value) {
  if (!value || value === "*") return;

  if (parseStep(week, value, 0, 7) && Number(week.incrementStart) < 7) {
    week.incrementStart = Number(week.incrementStart);
    day.cronEvery = "2";
    return;
  }
  const values = value.split(",");
  if (values.every(token => WEEKDAY_TOKEN.test(token))) {
    week.specificSpecific = values;
    day.cronEvery = "4";
    return;
  }
  const nthWeekday = /^([0-6])#([1-5])$/.exec(value);
  if (nthWeekday) {
    week.cronNthDayDay = Number(nthWeekday[1]);
    week.cronNthDayNth = Number(nthWeekday[2]);
    day.cronEvery = "10";
    return;
  }
}
