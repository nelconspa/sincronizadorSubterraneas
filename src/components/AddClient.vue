<template>
    <CModal :visible="showAddModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>Nuevo Cliente</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CAlert color="success"
                :visible="success">
                {{ successMsg }}
            </CAlert>
            <CForm>
                <CFormInput
                    type="text"
                    placeholder="Nombre"
                    aria-describedby="Nombre Cliente"
                    @input="setTouched('name')"
                    v-model="form.name"
                    feedback="Rellene este campo por favor."
                    :invalid="v$.form.name.$error"
                />
            </CForm>
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" @click="closeModal">
                Cerrar
            </CButton>
            <CButton color="primary" @click="saveClient">Guardar</CButton>
        </CModalFooter>
    </CModal>
</template>

<script>
    import axios from 'axios';
    import useVuelidate from '@vuelidate/core'
    import { required } from '@vuelidate/validators'
    export default {
        name: 'AddClient',
        props: {
            showAddModal: Boolean,
        },
        setup() {
            return { v$: useVuelidate() }
        },
        emits: ['cerrarAddModal'],
        data() {
            return {
                form: {
                    name: '',
                },
                success: false,
                fail: false,
                successMsg: '',
                failMsg: '',
                
            }
        },
        validations() {
            return {
                form: {
                    name:{
                        required
                    }
                }
            }
        },
        methods: {
            restoreInitialData() {
                this.fail = false;
                this.success = false; 
                this.failMsg = ''; 
                this.successMsg = '';
            },
            closeModal() {
                this.restoreInitialData(); 
                this.$emit('cerrarAddModal'); 
                this.form.name = '';
                this.v$.$reset();
            },

            closeModalOutside(event) {
                if (event.target === event.currentTarget) {
                    this.closeModal();
                }
            },

            setTouched(theModel) { 
                if(theModel == 'name' || theModel == 'all' )
                {this.v$.form.name.$touch()}
            },
            
            async saveClient() {
                this.setTouched('all');
                if(!this.v$.$invalid) {
                    try {
                        const response = await axios.post(
                            this.$store.state.backendUrl + '/clients',
                            this.form,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + this.$store.state.token,
                                }
                            }
                        )
                        console.log(response); 
                        this.successMsg = 'Cliente creado exitósamente.'; 
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