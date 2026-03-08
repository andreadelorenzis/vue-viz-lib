<template>
  <div
    ref="burndownContainer"
    class="burndown-container"
    :style="{ border: props.border, background: props.backgroundColor }"
  >
    <svg ref="burndownSvg"></svg>
  </div>
</template>

<style>
.burndown-container {
  width: 100%;
  border-radius: 10px;
  padding: 10px;
}
</style>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from "vue";
import * as d3 from "d3";

interface DataPoint {
  date: string;
  remaining: number;
}

interface Props {
  data: DataPoint[];
  idealData?: DataPoint[] | null;
  lineColor?: string;
  idealLineColor?: string;
  lineStrokeWidth?: number;
  idealLineStrokeWidth?: number;
  lineStyle?: string;
  idealLineStyle?: string;
  gridColor?: string;
  backgroundColor?: string;
  textColor?: string;
  border?: string;
}

const props = withDefaults(defineProps<Props>(), {
  idealData: null,
  lineColor: "#2563eb",
  idealLineColor: "#f87171",
  lineStrokeWidth: 3,
  idealLineStrokeWidth: 2,
  lineStyle: "solid",
  idealLineStyle: "dashed",
  gridColor: "#e5e7eb",
  backgroundColor: "transparent",
  textColor: "currentColor",
  border: "1px solid #ccc",
});

const burndownSvg = ref<SVGSVGElement | null>(null);
const burndownContainer = ref<HTMLDivElement | null>(null);

const ASPECT_RATIO = 0.5; // 2:1 ratio

const getDashArray = (style: string) => {
  if (style === "dashed") return "5,5";
  if (style === "dotted") return "2,2";
  if (style === "solid") return null;
  return style;
};

const drawChart = () => {
  if (!burndownSvg.value || !burndownContainer.value) return;

  const width = burndownContainer.value.clientWidth;
  const height = width * ASPECT_RATIO;

  const svgEl = d3.select(burndownSvg.value);
  svgEl.selectAll("*").remove();

  svgEl.attr("width", width).attr("height", height);

  const margin = { top: 15, right: 35, bottom: 30, left: 30 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svgEl
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleBand<string>()
    .domain(props.data.map((d) => d.date))
    .range([0, innerWidth])
    .padding(0.2);

  const maxValue: number =
    d3.max<DataPoint, number>(props.data, (d) => d.remaining) ?? 0;
  const y = d3
    .scaleLinear<number>()
    .domain([0, maxValue])
    .nice()
    .range([innerHeight, 0]);

  // Grid and axes
  const grid = g
    .append("g")
    .attr("class", "grid")
    .call(
      d3
        .axisLeft(y)
        .ticks(4)
        .tickSize(-innerWidth)
        .tickFormat(() => ""),
    );

  grid.selectAll("line").attr("stroke", props.gridColor);
  grid.select(".domain").remove();

  const yAxis = g.append("g").call(d3.axisLeft(y).ticks(4));
  yAxis.selectAll("text").attr("fill", props.textColor);
  yAxis.selectAll("path, line").attr("stroke", props.textColor);

  const MAX_TICKS = 5;

  const allDates = props.data.map((d) => d.date);
  const tickDates: string[] = [];

  if (allDates.length <= MAX_TICKS) {
    tickDates.push(...allDates);
  } else {
    const lastIndex = allDates.length - 1;

    for (let i = 0; i < MAX_TICKS; i++) {
      const index = Math.round((i * lastIndex) / (MAX_TICKS - 1));
      tickDates.push(allDates[index]);
    }
  }

  const xAxis = g
    .append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).tickValues(tickDates));
  xAxis.selectAll("text").attr("fill", props.textColor).attr("dy", "1.2em");
  xAxis.selectAll("path, line").attr("stroke", props.textColor);

  const line = d3
    .line<DataPoint>()
    .x((d: DataPoint) => (x(d.date) ?? 0) + x.bandwidth() / 2)
    .y((d: DataPoint) => y(d.remaining));

  // Actual burndown
  g.append("path")
    .datum(props.data)
    .attr("fill", "none")
    .attr("stroke", props.lineColor)
    .attr("stroke-width", props.lineStrokeWidth)
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .attr("stroke-dasharray", getDashArray(props.lineStyle))
    .attr("d", line);

  // Ideal burndown
  let ideal = props.idealData;
  if (!ideal || ideal.length === 0) {
    if (props.data.length > 0) {
      ideal = [
        { date: props.data[0].date, remaining: props.data[0].remaining },
        { date: props.data[props.data.length - 1].date, remaining: 0 },
      ];
    } else {
      ideal = [];
    }
  }

  g.append("path")
    .datum(ideal)
    .attr("fill", "none")
    .attr("stroke", props.idealLineColor)
    .attr("stroke-width", props.idealLineStrokeWidth)
    .attr("stroke-dasharray", getDashArray(props.idealLineStyle))
    .attr("d", line);
};

onMounted(() => {
  drawChart();
  // Watch for container resize
  if (burndownContainer.value) {
    const ro = new ResizeObserver(() => drawChart());
    ro.observe(burndownContainer.value);
  }
});

watch(
  () => [
    props.data,
    props.idealData,
    props.lineColor,
    props.idealLineColor,
    props.lineStrokeWidth,
    props.idealLineStrokeWidth,
    props.lineStyle,
    props.idealLineStyle,
    props.gridColor,
    props.backgroundColor,
    props.textColor,
    props.border,
  ],
  drawChart,
  { deep: true },
);
</script>
