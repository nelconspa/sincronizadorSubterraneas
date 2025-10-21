export default [
  {
    component: 'CNavItem',
    name: 'Inicio',
    to: '/dashboard',
    icon: 'pen-to-square',
    badge: {
      color: 'primary',
      text: 'NEW',
    },
  },
  {
    component: 'CNavTitle',
    name: 'SINCRONIZACIÓN',
  },
  {
    component: 'CNavItem',
    name: 'Estado de sincronización',
    to: '/sync-status',
    icon: 'cil-task',
  },
  {
    component: 'CNavItem',
    name: 'Crear tareas',
    to: '/create-task',
    icon: 'cil-plus',
  },
  {
    component: 'CNavItem',
    name: 'Tareas en cola',
    to: '/task-queue',
    icon: 'cil-calendar',
  },
  {
    component: 'CNavItem',
    name: 'Fallidas Zeus',
    to: '/failed-tasks-zeus',
    icon: 'cil-settings',
  },
  {
    component: 'CNavItem',
    name: 'Fallidas DGA',
    to: '/failed-tasks-dga',
    icon: 'cil-settings',
  },
  {
    component: 'CNavItem',
    name: 'Últimas Tareas',
    to: '/last-tasks',
    icon: 'cil-settings',
  },

  
  {
    component: 'CNavTitle',
    name: 'CONFIGURACIÓN DE CLIENTES',
  },
  {
    component: 'CNavItem',
    name: 'Clientes',
    to: '/clients',
    icon: 'cil-group',
  },
  
  {
    component: 'CNavItem',
    name: 'Configuraciones',
    to: '/client-configs',
    icon: 'cil-puzzle',
  },
  
  {
    component: 'CNavItem',
    name: 'Dispositivos',
    to: '/devices',
    icon: 'cil-audio',
  },
  
  
  {
    component: 'CNavTitle',
    name: 'ADMINISTRACIÓN',
  },
  
  {
    component: 'CNavItem',
    name: 'Usuarios',
    to: '/users',
    icon: 'cil-user',
  },
  

  // {
  //   component: 'CNavItem',
  //   name: 'Download CoreUI',
  //   href: 'http://coreui.io/vue/',
  //   icon: { name: 'cil-cloud-download', class: 'text-white' },
  //   _class: 'bg-success text-white',
  //   target: '_blank'
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Try CoreUI PRO',
  //   href: 'http://coreui.io/pro/vue/',
  //   icon: { name: 'cil-layers', class: 'text-white' },
  //   _class: 'bg-danger text-white',
  //   target: '_blank'
  // }
]
