<template>
  <svg ref="svg"></svg>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import * as d3 from "d3";

interface DataPoint {
  date: string;
  weekday: string;
  value: number;
}

interface Props {
  data: DataPoint[];
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 200,
});

const svg = ref<SVGSVGElement | null>(null);

const yLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const drawChart = () => {
  if (!svg.value) return;
  const svgEl = d3.select(svg.value);
  svgEl.selectAll("*").remove();

  svgEl.attr("width", props.width).attr("height", props.height);

  // Set the dimensions and margins of the graph
  const margin = { top: 30, right: 30, bottom: 40, left: 50 };

  const width = props.width - margin.left - margin.right;
  const height = props.height - margin.top - margin.bottom;

  const g = svgEl
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Build X, Y scales and axis:
  const x = d3
    .scaleBand<string>()
    .domain([...new Set(props.data.map((d: DataPoint) => d.date))] as string[])
    .range([0, width])
    .padding(0.01);

  const y = d3
    .scaleBand<string>()
    .domain(yLabels)
    .range([0, height])
    .padding(0.01);

  const yAxis = d3.axisLeft(y);
  const xAxis = d3.axisBottom(x);

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  g.append("g").call(yAxis);

  // Build color scale
  const maxVal: number =
    d3.max<DataPoint, number>(props.data, (d) => d.value) ?? 1;
  const color = d3
    .scaleSequential(d3.interpolateRgb("white", "#69b3a2"))
    .domain([0, maxVal]);

  g.selectAll<SVGRectElement, DataPoint>("rect")
    .data(props.data)
    .join("rect")
    .attr("x", (d: DataPoint) => x(d.date) ?? 0)
    .attr("y", (d: DataPoint) => y(d.weekday) ?? 0)
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .attr("fill", (d: DataPoint) => color(d.value));
};

onMounted(drawChart);
watch(() => props.data, drawChart, { deep: true });
</script>
