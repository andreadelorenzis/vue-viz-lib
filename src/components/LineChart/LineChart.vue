<template>
  <svg ref="svg"></svg>
</template>

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

const drawChart = () => {
  const svgEl = d3.select(svg.value)
  svgEl.selectAll('*').remove()

  svgEl
    .attr('width', props.width)
    .attr('height', props.height)

  const margin = { top: 30, right: 30, bottom: 40, left: 50 }

  const width = props.width - margin.left - margin.right
  const height = props.height - margin.top - margin.bottom

  const g = svgEl.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  const x = d3.scaleBand()
    .domain(props.data.map(d => d.day))
    .range([0, width])
    .padding(0.2)

  const y = d3.scaleLinear()
    .domain([0, d3.max(props.data, d => d.value)])
    .nice()
    .range([height, 0])

  // Fewer Y ticks
  const yAxis = d3.axisLeft(y)
    .ticks(4)

  const xAxis = d3.axisBottom(x)

  // Subtle horizontal gridlines
  g.append("g")
    .attr("class", "grid")
    .call(
      d3.axisLeft(y)
        .ticks(4)
        .tickSize(-width)
        .tickFormat("")
    )
    .selectAll("line")
    .attr("stroke", "#e5e7eb")

  g.append("g")
    .call(yAxis)

  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis)

  const line = d3.line()
    .x(d => x(d.day) + x.bandwidth() / 2)
    .y(d => y(d.value));

  g.append("path")
    .datum(props.data)
    .attr("fill", "none")
    .attr("stroke", "#2563eb")
    .attr("stroke-width", 3)
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .attr("d", line)
}

onMounted(drawChart)
watch(() => props.data, drawChart)
</script>