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
                Para eliminar este cliente no debe tener estaciones agregadas.
            </CAlert>
            <CAlert color="success"
                :visible="success">
                Cliente eliminado exitósamente. 
            </CAlert>

            
            <CButton 
                @click="deleteClient"
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
            client: Object,
            devices: Array,
        },
        data() {
            return {
                fail: false,
                success: false,
            }
        },
        methods: {
            closeModal() {
                this.$emit('closeDeleteModal');
                this.fail = false;
                this.success = false;
            },
            
           
            deleteClient() {
                /* Validar que el cliente no tenga dispositivos asociados a el  */  
                this.devices.forEach(device => {
                    if (device.client_id === this.client.id) {
                        console.log(device.client_id)
                        this.fail = true;
                        setTimeout(() => {
                            this.closeModal(); 
                        }, 2000);
                    }
                })

                if (!this.fail) { 
                    axios.delete(
                        this.$store.state.backendUrl+'/clients/' + this.client.id,
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