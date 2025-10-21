<template>
  <CChart type="line" :data="data" :options="options" ref="mainChartRef" />
</template>

<script>
import { onMounted, ref, defineProps, watch } from 'vue'
import { CChart } from '@coreui/vue-chartjs'
import { getStyle } from '@coreui/utils'

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

export default {
  name: 'MainChartExample',
  components: {
    CChart,
  },
  props: {
    tasks: {
      type: Array,
      default: () => []
    }
  },
 
  setup(props) {
    
    const tasks = ref(props.tasks);
    let data = ref({});
    
    const updateData = () => {
        if (tasks.value.length > 0) {
          console.log("en tasks enviadas desde prop");
          data.value = {
            labels: Array.from({length:31}, (_, i) => (i+1).toString()),
            datasets: [
              {
                label: 'Registros según fecha',
                backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
                borderColor: getStyle('--cui-info'),
                pointHoverBackgroundColor: getStyle('--cui-info'),
                borderWidth: 2,
                data: tasks.value.map(task => {
                  return task.Registros; 
                }),
                fill: true,
              },
            ],
          }
        }

        /* } else {
          data.value = {
            labels: Array.from({length:31}, (_, i) => (i+1).toString()),
            datasets: [
              {
                label: 'Registros según fecha',
                backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
                borderColor: getStyle('--cui-info'),
                pointHoverBackgroundColor: getStyle('--cui-info'),
                borderWidth: 2,
                data: Array.from({length:31}, (_, i) => random(1, 25)),
                fill: true,
              },
            ]
          }
        } */
    }; 

    watch(() => props.tasks, (newValue, oldValue) => {
      tasks.value = newValue; 
      console.log('Tasks actualizadas:', tasks.value);
      updateData();
    }); 

    /* console.log('Valor taskprop: ', tasksProp.value);  */

    const mainChartRef = ref();


    /* if (tasks.value.length > 0) {
      console.log("en tasks enviadas desde prop");
      data = {
        labels: Array.from({length:31}, (_, i) => (i+1).toString()),
        //labels: ['', 'February', 'March', 'April', 'May', 'June', 'July'],
        
        datasets: [
          {
            label: 'Registros según fecha',
            backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
            borderColor: getStyle('--cui-info'),
            pointHoverBackgroundColor: getStyle('--cui-info'),
            borderWidth: 2,
            data: tasks.value.map(task => {
              return task.Registros; 
            }),
            fill: true,
          },
        
          
        ],
      }
    } else {
      data = { 
        labels: Array.from({length:31}, (_, i) => (i+1).toString()),
        //labels: ['', 'February', 'March', 'April', 'May', 'June', 'July'],
        
        datasets: [
          {
            label: 'Registros según fecha',
            backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
            borderColor: getStyle('--cui-info'),
            pointHoverBackgroundColor: getStyle('--cui-info'),
            borderWidth: 2,
            data: [
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),
              random(1,25),

            ],
            fill: true,
          },
        ]
      } */
  
    

    const options = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            color: getStyle('--cui-border-color-translucent'),
            drawOnChartArea: false,
          },
          ticks: {
            color: getStyle('--cui-body-color'),
          },
        },
        y: {
          beginAtZero: true,
          border: {
            color: getStyle('--cui-border-color-translucent'),
          },
          grid: {
            color: getStyle('--cui-border-color-translucent'),
          },
          max: 24,
          ticks: {
            color: getStyle('--cui-body-color'),
            maxTicksLimit: 5,
            stepSize: Math.ceil(250 / 5),
          },
        },
      },
      elements: {
        line: {
          tension: 0.4,
        },
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3,
        },
      },
    }

    onMounted(() => {
      document.documentElement.addEventListener('ColorSchemeChange', () => {
        if (mainChartRef.value) {
          mainChartRef.value.chart,
            (options.scales.x.grid.borderColor = getStyle(
              '--cui-border-color-translucent',
            ))
          mainChartRef.value.chart,
            (options.scales.x.grid.color = getStyle(
              '--cui-border-color-translucent',
            ))
          mainChartRef.value.chart,
            (options.scales.x.ticks.color = getStyle('--cui-body-color'))
          mainChartRef.value.chart,
            (options.scales.y.grid.borderColor = getStyle(
              '--cui-border-color-translucent',
            ))
          mainChartRef.value.chart,
            (options.scales.y.grid.color = getStyle(
              '--cui-border-color-translucent',
            ))
          mainChartRef.value.chart,
            (options.scales.y.ticks.color = getStyle('--cui-body-color'))
          mainChartRef.value.chart.update()
        }
      })
    })

    return {
      data,
      mainChartRef,
      options,
      tasks
    }
  },
}
</script>
