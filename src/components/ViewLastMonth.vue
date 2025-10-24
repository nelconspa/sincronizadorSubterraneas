<template>
    <CModal :visible="showModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>Reporte últimos 30 días</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <!-- <CAlert color="success"
                :visible="success">
                {{ successMsg }}
            </CAlert> -->
            
            
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" @click="closeModal">
                Cerrar
            </CButton>
            <CButton color="primary" @click="getReportLastMonth">Guardar</CButton>
        </CModalFooter>
    </CModal>
</template>

<script>
    import axios from 'axios';
    import useVuelidate from '@vuelidate/core'
    import { required } from '@vuelidate/validators'
    import { ref, onMounted, watch, computed } from 'vue'; 
    export default {
        name: 'ViewLastMonth',
        props: {
            showModal: Boolean,
            zeusCode: String,
        },
        emits: ['closeViewModal'],
        
        
        mounted() {
            this.getReportLastMonth(this.props.zeusCode); 
        },
        setup(props) {
            const success = ref(false);
            const fail = ref(false); 
            const successMsg = ref(''); 
            const failMsg = ref('');
            
            
            const getReportLastMonth = async (zeusCode) => {
                console.log('Zeus Code:', zeusCode);
                try {
                        const response = await axios.post(
                            this.$store.state.backendUrl + '/report-tasks',
                            
                            {
                                params: {
                                    zeusCode: zeusCode
                                },
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + this.$store.state.token,
                                }
                            }
                        )
                        console.log(response); 
                        successMsg.value = 'Reporte creado exitósamente.'; 
                        success.value = true; 
                        setTimeout(() => {
                            closeModal(); 
                        }, 2000);

                    } catch (error) {
                        if (error.response) {
                            const errors = error.response.data.errors; 
                            for (const key in errors) {
                                if (errors.hasOwnProperty(key)) {
                                    const errMsg = errors[key];
                                    failMsg.value = failMsg.value.concat(errMsg, "\n");  
                                    fail.value = true; 

                                    setTimeout(() => {
                                        restoreInitialData();
                                    //    closeModal(); 
                                    }, 2000);
                                    
                                }
                            }
                        }
                    };
                    
            };

            const restoreInitialData = () => {
                fail.value = false;
                success.value = false;
                failMsg.value = '';
                successMsg.value = '';
            };

            const closeModal = () => {
                restoreInitialData();
                emit('closeViewModal');
            };

            const closeModalOutside = (event) => {
                if (event.target === event.currentTarget) {
                    closeModal();
                }
            };

            onMounted(() => {
                if (props.zeusCode) {
                    getReportLastMonth(props.zeusCode); 
                } else {
                    console.error('No se proporcionó zeusCode');
                }
            });
            
            return {
                getReportLastMonth,
                closeModal,
                closeModalOutside,
            }
        },

    }
    
</script>