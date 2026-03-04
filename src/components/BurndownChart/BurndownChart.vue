<template>
  <div ref="burndownContainer" class="burndown-container">
    <svg ref="burndownSvg"></svg>
  </div>
</template>

<style>
.burndown-container {
  width: 100%;
}
</style>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from "vue";
import * as d3 from "d3";

interface DataPoint {
  day: string;
  value: number;
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

  svgEl
    .attr("width", width)
    .attr("height", height)
    .style("background-color", props.backgroundColor);

  const margin = { top: 15, right: 0, bottom: 20, left: 22 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svgEl
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleBand<string>()
    .domain(props.data.map((d) => d.day))
    .range([0, innerWidth])
    .padding(0.2);

  const maxValue: number =
    d3.max<DataPoint, number>(props.data, (d) => d.value) ?? 0;
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

  const xAxis = g
    .append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x));
  xAxis.selectAll("text").attr("fill", props.textColor);
  xAxis.selectAll("path, line").attr("stroke", props.textColor);

  const line = d3
    .line<DataPoint>()
    .x((d: DataPoint) => (x(d.day) ?? 0) + x.bandwidth() / 2)
    .y((d: DataPoint) => y(d.value));

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
        { day: props.data[0].day, value: props.data[0].value },
        { day: props.data[props.data.length - 1].day, value: 0 },
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
  ],
  drawChart,
  { deep: true },
);
</script>
