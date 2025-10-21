<template>
  <div>
    <WidgetsStatsA class="mb-4" />
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardBody>
            <CRow>
              <CCol :sm="5">
                <h4 id="traffic" class="card-title mb-0"></h4>
                <div class="small text-body-secondary">Registros</div>
              </CCol>
              <CCol :sm="7" class="d-none d-md-block">
                <CRow>
                  <CCol>
                    <v-select
                      v-model="year"
                      :options="years"
                      :reduce="year => year.name"
                      label="name"
                      placeholder="Año"
                    ></v-select>
                  </CCol>
                  <CCol>
                    <v-select
                      v-model="month"
                      :options="months"
                      :reduce="month => month.id"
                      label="name"
                      placeholder="Mes"
                    ></v-select>
                  </CCol>
                  <CCol>
                    <v-select
                      v-model="device_id"
                      placeholder="Dispositivo"
                      :options="devices"
                      :reduce="device => device.id"
                      label="zeusName"
                    ></v-select>                    
                  </CCol>
                  <CCol>
                    <CButton
                      color="success"
                      class="text-white"
                      @click="getTasksByDate"
                    >
                      Graficar
                    </CButton>                     
                  </CCol>
                </CRow>
                

                <!-- <CButton color="primary" class="float-end">
                  <CIcon icon="cil-cloud-download" />
                </CButton> -->

                <!-- <CButtonGroup
                  class="float-end me-3"
                  role="group"
                  aria-label="Basic outlined example"
                >
                  
                  <CButton color="secondary" variant="outline">Day</CButton>
                  <CButton color="secondary" variant="outline" active>Month</CButton>
                  <CButton color="secondary" variant="outline">Year</CButton>
                </CButtonGroup> -->

              </CCol>
            </CRow>
            <CRow>
              <MainChart 
                style="height: 300px; max-height: 300px; margin-top: 40px"
                :tasks="tasks"
              />
            </CRow>
          </CCardBody>
          <!-- <CCardFooter>
            <CRow
              :xs="{ cols: 1, gutter: 4 }"
              :sm="{ cols: 2 }"
              :lg="{ cols: 4 }"
              :xl="{ cols: 5 }"
              class="mb-2 text-center"
            >
              <CCol>
                <div class="text-body-secondary">Visits</div>
                <div class="fw-semibold text-truncate">29.703 Users (40%)</div>
                <CProgress class="mt-2" color="success" thin :precision="1" :value="40" />
              </CCol>
              <CCol>
                <div class="text-body-secondary">Unique</div>
                <div class="fw-semibold text-truncate">24.093 Users (20%)</div>
                <CProgress class="mt-2" color="info" thin :precision="1" :value="20" />
              </CCol>
              <CCol>
                <div class="text-body-secondary">Pageviews</div>
                <div class="fw-semibold text-truncate">78.706 Views (60%)</div>
                <CProgress class="mt-2" color="warning" thin :precision="1" :value="60" />
              </CCol>
              <CCol>
                <div class="text-body-secondary">New Users</div>
                <div class="fw-semibold text-truncate">22.123 Users (80%)</div>
                <CProgress class="mt-2" color="danger" thin :precision="1" :value="80" />
              </CCol>
              <CCol class="d-none d-xl-block">
                <div class="text-body-secondary">Bounce Rate</div>
                <div class="fw-semibold text-truncate">Average Rate (40.15%)</div>
                <CProgress class="mt-2" :value="40" thin :precision="1" />
              </CCol>
            </CRow>
          </CCardFooter> -->
        </CCard>
      </CCol>
    </CRow>
    
    <CRow>
      <CCol :md="12">
        
      </CCol>
    </CRow>
  </div>
</template>

<script>

import MainChart from './MainChart'
import WidgetsStatsA from './../widgets/WidgetsStatsTypeA.vue'
import WidgetsStatsD from './../widgets/WidgetsStatsTypeD.vue'
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'; 

export default {
  name: 'Dashboard',
  components: {
    MainChart,
    WidgetsStatsA,
    WidgetsStatsD,
  },
  setup() {
    const store = useStore(); 
    const devices = ref();
    const tasks = ref(); 
    const year = ref(); 
    const month = ref(); 
    const device_id = ref();  
    const years = [
      { id: 1, name: '2022' },
      { id: 2, name: '2023' },
      { id: 3, name: '2024' }
    ];

    const months = [
      { id: 1, name: 'Enero' },
      { id: 2, name: 'Febrero' },
      { id: 3, name: 'Marzo' },
      { id: 4, name: 'Abril' },
      { id: 5, name: 'Mayo' },
      { id: 6, name: 'Junio' },
      { id: 7, name: 'Julio' },
      { id: 8, name: 'Agosto' },
      { id: 9, name: 'Septiembre' },
      { id: 10, name: 'Octubre' },
      { id: 11, name: 'Noviembre' },
      { id: 12, name: 'Diciembre' }
    ];


    onMounted(() => {
      getDevices();
    })
    async function getTasksByDate() {
      try {
            const response = await axios.get(
              store.state.backendUrl + '/tasks',
              {
                params: {
                  device_id: device_id.value,
                  month: month.value,
                  year: year.value 
                },  
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + store.state.token,
                }
              }
            );
                    
            tasks.value = response.data;
            console.log(tasks.value);
            
            } catch (error) {
                console.error('Error en la solicitud a la API:', error);         
            } 
    }
    async function getDevices() {
        try {
            const response = await axios.get(
              store.state.backendUrl + '/devices',
              {
                params: {
                  'client': 1
                },  
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + store.state.token,
                }
              }
            );
                    
            devices.value = response.data;
            console.log(devices.value);
            
            } catch (error) {
                console.error('Error en la solicitud a la API:', error);         
            }
      }
    

    return {
      months,
      years,
      devices,
      tasks,
      device_id,
      month,
      year,
      getTasksByDate
      
    }
  },
}
</script>
