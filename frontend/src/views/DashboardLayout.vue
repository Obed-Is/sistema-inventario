<template>
    <div class="layout">
        <SidebarComponent class="navbar" />

        <div class="container">
            <RouterView />
        </div>
    </div>
</template>
<script setup>
import SidebarComponent from '@/components/SidebarComponent.vue';
import { RouterView } from 'vue-router';

</script>
<style scoped>
.layout {
    display: flex;
    min-height: 100vh;
    background-color: #F6F6F8;
}

.navbar {
    position: fixed;
    left: 0;
    top: 0;
    width: 270px;
    height: 100vh;
    z-index: 100;
}

.container {
    margin-left: 270px;
    flex: 1;
    min-height: 100vh;
    overflow-y: auto;
}
</style>