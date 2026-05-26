<template>
  <div class="w-full" :class="containerClasses">
    <div
      class="px-8 md:px-16 max-w-[1480px] mx-auto w-full"
      :class="contentPaddingClasses"
    >
      <div
        v-if="!useColumnLayout && (componentData.header || componentData.eyebrow || componentData.subheader)"
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

      <template v-if="componentData.menuSections?.length">
        <!-- Column grid (Sanity layout: featured | list | half) -->
        <div
          v-if="useColumnLayout"
          class="menu-grid grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-x-20 md:gap-y-10"
        >
          <template
            v-for="({ section, layout }, sectionIndex) in gridSections"
            :key="`section-${sectionIndex}-${section.title || layout}`"
          >
            <article
              v-if="layout === 'featured'"
              class="menu-grid__featured menu-featured flex flex-col min-h-0"
            >
              <div class="menu-featured__hero w-full">
                <h3
                  class="menu-featured__title text-center text-[#F3EC26] w-full"
                  :class="isVeganSection(section) ? 'menu-featured__title--vegan' : 'menu-featured__title--kukai font-display'"
                >
                  {{ getFeaturedTitle(section) }}
                </h3>

                <div class="menu-featured__photo-wrap w-full flex justify-center">
                  <div
                    class="menu-featured__photo"
                    :class="{ 'menu-featured__photo--placeholder': !section.image }"
                  >
                    <CmPicture
                      v-if="section.image"
                      :image-object="section.image"
                      classes="w-full h-full object-cover"
                      :lazy="true"
                    />
                    <img
                      v-else
                      :src="getFeaturedPhotoPlaceholder(section)"
                      :alt="getPhotoPlaceholderLabel(section)"
                      class="menu-featured__photo-placeholder-image"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              <div class="menu-featured__items flex flex-col gap-4 md:gap-5 w-full mt-2 md:mt-4">
                <div
                  v-for="(item, itemIndex) in section.items"
                  :key="itemIndex"
                  :class="isVariantMenuItem(item) ? 'menu-featured__variant' : 'menu-featured__base'"
                >
                  <div
                    v-if="hasIngredients(item)"
                    class="flex items-start justify-between gap-4 md:gap-6"
                  >
                    <p class="menu-featured__copy flex-1 leading-snug">
                      {{ formatIngredients(item) }}
                    </p>
                    <span
                      v-if="item.price"
                      class="menu-featured__price shrink-0 tabular-nums text-xl font-bold"
                    >
                      {{ formatMenuPrice(item.price) }}
                    </span>
                  </div>

                  <div
                    v-else-if="item.name"
                    class="flex items-start justify-between gap-4 md:gap-6"
                  >
                    <span class="menu-item-name text-xl font-bold flex-1 leading-snug">
                      {{ item.name }}
                    </span>
                    <span v-if="item.price" class="menu-featured__price shrink-0 tabular-nums text-xl font-bold">
                      {{ formatMenuPrice(item.price) }}
                    </span>
                  </div>

                  <p v-if="item.description" class="menu-featured__copy mt-1 leading-snug" :class="descriptionTextClasses">
                    {{ item.description }}
                  </p>
                </div>
              </div>
            </article>

            <section v-else-if="layout === 'list'" class="col-span-1 md:col-span-2 menu-toppings">
              <div class="menu-toppings__box h-full px-6 py-8 md:px-10 md:py-10" :class="menuBoxClasses">
                <div class="menu-toppings__inner flex flex-col md:flex-row md:items-start gap-6 md:gap-x-10 md:gap-y-0">
                  <h3 class="menu-toppings__title font-headline shrink-0 uppercase mb-0">
                    {{ getToppingsTitle(section) }}
                  </h3>

                  <div class="menu-toppings__grid flex-1 w-full min-w-0 gap-y-4 gap-x-8 md:gap-x-12">
                    <div
                      v-for="(item, itemIndex) in section.items"
                      :key="itemIndex"
                      class="menu-toppings__row flex items-baseline justify-between gap-3"
                    >
                      <span class="menu-item-name text-xl font-bold">{{ item.name }}</span>
                      <span v-if="item.price" class="menu-toppings__item-price shrink-0 tabular-nums text-xl font-bold">
                        {{ formatMenuPrice(item.price) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section v-else-if="layout === 'half'" class="menu-grid__half min-h-0">
              <div
                class="border rounded-lg px-6 py-8 md:px-8 md:py-10 h-full flex flex-col"
                :class="menuBoxClasses"
              >
                <h3 class="text-2xl md:text-3xl font-display uppercase tracking-wide text-[#F3EC26] mb-6 md:mb-8">
                  {{ section.title }}
                </h3>

                <div class="flex flex-col gap-4 flex-1">
                  <div
                    v-for="(item, itemIndex) in section.items"
                    :key="itemIndex"
                    class="flex flex-col gap-1"
                  >
                    <div class="flex items-baseline justify-between gap-4">
                      <span class="menu-item-name text-xl font-bold flex-1">{{ item.name }}</span>
                      <span v-if="item.price" class="text-xl font-bold shrink-0 tabular-nums">
                        {{ formatMenuPrice(item.price) }}
                      </span>
                    </div>
                    <p
                      v-if="hasIngredients(item)"
                      class="menu-item-detail text-base leading-relaxed"
                      :class="mutedTextClasses"
                    >
                      {{ formatIngredients(item) }}
                    </p>
                    <p v-if="item.description" class="menu-item-detail text-base" :class="descriptionTextClasses">
                      {{ item.description }}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </template>
        </div>

        <!-- Fallback: sections without layout field (stacked cards) -->
        <div v-else class="flex flex-col gap-8 md:gap-10">
          <section
            v-for="(section, sectionIndex) in componentData.menuSections"
            :key="sectionIndex"
            class="border rounded-lg px-6 py-8 md:px-8 md:py-10"
            :class="menuBoxClasses"
          >
            <h3 class="text-2xl md:text-3xl font-display uppercase tracking-wide text-[#F3EC26] mb-6">
              {{ section.title }}
            </h3>
            <div class="flex flex-col gap-4">
              <div
                v-for="(item, itemIndex) in section.items"
                :key="itemIndex"
                class="flex flex-col gap-1"
              >
                <div class="flex items-baseline justify-between gap-4">
                  <span class="menu-item-name text-xl font-bold flex-1">{{ item.name }}</span>
                  <span v-if="item.price" class="text-xl font-bold shrink-0 tabular-nums">
                    {{ formatMenuPrice(item.price) }}
                  </span>
                </div>
                <p v-if="hasIngredients(item)" class="menu-item-detail text-base" :class="mutedTextClasses">
                  {{ formatIngredients(item) }}
                </p>
                <p v-if="item.description" class="menu-item-detail text-base" :class="descriptionTextClasses">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </section>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useCheckmateFlexSettings } from '~/composables/checkmateFlexSettings';

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

const descriptionTextClasses = computed(() =>
  isDarkBackground.value ? 'text-white/70' : 'text-black/70',
);

function getSectionLayout(section) {
  const layout = section.layout;
  if (layout === 'featured' || layout === 'list' || layout === 'half') {
    return layout;
  }
  return null;
}

const useColumnLayout = computed(() =>
  (componentData.value.menuSections || []).some((section) => getSectionLayout(section) !== null),
);

const gridSections = computed(() => {
  const sections = componentData.value.menuSections || [];
  if (!useColumnLayout.value) {
    return [];
  }

  const featured = sections.filter((section) => getSectionLayout(section) === 'featured');
  const others = sections
    .filter((section) => getSectionLayout(section) !== 'featured')
    .map((section) => ({ section, layout: getSectionLayout(section) }))
    .filter((entry) => entry.layout);

  const kukai =
    featured.find((section) => /kukai|ku-kai/i.test(section.title || '') && !/vegan/i.test(section.title || '')) ||
    featured.find((section) => !isVeganSection(section));
  const vegan = featured.find((section) => isVeganSection(section));

  const orderedFeatured = [];
  if (kukai) {
    orderedFeatured.push({ section: kukai, layout: 'featured' });
  }
  if (vegan && vegan !== kukai) {
    orderedFeatured.push({ section: vegan, layout: 'featured' });
  }

  return [...orderedFeatured, ...others];
});

function hasIngredients(item) {
  return Array.isArray(item.ingredients) && item.ingredients.length > 0;
}

function formatIngredients(item) {
  return item.ingredients.join(', ');
}

function formatMenuPrice(price) {
  if (!price) {
    return '';
  }
  return String(price).replace(/\s*kr\.?\s*/gi, '');
}

function isVeganSection(section) {
  return /vegan/i.test(section.title || '');
}

function getFeaturedTitle(section) {
  if (isVeganSection(section)) {
    return section.title?.trim() || 'Vegan tan-tan men';
  }

  const title = section.title?.trim();
  if (!title || /^ramen$/i.test(title) || /^ku[- ]?kai(\s+ramen)?$/i.test(title)) {
    return 'KU-KAI RAMEN';
  }

  return title;
}

function getToppingsTitle(section) {
  const title = section.title?.trim();
  return title ? title.toUpperCase() : 'TOPPINGS';
}

const FEATURED_PHOTO_PLACEHOLDERS = {
  kukai: '/images/menu/kukai-ramen.png',
  vegan: '/images/menu/vegan-ramen.png',
};

function getFeaturedPhotoPlaceholder(section) {
  return isVeganSection(section)
    ? FEATURED_PHOTO_PLACEHOLDERS.vegan
    : FEATURED_PHOTO_PLACEHOLDERS.kukai;
}

function getPhotoPlaceholderLabel(section) {
  return isVeganSection(section) ? 'Vegan ramen' : 'Kū-Kai ramen';
}

function isVariantMenuItem(item) {
  return Boolean(item.name?.trim().startsWith('+'));
}

const containerClasses = computed(() => {
  let classes = getContainerClasses('background', 'text', 'padding', 'margin');

  if (componentData.value.container === 'contained') {
    classes.push(...getContainerClasses('width'));
  }

  if (!componentData.value.customPadding) {
    classes.push('py-16');
  }

  return classes.join(' ');
});

const contentPaddingClasses = computed(() => {
  if (useColumnLayout.value) {
    return 'pb-8 md:pb-16';
  }

  if (props.index === 0) {
    return 'pt-[7.5rem] pb-8 md:pt-[8.75rem] md:pb-16';
  }

  return 'py-8 md:py-16';
});
</script>

<style scoped>
.menu-grid {
  --menu-title-min: 1.75rem;
  --menu-title-fluid: 4vw;
  --menu-title-max: 4rem;
  --menu-topping-title-min: 1.5rem;
  --menu-topping-title-fluid: 2.75vw;
  --menu-topping-title-max: 2.938rem;
  --menu-photo-max-width: 28.125rem;
  --menu-photo-ratio: 585 / 524;
  --menu-photo-fluid: 30vw;
  --menu-featured-photo-overlap: clamp(2.75rem, 7vw, 4.5rem);
}

.menu-featured__hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5rem;
}

.menu-featured__title {
  position: relative;
  z-index: 2;
  text-align: center;
  font-size: clamp(var(--menu-title-min), var(--menu-title-fluid), var(--menu-title-max));
  line-height: 0.95;
  margin-bottom: 0;
  text-shadow: 0 0 18.3px #000000;
}

.menu-featured__title--kukai {
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.menu-featured__title--vegan {
  font-family: 'Yuji Boku', serif;
  font-weight: 300;
  letter-spacing: 0.01em;
  text-transform: none;
}

.menu-featured__photo-wrap {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: calc(-1 * var(--menu-featured-photo-overlap, 3.5rem) + 45px);
  margin-bottom: 0.25rem;
}

.menu-featured__photo {
  width: min(
    100%,
    clamp(17.5rem, var(--menu-photo-fluid, 38vw), var(--menu-photo-max-width, 36.5625rem))
  );
  aspect-ratio: var(--menu-photo-ratio, 585 / 524);
  height: auto;
  overflow: hidden;
  flex-shrink: 0;
}

.menu-featured__photo--placeholder {
  aspect-ratio: auto;
  height: auto;
  overflow: visible;
  background: transparent;
  width: min(
    100%,
    clamp(14rem, var(--menu-photo-fluid, 30vw), var(--menu-photo-max-width, 28.125rem))
  );
}

.menu-featured__photo-placeholder-image {
  display: block;
  width: 100%;
  height: auto;
  background: transparent;
}

.menu-featured__copy {
  font-family: var(--theme-font_paragraph_font_family, 'Roboto', sans-serif);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.95);
}

@media (min-width: 768px) {
  .menu-featured__copy {
    font-size: 1rem;
  }
}

.menu-item-detail {
  font-family: var(--theme-font_paragraph_font_family, 'Roboto', sans-serif);
  line-height: 1.45;
}

.menu-featured__price {
  font-family: var(--theme-font_paragraph_font_family, 'Roboto', sans-serif);
  color: rgba(255, 255, 255, 0.95);
  padding-top: 0.125rem;
}

.menu-item-name {
  font-family: var(--theme-font_paragraph_font_family, 'Roboto', sans-serif);
  line-height: 1.4;
}

.menu-featured__items {
  max-width: 26rem;
}

@media (min-width: 768px) {
  .menu-featured__items {
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
