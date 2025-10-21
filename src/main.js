import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
    faPhone, 
    faClipboard,
    faPenToSquare,
    faTrash

} from '@fortawesome/free-solid-svg-icons'
import DocsExample from '@/components/DocsExample'
import VueDatePicker from '@vuepic/vue-datepicker';
import VueAwesomePaginate from 'vue-awesome-paginate'
import '@vuepic/vue-datepicker/dist/main.css'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
import "vue-awesome-paginate/dist/style.css";


library.add(faPhone);
library.add(faClipboard);
library.add(faPenToSquare);
library.add(faTrash);


const app = createApp(App)
app.use(store)
app.use(router)
app.use(CoreuiVue)
app.use(VCalendar, {})
app.use(VueAwesomePaginate)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsExample', DocsExample)
app.component('VueDatePicker', VueDatePicker);
app.component('v-select', vSelect); 
app.component('font-awesome-icon', FontAwesomeIcon); 



app.mount('#app')
