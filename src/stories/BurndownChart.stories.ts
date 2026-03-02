import type { Meta, StoryFn } from "@storybook/vue3-vite";

import BurndownChart from "../components/BurndownChart/BurndownChart.vue";

export default {
  title: "Components/BurndownChart",
  component: BurndownChart,
  argTypes: {
    data: { control: "object" },
    idealData: { control: "object" },
    width: { control: "number" },
    height: { control: "number" },
  },
} as Meta<typeof BurndownChart>;

const Template: StoryFn<typeof BurndownChart> = (args) => ({
  components: { BurndownChart },
  setup() {
    return { args };
  },
  template: '<BurndownChart v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  data: [
    { day: "Day 1", value: 100 },
    { day: "Day 2", value: 90 },
    { day: "Day 3", value: 70 },
    { day: "Day 4", value: 65 },
    { day: "Day 5", value: 40 },
    { day: "Day 6", value: 20 },
  ],
  idealData: [
    { day: "Day 1", value: 100 },
    { day: "Day 6", value: 0 },
  ],
  width: 600,
  height: 400,
};
