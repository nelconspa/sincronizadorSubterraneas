<template>
    <CRow class="mb-4">
        <CCol class="col-3 mt-4">
            <CButton @click="addClient" color="success" shape="rounded-pill" variant="outline">
                <CIcon :icon="icon.cilPlus" size="xl"/>
            </CButton>
        </CCol>
        <CCol class="col-9">
            <SearchBarFilter @search="handleSearch" /> 
        </CCol>
    </CRow>

    <template v-if="isLoading" >
        <div class="d-flex flex-column align-items-center justify-content-center mt-5">
            <h5 class="text-bold">Cargando clientes...</h5>
            <CSpinner color="dark"/>
        </div>
                
    </template>
    <template v-else>
        <CTable class="mt-5">
            <CTableHead>
                <CTableRow color="dark">
                    <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Herramientas</CTableHeaderCell>
                    
                </CTableRow>
            </CTableHead>
            <CTableBody>
                <CTableRow v-for="(client, index) in filteredClients" :key="client.id">
                    <CTableDataCell>{{ client.name }} </CTableDataCell>
                    <CTableDataCell>
                        <CButton @click="editClient(client)">
                            <font-awesome-icon icon="pen-to-square" size="xl" />
                        </CButton>
                        <CButton @click="deleteClient(client)">
                            <font-awesome-icon icon="trash" size="xl" />
                        </CButton>
                    </CTableDataCell>
                
                    
                </CTableRow>
            </CTableBody>
        </CTable>
    </template>
    
    <AddClientModal
        :showAddModal="showAddModal"
        @cerrarAddModal="onCloseAdd"
    />
    <EditClientModal
        :showEditModal="showEditModal"
        :client="client_id"
        @cerrarEditModal="onCloseEdit"
    />
    <DeleteClient
        :showDeleteModal="showDeleteModal"
        @closeDeleteModal="onCloseDeleteModal"
        :client="client_id"
        :devices="devices"
    >
        <template v-slot:modalTitle>Eliminar Cliente: <b>{{ client_id.name }}</b></template>
        <template v-slot:modalBody>
            ADVERTENCIA: Se eliminarán todos los datos de este cliente.
        </template>
        <template v-slot:modalFooter>
        </template>

    </DeleteClient>

</template>

<script>
    import axios from 'axios'
    import SearchBarFilter from '../../components/SearchFilter.vue'; 
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';
    import AddClientModal from '../../components/AddClient.vue'; 
    import EditClientModal from '../../components/EditClient.vue'; 
    import DeleteClient from '../../components/DeleteClient.vue'; 

    export default {
        name: "Clients",
        components: {
            SearchBarFilter,
            CIcon,
            AddClientModal,
            EditClientModal,
            DeleteClient
        },
        setup() {
            return {
                icon,
            }
        },
        data() {
            return {
                clients: [],
                devices: [],
                searchFilter: '',
                showAddModal: false,
                showEditModal: false,
                showDeleteModal: false,
                client_id: null,
                isLoading: false,
            }
            
        },
        computed: {
            filteredClients() {
                let filterClients = this.clients; 

                if (this.searchFilter !== '') {
                    filterClients = filterClients.filter(client => 
                        client.name.toLowerCase().includes(this.searchFilter.toLowerCase())
                    );
                }

                return filterClients; 
            }

            
        },

        mounted() {
            this.getClients(); 
        },
        
        methods: {
            editClient(client) {
                this.showEditModal = true; 
                this.client_id = client; 
            },
            async deleteClient(client) {
                this.showDeleteModal = true; 
                this.client_id = client;
                try {
                    await this.getDevices(this.client_id.id);
                    console.log("Devices client: ", this.devices);
                }
                catch (error) {
                    console.error('Error al obtener dispositivos en deleteClient button:', error);
                }
            },

            addClient() {
                this.showAddModal = true; 
            },
            handleSearch(search) {
                this.searchFilter = search; 
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
                    console.log("DEVICES GETDEVICES: ", this.devices);
                   

                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.ShowError = true;
                        
                        // this.errorMsg = "Ha ocurrido un error: " + error;
                }
            },
            async getClients() {
                this.isLoading = true; 
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
                    this.isLoading = false; 
                    console.log(this.clients[0])
                } catch (error) {
                    this.isLoading = false; 
                    console.error('Error en la solicitud a la API:', error);
                    this.ShowError = true;
                        
                        // this.errorMsg = "Ha ocurrido un error: " + error;
                }
            },
            onCloseAdd() {
                this.showAddModal = false; 
                this.getClients(); 
            },
            onCloseEdit() {
                console.log("cerré modal editClient")
                this.showEditModal = false;
                this.getClients(); 
            },
            onCloseDeleteModal() {
                console.log("cerre modal Delete Modal"); 
                this.showDeleteModal = false; 
                this.getClients();
            },
        }
    }

    
</script> 