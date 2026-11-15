<template>
  <div>
    <el-button
      class="language"
      type="text"
      @click="currentLocale = currentLocale === 'en' ? 'cn' : 'en'"
      v-if="localesButton"
    >
      {{ currentLocale }}
    </el-button>
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-date" />
          {{ locale.Minutes.name }}
        </span>
        <div class="tabBody">
          <code v-if="minute.cronEvery === 'custom'">{{ minute.raw }}</code>
          <el-row>
            <el-radio
              @change="
                () =>
                  applyAdditionalActions([
                    additionalActions.UnselectEveryHour,
                    additionalActions.UnselectEveryDay,
                    additionalActions.UnselectEveryMonth,
                  ])
              "
              v-model="minute.cronEvery"
              label="1"
            >
              {{ locale.Minutes.every }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="minute.cronEvery" label="2">
              {{ locale.Minutes.interval[0] }}
              <el-input-number
                v-model="minute.incrementIncrement"
                size="small"
                :min="1"
                :max="59"
              />
              {{ locale.Minutes.interval[1] }}
              <el-input-number
                v-model="minute.incrementStart"
                size="small"
                :min="0"
                :max="59"
              />
              {{ locale.Minutes.interval[2] || "" }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="minute.cronEvery" class="long" label="3">
              {{ locale.Minutes.specific }}
              <el-select
                v-model="minute.specificSpecific"
                size="small"
                multiple
              >
                <el-option
                  v-for="val in 60"
                  :key="val"
                  :value="
                    Array.from({ length: 60 }, (_, i) => String(i))[val - 1]
                  "
                >
                  {{ val - 1 }}
                </el-option>
              </el-select>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="minute.cronEvery" label="4">
              {{ locale.Minutes.cycle[0] }}
              <el-input-number
                v-model="minute.rangeStart"
                size="small"
                :min="0"
                :max="Number(minute.rangeEnd) - 1"
              />
              {{ locale.Minutes.cycle[1] }}
              <el-input-number
                v-model="minute.rangeEnd"
                size="small"
                :min="Number(minute.rangeStart) + 1"
                :max="59"
              />
              {{ locale.Minutes.cycle[2] }}
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-date" />
          {{ locale.Hours.name }}
        </span>
        <div class="tabBody">
          <code v-if="hour.cronEvery === 'custom'">{{ hour.raw }}</code>
          <el-row>
            <el-radio
              @change="
                () =>
                  applyAdditionalActions([
                    additionalActions.AssignZeroMinutes,
                    additionalActions.UnselectEveryDay,
                    additionalActions.UnselectEveryMonth,
                  ])
              "
              v-model="hour.cronEvery"
              label="1"
            >
              {{ locale.Hours.every }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="hour.cronEvery" label="2">
              {{ locale.Hours.interval[0] }}
              <el-input-number
                v-model="hour.incrementIncrement"
                size="small"
                :min="1"
                :max="23"
              />
              {{ locale.Hours.interval[1] }}
              <el-input-number
                v-model="hour.incrementStart"
                size="small"
                :min="0"
                :max="23"
              />
              {{ locale.Hours.interval[2] }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="hour.cronEvery" class="long" label="3">
              {{ locale.Hours.specific }}
              <el-select v-model="hour.specificSpecific" size="small" multiple>
                <el-option
                  v-for="val in 24"
                  :key="val"
                  :value="
                    Array.from({ length: 24 }, (_, i) => String(i))[val - 1]
                  "
                >
                  {{ val - 1 }}
                </el-option>
              </el-select>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="hour.cronEvery" label="4">
              {{ locale.Hours.cycle[0] }}
              <el-input-number
                v-model="hour.rangeStart"
                size="small"
                :min="0"
                :max="Number(hour.rangeEnd) - 1"
              />
              {{ locale.Hours.cycle[1] }}
              <el-input-number
                v-model="hour.rangeEnd"
                size="small"
                :min="Number(hour.rangeStart) + 1"
                :max="23"
              />
              {{ locale.Hours.cycle[2] }}
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-date" />
          {{ locale.Day.name }}
        </span>
        <div class="tabBody">
          <code v-if="day.cronEvery === 'custom'">{{ day.raw }} {{ week.raw }}</code>
          <el-row>
            <el-radio
              @change="
                () =>
                  applyAdditionalActions([
                    additionalActions.AssignZeroMinutes,
                    additionalActions.AssignZeroHours,
                    additionalActions.UnselectEveryMonth,
                  ])
              "
              v-model="day.cronEvery"
              label="1"
            >
              {{ locale.Day.every }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="2">
              {{ locale.Day.intervalWeek[0] }}
              <el-input-number
                v-model="week.incrementIncrement"
                size="small"
                :min="1"
                :max="7"
              />
              {{ locale.Day.intervalWeek[1] }}
              <el-select v-model="week.incrementStart" size="small">
                <el-option
                  v-for="val in 7"
                  :key="val"
                  :label="locale.Week[val - 1]"
                  :value="val - 1"
                />
              </el-select>
              {{ locale.Day.intervalWeek[2] }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="3">
              {{ locale.Day.intervalDay[0] }}
              <el-input-number
                v-model="day.incrementIncrement"
                size="small"
                :min="1"
                :max="31"
              />
              {{ locale.Day.intervalDay[1] }}
              <el-input-number
                v-model="day.incrementStart"
                size="small"
                :min="1"
                :max="31"
              />
              {{ locale.Day.intervalDay[2] }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" class="long" label="4">
              {{ locale.Day.specificWeek }}
              <el-select v-model="week.specificSpecific" size="small" multiple>
                <el-option
                  v-for="val in 7"
                  :key="val"
                  :label="locale.Week[val - 1]"
                  :value="
                    ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][val - 1]
                  "
                />
              </el-select>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" class="long" label="5">
              {{ locale.Day.specificDay }}
              <el-select v-model="day.specificSpecific" size="small" multiple>
                <el-option
                  v-for="val in 31"
                  :key="val"
                  :value="
                    Array.from({ length: 31 }, (_, i) => String(i + 1))[val - 1]
                  "
                >
                  {{ val }}
                </el-option>
              </el-select>
            </el-radio>
          </el-row>
          <el-row v-if="extendedSyntax">
            <el-radio
              @change="
                () =>
                  applyAdditionalActions([
                    additionalActions.AssignZeroMinutes,
                    additionalActions.AssignZeroHours,
                  ])
              "
              v-model="day.cronEvery"
              label="6"
            >
              {{ locale.Day.lastDay }}
            </el-radio>
          </el-row>
          <el-row v-if="extendedSyntax">
            <el-radio
              @change="
                () =>
                  applyAdditionalActions([
                    additionalActions.AssignZeroMinutes,
                    additionalActions.AssignZeroHours,
                  ])
              "
              v-model="day.cronEvery"
              label="7"
            >
              {{ locale.Day.lastWeekday }}
            </el-radio>
          </el-row>
          <el-row v-if="extendedSyntax">
            <el-radio
              @change="
                () =>
                  applyAdditionalActions([
                    additionalActions.AssignZeroMinutes,
                    additionalActions.AssignZeroHours,
                  ])
              "
              v-model="day.cronEvery"
              label="8"
            >
              <el-input-number
                v-model="day.cronDaysBeforeEomMinus"
                size="small"
                :min="1"
                :max="31"
              />
              {{ locale.Day.beforeEndMonth[0] }}
            </el-radio>
          </el-row>
          <el-row v-if="extendedSyntax">
            <el-radio
              @change="
                () =>
                  applyAdditionalActions([
                    additionalActions.AssignZeroMinutes,
                    additionalActions.AssignZeroHours,
                  ])
              "
              v-model="day.cronEvery"
              label="9"
            >
              {{ locale.Day.nearestWeekday[0] }}
              <el-input-number
                v-model="day.cronDaysNearestWeekday"
                size="small"
                :min="1"
                :max="31"
              />
              {{ locale.Day.nearestWeekday[1] }}
            </el-radio>
          </el-row>
          <el-row v-if="extendedSyntax">
            <el-radio
              @change="
                () =>
                  applyAdditionalActions([
                    additionalActions.AssignZeroMinutes,
                    additionalActions.AssignZeroHours,
                  ])
              "
              v-model="day.cronEvery"
              label="10"
            >
              {{ locale.Day.someWeekday[0] }}
              <el-input-number
                v-model="week.cronNthDayNth"
                size="small"
                :min="1"
                :max="5"
              />
              <el-select v-model="week.cronNthDayDay" size="small">
                <el-option
                  v-for="val in 7"
                  :key="val"
                  :label="locale.Week[val - 1]"
                  :value="val - 1"
                />
              </el-select>
              {{ locale.Day.someWeekday[1] }}
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-date" />
          {{ locale.Month.name }}
        </span>
        <div class="tabBody">
          <code v-if="month.cronEvery === 'custom'">{{ month.raw }}</code>
          <el-row>
            <el-radio
              @change="
                () =>
                  applyAdditionalActions([
                    additionalActions.AssignZeroMinutes,
                    additionalActions.AssignZeroHours,
                    additionalActions.AssignFirstDayOfMonth,
                  ])
              "
              v-model="month.cronEvery"
              label="1"
            >
              {{ locale.Month.every }}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="month.cronEvery" label="2">
              {{ locale.Month.interval[0] }}
              <el-input-number
                v-model="month.incrementIncrement"
                size="small"
                :min="1"
                :max="12"
              />
              {{ locale.Month.interval[1] }}
              <el-input-number
                v-model="month.incrementStart"
                size="small"
                :min="1"
                :max="12"
              />
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="month.cronEvery" class="long" label="3">
              {{ locale.Month.specific }}
              <el-select v-model="month.specificSpecific" size="small" multiple>
                <el-option
                  v-for="val in 12"
                  :key="val"
                  :label="val"
                  :value="
                    Array.from({ length: 12 }, (_, i) => String(i + 1))[val - 1]
                  "
                />
              </el-select>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="month.cronEvery" label="4">
              {{ locale.Month.cycle[0] }}
              <el-input-number
                v-model="month.rangeStart"
                size="small"
                :min="1"
                :max="Number(month.rangeEnd) - 1"
              />
              {{ locale.Month.cycle[1] }}
              <el-input-number
                v-model="month.rangeEnd"
                size="small"
                :min="Number(month.rangeStart) + 1"
                :max="12"
              />
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import locales from "../locales";
import {
  DEFAULT_CRON_EXPRESSION,
  parseCronExpression,
  buildCronExpression,
  formatMinutesText,
  parseMinutesText,
  formatHoursText,
  parseHoursText,
  formatDaysText,
  parseDaysText,
  formatWeeksText,
  parseWeeksText,
  formatMonthsText,
  parseMonthsText,
} from "./cron-fields";

const ADDITIONAL_ACTIONS = {
  AssignZeroMinutes: "AssignZeroMinutes",
  AssignZeroHours: "AssignZeroHours",
  AssignFirstDayOfMonth: "AssignFirstDayOfMonth",
  SelectEveryMinute: "SelectEveryMinute",
  UnselectEveryHour: "UnselectEveryHour",
  UnselectEveryDay: "UnselectEveryDay",
  UnselectEveryMonth: "UnselectEveryMonth",
};

export default {
  name: "VueCronEditor",
  props: {
    value: {
      type: String,
      default: "",
      require: true,
    },
    i18n: {
      type: String,
      default: "en",
      require: false,
    },
    extendedSyntax: {
      type: Boolean,
      default: false,
    },
    localesButton: {
      type: Boolean,
      default: false,
      require: false,
    },
    visible: {
      type: Boolean,
      default: false,
      require: false,
    },
  },
  data() {
    return {
      currentLocale: this.i18n,
      additionalActions: ADDITIONAL_ACTIONS,
      actionsMap: new Map([
        [
          ADDITIONAL_ACTIONS.AssignZeroMinutes,
          () => {
            const minutesText = this.cron.split(" ")[0];
            if (minutesText === "*") this.minutesText = "0";
          },
        ],
        [
          ADDITIONAL_ACTIONS.AssignZeroHours,
          () => {
            const hoursText = this.cron.split(" ")[1];
            if (hoursText === "*") this.hoursText = "0";
          },
        ],
        [
          ADDITIONAL_ACTIONS.AssignFirstDayOfMonth,
          () => {
            const daysText = this.cron.split(" ")[2];
            if (daysText === "*" && this.weeksText === "*") this.daysText = "1";
          },
        ],
        [
          ADDITIONAL_ACTIONS.SelectEveryMinute,
          () => {
            if (this.minute.cronEvery !== "1") this.minute.cronEvery = "1";
            this.hour.cronEvery = "";
            this.day.cronEvery = "";
            this.month.cronEvery = "";
            this.week.cronEvery = "";
          },
        ],
        [
          ADDITIONAL_ACTIONS.UnselectEveryHour,
          () => {
            if (this.hour.cronEvery === "1") this.hour.cronEvery = "";
          },
        ],
        [
          ADDITIONAL_ACTIONS.UnselectEveryDay,
          () => {
            if (this.day.cronEvery === "1") this.day.cronEvery = "";
          },
        ],
        [
          ADDITIONAL_ACTIONS.UnselectEveryMonth,
          () => {
            if (this.month.cronEvery === "1") this.month.cronEvery = "";
          },
        ],
      ]),
      minute: {
        raw: "*",
        cronEvery: "",
        incrementStart: "3",
        incrementIncrement: "5",
        rangeStart: "",
        rangeEnd: "",
        specificSpecific: [],
      },
      hour: {
        raw: "*",
        cronEvery: "",
        incrementStart: "3",
        incrementIncrement: "5",
        rangeStart: "",
        rangeEnd: "",
        specificSpecific: [],
      },
      day: {
        raw: "*",
        cronEvery: "",
        incrementStart: "1",
        incrementIncrement: "1",
        rangeStart: "",
        rangeEnd: "",
        specificSpecific: [],
        cronDaysBeforeEomMinus: "",
        cronDaysNearestWeekday: "",
      },
      week: {
        raw: "*",
        cronEvery: "",
        incrementStart: 0,
        incrementIncrement: "1",
        specificSpecific: [],
        cronNthDayDay: 0,
        cronNthDayNth: "1",
      },
      month: {
        raw: "*",
        cronEvery: "",
        incrementStart: "3",
        incrementIncrement: "5",
        rangeStart: "",
        rangeEnd: "",
        specificSpecific: [],
      },
    };
  },
  computed: {
    locale() {
      return this.currentLocale === "cn" ? locales.cn : locales.en;
    },
    minutesText: {
      get() {
        if (this.minute.cronEvery === "custom") return this.minute.raw;
        return formatMinutesText(this.minute);
      },
      set(value) {
        parseMinutesText(this.minute, value);
      },
    },
    hoursText: {
      get() {
        if (this.hour.cronEvery === "custom") return this.hour.raw;
        return formatHoursText(this.hour);
      },
      set(value) {
        parseHoursText(this.hour, value);
      },
    },
    daysText: {
      get() {
        if (this.day.cronEvery === "custom") return this.day.raw;
        return formatDaysText(this.day);
      },
      set(value) {
        parseDaysText(this.day, value);
      },
    },
    weeksText: {
      get() {
        if (this.day.cronEvery === "custom") return this.week.raw;
        return formatWeeksText(this.day, this.week);
      },
      set(value) {
        parseWeeksText(this.day, this.week, value);
      },
    },
    monthsText: {
      get() {
        if (this.month.cronEvery === "custom") return this.month.raw;
        return formatMonthsText(this.month);
      },
      set(value) {
        parseMonthsText(this.month, value);
      },
    },
    cron() {
      return buildCronExpression({
        minutesText: this.minutesText,
        hoursText: this.hoursText,
        daysText: this.daysText,
        monthsText: this.monthsText,
        weeksText: this.weeksText,
      });
    },
  },
  watch: {
    i18n(value) {
      this.currentLocale = value;
    },
    extendedSyntax() {
      this.setCronValue(this.cron.split(" "));
    },
    value: {
      immediate: true,
      handler() {
        this.parseCron();
      },
    },
    cron(value) {
      const incoming = parseCronExpression(this.value, null);
      if (!incoming || value !== incoming.join(" ")) this.updateInputValue(value);
    },
    visible: {
      handler(val) {
        if (!val) {
          this.setDefaultCronValue();
        } else {
          this.parseCron();
        }
      },
    },
  },
  mounted() {
    if (!this.value) this.updateInputValue(this.cron);
  },
  methods: {
    updateInputValue(value) {
      this.$emit("input", value);
    },
    applyAdditionalActions(actions) {
      for (const action of actions) {
        const actionCallback = this.actionsMap.get(action);
        if (actionCallback) actionCallback();
      }

      return this.cron;
    },
    parseCron() {
      const fields = parseCronExpression(this.value, null);
      if (fields) {
        if (fields.join(" ") !== this.cron || !this.minute.cronEvery) {
          this.setCronValue(fields);
        }
      } else if (!this.minute.cronEvery) {
        this.minute.cronEvery = "1";
      }
    },
    setCronValue([minutes, hours, days, months, weeks]) {
      this.setField(this.minute, minutes, parseMinutesText, formatMinutesText);
      this.setField(this.hour, hours, parseHoursText, formatHoursText);
      this.setField(this.month, months, parseMonthsText, formatMonthsText);

      this.day.cronEvery = "1";
      parseDaysText(this.day, days);
      parseWeeksText(this.day, this.week, weeks);
      const extended = Number(this.day.cronEvery) >= 6;
      if (
        (extended && !this.extendedSyntax) ||
        formatDaysText(this.day) !== days ||
        formatWeeksText(this.day, this.week) !== weeks
      ) {
        this.day.raw = days;
        this.week.raw = weeks;
        this.day.cronEvery = "custom";
      }
    },
    setField(state, value, parse, format) {
      state.cronEvery = "";
      parse(state, value);
      if (format(state) !== value) {
        state.raw = value;
        state.cronEvery = "custom";
      }
    },
    setDefaultCronValue() {
      this.setCronValue(DEFAULT_CRON_EXPRESSION.split(" "));
      this.applyAdditionalActions([this.additionalActions.SelectEveryMinute]);
    },
  },
};
</script>

<style scoped>
.language {
  position: absolute;
  right: 25px;
  z-index: 1;
}

.el-tabs {
  box-shadow: none;
}

.tabBody .el-row {
  margin: 10px 0;
}

.tabBody .el-row.long .el-select {
  width: 350px;
}

.tabBody .el-row .el-input-number {
  width: 110px;
}

.bottom {
  width: 100%;
  text-align: center;
  margin-top: 5px;
  position: relative;
}

.bottom .value {
  font-size: 18px;
  display: block;
  padding: 10px;
}
</style>
