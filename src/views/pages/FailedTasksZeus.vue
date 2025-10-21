<template>
    <CRow>
        <CCol class="col-3">
            <ClientFilter 
                @filter="handleClients"
                
            /> 
        </CCol>
        <CCol class="col-3">
            <DeviceFilter 
                :allDevices="totalDevices"
                @filter="handleDevices"
            /> 
        </CCol>

        <CCol class="col-4">
            <SearchBarFilter 
                @search="handleSearch" 
            /> 
        </CCol>
        <CCol class="col-2 mt-2">
            <CButton color="primary mt-4" @click="searchOnServer">
                Buscar
            </CButton>
        </CCol>


    </CRow>
    <template v-if="isLoading" >
        <div class="d-flex flex-column align-items-center justify-content-center mt-5">
            <h5 class="text-bold">Cargando datos...</h5>
            <CSpinner color="dark"/>
        </div>
                
    </template>
    <template v-else>
        <CTable class="mt-4" striped bordered>
            <CTableHead color="dark">
                <CTableRow>
                    <CTableHeaderCell scope="col">Cliente</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Código zeus</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Fecha</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Error</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                <CTableRow v-for="(task, index) in displayedTasks" :key="index">
                    <template v-if="task.client !== null">
                        <CTableDataCell>{{ task.client.name }} </CTableDataCell>
                    </template>
                    <template v-else> 
                        <CTableDataCell> </CTableDataCell>
                    </template>
                    <CTableDataCell> {{ task.device.zeusName }} </CTableDataCell>
                    <CTableDataCell>{{ task.device.zeusCode }} </CTableDataCell>
                    <CTableDataCell>{{ task.last_error?.updated_at }} </CTableDataCell>
                    <CTableDataCell>{{ task.last_error?.message }} </CTableDataCell>
                </CTableRow>
            </CTableBody>
        </CTable>

        <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center">
                <li class="page-item" v-bind:class="{'disabled': currentPage === 1}" @click="prevPage">
                    <a class="page-link" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li v-for="page in paginatedPages" :key="page" :class="['page-item', { active: page === currentPage, disabled: page === '...' }]" @click="page !== '...' && getFailedTasks(page)">
                <a class="page-link">{{ page }}</a>
            </li>
                <li class="page-item" @click="nextPage" v-bind:class="{'disabled': currentPage === totalPages}">
                    <a class="page-link" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav> 
    </template>
    

    <!-- <div class="style-pagination mt-5">
        <vue-awesome-paginate 
            :total-items="filteredTasks.length"
            :items-per-page="perPage"
            :max-pages-shown="5"
            v-model="currentPage"
        >
            <template #prev-button>
                <span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                >
                    <path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z" />
                </svg>
                </span>
            </template>

            <template #next-button>
                <span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                >
                    <path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z" />
                </svg>
                </span>
            </template>
        </vue-awesome-paginate>
    
    </div> -->
    
</template>

<script>
    import axios from 'axios';
    import DatePicker from '../../components/DatePicker.vue'; 
    import ClientFilter from '../../components/ClientFilter.vue'; 
    import DeviceFilter from '../../components/DeviceFilter.vue'; 
    import SearchBarFilter from '../../components/SearchFilter.vue'; 

    export default {
        name: "FailedTasks",
        components: {
            DatePicker,
            ClientFilter,
            DeviceFilter,
            SearchBarFilter,
        },
        data() {
            return {
                failTasks: [],
                showModal: [],
                searchFilter: '',
                clientsFilter: [],
                devicesFilter: [],
                totalDevices: [],
                selectedDevices: [], // dispositivos seleccionados cuando ya se renderizan
                /* perPage: 10,
                currentPage: 1, 
                totalPages: 0,*/
                currentPage: 1,
                totalPages: 1,
                sortBy: 'id',
                descending: false,
                rowsPerPage: 40,
                pageRange: 2,
                isLoading: false,
            }
            
        },
       
        computed: {
            paginatedPages() {
                const pages = [];
                const total = this.totalPages;
                const current = this.currentPage;
                const range = this.pageRange;
                
                if (total <= 1) return [1]; // No hay paginación si solo hay una página

                // Añadir siempre la primera página
                pages.push(1);

                // Mostrar páginas alrededor de la página actual
                let start = Math.max(2, current - range);
                let end = Math.min(total - 1, current + range);

                if (start > 2) {
                    pages.push('...');
                }

                for (let i = start; i <= end; i++) {
                    pages.push(i);
                }

                if (end < total - 1) {
                    pages.push('...');
                }

                // Añadir siempre la última página
                if (total > 1) {
                    pages.push(total);
                }

                return pages;
            },
            displayedTasks() {
                //const startIndex = (this.currentPage - 1) * this.perPage;
                //const endIndex = startIndex + this.perPage;
                //return this.filteredTasks.slice(startIndex, endIndex);
                return this.filteredTasks;
            },
            filteredTasks() {
                let filterTasks = this.failTasks.data;   
                /* if (this.clientsFilter.length > 0) {
                    filterTasks = filterTasks.filter(task => 
                        (task.client && task.last_error && this.clientsFilter.includes(task.last_error.client_id))
                    );
                }
                if (this.devicesFilter.length > 0 && this.devicesFilter.length < this.totalDevices.length) {
                    filterTasks = filterTasks.filter(task => 
                        (task.device && task.last_error && this.devicesFilter.includes(task.last_error.device_id))
                    )
                    
                }

                if (this.searchFilter !== '') {
                    filterTasks = filterTasks.filter(task => 
                        (task.device && task.device.zeusName.toLowerCase().includes(this.searchFilter.toLowerCase())) ||
                        (task.client && task.client.name.toLowerCase().includes(this.searchFilter.toLowerCase()))
                    );
                } */

                //const startIndex = (this.currentPage - 1) * this.perPage; 
                //const endIndex = startIndex + this.perPage; 

                //return filterTasks.slice(startIndex, endIndex);  
                /* console.log("FILTER TASKS : ", filterTasks) */
                return filterTasks;
            }

        }, 
        /* watch: {
            filteredTasks() {
                this.totalPages = Math.ceil(this.filteredTasks.length / this.perPage);
            }
        }, */
        mounted() {
            this.getFailedTasks(); 
        },

        methods: {
            searchOnServer() {
                if (
                    (!this.clientsFilter || this.clientsFilter.length === 0) &&
                    (!this.devicesFilter || this.devicesFilter.length === 0)
                ) {
                    this.getFailedTasks(1); // Sin filtros
                } else {
                    this.getFailedTasks(1, {
                        clients: this.clientsFilter,
                        devices: this.devicesFilter,
                        search: this.searchFilter
                    });
                }
            },
            prevPage() {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.getFailedTasks(this.currentPage);
                }
            },
            nextPage() {
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                    this.getFailedTasks(this.currentPage);
                }
            },
            handleSearch(search) {
                this.searchFilter = search; 
            }, 

            handleClients(options) {
                this.clientsFilter = options; 
                this.getDevicesByClients(); 

                if (
                    (!this.clientsFilter || this.clientsFilter.length === 0) &&
                    (!this.devicesFilter || this.devicesFilter.length === 0)
                ) {
                    this.getFailedTasks(1);
                }
                
            }, 
            handleDevices(options) {
                //this.devicesFilter = options; 
                //this.getDevicesByClients(); 
                //console.log("DEVICES: ",options); 
                if (!this.selectedDevices.includes(options)) {
                    this.selectedDevices.push(options);
                }
                if (
                    (!this.clientsFilter || this.clientsFilter.length === 0) &&
                    (!this.devicesFilter || this.devicesFilter.length === 0)
                ) {
                    this.getFailedTasks(1);
                }
                console.log("DEVICES: ", this.selectedDevices);
            }, 

            
            async getFailedTasks(page = 1, filters = {}) {
                this.isLoading = true; 
                try {
                    const params = {
                        page: page,
                        rowsPerPage: this.rowsPerPage,
                    };
                    if (filters.clients && filters.clients.length > 0) {
                        params.clients = filters.clients;
                    }
                    if (filters.devices && filters.devices.length > 0) {
                        params.devices = filters.devices.map(d => d.id ? d.id : d);
                    }
                    if (filters.search && filters.search !== '') {
                        params.search = filters.search;
                    }
                    const response = await axios.get(
                    this.$store.state.backendUrl + '/syncManual',
                        {
                            params,
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    ); 

                    this.failTasks = response.data; 
                    this.isLoading = false;
                    console.log(this.failTasks); 

                    this.currentPage = response.data.current_page;
                    this.totalPages = response.data.last_page; 
                } catch (error) {
                    this.isLoading = false;
                    console.error ("Error en getFailedTasks: ", error); 
                }
            },
            /* async getFailedTasks(page = 1) {
                this.isLoading = true; 
                try {
                    const response = await axios.get(
                    this.$store.state.backendUrl + '/syncManual',
                    {
                        params: {
                            page: page,
                            rowsPerPage: this.rowsPerPage,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + this.$store.state.token,
                        }
                    }
                    ); 

                    this.failTasks = response.data; 
                    this.isLoading = false;
                    console.log(this.failTasks); 

                    this.currentPage = response.data.current_page;
                    this.totalPages = response.data.last_page; 
                } catch (error) {
                    this.isLoading = false;
                    console.error ("Error en getFailedTasks: ", error); 
                } 
                
                

            },*/

            async getDevicesByClients() { 
                try {
                    let devices = []; 
                    
                    for (const client_id of this.clientsFilter) {
                        const response = await axios.get(
                            this.$store.state.backendUrl + "/devices",
                            {
                                params: {
                                    'client_id': client_id,
                                    'clientConfig': true
                                },
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: "Bearer " + this.$store.state.token,
                                },
                            }
                        )
                        devices = devices.concat(response.data.map(config => ({
                            ...config,
                            host: config.client_config.zeusHost
                        }))); 
                    }
                    this.totalDevices = devices; 
                    //this.devicesFilter = devices;
                    console.log("total Devices: ", this.totalDevices); 
                    console.log("DISPOSITIVOS EN GETDEVICES: ", this.selectedDevices); 
                    if (this.selectedDevices.length === 0) {
                        this.devicesFilter = devices;
                    }

                    
                } catch (error) {
                    
                    console.error('Error en la solicitud a la API:', error);
                    this.ShowError = true;
                }
            }
        }
    } 
</script>

<style>
    .style-pagination .pagination-container {
        column-gap: 10px;
        align-items: center;
        }
    .style-pagination .paginate-buttons {
        height: 35px;
        width: 35px;
        cursor: pointer;
        border-radius: 4px;
        background-color: transparent;
        border: none;
        color: black;
        }

    .style-pagination .back-button,
    .style-pagination .next-button {
        background-color: black;
        color: white;
        border-radius: 8px;
        height: 45px;
        width: 45px;
        }
    .style-pagination .active-page {
        background-color: #e5e5e5;
        }
    .style-pagination .paginate-buttons:hover {
        background-color: #f5f5f5;
        }
    .style-pagination .active-page:hover {
        background-color: #e5e5e5;
        }

    .style-pagination .back-button svg {
        transform: rotate(180deg) translateY(-2px);
        }
    .style-pagination .next-button svg {
        transform: translateY(2px);
        }

    .style-pagination .back-button:hover,
    .style-pagination .next-button:hover {
        background-color: rgb(45, 45, 45);
        }

    .style-pagination .back-button:active,
    .style-pagination .next-button:active {
        background-color: rgb(85, 85, 85);
    }
</style>