<template>
    <CModal v-model:visible="isVisible" @close="closeModal" size="xl" scrollable> 
        <CModalHeader> 
            <CModalTitle>Reporte últimos 30 días</CModalTitle> 
        </CModalHeader> 
        <CModalBody> 
            <h5 class="mb-3">Reporte últimos 30 días</h5>

    <CTable bordered striped hover responsive>
      <CTableHead color="dark">
        <CTableRow>
          <CTableHeaderCell>ID Tarea</CTableHeaderCell>
          <CTableHeaderCell>Nombre</CTableHeaderCell>
          <CTableHeaderCell>Código Zeus</CTableHeaderCell>
          <CTableHeaderCell>Nombre Zeus</CTableHeaderCell>
          <CTableHeaderCell>Código DGA</CTableHeaderCell>
          <CTableHeaderCell>Fecha</CTableHeaderCell>
          <CTableHeaderCell>Hora</CTableHeaderCell>
          <CTableHeaderCell>Nivel Freático</CTableHeaderCell>
          <CTableHeaderCell>Caudal</CTableHeaderCell>
          <CTableHeaderCell>Totalizador</CTableHeaderCell>
          <CTableHeaderCell>Altura Limnimétrica</CTableHeaderCell>
          <CTableHeaderCell>Respuesta Zeus</CTableHeaderCell>
          <CTableHeaderCell>N° Comprobante</CTableHeaderCell>
          <CTableHeaderCell>Estado</CTableHeaderCell>
        </CTableRow>
      </CTableHead>

      <CTableBody>
        <CTableRow>
          <CTableDataCell>5115353</CTableDataCell>
          <CTableDataCell>RIEGO CHILE VH</CTableDataCell>
          <CTableDataCell>0UFH79OT</CTableDataCell>
          <CTableDataCell>VIVEROS HORCONES</CTableDataCell>
          <CTableDataCell>OB-0804-84</CTableDataCell>
          <CTableDataCell>2025-10-23</CTableDataCell>
          <CTableDataCell>23</CTableDataCell>
          <CTableDataCell>—</CTableDataCell>
          <CTableDataCell>—</CTableDataCell>
          <CTableDataCell>—</CTableDataCell>
          <CTableDataCell>—</CTableDataCell>
          <CTableDataCell>—</CTableDataCell>
          <CTableDataCell>—</CTableDataCell>
          <CTableDataCell>
            <CBadge color="warning">En Proceso</CBadge>
          </CTableDataCell>
        </CTableRow>

        <CTableRow>
          <CTableDataCell>5115354</CTableDataCell>
          <CTableDataCell>RIEGO SUR</CTableDataCell>
          <CTableDataCell>9GHJ21KL</CTableDataCell>
          <CTableDataCell>AGROTECH SPA</CTableDataCell>
          <CTableDataCell>OB-0402-11</CTableDataCell>
          <CTableDataCell>2025-10-23</CTableDataCell>
          <CTableDataCell>11</CTableDataCell>
          <CTableDataCell>4.3</CTableDataCell>
          <CTableDataCell>1.2</CTableDataCell>
          <CTableDataCell>12.5</CTableDataCell>
          <CTableDataCell>0.5</CTableDataCell>
          <CTableDataCell>OK</CTableDataCell>
          <CTableDataCell>123456</CTableDataCell>
          <CTableDataCell>
            <CBadge color="success">Completado</CBadge>
          </CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
        </CModalBody> 
        <CModalFooter> 
            <CButton color="secondary" @click="closeModal"> 
                Cerrar 
            </CButton> 
            <CButton color="primary" @click="getReportLastMonth">
                Guardar
            </CButton> 
        </CModalFooter> 
    </CModal> 
</template>

<script>
import axios from 'axios'
import { ref, onMounted, defineEmits, defineProps, watch } from 'vue'
import { useStore } from 'vuex';

export default {
  name: 'ViewLastMonth',
  props: {
    showModal: Boolean,
    zeusCode: String,
  },
  emits: ['closeViewModal'],
  setup(props, { emit }) {
    const success = ref(false)
    const fail = ref(false)
    const successMsg = ref('')
    const failMsg = ref('')
    const store = useStore();
    const isVisible = ref(false); 

    watch(() => props.showModal, (newVal) => {
        console.log("Prop showModal changed to: ", newVal);
        isVisible.value = newVal;
    }, { immediate: true}); 



    const getReportLastMonth = async (zeusCode) => {
      console.log('Zeus Code:', zeusCode)
      try {
        const response = await axios.get(
          `${store.state.backendUrl}/report-tasks`,
          {
            params: { zeusCode: zeusCode },
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + store.state.token,
            },
          }
        )

        console.log(response)
        successMsg.value = 'Reporte creado exitosamente.'
        success.value = true

        setTimeout(() => {
          closeModal()
        }, 2000)
      } catch (error) {
        console.error(error)
        fail.value = true
        failMsg.value = 'Error al generar el reporte'
      }
    }

    const restoreInitialData = () => {
      fail.value = false
      success.value = false
      failMsg.value = ''
      successMsg.value = ''
    }

    const closeModal = () => {
      restoreInitialData()
      emit('closeViewModal');
      isVisible.value = false; 
    }

    // Solo ejecutar si llega un zeusCode válido
    onMounted(() => {
    console.log("show modal ", props.showModal)
      if (props.zeusCode) {
        getReportLastMonth(props.zeusCode)
      }
    })

    return {
      success,
      fail,
      successMsg,
      failMsg,
      getReportLastMonth,
      closeModal,
      isVisible
    }
  },
}


</script>
