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

const yLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const drawChart = () => {
  const svgEl = d3.select(svg.value)
  svgEl.selectAll('*').remove()

  svgEl
    .attr('width', props.width)
    .attr('height', props.height)

  // Set the dimensions and margins of the graph  
  const margin = { top: 30, right: 30, bottom: 40, left: 50 }

  const width = props.width - margin.left - margin.right
  const height = props.height - margin.top - margin.bottom

  const g = svgEl.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  // Build X, Y scales and axis:
  const x = d3.scaleBand()
    .domain([...new Set(props.data.map(d => d.date))])
    .range([0, width])
    .padding(0.01)
    
    const y = d3.scaleBand()
    .domain(yLabels)   
    .range([0, height])
    .padding(0.01)

  const yAxis = d3.axisLeft(y)
  const xAxis = d3.axisBottom(x)

  g.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  
  g.append("g")
  .call(yAxis)
  
  // Build color scale
  const color = d3.scaleLinear()
    .domain([0, d3.max(props.data, d => d.value)])
    .range(["white", "#69b3a2"])

    g.selectAll('rect')
    .data(props.data)
    .join('rect')
    .attr("x", d => x(d.date))
    .attr("y", d => y(d.weekday))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .attr("fill", d => color(d.value))

}

onMounted(drawChart)
watch(() => props.data, drawChart)
</script>