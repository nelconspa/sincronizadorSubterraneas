<template>
    <CModal size="lg" class="modal-class" :visible="showModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>Agregar nuevo dispositivo</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CAlert color="success"
                :visible="success">
                {{ successMsg }}
            </CAlert>
            <CAlert color="danger"
                :visible="fail"
                v-html="failMsg">
            </CAlert>
            <CForm>
                <CRow>
                    <CCol class="col-12">
                        <CFormCheck
                            v-model="form.enabled" 
                            label="Habilitado" 
                            class="mr-5" 
                            
                        />
                    </CCol>
                    <CCol class="col-12 mt-4">
                        <label class="mb-2">Seleccionar cliente</label>
                        <v-select
                            v-model="form.client_id"
                            :options="clients"
                            :reduce="client => client.id"
                            @option:selected="getUserConfig"
                            placeholder="Seleccione..."
                            label="name"
                            @input="setTouched('client_id')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.client_id.$error"
                            searchable


                        >
                        </v-select>
                    </CCol>
                    <CCol class="col-6 mt-4">
                        <label class="mb-2">Seleccionar configuración</label>
                        <v-select
                            v-model="form.client_config_id"
                            :options="configs"
                            :reduce="config => config.id"
                            placeholder="Seleccione..."
                            label="dgaUsername"
                            @option:selected="getCodesConfig"
                            @input="setTouched('client_config_id')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.client_config_id.$error"
                        />
                    </CCol>
                    <CCol class="col-6 mt-4">
                        <label class="mb-2">Seleccionar periodicidad </label>
                        <v-select 
                            v-model="form.schedule_id" 
                            :options="schedules"
                            :reduce="schedule => schedule.id"
                            :searchable="true"
                            label="name"
                            placeholder="Seleccione"
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
                            type="number"
                            placeholder="Canal: Nivel Freático"
                            aria-describedby="Nivel Freático"
                            v-model="form.channelNivelFreatico"
                        />
                    </CCol>
                    <CCol class="col-4 mt-4">
                        <CFormInput
                            label="Canal: Caudal"
                            type="number"
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
                            type="number"
                            placeholder="Canal: Totalizador"
                            aria-describedby="Totalizador"
                            v-model="form.channelTotalizador"
                            @input="setTouched('channelTotalizador')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.channelTotalizador.$error"
                        />
                    </CCol>
                    
                    <CCol class="col-6 mt-4">
                        <CFormInput
                            label="Canal: Altura Limnimétrica"
                            type="number"
                            placeholder="Canal: Altura limnimétrica"
                            aria-describedby="Altura Limnimétrica"
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
        setup() {
            return { v$: useVuelidate() }
        },
        props: {
            showModal: Boolean,
        },
        data() {
            return {
                form: {
                    enabled: false,
                    client_id: null,
                    client_config_id: null,
                    schedule_id: null,
                    zeusName: '',
                    zeusCode: '',
                    channelNivelFreatico: 0,
                    channelCaudal: 0,
                    channelTotalizador: 0,
                    channelAlturaLimnimetrica: 0,
                    
                    
                },
                schedules: [],
                configs: [],
                clients: [],
                selected: null,
                options: [],
                success: false,
                fail: false,
                successMsg: '',
                failMsg: ''
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

        mounted() {
            //this.getUserConfig();
            this.getClients(); 
            this.getSchedules(); 
        },
        watch: {
            showModal(newValue) {
                // Si la modal se cierra, restablecer el valor de showModal
                if (!newValue) {
                    this.$emit('update:showModal', false);
                }
            }
        },
        methods: {
            getCodesConfig() {
                return; 
            },
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
                
                const modalContent = document.querySelector(".modal-class");
                if (!modalContent.contains(event.target)) {
                    console.log("Entra al if");
                    this.closeModal();
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

            async saveDevice() {
                let errorMsgs = []
                this.setTouched('all');

                if(!this.form.client_id) {
                    errorMsgs.push("- Por favor ingrese un cliente." );
                }
                if(!this.form.client_config_id) {
                    errorMsgs.push("- Por favor ingrese una configuración.");
                }
                if(!this.form.schedule_id) {
                    errorMsgs.push("- Por favor ingrese una periodicidad.");
                }
                if(errorMsgs.length) {
                    this.failMsg = "Por favor corrija los siguientes errores:<br><br>" + errorMsgs.join("<br>"); 
                    this.fail = true;
                    setTimeout(() => {
                        this.restoreInitialData();
                        //    this.closeModal(); 
                    }, 2500);
                    return;
                }
                
                if(!this.v$.$invalid) {
                    try {
                        const response = await axios.post(
                            this.$store.state.backendUrl + '/devices',
                            this.form,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + this.$store.state.token,
                                }
                            }
                        )
                        console.log(response); 
                        this.successMsg = 'Dispositivo añadido exitósamente.'; 
                        this.success = true; 
                        setTimeout(() => {
                            this.closeModal(); 
                        }, 2000);

                    } catch (error) {
                        if (error.response) {
                            const errors = error.response.data.errors; 
                            for (const key in errors) {
                                if (errors.hasOwnProperty(key)) {
                                    const errMsg = errors[key];
                                    this.failMsg = this.failMsg.concat(errMsg, "\n");  
                                    this.fail = true; 

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

    }
    
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>