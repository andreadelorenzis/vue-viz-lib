<template>
  <div class="container">
    <div class="svg-container">
      <svg ref="svg"></svg>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: max-content;
  max-width: 100%;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 0 10px;
  padding-bottom: 5px;
  box-sizing: border-box;
}
.svg-container {
  overflow-x: auto;
  width: 100%;
}
svg {
  display: block;
}
</style>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import * as d3 from "d3";

interface RawDataPoint {
  date: string;
  value: number;
}

interface ProcessedDataPoint {
  date: Date;
  value: number;
  week?: number;
  day?: number;
}

interface Props {
  data: RawDataPoint[];
  cellSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  cellSize: 15,
});

const svg = ref<SVGSVGElement | null>(null);

const drawChart = () => {
  if (!svg.value) return;
  const svgEl = d3.select(svg.value);
  svgEl.selectAll("*").remove();

  const parseDate = d3.timeParse("%Y-%m-%d");
  const formatDate = d3.timeFormat("%Y-%m-%d");

  let parsedData: ProcessedDataPoint[] = [];
  for (const d of props.data) {
    const parsed = parseDate(d.date);
    if (parsed) {
      parsedData.push({ date: parsed, value: d.value });
    }
  }

  parsedData.sort((a, b) => a.date.getTime() - b.date.getTime());

  if (parsedData.length === 0) return;

  const firstDate = d3.min(parsedData, (d) => d.date) as Date;
  const lastDate = d3.max(parsedData, (d) => d.date) as Date;

  const startOfWeek = d3.timeSunday.floor(firstDate);
  const endOfWeek = d3.timeSunday.ceil(lastDate);

  const allDays = d3.timeDays(startOfWeek, endOfWeek);

  const dataMap = new Map<string, number>(
    parsedData.map((d) => [formatDate(d.date), d.value]),
  );

  const completeData: ProcessedDataPoint[] = allDays.map((date) => ({
    date,
    value: dataMap.get(formatDate(date)) ?? 0,
  }));

  // Compute week index + weekday index
  completeData.forEach((d) => {
    d.week = d3.timeSunday.count(startOfWeek, d.date);
    d.day = d.date.getDay(); // 0 = Sunday
  });

  const weeks = (d3.max(completeData, (d) => d.week!) ?? 0) + 1;
  const width = weeks * props.cellSize;
  const height = 7 * props.cellSize;

  const margin = { top: 25, right: 0, bottom: 10, left: 25 };

  svgEl
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const g = svgEl
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // ---- Color scale (GitHub style) ----
  const maxVal = d3.max(completeData, (d) => d.value) ?? 1;
  const color = d3
    .scaleQuantize<string>()
    .domain([0, maxVal])
    .range(["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"]);

  g.selectAll("rect")
    .data(completeData)
    .join("rect")
    .attr("x", (d) => (d.week ?? 0) * props.cellSize)
    .attr("y", (d) => (d.day ?? 0) * props.cellSize)
    .attr("width", props.cellSize - 2)
    .attr("height", props.cellSize - 2)
    .attr("fill", (d) => color(d.value))
    .append("title")
    .text((d) => `${formatDate(d.date)} — ${d.value}`);

  // ---- Weekday labels ----
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  g.selectAll(".weekday")
    .data(weekdays)
    .join("text")
    .attr("class", "weekday")
    .attr("x", -5)
    .attr("y", (_, i) => i * props.cellSize + props.cellSize * 0.7)
    .attr("text-anchor", "end")
    .attr("font-size", "10px")
    .text((d) => d);

  // ---- Month labels ----
  const months = d3.timeMonths(d3.timeMonth.floor(startOfWeek), lastDate);

  g.selectAll(".month")
    .data(months)
    .join("text")
    .attr("class", "month")
    .attr("x", (d) => {
      const week = d3.timeSunday.count(startOfWeek, d);
      return week * props.cellSize;
    })
    .attr("y", -5)
    .attr("font-size", "10px")
    .text(d3.timeFormat("%b"));
};

onMounted(drawChart);
watch(() => props.data, drawChart, { deep: true });
</script>
