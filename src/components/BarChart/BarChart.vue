<template>
  <svg ref="svg"></svg>
  <div ref="tooltip" class="tooltip"></div>
</template>

<style scoped>
.tooltip {
    position:absolute; 
    pointer-events:none; 
    background:#333; 
    color:#fff; 
    padding:4px 8px; 
    border-radius:4px; 
    font-size:12px; 
    opacity:0; 
    transition:0.2s;
}
</style>

<script setup>
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  width: {
    type: Number,
    default: 400
  },
  height: {
    type: Number,
    default: 200
  }
})

const svg = ref(null)
const tooltip = ref(null)

const drawChart = () => {
  const svgEl = d3.select(svg.value)
  const tipEl = d3.select(tooltip.value)

  svgEl.selectAll('*').remove() // Clear previous renders

  svgEl.attr('width', props.width).attr('height', props.height)

  const x = d3
    .scaleBand()
    .domain(props.data.map((d, i) => i))
    .range([0, props.width])
    .padding(0.1)

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(props.data)])
    .nice()
    .range([props.height, 0])

  svgEl
    .selectAll('rect')
    .data(props.data)
    .join('rect')
    .attr('x', (_, i) => x(i))
    .attr('y', d => y(d))
    .attr('width', x.bandwidth())
    .attr('height', d => props.height - y(d))
    .attr('fill', 'steelblue')
    // --- EVENTS ---
    .on('mouseenter', (event, d, i, nodes) => {
      const rect = event.currentTarget
      const bbox = rect.getBoundingClientRect() 
      const tipBox = tipEl.node().getBoundingClientRect()

      tipEl.style('opacity', 1)
        .text(d)
        .style('left', (bbox.x + bbox.width / 2 - tipBox.width / 2) + 'px')
        .style('top', (bbox.y - tipBox.height - 10) + 'px')
    })
    .on('mouseleave', () => {
      tipEl.style('opacity', 0)
    })
}

onMounted(drawChart)
watch(() => props.data, drawChart)
</script>