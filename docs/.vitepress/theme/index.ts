import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "virtual:group-icons.css";
import "./style.css";
import Layout from "./Layout.vue";

export default {
  extends: DefaultTheme,
  // Use the default layout directly to avoid unintentionally replacing layout slots
  Layout,
  enhanceApp({ app, router, siteData }) {},
} satisfies Theme;
