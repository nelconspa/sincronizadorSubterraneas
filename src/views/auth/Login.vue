<template>
    <div class="background-login min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
        <CRow class="justify-content-center">
            <CCol class="align-self-center col-xl-6 col-md-10 col-sm-11 col-xs-11 h-100vh">
                <CCardGroup>
                <CCard class="p-5">
                    <CCardBody>
                    <CAlert color="danger"
                        :visible="ShowError" 
                        dismissible @close="() => { ShowError = false }">
                        {{ errorMsg }}
                    </CAlert>
                    <CForm @submit="onSubmit">
                        <CImage align="center" :src="logoHidrosistemas" rounded  width="90%"/>
                        <p class="text-body-secondary text-center">Inicio de sesión panel de administración</p>
                        <CInputGroup class="mb-3 ">
                        <CInputGroupText>
                            <CIcon icon="cil-user" />
                        </CInputGroupText>
                        <CFormInput
                            v-model.trim="form.email"
                            @input="setTouched('email')"
                            type="email"
                            placeholder="Email"
                            autocomplete="email"
                            feedback="Ingresa un email válido."
                            :invalid="v$.form.email.$error"
                        />
                        </CInputGroup>
                        <CInputGroup class="mb-4">
                        <CInputGroupText>
                            <CIcon icon="cil-lock-locked" />
                        </CInputGroupText>
                        <CFormInput
                            v-model.trim="form.password"
                            @input="setTouched('password')"
                            type="password"
                            placeholder="Contraseña"
                            autocomplete="current-password"
                            feedback="Ingrese su contraseña."
                            :invalid="v$.form.password.$error"
                        />
                        </CInputGroup>
                        
                        <CContainer class="d-grid gap-2">
                            <SubmitButton 
                                title="Ingresar"
                                :isSendingForm="isSendingForm"
                            />
                        </CContainer>
                        
                        
                        <!-- <CButton color="link" class="text-center pt-3">
                        ¿Olvidaste la contraseña?
                        </CButton> -->
    
                    </CForm>
                    </CCardBody>
                </CCard>
                
                </CCardGroup>
            </CCol>
            </CRow>
        </CContainer>
        </div>
</template>
    

<script>
/* eslint-disable */
import axios, { AxiosError } from "axios";
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import SubmitButton from '@/components/SubmitButton.vue'
import logoHidrosistemas from '@/assets/brand/hidrosistemas-logo.jpeg';

export default {
    
    name: 'Login',
    setup() {
        return { v$: useVuelidate(), logoHidrosistemas }
    },
    components:{ SubmitButton },
    data() {
        return {
            form: {
                email: '',
                password: '',
            },
            errorMsg: '', 
            ShowError: false,
            isSendingForm: false, 
        }
    },
    validations() {
        return {
            form: {
                email: {
                    required,
                    email,
                },
                
                password: {
                    required,
                },
            },
        }
    },
    methods: {
        setTouched(theModel) {
            if(theModel == 'email' || theModel == 'all' )
                {this.v$.form.email.$touch()}

            if(theModel == 'password' || theModel == 'all'){
                this.v$.form.password.$touch()
            } 
        },

        handleErrors(error) { 
            console.log("Error: ", error);
            this.ShowError=true;
            const statusCode = error.response.status; 
            
            if (error instanceof AxiosError && error.response) {
                if (statusCode == 404) {    
                    this.errorMsg = "No se encontró el recurso solicitado."
                
                } else if (statusCode == 401) {
                    this.errorMsg = "Email y/o Contraseña inválida."
                
                } else if (statusCode == 500) {
                    this.errorMsg = "Error del servidor: Ha ocurrido un error interno en el servidor."
                }

            } else if (error.request) {
                this.errorMsg = "No se recibió respuesta del servidor.";

            } else {
                this.errorMsg = "Ha ocurrido un error: " + error; 
            }
            this.isSendingForm = false;
        },

        onSubmit(event) {
            event.preventDefault();
            this.setTouched('all');
            console.log(this.v$.$invalid)
            if (!this.v$.$invalid) {
                this.isSendingForm = true;
                axios.post(
                    this.$store.state.backendUrl+'/login',
                    this.form, 
                    {
                        headers: {"Content-Type": "application/json",}
                    })
                .then((response) => {
                    let resp = response.data; 
                   
                    this.$store.commit('saveLogin',
                    {
                        "token":resp.data.token,
                        "name":resp.data.name,
                    });
                 
                    this.$router.push('/')
                    this.isSendingForm = false;
            
                })
                .catch( (error) => {
                    this.handleErrors(error); 
                    
                });
            
            }
        },
    },
}
</script>

<style>
    .background-login {
        background-color: #595959;  
    }
</style>