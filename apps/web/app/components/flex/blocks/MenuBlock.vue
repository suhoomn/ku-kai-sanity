<template>
  <div class="w-full" :class="containerClasses">
    <div
      class="px-5 sm:px-8 md:px-12 lg:px-16 max-w-[1480px] mx-auto w-full"
      :class="contentPaddingClasses"
    >
      <div
        v-if="!menuHasContent && (componentData.header || componentData.eyebrow || componentData.subheader)"
        class="mb-12 md:mb-16 text-center"
      >
        <p v-if="componentData.eyebrow" class="eyebrow text-sm uppercase mb-4">
          {{ componentData.eyebrow }}
        </p>
        <h2 v-if="componentData.header" class="text-3xl md:text-4xl font-semibold mb-4">
          {{ componentData.header }}
        </h2>
        <div v-if="componentData.subheader" class="text-lg" v-html="componentData.subheader"></div>
      </div>

      <div
        v-if="menuHasContent"
        class="menu-grid grid grid-cols-1 md:grid-cols-2 gap-y-12 sm:gap-y-14 md:gap-x-10 md:gap-y-8 lg:gap-x-16 lg:gap-y-6"
      >
        <article
          v-if="menu.kukai"
          class="menu-grid__featured menu-featured flex flex-col overflow-visible"
        >
          <FeaturedRamen :ramen="menu.kukai" variant="kukai" />
        </article>

        <article
          v-if="menu.vegan"
          class="menu-grid__featured menu-featured flex flex-col overflow-visible"
        >
          <FeaturedRamen :ramen="menu.vegan" variant="vegan" />
        </article>

        <section v-if="menu.toppings.length" class="col-span-1 md:col-span-2 menu-toppings">
          <div class="menu-toppings__box h-full px-5 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10" :class="menuBoxClasses">
            <div class="menu-toppings__inner flex flex-col md:flex-row md:items-start gap-6 md:gap-x-10 md:gap-y-0">
              <h3 class="menu-toppings__title font-headline shrink-0 uppercase mb-0">TOPPINGS</h3>
              <div class="menu-toppings__grid flex-1 w-full min-w-0 gap-y-4 gap-x-8 md:gap-x-12">
                <div
                  v-for="(item, itemIndex) in menu.toppings"
                  :key="`topping-${itemIndex}`"
                  class="menu-toppings__row flex items-baseline justify-between gap-3"
                >
                  <span class="menu-item-name text-lg sm:text-xl font-bold">{{ item.name }}</span>
                  <span v-if="item.price" class="menu-toppings__item-price shrink-0 tabular-nums text-lg sm:text-xl font-bold">
                    {{ formatMenuPrice(item.price) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section v-if="menu.sides.length" class="menu-grid__half">
          <div class="border rounded-lg px-5 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 h-full flex flex-col" :class="menuBoxClasses">
            <h3 class="text-xl sm:text-2xl md:text-3xl font-display uppercase tracking-wide text-[#F3EC26] mb-5 sm:mb-6 md:mb-8">SIDES</h3>
            <MenuLineItemList :items="menu.sides" :muted-classes="mutedTextClasses" />
          </div>
        </section>

        <section v-if="menu.drinks.length" class="menu-grid__half">
          <div class="border rounded-lg px-5 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 h-full flex flex-col" :class="menuBoxClasses">
            <h3 class="text-xl sm:text-2xl md:text-3xl font-display uppercase tracking-wide text-[#F3EC26] mb-5 sm:mb-6 md:mb-8">DRINKS</h3>
            <MenuLineItemList :items="menu.drinks" :muted-classes="mutedTextClasses" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCheckmateFlexSettings } from '~/composables/checkmateFlexSettings';
import { normalizeMenuBlockData, menuHasContent as checkMenuHasContent } from '~/composables/useMenuBlockData';
import FeaturedRamen from '~/components/flex/blocks/menu/FeaturedRamen.vue';
import MenuLineItemList from '~/components/flex/blocks/menu/MenuLineItemList.vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: Number,
    default: 0,
  },
});

const componentData = computed(() => props.data);

const menu = computed(() => normalizeMenuBlockData(componentData.value));

const menuHasContent = computed(() => checkMenuHasContent(menu.value));

const flexSettings = computed(() => ({
  ...componentData.value,
  backgroundColor: componentData.value.backgroundColor ?? 'dark',
  textColor: componentData.value.textColor ?? 'light',
}));

const { getContainerClasses } = useCheckmateFlexSettings(flexSettings);

const isDarkBackground = computed(() => flexSettings.value.backgroundColor === 'dark');

const menuBoxClasses = computed(() =>
  isDarkBackground.value ? 'border-white/30 text-white' : 'border-black text-black',
);

const mutedTextClasses = computed(() =>
  isDarkBackground.value ? 'text-white/90' : 'text-black/85',
);

function formatMenuPrice(price) {
  if (!price) {
    return '';
  }
  return String(price).replace(/\s*kr\.?\s*/gi, '');
}

const containerClasses = computed(() => {
  let classes = getContainerClasses('background', 'text', 'padding', 'margin');

  if (componentData.value.container === 'contained') {
    classes.push(...getContainerClasses('width'));
  }

  if (!componentData.value.customPadding) {
    classes.push(menuHasContent.value ? 'pt-0 pb-10 md:pb-12' : 'py-16');
  }

  return classes.join(' ');
});

const contentPaddingClasses = computed(() => {
  if (menuHasContent.value) {
    return props.index === 0
      ? 'pt-[4.75rem] pb-6 sm:pt-[5rem] md:pt-[5.25rem] lg:pt-[5.75rem] md:pb-8 lg:pb-10'
      : 'pb-6 md:pb-8 lg:pb-10';
  }

  if (props.index === 0) {
    return 'pt-[7.5rem] pb-8 md:pt-[8.75rem] md:pb-16';
  }

  return 'py-8 md:py-16';
});
</script>

<style scoped>
/* Mobile-first; desktop (lg+) matches tuned full-screen layout */
.menu-grid {
  --menu-title-min: 1.375rem;
  --menu-title-fluid: 7vw;
  --menu-title-max: 2.25rem;
  --menu-topping-title-min: 1.375rem;
  --menu-topping-title-fluid: 5vw;
  --menu-topping-title-max: 2.25rem;
  --menu-photo-min: 11.5rem;
  --menu-photo-max-width: 15.5rem;
  --menu-photo-fluid: 76vw;
  --menu-featured-body-pull: 52px;
  --menu-featured-block-offset: 1.5rem;
  --menu-featured-hero-lift: 0rem;
  --menu-featured-items-gap: 1.25rem;
  --menu-featured-photo-gap: 0.875rem;
  overflow: visible;
}

.menu-grid__featured {
  overflow: visible;
  isolation: isolate;
}

/* Large phones */
@media (min-width: 480px) {
  .menu-grid {
    --menu-title-max: 2.5rem;
    --menu-photo-min: 12.5rem;
    --menu-photo-max-width: 17rem;
    --menu-photo-fluid: 68vw;
    --menu-featured-body-pull: 58px;
    --menu-featured-block-offset: 1.75rem;
  }
}

/* Small tablet / large phone landscape */
@media (min-width: 640px) {
  .menu-grid {
    --menu-title-max: 2.75rem;
    --menu-photo-min: 14rem;
    --menu-photo-max-width: 19rem;
    --menu-photo-fluid: 58vw;
    --menu-featured-body-pull: 62px;
    --menu-featured-block-offset: 2rem;
    --menu-featured-items-gap: 1.375rem;
    --menu-featured-photo-gap: 1rem;
  }
}

/* Tablet: two columns */
@media (min-width: 768px) {
  .menu-grid {
    --menu-title-min: 1.5rem;
    --menu-title-fluid: 3.8vw;
    --menu-title-max: 3rem;
    --menu-photo-min: 15rem;
    --menu-photo-max-width: 22rem;
    --menu-photo-fluid: 40vw;
    --menu-featured-body-pull: 66px;
    --menu-featured-block-offset: 2.25rem;
    --menu-featured-hero-lift: 3.5rem;
    --menu-featured-items-gap: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .menu-grid {
    --menu-title-fluid: 3.2vw;
    --menu-title-max: 4rem;
    --menu-photo-min: 19rem;
    --menu-photo-max-width: 30rem;
    --menu-photo-fluid: 34vw;
    --menu-featured-body-pull: 70px;
    --menu-featured-block-offset: 40px;
    --menu-featured-hero-lift: 8rem;
    --menu-featured-photo-gap: 1rem;
  }
}

/* Large desktop */
@media (min-width: 1280px) {
  .menu-grid {
    --menu-photo-min: 21rem;
    --menu-photo-max-width: 33rem;
    --menu-photo-fluid: 36vw;
  }
}

@media (max-width: 767px) {
  .menu-grid__featured {
    padding-bottom: 0.75rem;
  }

  .menu-grid :deep(.menu-featured__hero) {
    margin-bottom: 1rem;
  }

  .menu-grid :deep(.menu-featured__items) {
    max-width: none;
    padding-left: 0;
    padding-right: 0;
  }

  .menu-toppings__inner {
    flex-direction: column;
  }
}

.menu-grid :deep(.menu-featured__hero) {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: calc(var(--menu-featured-block-offset) - var(--menu-featured-hero-lift));
  margin-bottom: 0.25rem;
  overflow: visible;
}

.menu-grid :deep(.menu-featured__title) {
  position: relative;
  z-index: 3;
  flex-shrink: 0;
  text-align: center;
  font-size: clamp(var(--menu-title-min), var(--menu-title-fluid), var(--menu-title-max));
  line-height: 0.95;
  margin: 0;
  padding-bottom: 0;
  text-shadow:
    0 0 18px #000,
    0 2px 8px rgba(0, 0, 0, 0.85);
}

/* Photo + ingredients: pull up toward fixed title (no extra gap on title) */
.menu-grid :deep(.menu-featured__below-title) {
  position: relative;
  z-index: 1;
  width: 100%;
  margin-top: calc(-1 * var(--menu-featured-body-pull));
}

.menu-grid :deep(.menu-featured__title--kukai) {
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.menu-grid :deep(.menu-featured__title--vegan) {
  font-family: 'Yuji Boku', serif;
  font-weight: 300;
  letter-spacing: 0.01em;
  text-transform: none;
}

.menu-grid :deep(.menu-featured__photo-wrap) {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 0;
  margin-bottom: var(--menu-featured-photo-gap);
  overflow: visible;
}

.menu-grid :deep(.menu-featured__photo) {
  width: min(
    100%,
    clamp(var(--menu-photo-min), var(--menu-photo-fluid), var(--menu-photo-max-width))
  );
  height: auto;
  overflow: visible;
  flex-shrink: 0;
  line-height: 0;
}

.menu-grid :deep(.menu-featured__photo picture),
.menu-grid :deep(.menu-featured__photo img) {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.menu-grid :deep(.menu-featured__copy) {
  font-family: var(--theme-font_paragraph_font_family, 'Roboto', sans-serif);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.95);
}

@media (min-width: 768px) {
  .menu-grid :deep(.menu-featured__copy) {
    font-size: 1rem;
  }
}

.menu-item-detail {
  font-family: var(--theme-font_paragraph_font_family, 'Roboto', sans-serif);
  line-height: 1.45;
}

.menu-grid :deep(.menu-featured__price) {
  font-family: var(--theme-font_paragraph_font_family, 'Roboto', sans-serif);
  color: rgba(255, 255, 255, 0.95);
  padding-top: 0.125rem;
}

.menu-item-name {
  font-family: var(--theme-font_paragraph_font_family, 'Roboto', sans-serif);
  line-height: 1.4;
}

.menu-grid :deep(.menu-featured__items) {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 26rem;
  margin-top: var(--menu-featured-items-gap);
}

@media (min-width: 768px) {
  .menu-grid :deep(.menu-featured__items) {
    max-width: none;
  }
}

.menu-toppings__box {
  border-width: 1px;
  border-radius: 0;
}

.menu-toppings__inner {
  width: 100%;
}

.menu-toppings__title {
  font-size: clamp(
    var(--menu-topping-title-min),
    var(--menu-topping-title-fluid),
    var(--menu-topping-title-max)
  );
  font-weight: 200;
  line-height: 1;
  letter-spacing: 0.02em;
  color: #fff;
  text-align: left;
  align-self: flex-start;
}

@media (min-width: 768px) {
  .menu-toppings__title {
    padding-top: 0.125rem;
  }
}

.menu-toppings__grid {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .menu-toppings__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.menu-toppings__item-price {
  font-family: var(--theme-font_paragraph_font_family, 'Roboto', sans-serif);
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.95);
}
</style>
