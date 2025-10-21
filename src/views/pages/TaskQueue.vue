<template>
    <CRow>
        <CCol class="col-3">
            <label class="form-label">Fecha</label>
            <DatePicker
                v-model="dateRange"
                placeholder="Escoja un rango de fechas"
                @update:model-value="handleDate"
                range

            /> 
        </CCol>
        
        <CCol class="col-4">
            <ClientFilter 
                @filter="handleClients"
                
            /> 
        </CCol>
        <CCol class="col-3">
            <DeviceFilter 
                :allDevices="devicesFilter"
                @filter="handleDevices"
            /> 
        </CCol>
        <CCol class="mt-4 col-2">
            <CRow>
                <CCol>
                    <CButton color="primary" @click="getQueueTasks" class="mt-2">
                        Buscar
                    </CButton>
                </CCol>
                <CCol>
                    <template v-if="isLoading">
                        <div class="">
                            <CSpinner color="dark" class="mt-2" />
                        </div>
                    </template>
                    
                </CCol>
            </CRow>
            
        </CCol>
        
    </CRow>

    <CTable class="mt-5">
        <CTableHead>
            <CTableRow color="dark">
                <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                <CTableHeaderCell scope="col">Cliente</CTableHeaderCell>
                <CTableHeaderCell scope="col">Fecha</CTableHeaderCell>
                <CTableHeaderCell scope="col">Hora</CTableHeaderCell>
                <CTableHeaderCell scope="col">Dispositivo</CTableHeaderCell>
                <CTableHeaderCell scope="col">Nivel Freatico</CTableHeaderCell>
                <CTableHeaderCell scope="col">Caudal</CTableHeaderCell>
                <CTableHeaderCell scope="col">Totalizador</CTableHeaderCell>
                <CTableHeaderCell scope="col">Fecha Medición</CTableHeaderCell>
                <CTableHeaderCell scope="col">Comprobante DGA</CTableHeaderCell>
                <!--  <CTableHeaderCell scope="col">Sincronizado el</CTableHeaderCell>-->
            </CTableRow>
        </CTableHead>
        <CTableBody>
            <CTableRow v-for="(task, index) in tasksQueue.data" :key="task.id">
                <CTableDataCell>{{ getStepName(task.step) }} </CTableDataCell>
                <template v-if="task.client && task.client.name">
                    <CTableDataCell>{{ task.client.name }} </CTableDataCell>
                </template>
                
                <CTableDataCell>{{ task.taskDate }} </CTableDataCell>
                <CTableDataCell>{{ task.taskHour }} </CTableDataCell>
                <CTableDataCell>{{ task.device.zeusName }} </CTableDataCell>
                <CTableDataCell>{{ task.device.channelNivelFreatico }} </CTableDataCell>
                <CTableDataCell>{{ task.device.channelCaudal }} </CTableDataCell>
                <CTableDataCell>{{ task.device.channelTotalizador }} </CTableDataCell>
                <CTableDataCell>{{ task.zeusDate }} </CTableDataCell>
                <template v-if="task.dgaNumeroComprobante !== null">
                    <CTableDataCell>{{ task.dgaNumeroComprobante }} </CTableDataCell>
                </template>
                <template v-else>
                    <CTableDataCell></CTableDataCell>
                </template>
                
                <!-- <CTableDataCell>{{  }} </CTableDataCell> -->
            </CTableRow>
        </CTableBody>
    </CTable>

    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
            <li class="page-item" v-bind:class="{'disabled': currentPage === 1}" @click="prevPage">
                <a class="page-link" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li v-for="page in paginatedPages" :key="page" :class="['page-item', { active: page === currentPage, disabled: page === '...' }]" @click="page !== '...' && getQueueTasks(page)">
            <a class="page-link">{{ page }}</a>
        </li>
            <li class="page-item" @click="nextPage" v-bind:class="{'disabled': currentPage === totalPages}">
                <a class="page-link" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav> 
</template>

<script>
    import axios from 'axios';
    import DatePicker from '../../components/DatePicker.vue'; 
    import ClientFilter from '../../components/ClientFilter.vue';
    import DeviceFilter from '../../components/DeviceFilter.vue'; 

    export default {
        name: 'TaskQueue',
        components: {
            DatePicker,
            ClientFilter,
            DeviceFilter
        },
        data() {
            return {
                tasksQueue: [],
                clientSelected: '',
                clients: [],
                devices: [],
                clientsFilter: [],
                devicesFilter: [],
                dateRange: [null, null],
                formatDates: [null, null],
                currentPage: 1,
                totalPages: 1,
                sortBy: 'id',
                descending: false,
                rowsPerPage: 10,
                pageRange: 2,
                isLoading: false,
            }
        },

        mounted() {
            const today = new Date();
            this.dateRange = [today, today];
            //this.getClients();
            //this.getDevices(); 
        }, 
        computed: {
            paginatedPages() {
                const pages = [];
                const total = this.totalPages;
                const current = this.currentPage;
                const range = this.pageRange;
                
                if (total <= 1) return [1]; // No hay paginación si solo hay una página

                // Añadir siempre la primera página
                pages.push(1);

                // Mostrar páginas alrededor de la página actual
                let start = Math.max(2, current - range);
                let end = Math.min(total - 1, current + range);

                if (start > 2) {
                    pages.push('...');
                }

                for (let i = start; i <= end; i++) {
                    pages.push(i);
                }

                if (end < total - 1) {
                    pages.push('...');
                }

                // Añadir siempre la última página
                if (total > 1) {
                    pages.push(total);
                }

                return pages;
            },
        },
        methods: {
            prevPage() {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.getQueueTasks(this.currentPage);
                }
            },
            nextPage() {
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                    this.getQueueTasks(this.currentPage);
                }
            },
            getStepName(step) {
                let name; 
                switch(step) {
                    case 1:
                        name = 'En cola zeus';
                        break; 
                    case 2: 
                        name = 'En cola DGA';
                        break; 
                    case 3:
                        name = 'Finalizado';
                        break; 
                    default: 
                        name = '';
                }

                return name; 
            },

            handleDate(modelData) {
                this.dateRange = modelData.map(date => {
                    if (date instanceof Date) {
                        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                    }
                    return date;
                });
                console.log("RANGE DATA: ",this.dateRange); 
            },
           
           
            async getQueueTasks(page = 1) {
                let date1, date2; 
                date1 = this.dateRange[0]; 
                date2 = this.dateRange[1]; 
                this.devices = this.devicesFilter.map(device => device.id); 
                this.isLoading = true; 
                console.log(this.isLoading); 
                try {
                    let params = {
                        clients: this.clientsFilter,
                        devices: this.devices,
                        date1: date1,
                        date2: date2,
                        page: page,
                        rowsPerPage: this.rowsPerPage,
                    }
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/tasks',
                        {
                            params,
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    );
                    
                    this.tasksQueue = response.data;
                    this.isLoading = false; 
                    console.log(this.tasksQueue); 

                    this.currentPage = response.data.current_page;
                    this.totalPages = response.data.last_page; 

                } catch (error) {
                    this.isLoading = false; 
                    console.error('Error en la solicitud a la API:', error);
                    this.ShowError = true;
                        
                        // this.errorMsg = "Ha ocurrido un error: " + error;
                }
            },
            handleClients(options) {
                this.clientsFilter = options; 
                this.getDevicesByClients(); 
                
            }, 
            handleDevices(options) {
                this.devicesFilter = options; 
                console.log("Devices: ",this.devicesFilter); 
                this.getDevicesByClients(); 
            }, 

            async getDevices() {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/devices',
                        {
                            client: true,
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    );
                    
                    this.devices = response.data;
                    console.log(this.devices)

                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.ShowError = true;
                        
                        // this.errorMsg = "Ha ocurrido un error: " + error;
                }
            },
            async getDevicesByClients() { 
                try {
                    let devices = []; 
                    for (const client_id of this.clientsFilter) {
                        const response = await axios.get(
                            this.$store.state.backendUrl + "/devices",
                            {
                                params: {
                                    'client_id': client_id,
                                    'clientConfig': true
                                },
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: "Bearer " + this.$store.state.token,
                                },
                            }
                        )
                        devices = devices.concat(response.data); 
                    }

                    this.devicesFilter = devices; 
                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.ShowError = true;
                }
            }
        }
    
    }
</script>