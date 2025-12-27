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
    display: grid;
    grid-template-columns: 270px auto;
    background-color: #F6F6F8;
}
</style>