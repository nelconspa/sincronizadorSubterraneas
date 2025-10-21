<template>
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

<script>
    export default {
        name: 'Paginator',
        props: {
            
        }
    }
</script>