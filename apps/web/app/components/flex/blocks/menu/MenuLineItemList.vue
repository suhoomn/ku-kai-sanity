<template>
  <div class="flex flex-col gap-4 flex-1">
    <div v-for="(item, index) in items" :key="index" class="flex flex-col gap-1">
      <div class="flex items-baseline justify-between gap-4">
        <span class="menu-item-name text-xl font-bold flex-1">{{ item.name }}</span>
        <span v-if="item.price" class="text-xl font-bold shrink-0 tabular-nums">
          {{ formatMenuPrice(item.price) }}
        </span>
      </div>
      <p v-if="lineDetail(item)" class="menu-item-detail text-base leading-relaxed" :class="mutedClasses">
        {{ lineDetail(item) }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
  mutedClasses: {
    type: String,
    default: '',
  },
});

function lineDetail(item) {
  const ingredients = (item.ingredients || []).filter(Boolean).join(', ');
  return ingredients || item.note || '';
}

function formatMenuPrice(price) {
  if (!price) {
    return '';
  }
  return String(price).replace(/\s*kr\.?\s*/gi, '');
}
</script>
