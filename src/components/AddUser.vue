<template>
    <CModal :visible="showModal" @click.native="closeModalOutside">
        <CModalHeader>
            <CModalTitle>Nuevo Usuario</CModalTitle>
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
                        <v-select
                            v-model="form.profile_id"
                            :options="profiles"
                            :reduce="profile => profile.id"
                            label="name"
                            placeholder="Seleccione un perfil..."
                            @input="setTouched('profile_id')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.profile_id.$error"
                            
                        />
                    </CCol>
                    <CCol class="col-12 mt-4">
                        <CFormInput
                            type="text"
                            placeholder="Nombre"
                            aria-describedby="Nombre Usuario"
                            v-model="form.name"
                            @input="setTouched('name')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.name.$error"
                        />
                    </CCol>
                    <CCol class="col-12 mt-4">
                        <CFormInput
                            type="email"
                            placeholder="Correo electronico"
                            aria-describedby="Correo electrónico"
                            v-model="form.email"
                            @input="setTouched('email')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.email.$error"
                        />
                    </CCol>
                    <CCol class="col-6 mt-4">
                        <CFormInput
                            type="password"
                            placeholder="Contraseña"
                            aria-describedby="Contraseña"
                            v-model="form.password"
                            @input="setTouched('password')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.password.$error"
                        />
                    </CCol>
                    <CCol class="col-6 mt-4">
                        <CFormInput
                            type="password"
                            placeholder="Repetir Contraseña"
                            aria-describedby="Repetir Contraseña"
                            v-model="form.password_confirmation"
                            @input="setTouched('password_confirmation')"
                            feedback="Rellene este campo por favor."
                            :invalid="v$.form.password_confirmation.$error"
                        />
                    </CCol>
                </CRow>
                
            </CForm>
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" @click="closeModal">
                Cerrar
            </CButton>
            <CButton color="primary" @click="saveUser">Guardar</CButton>
        </CModalFooter>
    </CModal>
</template>

<script>
    import axios from 'axios';
    import useVuelidate from '@vuelidate/core';
    import { required, integer, minValue } from '@vuelidate/validators'; 

    export default {
        name: 'AddUser',
        props: {
            showModal: Boolean,
        },
        setup() {
            return { v$: useVuelidate() }
        },
        data() {
            return {
                form: {
                    profile_id: '',
                    name: '',
                    email:'',
                    password: '',
                    password_confirmation: '',
                },
                profiles: [],
                success: false,
                fail: false,
                failMsg: '',
                successMsg: ''
                
            }
        },

        validations() {
            return {
                form: {
                    profile_id:{
                        required
                    },
                    name: {
                        required
                    },
                    email: {
                        required
                    },
                    password: {
                        required
                    },
                    password_confirmation: {
                        required
                    },
                    
                    
                    
                }
            }
        },

        mounted(){
            this.getProfiles(); 
        },
        methods: {
            setTouched(theModel) { 
                if(theModel == 'profile_id' || theModel == 'all' )
                {this.v$.form.profile_id.$touch()}

                if(theModel == 'name' || theModel == 'all'){
                    this.v$.form.name.$touch()
                } 
                if(theModel == 'email' || theModel == 'all' )
                {
                    this.v$.form.email.$touch()
                }

                if(theModel == 'password' || theModel == 'all' )
                {
                    this.v$.form.password.$touch()
                }
                if(theModel == 'password_confirmation' || theModel == 'all' )
                {
                    this.v$.form.password_confirmation.$touch()
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

            async getProfiles() {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/profile',
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    );
                    
                    this.profiles = response.data; 
                    
                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.ShowError = true;
                    // this.errorMsg = "Ha ocurrido un error: " + error;
                }
            }, 

            async saveUser() {
                this.setTouched('all');
                if (!this.v$.$invalid) {
                    try {
                        const response = await axios.post(
                            this.$store.state.backendUrl + '/users',
                            this.form,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + this.$store.state.token,
                                }
                            }
                        )
                        console.log(response); 
                        this.successMsg = 'Usuario creado exitósamente.'; 
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