import type { Meta, StoryFn } from "@storybook/vue3-vite";

import CalendarHeatmap from "../components/CalendarHeatmap/CalendarHeatmap.vue";

export default {
  title: "Components/CalendarHeatmap",
  component: CalendarHeatmap,
  argTypes: {
    data: { control: "object" },
    cellSize: { control: "number" },
    cellHorizontalPadding: { control: "number" },
    cellVerticalPadding: { control: "number" },
    colorScale: { control: "object" },
    textColor: { control: "color" },
    backgroundColor: { control: "color" },
    fontSize: { control: "text" },
    fontStyle: { control: "text" },
    marginTop: { control: "number" },
    marginBottom: { control: "number" },
    marginLeft: { control: "number" },
    marginRight: { control: "number" },
    hoverColor: { control: "color" },
  },
} as Meta<typeof CalendarHeatmap>;

const Template: StoryFn<typeof CalendarHeatmap> = (args: any) => ({
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
  cellHorizontalPadding: 2,
  cellVerticalPadding: 2,
  colorScale: ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"],
  textColor: "#666",
  backgroundColor: "transparent",
  fontSize: "10px",
  fontStyle: "normal",
  marginTop: 25,
  marginBottom: 10,
  marginLeft: 25,
  marginRight: 0,
  hoverColor: "#333",
};
