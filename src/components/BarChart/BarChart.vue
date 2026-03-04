<template>
  <svg ref="svg"></svg>
  <div ref="tooltip" class="tooltip"></div>
</template>

<style scoped>
.tooltip {
  position: absolute;
  pointer-events: none;
  background: #333;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  transition: 0.2s;
}
</style>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import * as d3 from "d3";

interface Props {
  data: number[];
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 200,
});

const svg = ref<SVGSVGElement | null>(null);
const tooltip = ref<HTMLDivElement | null>(null);

const drawChart = () => {
  if (!svg.value || !tooltip.value) return;
  const svgEl = d3.select(svg.value);
  const tipEl = d3.select(tooltip.value);

  svgEl.selectAll("*").remove(); // Clear previous renders

  svgEl.attr("width", props.width).attr("height", props.height);

  const x = d3
    .scaleBand<number>()
    .domain(props.data.map((_, i) => i))
    .range([0, props.width])
    .padding(0.1);

  const maxValue = d3.max<number>(props.data) ?? 0;
  const y = d3
    .scaleLinear<number, number>()
    .domain([0, maxValue])
    .nice()
    .range([props.height, 0]);

  svgEl
    .selectAll<SVGRectElement, number>("rect")
    .data<number>(props.data)
    .join("rect")
    .attr("x", (_, i) => x(i) ?? 0)
    .attr("y", (d) => y(d))
    .attr("width", x.bandwidth())
    .attr("height", (d) => props.height - y(d))
    .attr("fill", "steelblue")
    // --- EVENTS ---
    .on("mouseenter", (event: MouseEvent, d: number) => {
      const rect = event.currentTarget as SVGRectElement;
      const bbox = rect.getBoundingClientRect();
      const tipNode = tipEl.node();
      if (!tipNode) return;

      const tipBox = tipNode.getBoundingClientRect();

      tipEl
        .style("opacity", 1)
        .text(d.toString())
        .style("left", bbox.x + bbox.width / 2 - tipBox.width / 2 + "px")
        .style("top", bbox.y - tipBox.height - 10 + "px");
    })
    .on("mouseleave", () => {
      tipEl.style("opacity", 0);
    });
};

onMounted(drawChart);
watch(() => props.data, drawChart, { deep: true });
</script>
