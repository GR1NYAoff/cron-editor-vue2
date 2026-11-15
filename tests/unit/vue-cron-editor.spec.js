import { shallowMount } from "@vue/test-utils";
import VueCronEditor from "@/vue-cron-editor.vue";

function mountEditor(propsData = {}) {
  return shallowMount(VueCronEditor, { propsData });
}

describe("VueCronEditor", () => {
  it("emits the default 'every minute' cron expression on mount with no value", () => {
    const wrapper = mountEditor({ value: "" });
    expect(wrapper.emitted("input")[0][0]).toBe("* * * * *");
  });

  it("keeps a wildcard step valid in the component state", () => {
    const wrapper = mountEditor({ value: "*/5 * * * *" });
    expect(wrapper.vm.cron).toBe("*/5 * * * *");
    expect(wrapper.vm.minute.incrementStart).toBe("0");
  });

  it("edits last-day-of-month expressions when extended syntax is enabled", () => {
    const wrapper = mountEditor({ value: "0 0 L * *", extendedSyntax: true });
    expect(wrapper.vm.day.cronEvery).toBe("6");
    expect(wrapper.vm.cron).toBe("0 0 L * *");
  });

  it("regression: nearest-weekday (NW) round trips through the correct field", () => {
    const wrapper = mountEditor({ value: "0 0 15W * *", extendedSyntax: true });
    expect(wrapper.vm.day.cronDaysNearestWeekday).toBe("15");
    expect(wrapper.vm.cron).toBe("0 0 15W * *");
  });

  it("visible toggled off resets to the default cron expression", async () => {
    const wrapper = mountEditor({ value: "0 0 L * *", visible: true });
    await wrapper.setProps({ visible: false });
    expect(wrapper.vm.cron).toBe("* * * * *");
  });

  it.each([
    "0 9 * * MON-FRI",
    "0 9 10-20 * *",
    "0 9 * JAN *",
    "0 9 15 * MON",
    "0 9 * * 1-5/2",
    "5,10-20 * * * *",
    "0 9 L * *",
  ])("preserves %s when another field is edited", async (value) => {
    const wrapper = mountEditor({ value });
    expect(wrapper.vm.cron).toBe(value);
    expect(wrapper.emitted("input")).toBeUndefined();

    wrapper.vm.hoursText = "10";
    await wrapper.vm.$nextTick();
    const fields = value.split(" ");
    fields[1] = "10";
    expect(wrapper.emitted("input")).toEqual([[fields.join(" ")]]);
  });

  it("replaces a custom day group when a day mode is chosen", async () => {
    const wrapper = mountEditor({ value: "0 9 15 * MON" });
    wrapper.vm.day.cronEvery = "1";
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("input")).toEqual([["0 9 * * *"]]);
  });

  it("clears a weekday constraint on a whitespace-separated external update", async () => {
    const wrapper = mountEditor({ value: "0 9 * * MON" });
    await wrapper.setProps({ value: "15\t10\t*\t*\t*" });
    expect(wrapper.vm.cron).toBe("15 10 * * *");
    expect(wrapper.emitted("input")).toBeUndefined();
  });

  it("falls back to English for an unknown locale", () => {
    const wrapper = mountEditor({ i18n: "fr" });
    expect(wrapper.text()).toContain("Minutes");
  });

  it("regression: setDefaultCronValue passes setCronValue a split array, not the raw string", () => {
    // The final cron can't detect this: the SelectEveryMinute action that
    // runs right after setCronValue always resets every field regardless, so
    // we must assert on the call itself instead of the (masked) end state.
    const wrapper = mountEditor({ value: "0 5 * 6 *" });
    const setCronValueSpy = jest.spyOn(wrapper.vm, "setCronValue");

    wrapper.vm.setDefaultCronValue();

    expect(setCronValueSpy).toHaveBeenCalledWith(["*", "*", "*", "*", "*"]);
  });
});
