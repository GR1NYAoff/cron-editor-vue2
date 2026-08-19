import {
  DEFAULT_CRON_EXPRESSION,
  parseCronExpression,
  buildCronExpression,
  formatMinutesText,
  parseMinutesText,
  formatHoursText,
  parseHoursText,
  formatMonthsText,
  parseMonthsText,
  formatDaysText,
  parseDaysText,
  formatWeeksText,
  parseWeeksText,
} from "@/cron-fields";

function newIncrementState(overrides = {}) {
  return {
    cronEvery: "",
    incrementStart: "3",
    incrementIncrement: "5",
    rangeStart: "",
    rangeEnd: "",
    specificSpecific: [],
    ...overrides,
  };
}

function newDayState(overrides = {}) {
  return {
    cronEvery: "",
    incrementStart: "1",
    incrementIncrement: "1",
    rangeStart: "",
    rangeEnd: "",
    specificSpecific: [],
    cronDaysBeforeEomMinus: "",
    cronDaysNearestWeekday: "",
    ...overrides,
  };
}

function newWeekState(overrides = {}) {
  return {
    cronEvery: "",
    incrementStart: 0,
    incrementIncrement: "1",
    specificSpecific: [],
    cronNthDayDay: 0,
    cronNthDayNth: "1",
    ...overrides,
  };
}

describe("parseCronExpression", () => {
  it("splits a well-formed cron string into 5 fields", () => {
    expect(parseCronExpression("1 2 3 4 5")).toEqual(["1", "2", "3", "4", "5"]);
  });

  it("falls back to the default expression when empty", () => {
    expect(parseCronExpression("")).toEqual(DEFAULT_CRON_EXPRESSION.split(" "));
  });

  it("falls back to the default expression when incomplete", () => {
    expect(parseCronExpression("* * *")).toEqual(
      DEFAULT_CRON_EXPRESSION.split(" ")
    );
  });

  it("collapses extra whitespace between fields", () => {
    expect(parseCronExpression("1   2 3  4 5")).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
    ]);
  });
});

describe("buildCronExpression", () => {
  it("falls back to '*' for any empty field", () => {
    expect(
      buildCronExpression({
        minutesText: "",
        hoursText: "",
        daysText: "",
        monthsText: "",
        weeksText: "",
      })
    ).toBe("* * * * *");
  });
});

describe("minutes field", () => {
  it("formats/parses 'every minute' (*)", () => {
    const minute = newIncrementState();
    parseMinutesText(minute, "*");
    expect(minute.cronEvery).toBe("1");
    expect(formatMinutesText(minute)).toBe("*");
  });

  it("formats/parses increment values (start/step)", () => {
    const minute = newIncrementState();
    parseMinutesText(minute, "3/5");
    expect(minute.cronEvery).toBe("2");
    expect(minute.incrementStart).toBe("3");
    expect(minute.incrementIncrement).toBe("5");
    expect(formatMinutesText(minute)).toBe("3/5");
  });

  it("treats a leading '*' increment start as 0 (corner case: */5)", () => {
    const minute = newIncrementState();
    parseMinutesText(minute, "*/5");
    expect(minute.cronEvery).toBe("2");
    expect(minute.incrementStart).toBe("0");
    expect(minute.incrementIncrement).toBe("5");
  });

  it("parses a range", () => {
    const minute = newIncrementState();
    parseMinutesText(minute, "10-20");
    expect(minute.cronEvery).toBe("4");
    expect(formatMinutesText(minute)).toBe("10-20");
  });

  it("parses a comma separated list", () => {
    const minute = newIncrementState();
    parseMinutesText(minute, "5,10,15");
    expect(minute.cronEvery).toBe("3");
    expect(formatMinutesText(minute)).toBe("5,10,15");
  });

  it("parses a single specific value of 0 (corner case)", () => {
    const minute = newIncrementState();
    parseMinutesText(minute, "0");
    expect(minute.cronEvery).toBe("3");
    expect(minute.specificSpecific).toEqual(["0"]);
    expect(formatMinutesText(minute)).toBe("0");
  });

  it("ignores malformed values instead of misparsing them", () => {
    const minute = newIncrementState();
    parseMinutesText(minute, "5abc");
    expect(minute.cronEvery).toBe("");
  });
});

describe("hours field", () => {
  it("selects 'every hour' when field is '*' (tab reflects the value)", () => {
    const hour = newIncrementState();
    parseHoursText(hour, "*");
    expect(hour.cronEvery).toBe("1");
  });

  it("treats a leading '*' increment start as 0", () => {
    const hour = newIncrementState();
    parseHoursText(hour, "*/2");
    expect(hour.incrementStart).toBe("0");
    expect(hour.cronEvery).toBe("2");
  });

  it("parses a single specific value of 0", () => {
    const hour = newIncrementState();
    parseHoursText(hour, "0");
    expect(hour.cronEvery).toBe("3");
    expect(hour.specificSpecific).toEqual(["0"]);
  });
});

describe("months field", () => {
  it("selects 'every month' when field is '*'", () => {
    const month = newIncrementState();
    parseMonthsText(month, "*");
    expect(month.cronEvery).toBe("1");
  });

  it("treats a leading '*' increment start as 1 (months are 1-12)", () => {
    const month = newIncrementState();
    parseMonthsText(month, "*/3");
    expect(month.incrementStart).toBe("1");
    expect(month.cronEvery).toBe("2");
  });

  it("round trips a range", () => {
    const month = newIncrementState();
    parseMonthsText(month, "3-9");
    expect(formatMonthsText(month)).toBe("3-9");
  });
});

describe("day of month field", () => {
  it("does not force cronEvery on '*' (shared state with day-of-week)", () => {
    const day = newDayState();
    parseDaysText(day, "*");
    expect(day.cronEvery).toBe("");
  });

  it("treats a leading '*' increment start as 1", () => {
    const day = newDayState();
    parseDaysText(day, "*/5");
    expect(day.incrementStart).toBe("1");
    expect(day.cronEvery).toBe("3");
  });

  it("parses last day of month (L)", () => {
    const day = newDayState();
    parseDaysText(day, "L");
    expect(day.cronEvery).toBe("6");
    expect(formatDaysText(day)).toBe("L");
  });

  it("parses last weekday of month (LW)", () => {
    const day = newDayState();
    parseDaysText(day, "LW");
    expect(day.cronEvery).toBe("7");
    expect(formatDaysText(day)).toBe("LW");
  });

  it("parses N days before end of month (L-N)", () => {
    const day = newDayState();
    parseDaysText(day, "L-5");
    expect(day.cronEvery).toBe("8");
    expect(day.cronDaysBeforeEomMinus).toBe("5");
    expect(formatDaysText(day)).toBe("L-5");
  });

  it("parses nearest weekday (NW) into cronDaysNearestWeekday (regression test)", () => {
    const day = newDayState();
    parseDaysText(day, "15W");
    expect(day.cronEvery).toBe("9");
    expect(day.cronDaysNearestWeekday).toBe("15");
    expect(formatDaysText(day)).toBe("15W");
  });

  it("parses a specific day list", () => {
    const day = newDayState();
    parseDaysText(day, "1,15,31");
    expect(day.cronEvery).toBe("5");
    expect(formatDaysText(day)).toBe("1,15,31");
  });

  it("does not misinterpret a day-of-month range as a specific day", () => {
    const day = newDayState();
    parseDaysText(day, "10-20");
    // Unsupported by the UI: must not be silently coerced into "specific day".
    expect(day.cronEvery).toBe("");
  });
});

describe("day of week field", () => {
  it("does not force cronEvery on '*'", () => {
    const day = newDayState();
    const week = newWeekState();
    parseWeeksText(day, week, "*");
    expect(day.cronEvery).toBe("");
  });

  it("parses Sunday as 0 (corner case: falsy numeric value)", () => {
    const day = newDayState();
    const week = newWeekState();
    parseWeeksText(day, week, "0");
    expect(day.cronEvery).toBe("4");
    expect(week.specificSpecific).toEqual(["0"]);
  });

  it("parses a single weekday name", () => {
    const day = newDayState();
    const week = newWeekState();
    parseWeeksText(day, week, "MON");
    expect(day.cronEvery).toBe("4");
    expect(week.specificSpecific).toEqual(["MON"]);
  });

  it("parses a comma separated weekday list", () => {
    const day = newDayState();
    const week = newWeekState();
    parseWeeksText(day, week, "MON,TUE");
    expect(day.cronEvery).toBe("4");
    expect(formatWeeksText(day, week)).toBe("MON,TUE");
  });

  it("parses an nth-weekday-of-month expression (day#nth)", () => {
    const day = newDayState();
    const week = newWeekState();
    parseWeeksText(day, week, "5#3");
    expect(day.cronEvery).toBe("10");
    expect(week.cronNthDayDay).toBe(5);
    expect(week.cronNthDayNth).toBe(3);
    expect(formatWeeksText(day, week)).toBe("5#3");
  });

  it("treats a leading '*' increment start as 0", () => {
    const day = newDayState();
    const week = newWeekState();
    parseWeeksText(day, week, "*/2");
    expect(week.incrementStart).toBe(0);
    expect(day.cronEvery).toBe("2");
  });

  it("ignores unsupported weekday ranges instead of corrupting state", () => {
    const day = newDayState();
    const week = newWeekState();
    parseWeeksText(day, week, "MON-FRI");
    expect(day.cronEvery).toBe("");
  });
});

describe("round trips of full cron expressions", () => {
  const cases = [
    "* * * * *",
    "0/5 * * * *",
    "0 0 * * *",
    "30 8-17 * * *",
    "0 0 1 * *",
    "0 0 L * *",
    "0 0 LW * *",
    "0 0 L-3 * *",
    "0 0 15W * *",
    "0 0 * * MON-FRI".replace("MON-FRI", "1,2,3,4,5"),
    "0 0 * * 0",
    "0 0 * * 5#3",
  ];

  it.each(cases)("round trips %s", (cronExpression) => {
    const [minutesIn, hoursIn, daysIn, monthsIn, weeksIn] =
      parseCronExpression(cronExpression);

    const minute = newIncrementState();
    const hour = newIncrementState();
    const day = newDayState();
    const week = newWeekState();
    const month = newIncrementState();

    parseMinutesText(minute, minutesIn);
    parseHoursText(hour, hoursIn);
    parseDaysText(day, daysIn);
    parseMonthsText(month, monthsIn);
    parseWeeksText(day, week, weeksIn);

    const rebuilt = buildCronExpression({
      minutesText: formatMinutesText(minute),
      hoursText: formatHoursText(hour),
      daysText: formatDaysText(day),
      monthsText: formatMonthsText(month),
      weeksText: formatWeeksText(day, week),
    });

    expect(rebuilt).toBe(cronExpression);
  });
});
