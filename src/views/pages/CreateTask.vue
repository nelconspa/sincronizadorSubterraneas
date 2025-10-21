<template>
    <CRow>
        <CCol>
            <ClientFilter 
                @filter="handleClients"
                
            /> 
        </CCol>
        <CCol>
            <DeviceFilter 
                :allDevices="totalDevices"
                @filter="handleDevices"
                
            />
        </CCol>

    </CRow>

    <div v-show="isSelected">
        <CCard class="mt-5"
        >
            <CCardBody class="mt-4">
                <CRow>
                    <CCol class="col-6">
                        <VDatePicker v-model="date" expanded v-model.range="range" mode="date" />
                    </CCol>
                    <CCol class="col-6">
                        <CRow class="px-5">
                            <CCol class="col-4" v-for="hour in hours" :key="hour">
                                <CFormCheck 
                                    :label="hour" 
                                    v-model="selectedHours[hour]"
                                    @change="handleHourChange(hour)" 
                                />
                            </CCol>
                        </CRow>
                        
                    </CCol>
                </CRow>

                <div class="d-grid gap-2 col-6 mx-auto mt-3" >
                    <CButton 
                        color="primary" 
                        shape="rounded-pill"
                        @click="createTask"
                        :class="{'disabled': isButtonDisabled}"
                    >
                        Agregar tareas a la cola
                    </CButton>
                </div>
                
            </CCardBody>
        </CCard>
    </div>
    
    <template v-if="isCompleted">
        <CToaster placement="top-end">
            <CToast visible :color="toast.color" class="text-white" :delay="toast.delay">
                <CToastHeader closeButton :class="toast.error ? 'bg-danger text-white' : 'bg-success text-white'">
                <span class="me-auto fw-bold">{{ toast.title }}</span>
                </CToastHeader>
                <CToastBody>
                    {{ toast.content }}
                </CToastBody>  
            </CToast>
        </CToaster>
        
        
    </template>
    
    
</template>

<script>
    import axios from 'axios';
    import DatePicker from '../../components/DatePicker.vue'; 
    import ClientFilter from '../../components/ClientFilter.vue';
    import DeviceFilter from '../../components/DeviceFilter.vue';

    export default {
        name: 'CreateTask',
        components: {
            DatePicker,
            ClientFilter,
            DeviceFilter
        },
        data() {
            return {
                clientSelected: '',
                date: '',
                clientsFilter: [],
                devicesFilter: [],
                selectedDevices: [],
                totalDevices: [],
                hours: ['00:00','01:00','02:00','03:00','04:00',
                        '05:00','06:00','07:00','08:00',
                        '09:00','10:00','11:00','12:00','13:00',
                        '14:00','15:00','16:00','17:00','18:00',
                        '19:00','20:00','21:00','22:00','23:00','24:00', 'Seleccionar todo'],
                selectedHours: {},
                isSelected: false,
                isCompleted: false,
                toast: {},

            }
        },

        mounted() {
            this.hours.forEach(hour => {
                this.selectedHours[hour] = false;
            });
        }, 

        computed: {
            isButtonDisabled() {
                console.log(this.selectedDevices);
                console.log(this.date); 
                const anyHourSelected = Object.values(this.selectedHours).some(selected => selected); 
                return !this.selectedDevices.length || !this.date || !anyHourSelected; 
            }
        },

        methods: {
            handleHourChange(hour) {
                if (hour === 'Seleccionar todo') {
                    const selectAll = !this.selectedHours[hour];
                    Object.keys(this.selectedHours).forEach(hour => { 
                        this.selectedHours[hour] = selectAll; 
                    });
                } else {
                    this.selectedHours[hour] = !this.selectedHours[hour];
                    
                    // Si se deselecciona cualquier hora y "Seleccionar todo" está marcado, desmarcar "Seleccionar todo"
                    if (!this.selectedHours[hour] && this.selectedHours['Seleccionar todo']) {
                        this.selectedHours['Seleccionar todo'] = false;
                    }
                };
            },
            handleClients(options) {
                this.clientsFilter = options; 
                this.getDevicesByClients(); 
            }, 
            handleDevices(options) {
                /* this.devicesFilter = options;
                console.log("HANDLE DEVICES: ",this.devicesFilter); 
                this.isSelected = true;
                this.getDevicesByClients(); */
                console.log('options: ',options)
                if (!this.selectedDevices.includes(options)) {
                    this.selectedDevices.push(options);
                }
                console.log('selectedDEVICES:',this.selectedDevices); 
                this.isSelected = true; 
                
            }, 

            convertFormatHour() {
                //console.log("array de horas: ", this.selectedHours); 
                let hoursObj = this.selectedHours; 
                let hoursArray = []
                for (const hour in hoursObj) {
                    
                    if (hoursObj[hour] && hour != 'Seleccionar todo') {
                        let hourFormat = parseInt(hour.slice(0,2)); 
                        hoursArray.push(hourFormat); 
                    }  
                }

                return hoursArray; 
            }, 

            async createTask() {
                this.toast = {}; 
                let devicesLength = this.selectedDevices.length; 
                const dateArray = [this.date.start, this.date.end]; 
                let hours = this.convertFormatHour(); 

                let params = {
                    devices: this.selectedDevices[devicesLength - 1],
                    dates: dateArray,
                    hours: hours
                } 
                

                

                try {
                    const response = await axios.post(
                        this.$store.state.backendUrl + '/tasks-create',
                        params,
                        {
                            headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + this.$store.state.token,
                                },
                        }
                    );
                    
                    this.tasks = response.data;
                    
                    this.isCompleted = true; 
                    this.toast = {
                        error: false,
                        title: 'Tarea creada',
                        content: 'Tarea creada con éxito',
                        color: 'success',
                        delay: 2000
                    }; 

                } catch (error) {
                    this.isCompleted = true; 
                    
                    this.toast = {
                        error: true, 
                        title: 'Error',
                        content: `Error al crear tarea`,
                        color: 'danger',
                        delay: 2000
                    }; 
                    console.error('Error en la solicitud a la API:', error);
                    this.ShowError = true;
                        
                        // this.errorMsg = "Ha ocurrido un error: " + error;
                }

                


            },
            async getClients() {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/clients',

                        {
                            headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + this.$store.state.token,
                                },
                        }
                    );
                    
                    this.clients = response.data;
                    console.log("Clientes: ",this.clients)
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
                        devices = devices.concat(response.data.map(config => ({
                            ...config,
                            host: config.client_config.zeusHost
                        }))); 
                    }
                    this.totalDevices = devices; 
                    //this.devicesFilter = devices;
                    console.log("total Devices: ", this.totalDevices); 
                    console.log("DISPOSITIVOS EN GETDEVICES: ", this.selectedDevices); 
                    if (this.selectedDevices.length === 0) {
                        this.devicesFilter = devices;
                    }

                    
                } catch (error) {
                    
                    console.error('Error en la solicitud a la API:', error);
                    this.ShowError = true;
                }
            },

            async getDevices() {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/devices',
                        {
                            params: {
                                'client_id': 1,
                                'client': 1
                            },  
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
            }
        }
    
    }
</script>