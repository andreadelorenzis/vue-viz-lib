import type { Meta, StoryFn, StoryObj } from "@storybook/vue3-vite";

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

type Story = StoryObj<typeof BarChart>;

const Template: StoryFn<typeof BarChart> = (args) => ({
  components: { BarChart },
  setup() {
    return { args };
  },
  template: '<BarChart v-bind="args" />',
});

export const Default: Story = {
  args: {
    data: [30, 86, 168, 281, 303, 365, 200, 150],
    width: 500,
    height: 300,
  },
};
