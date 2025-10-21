<template>
    <CRow class="mb-4">
        <CCol class="col-3 mt-4">
            <CButton @click="addConfig" color="success" shape="rounded-pill" variant="outline">
                <CIcon :icon="icon.cilPlus" size="xl"/>
            </CButton>
        </CCol>
        <CCol class="col-9"> 
            <SearchBarFilter @search="handleSearch" /> 
        </CCol>
    </CRow>

    <template v-if="isLoading" >
        <div class="d-flex flex-column align-items-center justify-content-center mt-5">
            <h5 class="text-bold">Cargando configuraciones...</h5>
            <CSpinner color="dark"/>
        </div>
                
    </template>
    <template v-else>
        <CTable class="mt-5">
        <CTableHead>
            <CTableRow color="dark">
                <CTableHeaderCell scope="col">Cliente</CTableHeaderCell>
                <CTableHeaderCell scope="col">Zeus Host</CTableHeaderCell>
                <CTableHeaderCell scope="col">Zeus Username</CTableHeaderCell>
                <CTableHeaderCell scope="col">DGA Username</CTableHeaderCell>
                <CTableHeaderCell scope="col">Herramientas</CTableHeaderCell>
            </CTableRow>
        </CTableHead>
        <CTableBody>
            <CTableRow v-for="(config, index) in filteredConfigs" :key="config.id">

                <CTableDataCell>{{ config.clientName }} </CTableDataCell>
                <CTableDataCell>{{ config.zeusHost }} </CTableDataCell>
                <CTableDataCell>{{ config.zeusUsername }} </CTableDataCell>
                <CTableDataCell>{{ config.dgaUsername }} </CTableDataCell>
                <CTableDataCell>
                    <CButton @click="editConfig(config)">
                        <font-awesome-icon icon="pen-to-square" size="xl" />
                    </CButton>
                    <CButton @click="deleteConfig(config)">
                        <font-awesome-icon icon="trash" size="xl" />
                    </CButton>
                </CTableDataCell>   
            </CTableRow>
        </CTableBody>
        </CTable>
    </template>
    

    <AddConfigModal
        :showModal="showAddModal"
        @cerrar="onCloseAdd"
    />
    <EditConfigModal
        :showModal="showEditModal"
        :configClient="config_id"
        @cerrar="onCloseEdit"
    />
    <DeleteConfigModal
        :showDeleteModal="showDeleteModal"
        @closeDeleteModal="onCloseDeleteModal"
        :config="config_id"
        :devices="devices"
    >
        <template v-slot:modalTitle>Eliminar Configuración de: <b>{{ config_id.client.name }}</b></template>
        <template v-slot:modalBody>
            ADVERTENCIA: Se eliminará toda la configuración.
        </template>
        <template v-slot:modalFooter>
        </template>

    </DeleteConfigModal>
</template>

<script>
    import axios from 'axios'
    import SearchBarFilter from '../../components/SearchFilter.vue'; 
    import AddConfigModal from '../../components/AddConfig.vue';
    import EditConfigModal from '../../components/EditConfig.vue'; 
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';
    import DeleteConfigModal from '../../components/DeleteConfig.vue'; 
    

    export default {
        name: "Configurations",
        components: {
            SearchBarFilter,
            CIcon,
            AddConfigModal,
            EditConfigModal,
            DeleteConfigModal,
        },
        setup() {
            return {
                icon,
            }
        },
        data() {
            return {
                configs: [],
                devices: [],
                searchFilter: '',
                showAddModal: false,
                showEditModal: false,
                showDeleteModal: false,
                config_id: null,
                isLoading: false,
            }
            
        },
        computed: {
            filteredConfigs() {
                let filterConfigs = this.configs; 

                if (this.searchFilter !== '') {
                    filterConfigs = filterConfigs.filter(config => 
                        config.dgaUsername.toLowerCase().includes(this.searchFilter.toLowerCase()) || 
                        config.zeusUsername.toLowerCase().includes(this.searchFilter.toLowerCase()) || 
                        config.zeusHost.toLowerCase().includes(this.searchFilter.toLowerCase()) 

                    );
                }

                return filterConfigs; 
            }

            
        },
       

        mounted() {
            this.getConfigs();
        },
        
        methods: {
            addConfig() {
                this.showAddModal = true;
            },
            editConfig(config) {
                this.showEditModal = true;
                this.config_id = config;      
            },
            async getDevices(client_id) {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/devices',
                        {
                            params: {
                                'client': true,
                                'client_id': client_id
                            },  
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    );
                    
                    this.devices = response.data;
                    return this.devices; 
                    
                   

                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.ShowError = true;
                        
                        // this.errorMsg = "Ha ocurrido un error: " + error;
                }
            },
            async deleteConfig(config) {
                
                this.showDeleteModal = true; 
                this.config_id = config;
                try {
                    await this.getDevices(this.config_id.client_id);
                    console.log("Devices config: ", this.devices);
                }
                catch (error) {
                    console.error('Error al obtener dispositivos en deleteConfig button:', error);
                }
            },

            handleSearch(search) {
                this.searchFilter = search; 
            },

            async getConfigs() {
                this.isLoading = true;
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/client_configs',
                        {
                            params: {
                                'client': true
                            },
                           
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    );
                    console.log(response.data); 
                    this.configs = response.data.map(config => ({
                        ...config,
                        clientName: config.client?.name ?? '' // O un valor por defecto si `name` no existe
                    }));
                    this.isLoading = false; 
                  

                } catch (error) {
                    this.isLoading = false; 
                    console.error('Error en la solicitud a la API:', error);
                    
                    // this.errorMsg = "Ha ocurrido un error: " + error;
                }
            },

            async getClients() {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/clients',
                        {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + this.$store.state.token,
                        }
                        }
                    );
                    
                    this.clients = response.data;
                    console.log(this.clients[0])
                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.ShowError = true;
                        
                        // this.errorMsg = "Ha ocurrido un error: " + error;
                }
            },
            

            onCloseAdd() {
                this.showAddModal = false; 
                this.getConfigs();
            },
            onCloseEdit() {
                this.showEditModal = false; 
                this.getConfigs();
            },
            onCloseDeleteModal() {
                this.showDeleteModal = false; 
                this.getConfigs(); 
            }

            
        }
    }

    
</script> 