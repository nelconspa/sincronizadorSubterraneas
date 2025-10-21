<template>
    <CRow>
        <CCol class="col-3">
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
        <CCol class="col-2">
            <EnabledFilter
                :enabled="enabledFilter"
                @filter="handleEnabled"
            /> 
        </CCol>
        

        <CCol class="col-4">
            <SearchBarFilter 
                @search="handleSearch" 
            /> 
        </CCol>
    </CRow>
    <template v-if="isLoading" >
        <div class="d-flex flex-column align-items-center justify-content-center mt-5">
            <h5 class="text-bold">Cargando datos...</h5>
            <CSpinner color="dark"/>
        </div>
                
    </template>
    <template v-else>
        <CTable class="mt-4">
        <CTableHead>
            <CTableRow color="dark">
                <CTableHeaderCell scope="col">Dispositivo</CTableHeaderCell>
                <CTableHeaderCell scope="col">Zeus</CTableHeaderCell>
                <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ult. Sincronización</CTableHeaderCell>
                <CTableHeaderCell scope="col">Caudal</CTableHeaderCell>
                <CTableHeaderCell scope="col">N. Freatico</CTableHeaderCell>
                <CTableHeaderCell scope="col">Totalizador</CTableHeaderCell>
                <CTableHeaderCell scope="col">Prox. Sincronización</CTableHeaderCell>
                <CTableHeaderCell scope="col">Info</CTableHeaderCell>
               
                
            </CTableRow>
        </CTableHead>
        
            
            
                <CTableBody>
                <CTableRow v-for="(task, index) in filteredTasks" 
                :key="index" 
                :class="{'table-success': task.sync_status.status === 'ok', 
                        'table-danger': task.sync_status.status === 'error'}"
            >
                    <CTableDataCell>{{ task.zeusName }}</CTableDataCell>
                    <CTableDataCell>{{ task.zeusCode }}</CTableDataCell>
                    <CTableDataCell>{{ task.enabled }}</CTableDataCell>
                    
                    <template v-if="task.last_task !== null">
                        <CTableDataCell>{{ task.last_task.taskDate }}</CTableDataCell>
                        <CTableDataCell>{{ task.last_task.caudal }}</CTableDataCell>
                        <CTableDataCell>{{ task.last_task.nivelFreatico }}</CTableDataCell>
                        <CTableDataCell>{{ task.last_task.totalizador }}</CTableDataCell>
                    </template>
    
                    <template v-else>
                        <CTableDataCell>&nbsp;</CTableDataCell>
                        <CTableDataCell>&nbsp;</CTableDataCell>
                        <CTableDataCell>&nbsp;</CTableDataCell>
                        <CTableDataCell>&nbsp;</CTableDataCell>
                    </template>
    
                    <template v-if="task.next_task !== null">
                        <CTableDataCell>{{ task.next_task.taskDate }}</CTableDataCell>
                    </template>
    
                    <template v-else>
                        <CTableDataCell>&nbsp;</CTableDataCell>
                    </template>
                    
                    <CTableDataCell>{{ task.sync_status.message }}</CTableDataCell>
                
                
                
                </CTableRow>
            </CTableBody> 
        
            
            
        
        </CTable>
    </template>
    


    
</template>

<script>
    import axios from 'axios';
    import DatePicker from '../../components/DatePicker.vue'; 
    import ClientFilter from '../../components/ClientFilter.vue'; 
    import DeviceFilter from '../../components/DeviceFilter.vue'; 
    import SearchBarFilter from '../../components/SearchFilter.vue'; 
    import EnabledFilter from '../../components/EnabledFilter.vue';

    export default {
        name: "FailedTasks",
        components: {
            DatePicker,
            ClientFilter,
            DeviceFilter,
            SearchBarFilter,
            EnabledFilter
        },
        data() {
            return {
                statusTasks: [],
                showModal: [],
                searchFilter: '',
                enabledFilter: false,
                clientsFilter: [],
                selectedDevices: [],
                devicesFilter: [],
                totalDevices: [],
                isLoading: false,
            }
            
        },

        computed: {
            filteredTasks() {
                let filterTasks = [...this.statusTasks];
                if (this.clientsFilter.length > 0) {
                    filterTasks = filterTasks.filter(task => 
                        this.clientsFilter.includes(task.client_id)
                    );
                    
                }
                
                if (this.devicesFilter.length > 0 && this.devicesFilter.length < this.totalDevices.length) {
                    filterTasks = filterTasks.filter(task => 
                        (task.next_task && this.devicesFilter.includes(task.next_task.device_id))
                    )
                }
                
                if (this.enabledFilter) {
                    filterTasks = filterTasks.filter(task =>
                        task.enabled === 1
                    );
                }
                if (this.searchFilter !== '') {
                    filterTasks = filterTasks.filter(task => 
                        (task.zeusName && task.zeusName.toLowerCase().includes(this.searchFilter.toLowerCase())) ||
                        (task.client && task.client.name.toLowerCase().includes(this.searchFilter.toLowerCase()))
                    );
                }

                console.log(filterTasks); 
                
                return filterTasks; 
            }

        }, 

        mounted() {
            this.getStatusTasks(); 
        },

        methods: {
            handleEnabled(enabled) {
                this.enabledFilter = enabled; 
                console.log("ENABLED:" , this.enabledFilter); 

            },
            handleSearch(search) {
                this.searchFilter = search; 
            }, 

            handleClients(options) {
                this.clientsFilter = options; 
                this.getDevicesByClients(); 
                
            }, 
            handleDevices(options) {
                /* this.devicesFilter = options; 
                console.log(options); */ 
                //this.getDevicesByClients(); 
                console.log(options); 
                if (!this.selectedDevices.includes(options)) {
                    this.selectedDevices.push(options);
                }
                console.log("DEVICES: ", this.selectedDevices);
            }, 

            async getStatusTasks() {
                this.isLoading = true; 
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/syncStatus',
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    ); 

                    this.statusTasks = response.data;
                    this.isLoading = false;  
                    console.log(this.statusTasks); 
                } catch(error) {
                    console.error("Error al obtener datos: ", error);
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
                        devices = response.data;
                    }
                    this.totalDevices = devices;
                    if (this.selectedDevices.length === 0) {
                        this.devicesFilter = devices;
                    } 
                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.ShowError = true;
                }
            }
        }
    } 
</script>