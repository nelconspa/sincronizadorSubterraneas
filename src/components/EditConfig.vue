<template>
    <CModal :visible="showModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>Editar configuración de servidores</CModalTitle>
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
                    <CCol class="col-12 mt-4">
                        <v-select 
                            v-model="form.client_id"
                            :options="clients"
                            :reduce="client => client.id"
                            @option:selected="setData"
                            label="name"
                            placeholder="Seleccione..."
                            @input="setTouched('client_id')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.client_id.$error"
                        />
                    </CCol>
                    <CCol class="col-6 mt-4">
                        <CFormInput
                            label="Zeus Host"
                            type="text"
                            placeholder=""
                            aria-describedby="Zeus Host"
                            v-model="form.zeusHost"
                            @input="setTouched('zeusHost')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.zeusHost.$error"
                        />
                    </CCol>
                    <CCol class="col-6 mt-4">
                        <CFormInput
                            label="Zeus Puerto"
                            type="text"
                            placeholder=""
                            aria-describedby="Zeus Puerto"
                            v-model="form.zeusPort"
                            @input="setTouched('zeusPort')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.zeusPort.$error"
                        />
                    </CCol>
                    <CCol class="col-12 mt-4">
                        <CFormInput
                            label="Zeus Username"
                            type="text"
                            placeholder="Zeus Username"
                            aria-describedby="Zeus username"
                            v-model="form.zeusUsername"
                            @input="setTouched('zeusUsername')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.zeusUsername.$error"
                        />
                    </CCol>
                    <CCol class="col-12 mt-4">
                        <CFormInput
                            label="Zeus Password"
                            type="text"
                            placeholder="Zeus Password"
                            aria-describedby="Zeus password"
                            v-model="form.zeusPassword"
                            @input="setTouched('zeusPassword')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.zeusPassword.$error"
                        />
                    </CCol>
                    <CCol class="col-12 mt-4">
                        <CFormInput
                            label="Zeus Auth Pass"
                            type="text"
                            placeholder="Zeus Auth Pass"
                            aria-describedby="Zeus Auth Pass"
                            v-model="form.zeusAuthPass"
                            @input="setTouched('zeusAuthPass')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.zeusAuthPass.$error"
                        />
                    </CCol>
                    <CCol class="col-12 mt-4">
                        <CFormInput
                            label="DGA Username"
                            type="text"
                            placeholder="DGA Username"
                            aria-describedby="DGA username"
                            v-model="form.dgaUsername"
                            @input="setTouched('dgaUsername')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.dgaUsername.$error"
                        />
                    </CCol>
                    <CCol class="col-12 mt-4">
                        <CFormInput
                            label="DGA Password"
                            type="text"
                            placeholder="DGA Password"
                            aria-describedby="DGA password"
                            v-model="form.dgaPassword"
                            @input="setTouched('dgaPassword')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.dgaPassword.$error"
                        />
                    </CCol>
                </CRow>
                
            </CForm>
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" @click="closeModal">
                Cerrar
            </CButton>
            <CButton color="primary" @click="saveConfig">Guardar</CButton>
        </CModalFooter>
    </CModal>
</template>

<script>
    import axios from 'axios';
    
    import useVuelidate from '@vuelidate/core';
    import { required } from '@vuelidate/validators'; 

    export default {
        name: 'EditConfig',
        props: {
            showModal: Boolean,
            configClient: Object,
        },
        setup() {
            return { v$: useVuelidate() }
        },
        data() {
            return {
                form: {
                    id: '',
                    client_id: '',
                    zeusHost: '',
                    zeusPort: '',
                    zeusUsername: '',
                    zeusPassword: '',
                    zeusAuthPass: '',
                    dgaUsername: '',
                    dgaPassword: ''
                },
                configs: [],
                clients: [],
                success: false,
                fail: false,
                successMsg: '',
                failMsg: '',
                
            }
        },
        validations() {
            return {
                form: {
                    client_id:{
                        required
                    },
                    zeusHost: {
                        required
                    },
                    zeusPort: {
                        required
                    },
                    zeusUsername: {
                        required
                    },
                    zeusPassword: {
                        required
                    },
                    zeusAuthPass: {
                        required
                    },
                    dgaUsername: {
                        required
                    },
                    dgaPassword: {
                        required
                    }
                    
                    
                }
            }
        },

        watch: {
            configClient: {
                handler(newConfig) {
                    this.setDataConfig(newConfig);
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
            this.getClients();
        },

        methods: {
            setTouched(theModel) { 
                
                if(theModel == 'zeusHost' || theModel == 'all'){
                    this.v$.form.zeusHost.$touch()
                } 
                if(theModel == 'zeusPort' || theModel == 'all' )
                {
                    this.v$.form.zeusPort.$touch()
                }

                if(theModel == 'zeusUsername' || theModel == 'all' )
                {
                    this.v$.form.zeusUsername.$touch()
                }

                if(theModel == 'zeusPassword' || theModel == 'all')
                {
                    this.v$.form.zeusPassword.$touch()
                }

                if(theModel == 'zeusAuthPass' || theModel == 'all')
                {
                    this.v$.form.zeusAuthPass.$touch()
                }

                if(theModel == 'dgaUsername' || theModel == 'all')
                {
                    this.v$.form.dgaUsername.$touch()
                }

                if(theModel == 'dgaPassword' || theModel == 'all')
                {
                    this.v$.form.dgaPassword.$touch()
                }
                
               
            },
            setData(options) {
                console.log("option: ",options);
            },
            async saveConfig() {
                this.setTouched('all');
                console.log(this.form);
                if (!this.v$.$invalid) {
                    try {
                        const response = await axios.put(
                            this.$store.state.backendUrl + '/client_configs/' + this.form.id,
                            this.form,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + this.$store.state.token,
                                }
                            }
                        )
                        console.log(response); 
                        this.successMsg = 'Configuración actualizada exitósamente.'; 
                        this.success = true; 
                        setTimeout(() => {
                            this.closeModal(); 
                        }, 2000);
                    

                        
                    } catch(error) {
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
                
                
            },
            setDataConfig(newConfig) {
                console.log("SET DATA: ", newConfig);
                if (newConfig) {
                    console.log(newConfig);
                    this.form.id = newConfig.id; 
                    this.form.client_id = newConfig.client_id;
                    this.form.name = newConfig.name;
                    this.form.zeusHost = newConfig.zeusHost;
                    this.form.zeusPort = newConfig.zeusPort.toString();
                    this.form.zeusUsername = newConfig.zeusUsername;
                    this.form.zeusPassword = newConfig.zeusPassword;
                    this.form.zeusAuthPass = newConfig.zeusAuthPass;
                    this.form.dgaUsername = newConfig.dgaUsername;
                    this.form.dgaPassword = newConfig.dgaPassword; 
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
                if (event.target === event.currentTarget) {
                    this.closeModal();
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
                    console.log(this.clients[0])
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
                        clientName: config.client?.name ?? '' // O un valor por defecto si `name` no existe
                    }));
                    console.log(this.configs)

                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.ShowError = true;
                    // this.errorMsg = "Ha ocurrido un error: " + error;
                }
            }, 
        }

    }
    
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>