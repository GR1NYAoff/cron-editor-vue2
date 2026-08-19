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

  it("normalizes an incoming */N minutes expression to 0/N in the component state", () => {
    const wrapper = mountEditor({ value: "*/5 * * * *" });
    expect(wrapper.vm.cron).toBe("0/5 * * * *");
  });

  it("parses last-day-of-month and nth-weekday expressions without corrupting state", () => {
    const wrapper = mountEditor({ value: "0 0 L * *" });
    expect(wrapper.vm.day.cronEvery).toBe("6");
    expect(wrapper.vm.cron).toBe("0 0 L * *");
  });

  it("regression: nearest-weekday (NW) round trips through the correct field", () => {
    const wrapper = mountEditor({ value: "0 0 15W * *" });
    expect(wrapper.vm.day.cronDaysNearestWeekday).toBe("15");
    expect(wrapper.vm.cron).toBe("0 0 15W * *");
  });

  it("visible toggled off resets to the default cron expression", async () => {
    const wrapper = mountEditor({ value: "0 0 L * *", visible: true });
    await wrapper.setProps({ visible: false });
    expect(wrapper.vm.cron).toBe("* * * * *");
  });

  it("setCronValue needs an array of 5 fields, not a raw cron string", () => {
    // Passing the un-split string reproduces the historical bug: array
    // destructuring on a string iterates its characters ("*", " ", "*", ...),
    // so the hour/month fields silently receive " " instead of "*" and never
    // get reset to "every".
    const buggyWrapper = mountEditor({ value: "0 5 * 6 *" });
    buggyWrapper.vm.setCronValue("* * * * *");
    expect(buggyWrapper.vm.cron).toBe("* 5 * 6 *");

    const fixedWrapper = mountEditor({ value: "0 5 * 6 *" });
    fixedWrapper.vm.setCronValue("* * * * *".split(" "));
    expect(fixedWrapper.vm.cron).toBe("* * * * *");
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
