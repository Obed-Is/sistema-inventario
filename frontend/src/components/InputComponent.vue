<template>
    <label>
        {{ lbl }}
        <!-- Se manda el evento input y ese emit para mostrar el valor que se ingresa desde el componente padre -->
        <input :type="type" :name="name" :id="id" :placeholder="placeholder"
            @input="$emit('update:modelValue', $event.target.value)">
        <slot />
        <span v-if="error" class="errores">{{ error }}</span>
    </label>
</template>

<script setup>
defineProps({
    lbl: String,
    type: { default: 'text' },
    name: String,
    id: String,
    placeholder: String,
    modelValue: String,
    error: String
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
label {
    position: relative;
    display: flex;
    flex-direction: column;
    color: #161616;
    font-size: 16px;

    input {
        outline: none;
        margin-top: 3px;
        padding: 7px 3px 7px 30px;
        background-color: #fffdfd;
        border: 1px solid var(--border-color);
        border-radius: 5px;
    }

    .input-lock {
        cursor: pointer;
    }

    .input-icon {
        position: absolute;
        width: 20px;
        height: 20px;
        top: 31px;
        left: 5px;
        color: var(--muted-text);
    }
}

.errores {
    font-size: 0.9em;
    color: var(--muted-text);
}
</style>