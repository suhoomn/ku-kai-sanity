<template>
    <div
      @click="handleOutsideClick"
      class="min-h-screen"
      :class="isDarkMenuPage ? 'bg-menu-bg text-white' : 'bg-primary'"
    >
      
        
        <SiteHeader/>
        <div
          id="slot"
          :class="[
            coreStore.getShowMenu ? 'blur-sm' : '',
            isDarkMenuPage ? 'layout-slot--below-fixed-header' : '',
          ]"
        >
            <slot></slot>
        </div>
        <SiteFooter />
        
        <!-- Form Modal -->
        <FormModal />
      
    </div>
</template>

<script setup>
import { useCoreStore } from '~/stores/core';
import FormModal from '~/components/ui/FormModal.vue';
import { useDarkMenuPage } from '~/composables/useDarkMenuPage';

const coreStore = useCoreStore();
const { isDarkMenuPage } = useDarkMenuPage();

// Get the current route to fetch page data for header styling
const route = useRoute();

// Get the slug from the route params
const slug = computed(() => {
  const slugArray = route.params.slug
  return Array.isArray(slugArray) ? slugArray.join('/') : slugArray
})

// Fetch page data to get darkHeader value for header styling
const { page: pageData } = await useCheckmateSingle({
  path: slug.value || '' // Pass empty string for frontpage to let composable handle it
})

// Set current page in store if data exists
if (pageData.value) {
  coreStore.setCurrentPage(pageData.value)
}

watch(
  isDarkMenuPage,
  (isDark) => {
    if (!import.meta.client) return;
    document.body.classList.toggle('bg-menu-bg', isDark);
    document.body.classList.toggle('bg-primary', !isDark);
    document.body.classList.remove('bg-black');
    document.body.classList.toggle('text-white', isDark);
    document.body.classList.toggle('text-black', !isDark);
  },
  { immediate: true },
);

onUnmounted(() => {
  if (!import.meta.client) return;
  document.body.classList.remove('bg-menu-bg', 'text-white');
  document.body.classList.add('bg-primary', 'text-black');
});

function handleOutsideClick(event) {

  if (coreStore.getShowMenu && window.innerWidth >= 640) {
    const burgerMenu = document.querySelector('.burger-menu');
    const burgerIcon = document.querySelector('button[class*="z-\\[26\\]"]');
    
    if (burgerMenu && burgerIcon && 
        !burgerMenu.contains(event.target) && 
        !burgerIcon.contains(event.target)) {
      coreStore.toggleShowMenu();
    }
  }
}
</script>
