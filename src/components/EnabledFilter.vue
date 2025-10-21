<template>
    <div class="mt-4">
        <CFormSwitch
        size="xl" 
        label="Habilitado"
        v-model="checked"
        @change="filter"
    />
    </div>
    
</template>

<script setup>
    import { ref, defineEmits } from 'vue';

    const checked = ref(false);
    const emit = defineEmits(['filter']);

    const filter = (e) => {
        emit('filter', !checked.value);
    }
</script>