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
    { date: "Day 1", remaining: 100 },
    { date: "Day 2", remaining: 90 },
    { date: "Day 3", remaining: 70 },
    { date: "Day 4", remaining: 65 },
    { date: "Day 5", remaining: 40 },
    { date: "Day 6", remaining: 0 },
  ],
  idealData: [
    { date: "Day 1", remaining: 100 },
    { date: "Day 6", remaining: 0 },
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
