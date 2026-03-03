<template>
  <svg ref="svg"></svg>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import * as d3 from "d3";

interface DataPoint {
  day: string;
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

const drawChart = () => {
  if (!svg.value) return;
  const svgEl = d3.select(svg.value);
  svgEl.selectAll("*").remove();

  svgEl.attr("width", props.width).attr("height", props.height);

  const margin = { top: 30, right: 30, bottom: 40, left: 50 };

  const width = props.width - margin.left - margin.right;
  const height = props.height - margin.top - margin.bottom;

  const g = svgEl
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleBand<string>()
    .domain(props.data.map((d) => d.day))
    .range([0, width])
    .padding(0.2);

  const y = d3
    .scaleLinear<number>()
    .domain([0, d3.max(props.data, (d) => d.value) ?? 0])
    .nice()
    .range([height, 0]);

  // Fewer Y ticks
  const yAxis = d3.axisLeft(y).ticks(4);

  const xAxis = d3.axisBottom(x);

  // Subtle horizontal gridlines
  g.append("g")
    .attr("class", "grid")
    .call(
      d3
        .axisLeft(y)
        .ticks(4)
        .tickSize(-width)
        .tickFormat(() => ""),
    )
    .selectAll("line")
    .attr("stroke", "#e5e7eb");

  g.append("g").call(yAxis);

  g.append("g").attr("transform", `translate(0,${height})`).call(xAxis);

  const line = d3
    .line<DataPoint>()
    .x((d) => (x(d.day) ?? 0) + x.bandwidth() / 2)
    .y((d) => y(d.value));

  g.append("path")
    .datum(props.data)
    .attr("fill", "none")
    .attr("stroke", "#2563eb")
    .attr("stroke-width", 3)
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .attr("d", line);
};

onMounted(drawChart);
watch(() => props.data, drawChart, { deep: true });
</script>
