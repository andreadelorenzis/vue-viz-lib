<script setup lang="ts">
import { ref } from "vue";
import BarChart from "./components/BarChart/BarChart.vue";
import LineChart from "./components/LineChart/LineChart.vue";
import BurndownChart from "./components/BurndownChart/BurndownChart.vue";
import Heatmap from "./components/Heatmap/Heatmap.vue";
import CalendarHeatmap from "./components/CalendarHeatmap/CalendarHeatmap.vue";
import FrappeGantt from "./components/FrappeGantt/FrappeGantt.vue";

const chartData = ref([10, 15, 20, 25, 30, 5, 7]);
const lineChartData = ref([
  { day: "01 Mar", value: 30, efficiency: 0.8 },
  { day: "02 Mar", value: 20, efficiency: 0.6 },
  { day: "03 Mar", value: 10, efficiency: 0.6 },
]);
const burndownData = [
  { date: "date 1", remaining: 50 },
  { date: "date 2", remaining: 42 },
  { date: "date 3", remaining: 35 },
  { date: "date 4", remaining: 28 },
  { date: "date 5", remaining: 20 },
  { date: "date 6", remaining: 12 },
  { date: "date 7", remaining: 0 },
];

const idealBurndownData = [
  { date: "date 1", remaining: 50 },
  { date: "date 2", remaining: 40 },
  { date: "date 3", remaining: 30 },
  { date: "date 4", remaining: 20 },
  { date: "date 5", remaining: 10 },
  { date: "date 6", remaining: 0 },
  { date: "date 7", remaining: 0 },
];

const heatmapData = [
  { date: "date 1", weekday: "Mon", value: 50 },
  { date: "date 2", weekday: "Tue", value: 40 },
  { date: "date 3", weekday: "Wed", value: 30 },
  { date: "date 4", weekday: "Thu", value: 20 },
  { date: "date 5", weekday: "Fri", value: 10 },
  { date: "date 6", weekday: "Sat", value: 20 },
  { date: "date 7", weekday: "Sun", value: 0 },
];

let tasks = [
  {
    id: "1",
    name: "Redesign website",
    start: "2016-12-28",
    end: "2016-12-31",
    progress: 30,
  },
];

// const heatmapCalendarData = generateYearData();
const heatmapCalendarData = [{ date: "2026-01-01", value: 1 }];

const handleDateChange = (task: any, start: Date, end: Date) => {
  console.log("Date changed for task: ", task);
  console.log("New range:", start, end);
};

const handleProgressChange = (task: any, progress: number) => {
  console.log("Progress changed for task", task);
  console.log("new progress: ", progress);
};

const handleViewChange = (mode: any) => {
  console.log("View changed: ", mode);
};

const handleClick = (task: any) => {
  console.log("Clicked task: ", task);
};
</script>

<template>
  <div class="app-container">
    <FrappeGantt
      :tasks="tasks"
      :options="{ view_mode: 'Day' }"
      @taskClick="handleClick"
      @dateChange="handleDateChange"
      @progressChange="handleProgressChange"
      @viewChange="handleViewChange"
    />
    <BarChart :data="chartData" />
    <LineChart :data="lineChartData" />
    <BurndownChart :data="burndownData" :idealData="idealBurndownData" />
    <Heatmap :data="heatmapData" />
    <CalendarHeatmap :data="heatmapCalendarData" :year="2026" />
  </div>
</template>

<style scoped>
.app-container {
  width: 100%; /* full width of parent/viewport */
  max-width: 100vw; /* prevent horizontal overflow */
  padding: 2rem;
  box-sizing: border-box;
}
</style>
