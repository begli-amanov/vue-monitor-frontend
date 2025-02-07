<script setup lang="js">
import { Button } from 'primevue'
import Chart from 'primevue/chart'
import Toolbar from 'primevue/toolbar'
import { onMounted, ref } from 'vue'

onMounted(() => {
  monthlyBasedChartData.value = setMonthlyBasedChartData()
  monthlyBasedChartOptions.value = setMonthlyBasedChartOptions()

  quarterBasedChartData.value = setQuarterBasedChartData()
  quarterBasedChartOptions.value = setQuarterBasedChartOptions()
})

const monthlyBasedChartData = ref()
const monthlyBasedChartOptions = ref()

const quarterBasedChartData = ref()
const quarterBasedChartOptions = ref()

const setMonthlyBasedChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement)

  return {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        label: 'Monthly',
        backgroundColor: documentStyle.getPropertyValue('--p-emerald-500'),
        borderColor: documentStyle.getPropertyValue('--p-emerald-500'),
        data: [65, 59, 80, 81, 56, 55, 40, 90, 15, 24, 25, 36],
      },
    ],
  }
}
const setMonthlyBasedChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      tooltip: {
        titleFont: {
          family: 'Arial', // Font family for the tooltip title
          size: 14, // Font size for the tooltip title
        },
        bodyFont: {
          family: 'Inter Var', // Font family for the tooltip body
          size: 14, // Font size for the tooltip body
        },
      },

      legend: {
        labels: {
          color: textColor,
          font: {
            weight: 500,
            size: 16,
            family: 'Inter Var',
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500,
            size: 14,
            family: 'Inter Var',
          },
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500,
            family: 'Inter Var',
          },
        },
        grid: {
          color: surfaceBorder,
          drawBorder: true,
        },
      },
    },
  }
}

const setQuarterBasedChartData = () => {
  return {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Quarters',
        data: [540, 325, 702, 620],
        backgroundColor: [
          'rgba(249, 115, 22, 0.4)',
          'rgba(6, 182, 212, 0.4)',
          'rgb(107, 114, 128, 0.4)',
          'rgba(139, 92, 246, 0.4)',
        ],
        borderColor: [
          'rgb(249, 115, 22)',
          'rgb(6, 182, 212)',
          'rgb(107, 114, 128)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 1,
      },
    ],
  }
}
const setQuarterBasedChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      tooltip: {
        titleFont: {
          family: 'Arial', // Font family for the tooltip title
          size: 14, // Font size for the tooltip title
        },
        bodyFont: {
          family: 'Inter Var', // Font family for the tooltip body
          size: 14, // Font size for the tooltip body
        },
      },

      legend: {
        labels: {
          color: textColor,
          font: {
            weight: 500,
            size: 16,
            family: 'Inter Var',
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500,
            size: 14,
            family: 'Inter Var',
          },
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500,
            family: 'Inter Var',
          },
        },
        grid: {
          color: surfaceBorder,
          drawBorder: true,
        },
      },
    },
  }
}
</script>

<template>
  <div class="pt-6 p-4">
    <!-- toolbar starts here -->
    <Toolbar class="mb-4">
      <template #start>
        <RouterLink to="/">
          <Button label="Home" icon="pi pi-home" class="mr-2" />
        </RouterLink>
      </template>

      <template #end>
        <!-- signout button. a better place for this button? -->
        <RouterLink to="/login">
          <Button label="Out" icon="pi pi-power-off" severity="danger" />
        </RouterLink>
      </template>
    </Toolbar>
    <!-- monthly-based chart -->
    <div class="card">
      <Chart
        type="bar"
        :data="monthlyBasedChartData"
        :options="monthlyBasedChartOptions"
        class="h-[30rem]"
      />
    </div>

    <!-- quarter-based chart  -->
    <div class="card">
      <Chart
        type="bar"
        :data="quarterBasedChartData"
        :options="quarterBasedChartOptions"
        class="h-[40rem]"
      />
    </div>
  </div>
</template>
