<script setup lang="ts">
import DefaultTheme from "vitepress/theme";

const { Layout } = DefaultTheme;

import ColorMode from "./components/color-mode.vue";
import NotFound from "./components/not-found.vue";
</script>

<template>
  <Layout>
    <template #not-found>
      <NotFound />
    </template>
  </Layout>
</template>
