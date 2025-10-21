<template>
    <label class="form-label">Seleccione dispositivo</label>
    <v-select 
        multiple
        v-model="selectedDevices" 
        :options="allDevices"
        @option:selected="filter"
        @option:deselected="filter"
        :reduce="device => device.id"
        label="zeusName"
        placeholder="Seleccione..."
    />
</template>

<script>
    import { defineEmits } from 'vue';
    import axios from 'axios';
    export default { 
        emits: ['filter'],
        props: {
            allDevices: Array,
        },
        data() {
            return {
                selectedDevices: []
            }
            

        },

    
        methods: {
            
            filter(e) {
                this.$emit('filter', this.selectedDevices); 
            }
        }
    }
    
</script>