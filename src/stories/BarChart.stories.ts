import type { Meta, StoryFn } from "@storybook/vue3-vite";

import BarChart from "../components/BarChart/BarChart.vue";

export default {
  title: "Components/BarChart",
  component: BarChart,
  argTypes: {
    data: { control: "object" },
    width: { control: "number" },
    height: { control: "number" },
  },
} as Meta<typeof BarChart>;

const Template: StoryFn<typeof BarChart> = (args) => ({
  components: { BarChart },
  setup() {
    return { args };
  },
  template: '<BarChart v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  data: [30, 86, 168, 281, 303, 365, 200, 150],
  width: 500,
  height: 300,
};
