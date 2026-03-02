<template>
  <svg ref="svg"></svg>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import * as d3 from "d3";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  cellSize: {
    type: Number,
    default: 15,
  },
});

const svg = ref(null);

const drawChart = () => {
  const svgEl = d3.select(svg.value);
  svgEl.selectAll("*").remove();

  const parseDate = d3.timeParse("%Y-%m-%d");
  const formatDate = d3.timeFormat("%Y-%m-%d");

  let data = props.data.map((d) => ({
    date: parseDate(d.date),
    value: d.value,
  }));

  data.sort((a, b) => a.date - b.date);

  const firstDate = d3.min(data, (d) => d.date);
  const lastDate = d3.max(data, (d) => d.date);

  const startOfWeek = d3.timeSunday.floor(firstDate);
  const endOfWeek = d3.timeSunday.ceil(lastDate);

  const allDays = d3.timeDays(startOfWeek, endOfWeek);

  const dataMap = new Map(data.map((d) => [formatDate(d.date), d.value]));

  data = allDays.map((date) => ({
    date,
    value: dataMap.get(formatDate(date)) ?? 0,
  }));

  // Compute week index + weekday index
  data.forEach((d) => {
    d.week = d3.timeSunday.count(startOfWeek, d.date);
    d.day = d.date.getDay(); // 0 = Sunday
  });

  const weeks = d3.max(data, (d) => d.week) + 1;
  const width = weeks * props.cellSize;
  const height = 7 * props.cellSize;

  const margin = { top: 25, right: 20, bottom: 10, left: 40 };

  svgEl
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const g = svgEl
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // ---- Color scale (GitHub style) ----
  const color = d3
    .scaleQuantize()
    .domain([0, d3.max(data, (d) => d.value)])
    .range(["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"]);

  g.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d) => d.week * props.cellSize)
    .attr("y", (d) => d.day * props.cellSize)
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
watch(() => props.data, drawChart);
</script>
