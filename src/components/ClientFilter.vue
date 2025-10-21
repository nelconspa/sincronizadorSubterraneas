<template>
    <label class="form-label">Seleccione cliente</label>
    <v-select 
        multiple
        v-model="selectedClients" 
        :options="clients"
        @option:selected="filter"
        @option:deselected="filter" 
        :reduce="client => client.id"
        label="name"
        placeholder="Seleccione..."
    />
</template>

<script>
    import { defineEmits } from 'vue';
    import axios from 'axios';
    export default { 
        emits: ['filter', 'fetch-devices'],
    
        data() {
            return {
                clients: [],
                selectedClients: []
            }
            

        },

        mounted() {
            this.getClientsData(); 
        },

        methods: {
            async getClientsData() {
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
                    
                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.ShowError = true;
                        
                        // this.errorMsg = "Ha ocurrido un error: " + error;
                }
             
            },
            filter(e) {
                console.log(this.selectedClients);
                this.$emit('filter', this.selectedClients);
                
            }
        }
    }
    
</script>