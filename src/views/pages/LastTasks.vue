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

            <CTableHeaderCell v-for="col in diaColumns" :key="col" class="text-center">
              {{ col.replace('dia_', 'Día ').replace('_', ' ') }}
            </CTableHeaderCell>

            <CTableHeaderCell>Total</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          <CTableRow v-for="row in filteredData" :key="row.device_id">
            <CTableDataCell @click="getReportClient(row)">{{ row.client_name }}</CTableDataCell>
            <CTableDataCell>{{ row.zeusCode }}</CTableDataCell>
            <CTableDataCell>{{ row.zeusName }}</CTableDataCell>

            <CTableDataCell v-for="col in diaColumns" :key="col" class="text-center">
              {{ row[col] }}
            </CTableDataCell>

            <CTableDataCell><b>{{ row.total }}</b></CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>


      <ViewLastMonthModal
        :showModal="showModal"
        :zeusCode="zeusCode"
        @closeViewModal="closeShowModal"
      />
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import ViewLastMonthModal from '../../components/ViewLastMonth.vue';

export default {
  name: 'DeviceStatus',

  components: {
    ViewLastMonthModal,
  },
  data() {
    return {
      isLoading: false,
      showModal: false,
      selectedEstado: null,
      estadoOptions: [
        { label: 'Todos', value: null },
        { label: 'En Zeus', value: '2' },
        { label: 'En DGA', value: '3' },
      ],
      rawData: [],
      filteredData: [],
      diaColumns: [
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
      ],
      zeusCode: '',
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData(stepValue = this.selectedEstado) {
      console.log(stepValue);
      if (stepValue === 'Todos') stepValue = null;
        this.isLoading = true
        try {
          const response = await axios.get(
            this.$store.state.backendUrl + '/tasks-resume',
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.$store.state.token,
              },
              params: {
                step: stepValue
              },
            }
          )

          this.rawData = response.data
          console.log(this.rawData)
          this.filteredData = this.rawData    
          this.isLoading = false
        } catch (error) {
          console.error('Error al obtener datos:', error)
          this.isLoading = false
        }
    },

    async getReportClient(client) {
      this.showModal = true;
      this.zeusCode = client.zeusCode ? client.zeusCode : null; 
    },

    closeShowModal () {
      this.showModal = false; 
    }
  },
}
</script>
