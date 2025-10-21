<template>
  <CSidebar
    class="border-end"
    colorScheme="dark"
    position="fixed"
    :unfoldable="sidebarUnfoldable"
    :visible="sidebarVisible"
    @visible-change="
      (event) =>
        $store.commit({
          type: 'updateSidebarVisible',
          value: event,
        })
    "
  >
    <CSidebarHeader class="border-bottom">
      <RouterLink custom to="/" v-slot="{ href, navigate }">
        <CSidebarBrand class="text-center" v-bind="$attrs" as="a" :href="href" @click="navigate">
          <CImage align="center" :src="logoHidrosistemas" rounded  width="200"/>
<!--           <CIcon custom-class-name="sidebar-brand-full" :icon="logo" :height="40" />
 -->          
        </CSidebarBrand>
      </RouterLink>
      <CCloseButton class="d-lg-none" dark @click="$store.commit('toggleSidebar')" />
    </CSidebarHeader>
    <AppSidebarNav />
    <CSidebarFooter class="border-top d-none d-lg-flex">
      <CSidebarToggler @click="$store.commit('toggleUnfoldable')" />
    </CSidebarFooter>
  </CSidebar>
</template>

<script>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useStore } from 'vuex';
import { AppSidebarNav } from './AppSidebarNav';
import { logo } from '@/assets/brand/logo';
import { sygnet } from '@/assets/brand/sygnet';
import logoHidrosistemas from '@/assets/brand/hidrosistemas-logo.jpeg';

export default {
  name: 'AppSidebar',
  components: {
    AppSidebarNav,
    RouterLink,
  },
  setup() {
    const store = useStore()
    return {
      logo,
      sygnet,
      sidebarUnfoldable: computed(() => store.state.sidebarUnfoldable),
      sidebarVisible: computed(() => store.state.sidebarVisible),
      logoHidrosistemas
    }
  },
}
</script>
