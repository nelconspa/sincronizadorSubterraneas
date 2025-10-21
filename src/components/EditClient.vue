<template>
    <CModal :visible="showEditModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>Editar Cliente</CModalTitle>
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
            
            <CForm class="mt-3">

                <CFormInput
                    type="text"
                    placeholder="Nombre"
                    aria-describedby="Nombre Cliente"
                    v-model="form.name"
                    @input="setTouched('name')"
                    feedback="Rellene este campo por favor."
                    :invalid="v$.form.name.$error"
                    class="mt-3"

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


    <DeleteModal
        :showDeleteModal="showDeleteModal"
        @closeDeleteModal="onCloseDeleteModal"
        :client="form"
    >
        <template v-slot:modalTitle>Eliminar Cliente</template>
        <template v-slot:modalBody>
            <b>ADVERTENCIA:</b> Se eliminarán todos los datos de este cliente.
        </template>
        <template v-slot:modalFooter>
        </template>

    </DeleteModal>

</template>

<script>
    import axios from 'axios';
    import useVuelidate from '@vuelidate/core'
    import { required } from '@vuelidate/validators'
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';
    import DeleteModal from './DeleteModal.vue'; 


    export default {
        name: 'EditUser',
        components: {
            CIcon,
            DeleteModal,
        },
        emits: ['update:showEditModal','cerrarEditModal'], 
        props: {
            showEditModal: Boolean,
            client: Object
        },
        setup() {
            return { 
                v$: useVuelidate(),
                icon
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
        data() {
            return {
                form: {
                    id: '',
                    name: '',
                },
                showDeleteModal: false,
                success: false,
                fail: false,
                successMsg: '',
                failMsg: ''
                
            }
        },
        emits: ['onUpdate:showEditModal','cerrarEditModal'],
        watch: {
            client: {
                handler(newConfig) {
                    this.setDataClient(newConfig);
                },
                deep: true,
                immediate: true 
            },
            showEditModal(newValue) {
                // Si la modal se cierra, restablecer el valor de showModal
                if (!newValue) {
                    this.$emit('update:showEditModal');
                }
            }
        },
        methods: {
            setTouched(theModel) { 
                if(theModel == 'name' || theModel == 'all' )
                {this.v$.form.name.$touch()}
            },

            handleDeleteModal() {
                this.showDeleteModal = true; 
                
            },
            restoreInitialData() {
                this.fail = false;
                this.success = false; 
                this.failMsg = ''; 
                this.successMsg = '';
            }, 
            closeModal() {
                this.restoreInitialData(); 
                this.$emit('cerrarEditModal'); 
            },

            closeModalOutside(event) {
                if (event.target === event.currentTarget) {
                    this.closeModal();
                }
            },
            setDataClient(newConfig) {
                if (newConfig) {
                    console.log(newConfig);
                    this.form.id = newConfig.id;
                    this.form.name = newConfig.name;
                    
                } 
            },

            async saveClient() {
                this.setTouched('all');
                if(!this.v$.$invalid) {
                    try {
                        const response = await axios.put(
                            this.$store.state.backendUrl + '/clients/' + this.form.id,
                            this.form,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + this.$store.state.token,
                                }
                            }
                        )
                        console.log(response); 
                        this.successMsg = 'Cliente actualizado exitósamente.'; 
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
                
            },
            onCloseDeleteModal() {
                console.log("cerre modal Delete Modal"); 
                this.showDeleteModal = false; 
                

            },
        }

    }
    
</script>