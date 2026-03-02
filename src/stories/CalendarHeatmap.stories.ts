import type { Meta, StoryFn } from "@storybook/vue3-vite";

import CalendarHeatmap from "../components/CalendarHeatmap/CalendarHeatmap.vue";

export default {
  title: "Components/CalendarHeatmap",
  component: CalendarHeatmap,
  argTypes: {
    data: { control: "object" },
    cellSize: { control: "number" },
  },
} as Meta<typeof CalendarHeatmap>;

const Template: StoryFn<typeof CalendarHeatmap> = (args) => ({
  components: { CalendarHeatmap },
  setup() {
    return { args };
  },
  template: '<CalendarHeatmap v-bind="args" />',
});

// Generate some sample data spanning the last 6 months
const generateData = () => {
  const data = [];
  const date = new Date();
  date.setMonth(date.getMonth() - 6);

  for (let i = 0; i < 180; i++) {
    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.floor(Math.random() * 5),
    });
    date.setDate(date.getDate() + 1);
  }
  return data;
};

export const Default = Template.bind({});
Default.args = {
  data: generateData(),
  cellSize: 15,
};
