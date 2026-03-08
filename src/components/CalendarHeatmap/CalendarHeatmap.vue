<template>
  <div class="calendar-heatmap-container" :style="{ border: props.border }">
    <div class="calendar-heatmap-svg-container">
      <svg ref="svg"></svg>
    </div>
  </div>
</template>

<style>
.calendar-heatmap-container {
  width: max-content;
  max-width: 100%;
  border-radius: 10px;
  padding: 0 10px;
  padding-bottom: 5px;
  box-sizing: border-box;
}
.calendar-heatmap-svg-container {
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
  year: number;
  cellSize?: number;
  cellHorizontalPadding?: number;
  cellVerticalPadding?: number;
  colorScale?: string[];
  textColor?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontStyle?: string;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  hoverColor?: string;
  border?: string;
  tooltipFormat?: (d: RawDataPoint) => string;
}

const props = withDefaults(defineProps<Props>(), {
  cellSize: 15,
  cellHorizontalPadding: 2,
  cellVerticalPadding: 2,
  colorScale: () => ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"],
  textColor: "inherit",
  backgroundColor: "transparent",
  fontSize: "12px",
  fontStyle: "inherit",
  marginTop: 25,
  marginBottom: 10,
  marginLeft: 30,
  marginRight: 0,
  hoverColor: "#333",
  border: "1px solid #ccc",
  tooltipFormat: (d: RawDataPoint) => `${d.date} — ${d.value}`,
});

const svg = ref<SVGSVGElement | null>(null);

const drawChart = () => {
  if (!svg.value) return;
  const svgEl = d3.select(svg.value);
  svgEl.selectAll("*").remove();

  svgEl.style("background-color", props.backgroundColor);

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

  // if (parsedData.length === 0) return;

  const yearStart = new Date(props.year, 0, 1);
  const yearEnd = new Date(props.year + 1, 0, 1);

  const startOfWeek = d3.timeSunday.floor(yearStart);
  const endOfWeek = d3.timeSunday.ceil(yearEnd);

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

  svgEl
    .attr("width", width + props.marginLeft + props.marginRight)
    .attr("height", height + props.marginTop + props.marginBottom);

  const g = svgEl
    .append("g")
    .attr("transform", `translate(${props.marginLeft},${props.marginTop})`);

  // ---- Color scale (GitHub style or custom) ----
  const maxVal = Math.max(1, d3.max(completeData, (d) => d.value) ?? 0);
  const color = d3
    .scaleQuantize<string>()
    .domain([0, maxVal])
    .range(props.colorScale);

  g.selectAll("rect")
    .data(completeData)
    .join("rect")
    .attr(
      "x",
      (d) => (d.week ?? 0) * props.cellSize + props.cellHorizontalPadding / 2,
    )
    .attr(
      "y",
      (d) => (d.day ?? 0) * props.cellSize + props.cellVerticalPadding / 2,
    )
    .attr("width", props.cellSize - props.cellHorizontalPadding)
    .attr("height", props.cellSize - props.cellVerticalPadding)
    .attr("fill", (d) => color(d.value))
    .on("mouseover", function () {
      if (props.hoverColor) {
        d3.select(this)
          .attr("stroke", props.hoverColor)
          .attr("stroke-width", 1);
      }
    })
    .on("mouseout", function () {
      if (props.hoverColor) {
        d3.select(this).attr("stroke", null).attr("stroke-width", null);
      }
    })
    .append("title")
    .text((d) =>
      props.tooltipFormat({ date: formatDate(d.date), value: d.value }),
    );

  // ---- Weekday labels ----
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  g.selectAll(".weekday")
    .data(weekdays)
    .join("text")
    .attr("class", "weekday")
    .attr("x", -5)
    .attr("y", (_, i) => i * props.cellSize + props.cellSize * 0.7)
    .attr("text-anchor", "end")
    .attr("font-size", props.fontSize)
    .attr("font-style", props.fontStyle)
    .attr("fill", props.textColor)
    .text((d) => d);

  // ---- Month labels ----
  const months = d3.timeMonths(d3.timeMonth.floor(yearStart), yearEnd);

  g.selectAll(".month")
    .data(months)
    .join("text")
    .attr("class", "month")
    .attr("x", (d) => {
      const week = d3.timeSunday.count(startOfWeek, d);
      return week * props.cellSize;
    })
    .attr("y", -5)
    .attr("font-size", props.fontSize)
    .attr("font-style", props.fontStyle)
    .attr("fill", props.textColor)
    .text(d3.timeFormat("%b"));
};

onMounted(drawChart);
watch(
  () => [
    props.data,
    props.cellSize,
    props.cellHorizontalPadding,
    props.cellVerticalPadding,
    props.colorScale,
    props.textColor,
    props.backgroundColor,
    props.fontSize,
    props.fontStyle,
    props.marginTop,
    props.marginBottom,
    props.marginLeft,
    props.marginRight,
    props.hoverColor,
    props.border,
    props.tooltipFormat,
  ],
  drawChart,
  { deep: true },
);
</script>
