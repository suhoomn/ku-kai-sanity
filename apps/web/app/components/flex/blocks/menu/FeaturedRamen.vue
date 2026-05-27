<template>
  <div class="menu-featured__hero w-full">
    <h3
      class="menu-featured__title text-center text-[#F3EC26] w-full"
      :class="variant === 'vegan' ? 'menu-featured__title--vegan' : 'menu-featured__title--kukai font-display'"
    >
      {{ ramen.title }}
    </h3>

    <div v-if="ramen.image" class="menu-featured__photo-wrap w-full flex justify-center">
      <div class="menu-featured__photo">
        <CmPicture
          :image-object="ramen.image"
          classes="w-full h-full object-cover"
          :lazy="true"
        />
      </div>
    </div>

    <div class="menu-featured__items flex flex-col gap-4 md:gap-5 w-full mt-2 md:mt-4">
      <div
        v-if="ingredientsText"
        class="flex items-start justify-between gap-4 md:gap-6"
      >
        <p class="menu-featured__copy flex-1 leading-snug">{{ ingredientsText }}</p>
        <span v-if="ramen.price" class="menu-featured__price shrink-0 tabular-nums text-xl font-bold">
          {{ formatMenuPrice(ramen.price) }}
        </span>
      </div>

      <div v-if="ramen.addOnName" class="flex items-start justify-between gap-4 md:gap-6">
        <span class="menu-item-name text-xl font-bold flex-1 leading-snug">{{ ramen.addOnName }}</span>
        <span v-if="ramen.addOnPrice" class="menu-featured__price shrink-0 tabular-nums text-xl font-bold">
          {{ formatMenuPrice(ramen.addOnPrice) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  ramen: {
    type: Object,
    required: true,
  },
  variant: {
    type: String,
    required: true,
  },
});

const ingredientsText = computed(() =>
  (props.ramen.ingredients || []).filter(Boolean).join(', '),
);

function formatMenuPrice(price) {
  if (!price) {
    return '';
  }
  return String(price).replace(/\s*kr\.?\s*/gi, '');
}
</script>
