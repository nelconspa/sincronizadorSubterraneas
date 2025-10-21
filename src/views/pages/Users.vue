<template>
    <CRow class="mb-4">
        <CCol class="col-3 mt-4">
            <CButton @click="addUser" color="success" shape="rounded-pill" variant="outline">
                <CIcon :icon="icon.cilPlus" size="xl"/>
            </CButton>
        </CCol>
        <CCol class="col-9">
            <SearchBarFilter @search="handleSearch" /> 
        </CCol>
    </CRow>
    <CTable class="mt-5">
        <CTableHead>
            <CTableRow color="dark">
                <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                <CTableHeaderCell scope="col">Perfil</CTableHeaderCell>
                <CTableHeaderCell scope="col">Correo</CTableHeaderCell>
                <CTableHeaderCell scope="col">Herramientas</CTableHeaderCell>
            </CTableRow>
        </CTableHead>
        <CTableBody>
            <CTableRow v-for="(user, index) in filteredUsers" :key="user.id">
                <CTableDataCell>{{ user.name }} </CTableDataCell>
                <CTableDataCell>{{ user.profile.name }} </CTableDataCell>
                <CTableDataCell>{{ user.email }} </CTableDataCell>
                
                <CTableDataCell>
                    <CButton @click="editUser(user)">
                        <!-- <CIcon :icon="icon.cilPencil" size="xl"/> -->
                        <font-awesome-icon icon="pen-to-square" size="xl" />
                    </CButton>
                    <CButton @click="deleteUser(user)">
                        <font-awesome-icon icon="trash" size="xl" />
                    </CButton>
                </CTableDataCell>
                
            </CTableRow>
        </CTableBody>
    </CTable>
    <AddUserModal
        :showModal="showAddModal"
        @cerrar="onCloseAdd"
        
    />
    <EditUserModal
        :showModal="showEditModal"
        :user="user_id"
        @cerrar="onCloseEdit"
    />
    <DeleteUser
        :showDeleteModal="showDeleteModal"
        @closeDeleteModal="onCloseDeleteModal"
        :user="user_id"
        
    >
        <template v-slot:modalTitle>Eliminar Cliente: <b>{{ user_id.name }}</b></template>
        <template v-slot:modalBody>
            ADVERTENCIA: Se eliminarán todos los datos de este cliente.
        </template>
        <template v-slot:modalFooter>
        </template>

    </DeleteUser>
</template>

<script>
    import axios from 'axios'
    import SearchBarFilter from '../../components/SearchFilter.vue'; 
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';
    import AddUserModal from '../../components/AddUser.vue'; 
    import EditUserModal from '../../components/EditUser.vue'; 
    import DeleteUser from '../../components/DeleteUser.vue'; 

    export default {
        name: "Users",
        components: {
            SearchBarFilter,
            CIcon,
            AddUserModal,
            EditUserModal,
            DeleteUser,
        },
        setup() {
            return {
                icon,
            }
        },
        data() {
            return {
                users: [],
                searchFilter: '',
                showAddModal: false,
                showEditModal: false,
                showDeleteModal: false, 
                user_id: null,
            }
            
        },
        computed: {
            filteredUsers() {
                let filterUsers = this.users; 

                if (this.searchFilter !== '') {
                    filterUsers = filterUsers.filter(users => 
                        users.name.toLowerCase().includes(this.searchFilter)
                    );
                }

                return filterUsers; 
            }

            
        },

        mounted() {
            this.getUsers(); 
        },
        
        methods: {
            editUser(user) {
                this.showEditModal = true; 
                this.user_id = user;  
            },
            async deleteUser(user) {
                this.showDeleteModal = true; 
                this.user_id = user;
                
            },

            addUser() {
                this.showAddModal = true; 
            },
            handleSearch(search) {
                this.searchFilter = search; 
            },

            async getUsers() {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/users',
                        {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + this.$store.state.token,
                        }
                        }
                    );
                    
                    this.users = response.data;
                    console.log("Usuarios: ",this.users)
                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.ShowError = true;
                        
                        // this.errorMsg = "Ha ocurrido un error: " + error;
                }
            },
            

            onCloseAdd() {
                this.showAddModal = false; 
                this.getUsers(); 
            },
            onCloseEdit() {
                this.showEditModal = false;
                this.getUsers(); 
            },
            onCloseDeleteModal() { 
                this.showDeleteModal = false; 
                this.getUsers();
            },
        }
    }

    
</script> 