import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import "virtual:group-icons.css";
import "./style.css";

export default {
  extends: DefaultTheme,
  // Use the default layout directly to avoid unintentionally replacing layout slots
  Layout: Layout,
  enhanceApp({ app, router, siteData }) {},
} satisfies Theme;
