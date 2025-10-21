<template>
    <CModal :visible="showDeleteModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>
                <slot name="modalTitle"></slot>

            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <slot name="modalBody">
                                
            </slot>
        </CModalBody>
        <CModalFooter>
            <CAlert color="danger"
                :visible="fail">
                Para eliminar esta configuración no debe estar utilizandose.
            </CAlert>
            <CAlert color="success"
                :visible="success">
                Configuración eliminada exitósamente. 
            </CAlert>

            <CButton 
                @click="deleteConfig"
                color="danger" 
                class="text-white">Eliminar
            </CButton>

            <CButton color="primary" @click="closeModal">Cancelar</CButton>
        </CModalFooter>
    </CModal>
</template>

<script>
    import axios from 'axios'; 


    export default {
        name: 'DeleteModal',
        emits: ['closeDeleteModal'],
        props: {   
            showDeleteModal: Boolean, 
            config: Object,
            devices: Array
        },
        data() {
            return {
                fail: false,
                success: false,
            }
        },

        mounted() {
            
        },
        methods: {
            
            closeModal() {
                this.$emit('closeDeleteModal');
                this.fail = false;
                this.sucess = false;
            },
            
           
            deleteConfig() {
                console.log("Devices en delete config: ",this.devices); 
                this.devices.forEach(device => {
                    if (device.client_config_id === this.config.id) {
                        console.log(device.client_config_id)
                        if (device.enabled) {
                            this.fail = true; 
                            setTimeout(() => {
                                this.closeModal(); 
                        }, 2000);
                        } 
                    }
                })
                
                if (!this.fail) {
                    axios.delete(
                        this.$store.state.backendUrl+'/client_configs/' + this.config.id,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": 'Bearer ' + this.$store.state.token,
                            }
                        })

                    .then((response) => {
                            console.log(response); 
                            this.success = true; 
                            setTimeout(() => {
                                this.closeModal(); 
                            }, 2000);
                    })
                    .catch((error) => {
                            console.log("Error: ", error);
                            //this.errorMsg = "Ha ocurrido un error: " + error; 
                     })
                } 
                
                
                
            }

        }
    }           
</script>