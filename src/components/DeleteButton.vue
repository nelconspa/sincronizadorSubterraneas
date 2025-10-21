<template>
    <CButton
        @click="handleClick"
        :color="color"
    >
        {{ buttonText }}
    </CButton>
</template>

<script>
    export default {
        name: 'DeleteButton',
        emits: ['click'],
        props: {
            color: {
                type: String,
                default: "danger"
            },
            buttonText: {
                type: String,
                default: 'Eliminar'
            }
        },

        methods: {
            handleClick() {
                this.$emit("click"); 
            }
        }
    }
</script>