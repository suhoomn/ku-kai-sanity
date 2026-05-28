<template>
  <div class="menu-featured__hero w-full">
    <div class="menu-featured__visual w-full">
      <h3
        class="menu-featured__title text-center text-[#F3EC26] w-full"
        :class="
          variant === 'vegan'
            ? 'menu-featured__title--vegan font-yuji'
            : 'menu-featured__title--kukai font-display'
        "
      >
        {{ ramen.title }}
      </h3>

      <div v-if="ramen.image" class="menu-featured__photo-wrap w-full flex justify-center">
        <div class="menu-featured__photo">
          <CmPicture
            :image-object="ramen.image"
            classes="w-full h-auto object-contain"
            :lazy="true"
          />
        </div>
      </div>
    </div>

    <div class="menu-featured__items flex flex-col gap-3 md:gap-4 w-full">
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

<style scoped>
.menu-featured__hero,
.menu-featured__visual,
.menu-featured__photo-wrap,
.menu-featured__photo {
  overflow: visible;
}

.menu-featured__title--vegan {
  font-weight: 300;
  letter-spacing: 0.01em;
  text-transform: none;
}

.menu-featured__visual {
  margin-top: 0;
}

.menu-featured__photo-wrap {
  margin-bottom: 1rem;
}

.menu-featured__items {
  margin-top: 1.25rem;
}

@media (min-width: 768px) {
  .menu-featured__visual {
    margin-top: -8rem;
  }

  .menu-featured__items {
    margin-top: 1.5rem;
  }
}
</style>
