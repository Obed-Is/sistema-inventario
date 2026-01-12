<template>
    <div class="btn-link">
        <slot />
        <p>{{ titulo }}</p>
    </div>
</template>
<script setup>
defineProps({
    titulo: String
})
</script>
<style scoped>
.btn-link {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 15px;
    gap: 10px;
    cursor: pointer;
    border-radius: var(--card-radius);
    transition: .2s all ease-in-out;
    p {
        pointer-events: none;
    }
}
</style>