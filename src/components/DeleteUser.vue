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
                @click="deleteUser"
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
            user: Object
        },
        data() {
            return {
                fail: false,
                success: false,
                profile: null
            }
        },
        mounted() {
            this.getDataAccount(); 
        },
        methods: {
            closeModal() {
                this.$emit('closeDeleteModal');
                this.fail = false;
                this.success = false;
            },

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

                this.profile = response.data; 
                console.log(this.profile); 
            },
           
            async deleteUser() {
               if (this.user.id === this.profile.id) {
                    this.fail = true; 
                    setTimeout(() => {
                            this.closeModal(); 
                    }, 2000);
                
                } else {
                    axios.delete(
                        this.$store.state.backendUrl+'/users/' + this.user.id,
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