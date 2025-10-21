<template>
    <CRow class="mt-4">
        <CCol class="col-8">
            <CCard>
                <CCardBody>
                    <CCardTitle>Usuario</CCardTitle>
                    <CForm>
                        <CRow class="mt-5">
                            <CCol class="col-6">
                                <CFormInput
                                    label="Correo electrónico"
                                    v-model="formAccount.email"
                                    disabled
                                ></CFormInput>
                            </CCol>
                            <CCol class="col-6">
                                <CFormInput
                                    label="Rut"
                                    v-model="formAccount.rut"
                                ></CFormInput>
                            </CCol>
                            <CCol class="col-12 mt-4">  
                                <CFormInput
                                    label="Nombres"
                                    v-model="formAccount.names"
                                ></CFormInput>
                            </CCol>
                            <CCol class="col-6 mt-4">
                                <CFormInput
                                    label="Apellido Paterno"
                                    v-model="formAccount.surname1"
                                ></CFormInput>
                            </CCol>
                            <CCol class="col-6 mt-4">
                                <CFormInput
                                    label="Apellido Materno"
                                    v-model="formAccount.surname2"
                                ></CFormInput>
                            </CCol>
                        </CRow>
                        <CButton 
                            size="lg" 
                            color="primary" 
                            shape="rounded-pill" 
                            class="mt-4"
                            @click="saveDataProfile"
                        >
                            Guardar
                        </CButton>
                    </CForm>
                    <CAlert color="success"
                        :visible="successUserData">
                        {{ successUserDataMsg }}
                    </CAlert>
                    <CAlert color="danger"
                        :visible="failUserData">
                        {{ failUserDataMsg }}
                    </CAlert>
                </CCardBody>
            </CCard>
        </CCol>
        <CCol class="col-4">
            <CCard>
                <CCardBody>
                    <CCardTitle>Cambiar contraseña</CCardTitle>
                    <div class="mt-5">
                        <CFormInput
                        label="Contraseña actual"
                        placeholder="Contraseña"
                        type="password"
                        class=""
                        v-model="formPassword.currentPassword"
                        ></CFormInput>
                    
                    </div>
                    <div class="mt-4">
                        <CFormInput
                            label="Nueva contraseña"
                            placeholder="Nueva contraseña"
                            type="password"
                            v-model="formPassword.newPassword"

                        ></CFormInput>
                    </div>
                    <div class=mt-4>
                        <CFormInput
                            label="Confirmar contraseña"
                            placeholder="Confirmar contraseña"
                            type="password"
                            v-model="formPassword.newPassword_confirmation"
                        ></CFormInput>
                    </div>
                    <CButton 
                        size="lg" 
                        color="primary" 
                        shape="rounded-pill" 
                        class="mt-4"
                        
                        @click="changePassword"
                    >Cambiar contraseña</CButton>
                    <CAlert color="success"
                        :visible="successPassword">
                        {{ successPasswordMsg }}
                    </CAlert>
                    <CAlert color="danger"
                        :visible="failPassword">
                        {{ failPasswordMsg }}
                    </CAlert>
                </CCardBody>
            </CCard>
        </CCol>

    </CRow>
    
</template>
<script>
import axios from 'axios';

    export default {
        name: 'Profile',
        data() {
            return {
                formAccount: {
                    id: '',
                    email: '', 
                    rut: '',
                    names: '',
                    surname1: '',
                    surname2: '',
                },
                formPassword: {
                    currentPassword: '',
                    newPassword: '',
                    newPassword_confirmation: ''
                },
                successUserData: false,
                failUserData: false,
                successPassword: false,
                failPassword: false,
                successUserDataMsg: '',
                failUserDataMsg: '',
                successPasswordMsg: '',
                failPasswordMsg: '',
                
                
            }
        },

        mounted() {
            this.getDataAccount(); 
        },

        methods: {
            async getDataAccount() {
                const response = await axios.get(
                    this.$store.state.backendUrl + '/account',
                    {
                        headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                        }
                    }
                ); 
                 
                this.setDataAccount(response.data); 
            },

            async saveDataProfile() {
                try {
                    const response = await axios.put(
                        this.$store.state.backendUrl + '/account/',
                        this.formAccount,
                        {
                            headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    ); 
                    this.successUserDataMsg = 'Usuario actualizado exitósamente.'; 
                    this.successUserData = true; 
                    setTimeout(() => {
                        this.successUserData = false;
                        this.successUserDataMsg = '';
                    }, 2000);
                    
                } catch(error) {
                    if (error.response) {
                        const errors = error.response.data.errors; 
                        for (const key in errors) {
                            if (errors.hasOwnProperty(key)) {
                                const errMsg = errors[key];
                                this.failUserDataMsg += `${errMsg}\n`;  
                                this.failUserData = true; 

                                setTimeout(() => {
                                    this.failUserData = false;
                                    this.failUserDataMsg = '';
                                }, 2000);
                                
                            }
                        }
                    }
                }
                 
            },

            async changePassword() {
                try {
                    const response = await axios.post(
                        this.$store.state.backendUrl + '/account/changePassword',
                        this.formPassword,
                        {
                            headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    ); 
                    console.log(response.data); 
                    this.successPasswordMsg = 'Usuario actualizado exitósamente.'; 
                    this.successPassword = true; 

                    setTimeout(() => {
                        this.successPassword = false;
                        this.successPasswordMsg = '';
                    }, 2000);

                } catch(error) {
                    if (error.response) {
                        const errors = error.response.data.errors; 
                        for (const key in errors) {
                            if (errors.hasOwnProperty(key)) {
                                const errMsg = errors[key];
                                this.failPasswordMsg += `${errMsg}\n`;  
                                this.failPassword = true; 

                                setTimeout(() => {
                                    this.failPassword = false;
                                    this.failPasswordMsg = '';
                                }, 2000);
                                
                            }
                        }
                    }
                }   
                

            },

            setDataAccount(data) {
                console.log(data);
                this.formAccount.id = data.id;
                this.formAccount.email = data.email; 
                this.formAccount.rut = data.rut; 
                this.formAccount.names = data.names; 
                this.formAccount.surname1 = data.surname1; 
                this.formAccount.surname2 = data.surname2; 
            }
        }
    }
</script>