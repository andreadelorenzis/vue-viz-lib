import type { Meta, StoryFn } from "@storybook/vue3-vite";

import Heatmap from "../components/Heatmap/Heatmap.vue";

export default {
  title: "Components/Heatmap",
  component: Heatmap,
  argTypes: {
    data: { control: "object" },
    width: { control: "number" },
    height: { control: "number" },
  },
} as Meta<typeof Heatmap>;

const Template: StoryFn<typeof Heatmap> = (args) => ({
  components: { Heatmap },
  setup() {
    return { args };
  },
  template: '<Heatmap v-bind="args" />',
});

const generateHeatmapData = () => {
  const data = [];
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dates = ["W1", "W2", "W3", "W4", "W5", "W6"];

  for (const date of dates) {
    for (const weekday of weekdays) {
      data.push({
        date,
        weekday,
        value: Math.floor(Math.random() * 100),
      });
    }
  }
  return data;
};

export const Default = Template.bind({});
Default.args = {
  data: generateHeatmapData(),
  width: 500,
  height: 300,
};
