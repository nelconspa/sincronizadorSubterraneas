<template>
  <div>
    <!-- Filtro de estado -->
    <CRow class="mb-4">
      <CCol class="col-3">
        <CFormSelect
          v-model="selectedEstado"
          label="Estado"
          :options="estadoOptions"
          @change="fetchData($event.target.value)"
        />
      </CCol>
    </CRow>

    <!-- Loading -->
    <template v-if="isLoading">
      <div class="d-flex flex-column align-items-center justify-content-center mt-5">
        <h5 class="text-bold">Cargando datos...</h5>
        <CSpinner color="dark" />
      </div>
    </template>

    <!-- Tabla -->
    <template v-else>
      <CTable bordered striped hover responsive class="mt-4">
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell>Cliente</CTableHeaderCell>
            <CTableHeaderCell>Código Zeus</CTableHeaderCell>
            <CTableHeaderCell>Nombre Zeus</CTableHeaderCell>

            <CTableHeaderCell
              v-for="col in diaColumns"
              :key="col"
              class="text-center"
            >
              {{ col.replace('dia_', 'Día ').replace('_', ' ') }}
            </CTableHeaderCell>

            <CTableHeaderCell>Total</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          <CTableRow v-for="row in filteredData" :key="row.device_id">
            <CTableDataCell @click="getReportClient(row)">
              {{ row.client_name }}
            </CTableDataCell>
            <CTableDataCell>{{ row.zeusCode }}</CTableDataCell>
            <CTableDataCell>{{ row.zeusName }}</CTableDataCell>

            <CTableDataCell
              v-for="col in diaColumns"
              :key="col"
              class="text-center"
            >
              {{ row[col] }}
            </CTableDataCell>

            <CTableDataCell><b>{{ row.total }}</b></CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    </template>

    <!-- Modal -->
    <ViewLastMonthModal
      
      :showModal="showModal"
      :zeusCode="zeusCode"
      @closeViewModal="closeShowModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'
import ViewLastMonthModal from '../../components/ViewLastMonth.vue'

// store de Vuex
const store = useStore()

// Estados reactivos
const isLoading = ref(false)
const showModal = ref(false)
const selectedEstado = ref(null)
const rawData = ref([])
const filteredData = ref([])
const zeusCode = ref('')

// Opciones de filtro
const estadoOptions = [
  { label: 'Todos', value: null },
  { label: 'En Zeus', value: '2' },
  { label: 'En DGA', value: '3' },
]

// Columnas dinámicas
const diaColumns = [
  'dia_11_oct',
  'dia_12_oct',
  'dia_13_oct',
  'dia_14_oct',
  'dia_15_oct',
  'dia_16_oct',
  'dia_17_oct',
  'dia_18_oct',
  'dia_19_oct',
  'dia_20_oct',
  'dia_21_oct',
  'dia_22_oct',
]

// 🔹 Obtener datos del backend
const fetchData = async (stepValue = selectedEstado.value) => {
  console.log('Filtro seleccionado:', stepValue)
  if (stepValue === 'Todos') stepValue = null

  isLoading.value = true
  try {
    const response = await axios.get(`${store.state.backendUrl}/tasks-resume`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.state.token,
      },
      params: { step: stepValue },
    })

    rawData.value = response.data
    filteredData.value = response.data
  } catch (error) {
    console.error('Error al obtener datos:', error)
  } finally {
    isLoading.value = false
  }
}

// 🔹 Abrir modal al hacer clic en un cliente
const getReportClient = (client) => {
  console.log('Cliente seleccionado:', client)
  zeusCode.value = client.zeusCode || null
  showModal.value = true
}

// 🔹 Cerrar modal
const closeShowModal = () => {
  showModal.value = false
}

// 🔹 Cargar datos al montar el componente
onMounted(() => {
  fetchData()
})
</script>
