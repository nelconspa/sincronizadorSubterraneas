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
            client: Object
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
                this.sucess = false;
            },
            
           
            deleteClient() {
                if (this.client.client_configs.length) {
                    this.fail = true; 
                
                } else {
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