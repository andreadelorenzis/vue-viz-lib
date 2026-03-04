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
    lineColor: { control: "color" },
    idealLineColor: { control: "color" },
    lineStrokeWidth: { control: "number" },
    idealLineStrokeWidth: { control: "number" },
    lineStyle: { control: "text" },
    idealLineStyle: { control: "text" },
    gridColor: { control: "color" },
    backgroundColor: { control: "color" },
    textColor: { control: "color" },
  },
} as Meta<typeof BurndownChart>;

const Template: StoryFn<typeof BurndownChart> = (args: any) => ({
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
    { day: "Day 6", value: 0 },
  ],
  idealData: [
    { day: "Day 1", value: 100 },
    { day: "Day 6", value: 0 },
  ],
  lineColor: "#2563eb",
  idealLineColor: "#f87171",
  lineStrokeWidth: 3,
  idealLineStrokeWidth: 2,
  lineStyle: "solid",
  idealLineStyle: "dashed",
  gridColor: "#e5e7eb",
  backgroundColor: "transparent",
  textColor: "currentColor",
};
