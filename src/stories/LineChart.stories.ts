import type { Meta, StoryFn } from "@storybook/vue3-vite";

import LineChart from "../components/LineChart/LineChart.vue";

export default {
  title: "Components/LineChart",
  component: LineChart,
  argTypes: {
    data: { control: "object" },
    width: { control: "number" },
    height: { control: "number" },
  },
} as Meta<typeof LineChart>;

const Template: StoryFn<typeof LineChart> = (args) => ({
  components: { LineChart },
  setup() {
    return { args };
  },
  template: '<LineChart v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  data: [
    { day: "Mon", value: 12 },
    { day: "Tue", value: 19 },
    { day: "Wed", value: 3 },
    { day: "Thu", value: 5 },
    { day: "Fri", value: 2 },
    { day: "Sat", value: 15 },
    { day: "Sun", value: 20 },
  ],
  width: 600,
  height: 300,
};
