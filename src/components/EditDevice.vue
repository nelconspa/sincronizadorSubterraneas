<template>
    <CModal size="lg" :visible="showModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>Editar dispositivo</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CAlert color="success"
                :visible="success">
                {{ successMsg }}
            </CAlert>
            <CAlert color="danger"
                :visible="fail">
                {{ failMsg }}
            </CAlert>
            <CForm>
                <CRow>
                    <CCol class="col-12">
                        <CFormCheck 
                            label="Habilitado" 
                            class="mr-5"
                            v-model="form.enabled"
                        />
                    </CCol>
                    <CCol class="col-12 mt-4">
                        <v-select
                            v-model="form.client_id"
                            :options="clients"
                            :reduce="client => client.id"
                            label="name"
                            placeholder="Seleccione..."
                            @option:selected="getUserConfig"
                            @input="setTouched('client_id')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.client_id.$error"
                            
                        />
                            
                    </CCol>
                    <CCol class="col-6 mt-4">
                        <v-select 
                            v-model="form.client_config_id"
                            :options="configs"
                            :reduce="config => config.id"
                            placeholder="Seleccione..."
                            label="dgaUsername" 
                            @input="setTouched('client_config_id')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.client_config_id.$error"
                        />
                    </CCol>
                    <CCol class="col-6 mt-4">
                        <v-select 
                            v-model="form.schedule_id"
                            :options="schedules"
                            :reduce="schedule => schedule.id"
                            label="name"
                            placeholder="Seleccione..."
                            @input="setTouched('schedule_id')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.schedule_id.$error"
                        />
                    </CCol>
                    <CCol class="col-12 mt-4">
                        <CFormInput
                            label="Nombre"
                            type="text"
                            placeholder="Nombre"
                            aria-describedby="nombre"
                            v-model="form.zeusName"
                            @input="setTouched('zeusName')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.zeusName.$error"
                        />
                    </CCol>
                    <CCol class="col-6 mt-4">
                        <CFormInput
                            label="Zeus Código"
                            type="text"
                            placeholder="Zeus código"
                            aria-describedby="Zeus código"
                            v-model="form.zeusCode"
                            @input="setTouched('zeusCode')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.zeusCode.$error"
                            
                        />
                    </CCol>
                    <CCol class="col-6 mt-4">
                        <CFormInput
                            label="DGA Código"
                            type="text"
                            placeholder="DGA código"
                            aria-describedby="DGA código"
                            v-model="form.dgaCode"
                            @input="setTouched('dgaCode')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.dgaCode.$error"
                        />
                    </CCol>
                    <CCol class="col-4 mt-4">
                        <CFormInput
                            label="Canal: Nivel Freático"
                            type="text"
                            placeholder="Canal: Nivel Freático"
                            aria-describedby="Nivel Freático"
                            v-model="form.channelNivelFreatico"
                            
                        />
                    </CCol>
                    <CCol class="col-4 mt-4">
                        <CFormInput
                            label="Canal: Caudal"
                            type="text"
                            placeholder="Canal: Caudal"
                            aria-describedby="Caudal"
                            v-model="form.channelCaudal"
                            @input="setTouched('channelCaudal')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.channelCaudal.$error"
                            
                        />
                    </CCol>
                    <CCol class="col-4 mt-4">
                        <CFormInput
                            label="Canal: Totalizador"
                            type="text"
                            placeholder="Canal: Totalizador"
                            aria-describedby="Totalizador"
                            v-model="form.channelTotalizador"
                            @input="setTouched('channelTotalizador')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.channelTotalizador.$error"
                        />
                    </CCol>
                    <CCol class="col-4 mt-4">
                        <CFormInput
                            label="Canal: Altura Limnimétrica"
                            type="text"
                            placeholder="Canal: Altura limnimétrica"
                            aria-describedby="limnimetrica"
                            v-model="form.channelAlturaLimnimetrica"
                            @input="setTouched('channelAlturaLimnimetrica')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.channelAlturaLimnimetrica.$error"
                        />
                    </CCol>
                </CRow>
                
            </CForm>
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" @click="closeModal">
                Cerrar
            </CButton>
            <CButton color="primary" @click="saveDevice">Guardar</CButton>
        </CModalFooter>
    </CModal>
</template>

<script>
    import axios from 'axios';
    import useVuelidate from '@vuelidate/core';
    import { required, integer, minValue } from '@vuelidate/validators';
    export default {
        name: 'AddConfig',
        props: {
            showModal: Boolean,
            device: Object,
        },
        setup() {
            return { v$: useVuelidate() }
        },
        data() {
            return {
                form: {
                    id: '',
                    enabled: false,
                    client_id: '',
                    client_config_id: '',
                    zeusCode: '',
                    zeusName: '',
                    dgaCode: '',
                    channelNivelFreatico: '',
                    channelCaudal: '',
                    channelTotalizador: '',
                    channelAlturaLimnimetrica:'',
                    
                },
                schedules: [],
                configs: [],
                configsByClient: [],
                clients: [],
                successMsg: '', 
                success: false,
                fail: false,
                failMsg: '',
                
            }
        },
        validations() {
            return {
                form: {
                    client_id:{
                        required
                    },
                    client_config_id: {
                        required
                    },
                    schedule_id: {
                        required
                    },
                    zeusName: {
                        required
                    },
                    zeusCode: {
                        required
                    },
                    dgaCode: {
                        required
                    },
                    channelCaudal: {
                        required
                    },
                    channelAlturaLimnimetrica: {
                        integer
                    },
                    channelTotalizador: {
                        integer
                    }
                    
                    
                }
            }
        },

        watch: {
            device: {
                handler(newConfig) {
                    this.setDataDevice(newConfig);
                },
                deep: true,
                immediate: true // Esto llama a setDataConfig() inmediatamente después de montar el componente
            },
            showModal(newValue) {
                // Si la modal se cierra, restablecer el valor de showModal
                if (!newValue) {
                    this.$emit('update:showModal', false);
                }
            }
        },

        mounted() {
            this.getUsersConfig();
            this.getSchedules(); 
            this.getClients();
        },

        methods: {
            setTouched(theModel) { 
                if(theModel == 'client_id' || theModel == 'all' )
                {this.v$.form.client_id.$touch()}

                if(theModel == 'client_config_id' || theModel == 'all'){
                    this.v$.form.client_config_id.$touch()
                } 
                if(theModel == 'schedule_id' || theModel == 'all' )
                {
                    this.v$.form.schedule_id.$touch()
                }

                if(theModel == 'zeusName' || theModel == 'all' )
                {
                    this.v$.form.zeusName.$touch()
                }
                if(theModel == 'zeusCode' || theModel == 'all' )
                {
                    this.v$.form.zeusCode.$touch()
                }
                
                if(theModel == 'dgaCode' || theModel == 'all')
                {
                    this.v$.form.dgaCode.$touch()
                }

                if(theModel == 'channelCaudal' || theModel == 'all')
                {
                    this.v$.form.channelCaudal.$touch()
                }

                if(theModel == 'channelAlturaLimnimetrica' || theModel == 'all')
                {
                    this.v$.form.channelAlturaLimnimetrica.$touch()
                }

                if(theModel == 'channelTotalizador' || theModel == 'all')
                {
                    this.v$.form.channelTotalizador.$touch()
                }
                
               
            },

            getUserConfig(option) {
                axios.get(
                    this.$store.state.backendUrl + '/client_configs',
                    {
                        params: {
                            'client_id': option 
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + this.$store.state.token,
                        }
                    }
                )
                .then(response => {
                    // Procesa la respuesta aquí
                    this.configs = response.data;
                    console.log("configs: ", this.configs);
                    
                })
                .catch(error => {
                    console.error('Error en la solicitud a la API:', error);
                    this.ShowError = true;
                    // this.errorMsg = "Ha ocurrido un error: " + error;
                });
            },
            restoreInitialData() {
                this.fail = false;
                this.success = false; 
                this.failMsg = ''; 
                this.successMsg = '';
            },
            closeModal() {
                this.restoreInitialData();
                this.$emit('cerrar'); 
                
            },

            closeModalOutside(event) {
                if (event.target === event.currentTarget) {
                    this.closeModal();
                }
            },
            setDataDevice(newConfig) {
                if (newConfig) {
                    this.form.id = newConfig.id; 
                    this.form.client_id = newConfig.client_id;
                    this.form.schedule_id = newConfig.schedule_id; 
                    this.form.client_config_id = newConfig.client_config_id; 
                    this.form.name = newConfig.name;
                    this.form.zeusCode = newConfig.zeusCode;
                    this.form.zeusName = newConfig.zeusName;
                    this.form.dgaCode = newConfig.dgaCode;
                    this.form.channelNivelFreatico = newConfig.channelNivelFreatico;
                    this.form.channelCaudal = newConfig.channelCaudal; 
                    this.form.channelTotalizador = newConfig.channelTotalizador; 
                    this.form.channelAlturaLimnimetrica = newConfig.channelAlturaLimnimetrica; 
                    this.form.enabled = newConfig.enabled;  

                    this.getConfigByClient(this.form.client_id); 
                } 
            },

            async getSchedules() {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/schedules',
                        {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + this.$store.state.token,
                        }
                        }
                    );
                    
                    this.schedules = response.data;
                    console.log(this.schedules[0]); 

                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.ShowError = true;
                    // this.errorMsg = "Ha ocurrido un error: " + error;
                }
            }, 

            async getUsersConfig() {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/client_configs',
                        {
                        params: {
                            'client': 1
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + this.$store.state.token,
                        }
                        }
                    );
                    
                    this.configs = response.data.map(config => ({
                        ...config,
                        clientName: config.client?.name ?? ''
                    }));
                    console.log(this.configs[0])

                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.ShowError = true;
                    // this.errorMsg = "Ha ocurrido un error: " + error;
                }
            }, 

            async getConfigByClient(client_id) {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/client_configs',
                        {
                        params: {
                            'client': 1,
                            'client_id': client_id
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + this.$store.state.token,
                        }
                        }
                    );
                    
                    this.configsByClient = response.data;
                    console.log(this.configsByClient)
                    

                } catch (error) {
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
                        }
                        }
                    );
                    
                    this.clients = response.data;
                    

                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.ShowError = true;
                    // this.errorMsg = "Ha ocurrido un error: " + error;
                }
            }, 


            async saveDevice() {
                this.setTouched('all');
                if(!this.v$.$invalid) {
                    try {
                        const response = await axios.put(
                            this.$store.state.backendUrl + '/devices/' + this.form.id,
                            this.form,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + this.$store.state.token,
                                }
                            }
                        )
                        console.log(response); 
                        this.successMsg = 'Dispositivo actualizado exitósamente.'; 
                        this.success = true; 
                        setTimeout(() => {
                            this.closeModal(); 
                        }, 2000);

                    } catch (error) {
                        console.log("Error: ",error.response.data.messages);
                        if (error.response) {
                            const errors = error.response.data.messages; 
                            for (const key in errors) {
                                const errMsg = errors[key];
                                this.failMsg = this.failMsg.concat(errMsg, "\n");  
                                this.fail = true; 
                                console.log(this.failMsg);

                                setTimeout(() => {
                                    this.restoreInitialData();
                                    //    this.closeModal(); 
                                }, 2000);
                                    
                            }
                        }
                    }
                
                    
                    
                }
                
            }
        }

    }
    
</script>