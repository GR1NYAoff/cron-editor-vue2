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
export function parseCronExpression(value) {
  const parts = (value || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length < 5) {
    return DEFAULT_CRON_EXPRESSION.split(" ");
  }
  return parts.slice(0, 5);
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

function formatIncrementField(state) {
  switch (String(state.cronEvery)) {
    case "1":
      return "*";
    case "2":
      return `${state.incrementStart}/${state.incrementIncrement}`;
    case "3":
      return state.specificSpecific.join(",");
    case "4":
      return `${state.rangeStart}-${state.rangeEnd}`;
    default:
      return "";
  }
}

function parseIncrementField(state, value, wildcardStart) {
  if (!value) return;
  if (value === "*") {
    // A bare "*" unambiguously means "every", regardless of prior state.
    state.cronEvery = "1";
    return;
  }
  if (value.includes("/")) {
    const [start, increment] = value.split("/");
    state.incrementStart = start === "*" ? wildcardStart : start;
    state.incrementIncrement = increment;
    state.cronEvery = "2";
    return;
  }
  if (value.includes("-")) {
    const [start, end] = value.split("-");
    state.rangeStart = start;
    state.rangeEnd = end;
    state.cronEvery = "4";
    return;
  }
  if (value.includes(",")) {
    state.specificSpecific = value.split(",");
    state.cronEvery = "3";
    return;
  }
  if (NUMBER_ONLY.test(value)) {
    state.specificSpecific = [value];
    state.cronEvery = "3";
  }
}

export function formatMinutesText(minute) {
  return formatIncrementField(minute);
}

export function parseMinutesText(minute, value) {
  parseIncrementField(minute, value, "0");
}

export function formatHoursText(hour) {
  return formatIncrementField(hour);
}

export function parseHoursText(hour, value) {
  parseIncrementField(hour, value, "0");
}

export function formatMonthsText(month) {
  return formatIncrementField(month);
}

export function parseMonthsText(month, value) {
  parseIncrementField(month, value, "1");
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
      return `${day.incrementStart}/${day.incrementIncrement}`;
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

  if (value.includes("/")) {
    const [start, increment] = value.split("/");
    day.incrementStart = start === "*" ? "1" : start;
    day.incrementIncrement = increment;
    day.cronEvery = "3";
    return;
  }
  if (value.includes(",")) {
    day.specificSpecific = value.split(",");
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
  let match = /^L-(\d+)$/.exec(value);
  if (match) {
    day.cronEvery = "8";
    day.cronDaysBeforeEomMinus = match[1];
    return;
  }
  match = /^(\d+)W$/.exec(value);
  if (match) {
    day.cronEvery = "9";
    day.cronDaysNearestWeekday = match[1];
    return;
  }
  if (NUMBER_ONLY.test(value)) {
    day.specificSpecific = [value];
    day.cronEvery = "5";
  }
  // Plain day-of-month ranges (e.g. "10-20") have no corresponding radio in
  // the UI (option "4" is the day-of-week interval), so they are left
  // unhandled rather than silently mapped to the wrong state.
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
      return `${week.incrementStart}/${week.incrementIncrement}`;
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

  if (value.includes("/")) {
    const [start, increment] = value.split("/");
    week.incrementStart = start === "*" ? 0 : parseInt(start, 10);
    week.incrementIncrement = increment;
    day.cronEvery = "2";
    return;
  }
  if (value.includes(",")) {
    week.specificSpecific = value.split(",");
    day.cronEvery = "4";
    return;
  }
  if (value.includes("#")) {
    const [weekday, nth] = value.split("#");
    week.cronNthDayDay = parseInt(weekday, 10);
    week.cronNthDayNth = parseInt(nth, 10);
    day.cronEvery = "10";
    return;
  }
  if (WEEKDAY_TOKEN.test(value)) {
    week.specificSpecific = [value];
    day.cronEvery = "4";
  }
  // Day-of-week ranges (e.g. "MON-FRI") have no corresponding radio in the
  // UI either, so they are intentionally left unhandled.
}
