<template>
  <div id="gantt-wrapper">
    <svg ref="ganttContainer" id="ganttContainer"></svg>
  </div>
</template>

<style></style>

<script setup lang="ts">
import Gantt from "frappe-gantt";
import "../../../node_modules/frappe-gantt/dist/frappe-gantt.css";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

type GanttType = typeof Gantt;
type GanttTask = InstanceType<GanttType>["tasks"][0];
type GanttOptions = InstanceType<GanttType>["options"];
type GanttViewModeObject = Parameters<
  NonNullable<GanttOptions["on_view_change"]>
>[0];

const props = defineProps<{
  tasks: GanttTask[];
  options?: GanttOptions;
}>();

const emit = defineEmits<{
  (e: "taskClick", task: GanttTask): void;
  (e: "dateChange", task: GanttTask, start: Date, end: Date): void;
  (e: "progressChange", task: GanttTask, progress: number): void;
  (e: "viewChange", mode: GanttViewModeObject): void;
}>();

const ganttContainer = ref<SVGElement | null>(null);
let gantt: InstanceType<GanttType> | null = null;

const setupGanttChart = () => {
  if (!ganttContainer.value) return;
  gantt = new Gantt(ganttContainer.value, props.tasks, {
    ...props.options,

    on_click: (task: GanttTask) => {
      emit("taskClick", task);
    },

    on_date_change: (task: GanttTask, start: Date, end: Date) => {
      emit("dateChange", task, start, end);
    },

    on_progress_change: (task: GanttTask, progress: number) => {
      emit("progressChange", task, progress);
    },

    on_view_change: (mode: GanttViewModeObject) => {
      emit("viewChange", mode);
    },
  });
};

onMounted(() => {
  if (!ganttContainer.value) return;
  setupGanttChart();
});

onBeforeUnmount(() => {
  gantt = null;
});

watch(
  () => props.tasks,
  (tasks) => gantt?.refresh(tasks),
  { deep: true },
);

watch(
  () => props.options,
  (options) => gantt?.setup_options(options || {}),
  { deep: true },
);
</script>
