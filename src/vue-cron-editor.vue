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
          <el-row>
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
          <el-row>
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
          <el-row>
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
          <el-row>
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
          <el-row>
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

const DEFAULT_CRON_EXPRESSION = "* * * * *";

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
            if (daysText === "*") this.daysText = "1";
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
        cronEvery: "",
        incrementStart: "3",
        incrementIncrement: "5",
        rangeStart: "",
        rangeEnd: "",
        specificSpecific: [],
      },
      hour: {
        cronEvery: "",
        incrementStart: "3",
        incrementIncrement: "5",
        rangeStart: "",
        rangeEnd: "",
        specificSpecific: [],
      },
      day: {
        cronEvery: "",
        incrementStart: "1",
        incrementIncrement: "1",
        rangeStart: "",
        rangeEnd: "",
        specificSpecific: [],
        cronLastSpecificDomDay: 1,
        cronDaysBeforeEomMinus: "",
        cronDaysNearestWeekday: "",
      },
      week: {
        cronEvery: "",
        incrementStart: 0,
        incrementIncrement: "1",
        specificSpecific: [],
        cronNthDayDay: 0,
        cronNthDayNth: "1",
      },
      month: {
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
      return locales[this.currentLocale];
    },
    minutesText: {
      get() {
        let minutes = "";
        const { cronEvery } = this.minute;
        switch (cronEvery.toString()) {
          case "1":
            minutes = "*";
            break;
          case "2":
            minutes = `${this.minute.incrementStart}/${this.minute.incrementIncrement}`;
            break;
          case "3":
            this.minute.specificSpecific.map((val) => {
              minutes += `${val},`;
            });
            minutes = minutes.slice(0, -1);
            break;
          case "4":
            minutes = `${this.minute.rangeStart}-${this.minute.rangeEnd}`;
            break;
        }
        return minutes;
      },
      set(value) {
        if (value) {
          if (value === "*" && !this.minute.cronEvery) {
            this.minute.cronEvery = "1";
            return;
          }
          if (value.includes("/")) {
            const parts = value.split("/");
            this.minute.incrementStart = parts[0];
            this.minute.incrementIncrement = parts[1];
            this.minute.cronEvery = "2";
            return;
          }
          if (value.includes("-")) {
            const parts = value.split("-");
            this.minute.rangeStart = parts[0];
            this.minute.rangeEnd = parts[1];
            this.minute.cronEvery = "4";
            return;
          }
          if (value.includes(",")) {
            const parts = value.split(",");
            this.minute.specificSpecific = [];
            parts.forEach((el) => {
              this.minute.specificSpecific.push(el);
            });
            this.minute.cronEvery = "3";
            return;
          }
          if (value === "0" || parseInt(value, 10)) {
            this.minute.specificSpecific = [];
            this.minute.specificSpecific.push(value);
            this.minute.cronEvery = "3";
          }
        }
      },
    },
    hoursText: {
      get() {
        let hours = "";
        const { cronEvery } = this.hour;
        switch (cronEvery.toString()) {
          case "1":
            hours = "*";
            break;
          case "2":
            hours = `${this.hour.incrementStart}/${this.hour.incrementIncrement}`;
            break;
          case "3":
            this.hour.specificSpecific.map((val) => {
              hours += `${val},`;
            });
            hours = hours.slice(0, -1);
            break;
          case "4":
            hours = `${this.hour.rangeStart}-${this.hour.rangeEnd}`;
            break;
        }
        return hours;
      },
      set(value) {
        if (value) {
          if (value === "*") return;

          if (value.includes("/")) {
            const parts = value.split("/");
            this.hour.incrementStart = parts[0];
            this.hour.incrementIncrement = parts[1];
            this.hour.cronEvery = "2";
            return;
          }
          if (value.includes("-")) {
            const parts = value.split("-");
            this.hour.rangeStart = parts[0];
            this.hour.rangeEnd = parts[1];
            this.hour.cronEvery = "4";
            return;
          }
          if (value.includes(",")) {
            const parts = value.split(",");
            this.hour.specificSpecific = [];
            parts.forEach((el) => {
              this.hour.specificSpecific.push(el);
            });
            this.hour.cronEvery = "3";
            return;
          }
          if (value === "0" || parseInt(value, 10)) {
            this.hour.specificSpecific = [];
            this.hour.specificSpecific.push(value);
            this.hour.cronEvery = "3";
          }
        }
      },
    },
    daysText: {
      get() {
        let days = "";
        const { cronEvery } = this.day;
        switch (cronEvery.toString()) {
          case "1":
            days = "*";
            break;
          case "2":
          case "4":
          case "10":
            days = "*";
            break;
          case "3":
            days = `${this.day.incrementStart}/${this.day.incrementIncrement}`;
            break;
          case "5":
            this.day.specificSpecific.map((val) => {
              days += `${val},`;
            });
            days = days.slice(0, -1);
            break;
          case "6":
            days = "L";
            break;
          case "7":
            days = "LW";
            break;
          case "8":
            days = `L-${this.day.cronDaysBeforeEomMinus}`;
            break;
          case "9":
            days = `${this.day.cronDaysNearestWeekday}W`;
            break;
        }
        return days;
      },
      set(value) {
        if (value) {
          if (value === "*") return;

          if (value.includes("/")) {
            const parts = value.split("/");
            this.day.incrementStart = parts[0];
            this.day.incrementIncrement = parts[1];
            this.day.cronEvery = "3";
            return;
          }
          if (value.includes(",")) {
            const parts = value.split(",");
            this.day.specificSpecific = [];
            parts.forEach((el) => {
              this.day.specificSpecific.push(el);
            });
            this.day.cronEvery = "5";
            return;
          }
          if (value === "L") {
            this.day.cronEvery = "6";
            return;
          }
          if (value === "LW") {
            this.day.cronEvery = "7";
            return;
          }
          let match = /L-(\d+)/g.exec(value);
          if (match) {
            this.day.cronEvery = "8";
            this.day.cronDaysBeforeEomMinus = match[1];
            return;
          }
          match = /(\d+)W/g.exec(value);
          if (match) {
            this.day.cronEvery = "9";
            this.day.cronLastSpecificDomDay = match[1];
            return;
          }
          if (parseInt(value, 10)) {
            this.day.specificSpecific = [];
            this.day.specificSpecific.push(value);
            this.day.cronEvery = "5";
            return;
          }
          if (value.includes("-")) {
            const parts = value.split("-");
            this.day.rangeStart = parts[0];
            this.day.rangeEnd = parts[1];
            this.day.cronEvery = "4";
          }
        }
      },
    },
    weeksText: {
      get() {
        let weeks = "";
        const { cronEvery } = this.day;
        switch (cronEvery.toString()) {
          case "1":
          case "3":
          case "5":
            weeks = "*";
            break;
          case "2":
            weeks = `${this.week.incrementStart}/${this.week.incrementIncrement}`;
            break;
          case "4":
            this.week.specificSpecific.map((val) => {
              weeks += `${val},`;
            });
            weeks = weeks.slice(0, -1);
            break;
          case "6":
          case "7":
          case "8":
          case "9":
            weeks = "*";
            break;
          case "10":
            weeks = `${this.week.cronNthDayDay}#${this.week.cronNthDayNth}`;
            break;
        }
        return weeks;
      },
      set(value) {
        if (value) {
          if (value === "*") return;

          if (value.includes("/")) {
            const parts = value.split("/");
            this.week.incrementStart = parseInt(parts[0]);
            this.week.incrementIncrement = parts[1];
            this.day.cronEvery = "2";
            return;
          }
          if (value.includes(",")) {
            const parts = value.split(",");
            this.week.specificSpecific = [];
            parts.forEach((el) => {
              this.week.specificSpecific.push(el);
            });
            this.day.cronEvery = "4";
            return;
          }
          if (value.includes("#")) {
            const parts = value.split("#");
            this.week.cronNthDayDay = parseInt(parts[0]);
            this.week.cronNthDayNth = parseInt(parts[1]);
            this.day.cronEvery = "10";
            return;
          }
          if (parseInt(value, 10)) {
            this.week.specificSpecific = [];
            this.week.specificSpecific.push(value);
            this.day.cronEvery = "4";
          }
        }
      },
    },
    monthsText: {
      get() {
        let months = "";
        const { cronEvery } = this.month;
        switch (cronEvery.toString()) {
          case "1":
            months = "*";
            break;
          case "2":
            months = `${this.month.incrementStart}/${this.month.incrementIncrement}`;
            break;
          case "3":
            this.month.specificSpecific.map((val) => {
              months += `${val},`;
            });
            months = months.slice(0, -1);
            break;
          case "4":
            months = `${this.month.rangeStart}-${this.month.rangeEnd}`;
            break;
        }
        return months;
      },
      set(value) {
        if (value) {
          if (value === "*") return;

          if (value.includes("/")) {
            const parts = value.split("/");
            this.month.incrementStart = parts[0];
            this.month.incrementIncrement = parts[1];
            this.month.cronEvery = "2";
            return;
          }
          if (value.includes("-")) {
            const parts = value.split("-");
            this.month.rangeStart = parts[0];
            this.month.rangeEnd = parts[1];
            this.month.cronEvery = "4";
            return;
          }
          if (value.includes(",")) {
            const parts = value.split(",");
            this.month.specificSpecific = [];
            parts.forEach((el) => {
              this.month.specificSpecific.push(el);
            });
            this.month.cronEvery = "3";
            return;
          }
          if (parseInt(value, 10)) {
            this.month.specificSpecific = [];
            this.month.specificSpecific.push(value);
            this.month.cronEvery = "3";
          }
        }
      },
    },
    cron() {
      return `${this.minutesText || "*"} ${this.hoursText || "*"} ${
        this.daysText || "*"
      } ${this.monthsText || "*"} ${this.weeksText || "*"}`;
    },
  },
  watch: {
    cron: {
      handler() {
        this.updateInputValue(this.cron);
      },
    },
    value: {
      handler() {
        if (this.value === this.cron || this.value.split(" ").length < 5)
          return;
        this.parseCron();
      },
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
    this.parseCron();
    this.updateInputValue(this.cron);
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
      const cronValue = !this.value
        ? DEFAULT_CRON_EXPRESSION.split(" ")
        : this.value.split(" ");

      this.setCronValue(cronValue);
      this.setEvery();
    },
    setCronValue(cronValue) {
      const [minutesText, hoursText, daysText, monthsText, weeksText] =
        cronValue;

      this.minutesText = minutesText;
      this.hoursText = hoursText;
      this.daysText = daysText;
      this.monthsText = monthsText;
      this.weeksText = weeksText;
    },
    setDefaultCronValue() {
      this.setCronValue(DEFAULT_CRON_EXPRESSION);
      this.applyAdditionalActions([this.additionalActions.SelectEveryMinute]);
    },
    setEvery() {
      if (this.minute.cronEvery === "" || this.minute.cronEvery === "1") {
        this.minute.cronEvery = "1";
      } else if (this.hour.cronEvery === "" || this.hour.cronEvery === "1") {
        this.hour.cronEvery = "1";
      } else if (this.day.cronEvery === "" || this.day.cronEvery === "1") {
        this.day.cronEvery = "1";
      } else if (this.month.cronEvery === "" || this.month.cronEvery === "1") {
        this.month.cronEvery = "1";
      }
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
