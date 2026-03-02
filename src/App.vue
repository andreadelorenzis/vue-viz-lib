<script setup lang="ts">
import { ref } from "vue";
import BarChart from "./components/BarChart/BarChart.vue";
import LineChart from "./components/LineChart/LineChart.vue";
import BurndownChart from "./components/BurndownChart/BurndownChart.vue";
import Heatmap from "./components/Heatmap/Heatmap.vue";
import CalendarHeatmap from "./components/CalendarHeatmap/CalendarHeatmap.vue";

const chartData = ref([10, 15, 20, 25, 30, 5, 7]);
const lineChartData = ref([
  { day: "01 Mar", value: 30, efficiency: 0.8 },
  { day: "02 Mar", value: 20, efficiency: 0.6 },
  { day: "03 Mar", value: 10, efficiency: 0.6 },
]);
const burndownData = [
  { day: "Day 1", value: 50 },
  { day: "Day 2", value: 42 },
  { day: "Day 3", value: 35 },
  { day: "Day 4", value: 28 },
  { day: "Day 5", value: 20 },
  { day: "Day 6", value: 12 },
  { day: "Day 7", value: 0 },
];

const idealBurndownData = [
  { day: "Day 1", value: 50 },
  { day: "Day 2", value: 40 },
  { day: "Day 3", value: 30 },
  { day: "Day 4", value: 20 },
  { day: "Day 5", value: 10 },
  { day: "Day 6", value: 0 },
  { day: "Day 7", value: 0 },
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

function generateYearData() {
  const start = new Date("2026-01-01");
  const end = new Date("2026-12-31");
  const dates = [];

  let current = new Date(start);

  while (current <= end) {
    dates.push({
      date: current.toISOString().slice(0, 10),
      value: Math.floor(Math.random() * 10),
    });
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

const heatmapCalendarData = generateYearData();
</script>

<template>
  <BarChart :data="chartData" />
  <LineChart :data="lineChartData" />
  <BurndownChart :data="burndownData" :idealData="idealBurndownData" />
  <Heatmap :data="heatmapData" />
  <CalendarHeatmap :data="heatmapCalendarData" />
</template>
