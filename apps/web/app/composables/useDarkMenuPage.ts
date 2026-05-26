import { useCoreStore } from '~/stores/core';

/**
 * True when the current page includes a Menu Block using the dark background.
 */
export function useDarkMenuPage() {
  const coreStore = useCoreStore();

  const isDarkMenuPage = computed(() => {
    const content = coreStore.getCurrentPage?.content;
    if (!Array.isArray(content)) {
      return false;
    }

    return content.some(
      (block) =>
        block._type === 'menuBlock' &&
        (block.backgroundColor ?? 'dark') === 'dark',
    );
  });

  return { isDarkMenuPage };
}
