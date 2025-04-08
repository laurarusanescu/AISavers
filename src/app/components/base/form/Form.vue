<template>
  <form :class="$style.fields" action="#" @submit="submit">
    <slot />
  </form>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'submit'): void;
}>();

const submit = (e: Event) => {
  emit('submit');
  e.preventDefault();
};
</script>

<style lang="scss" module>
.fields {
  display: flex;
  flex-direction: column;
  width: 250px;
  gap: 12px;
}
</style>
