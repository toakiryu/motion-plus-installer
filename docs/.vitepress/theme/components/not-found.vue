<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useData, withBase, useRoute } from "vitepress";

const { theme, site } = useData();
const route = useRoute();

const editLinkPattern = site.value.themeConfig?.editLink?.pattern;
const editLink = editLinkPattern
  ? editLinkPattern.replace(/:path/, encodeURIComponent(route.path.slice(1)))
  : null;
console.log("editLink:", editLink);

const lang = site.value.lang;
const localeIndex = (site.value as any).localeIndex || "root";
const currentLang = site.value.locales[lang];

// candidate: path on the default language (remove current locale prefix if present)
const candidatePath = computed(() => {
  const path = route.path || "/";
  if (!localeIndex || localeIndex === "root") return path;
  // remove leading `/${localeIndex}` segment when present
  const regex = new RegExp(`^/${localeIndex}($|/)`);
  if (regex.test(path)) {
    const stripped = path.replace(new RegExp(`^/${localeIndex}`), "") || "/";
    return stripped.startsWith("/") ? stripped : `/${stripped}`;
  }
  return path;
});

// href resolved with base path (string)
const candidateHref = computed(() => {
  try {
    return withBase(candidatePath.value || "/");
  } catch (e) {
    return candidatePath.value || "/";
  }
});

// client-side fetch check: true = exists, false = not exists, null = unknown/loading
const defaultExists = ref<boolean | null>(null);

onMounted(async () => {
  if (typeof window === "undefined") return;

  const cand = candidatePath.value;
  if (!cand) {
    defaultExists.value = false;
    return;
  }

  const url = withBase(cand);
  try {
    // GET to ensure static server returns proper status; avoid reading body to minimize cost
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    if (!res || !res.ok) {
      defaultExists.value = false;
    } else {
      const contentType = (res.headers.get("content-type") || "").toLowerCase();
      const isHtml = contentType.includes("text/html");

      // Debug information to help diagnose false positives (only if Vite dev env available)
      try {
        const isDev = !!(import.meta as any)?.env?.DEV;
        if (isDev) {
          console.debug(
            "[NotFound] Fetched",
            url,
            "status=" + res.status,
            "content-type=" + contentType,
            "response-url=" + res.url
          );
        }
      } catch (e) {
        // ignore
      }

      if (!isHtml) {
        // If server returned non-HTML (e.g. text/plain, application/json), do not treat it as the translated page.
        // This avoids false positives when candidate path points at a static asset like `/llms-small.txt`.
        defaultExists.value = false;
      } else {
        // HTML: inspect body for NotFound markers
        const text = await res.text();
        const isNotFoundMarker =
          text.includes('id="mp-not-found"') ||
          text.includes('data-mp-not-found="1"') ||
          text.includes('id="page.is.NotFound"') ||
          /class=(?:"|')?NotFound(?:"|')?/.test(text);
        defaultExists.value = !isNotFoundMarker;
        try {
          const isDev = !!(import.meta as any)?.env?.DEV;
          if (isDev) {
            console.debug(
              "[NotFound] isNotFoundMarker=",
              isNotFoundMarker,
              "-> defaultExists=",
              defaultExists.value
            );
          }
        } catch (e) {
          // ignore
        }
      }
    }
  } catch (e) {
    defaultExists.value = false;
  }
});
</script>

<template>
  <div id="page.is.NotFound" class="not-found">
    <!-- internal marker used for server-side detection -->
    <div id="mp-not-found" data-mp-not-found="1" style="display: none"></div>

    <div class="card">
      <div class="visual">
        <!-- simple SVG illustration -->
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            x="1.5"
            y="4"
            width="21"
            height="16"
            rx="2"
            stroke="var(--vp-c-divider)"
            stroke-width="1.2"
            fill="var(--vp-c-bg)"
          />
          <path
            d="M7 9h10M7 13h6"
            stroke="var(--vp-c-text-2)"
            stroke-width="1.2"
            stroke-linecap="round"
          />
          <circle cx="18" cy="7" r="2" fill="var(--vp-c-brand-1)" />
        </svg>
      </div>

      <div class="content">
        <div>
          <p class="code">{{ theme.notFound?.code ?? "404" }}</p>
        </div>
        <div>
          <h1 class="title">{{ theme.notFound?.title ?? "PAGE NOT FOUND" }}</h1>
          <div class="divider" />
          <p class="quote">
            {{
              theme.notFound?.quote ??
              "But if you don't change your direction, and if you keep looking, you may end up where you are heading."
            }}
          </p>

          <div class="actions">
            <a
              class="btn primary"
              :href="withBase(theme.notFound?.link ?? currentLang?.link ?? '/')"
              :aria-label="theme.notFound?.linkLabel ?? 'go to home'"
            >
              {{ theme.notFound?.linkText ?? "Take me home" }}
            </a>

            <a
              v-if="defaultExists === true"
              class="btn secondary"
              :href="candidateHref"
              :aria-label="
                theme.notFound?.translationLinkLabel ?? 'view original page'
              "
            >
              {{ theme.notFound?.translationLinkText ?? "View original" }}
            </a>
          </div>
          <div class="translate-help">
            <p class="help-text">
              {{
                theme.notFound?.translationHelpMessage ??
                "Want to help translate this page? Contributions are welcome."
              }}
            </p>
            <a
              class="btn tertiary"
              :href="theme.notFound?.translationContributeLink ?? editLink"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{
                theme.notFound?.translationContributeText ??
                "Contribute translation"
              }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  width: 100%;
  height: calc(100dvh - var(--vp-nav-height));
  padding: 34px 14px 36px;
  justify-content: center;
  justify-items: center;
  text-align: center;
}

@media (min-width: 768px) {
  .not-found {
    padding: 96px 32px 168px;
  }
}

.code {
  line-height: 64px;
  font-size: 64px;
  font-weight: 600;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.title {
  padding-top: 12px;
  letter-spacing: 2px;
  line-height: 20px;
  font-size: 20px;
  font-weight: 700;
}

.divider {
  margin: 24px 0 18px;
  width: 80%;
  height: 1px;
  background-color: var(--vp-c-divider);
}

.quote {
  margin: 0 auto;
  max-width: 256px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.action {
  padding-top: 20px;
}

.link {
  display: inline-block;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 16px;
  padding: 3px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  transition: border-color 0.25s, color 0.25s;
}

.link:hover {
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-brand-2);
}

/* New styles for improved NotFound card */
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 48px 16px;
}

.card {
  display: flex;
  gap: 28px;
  flex-direction: column;
  width: auto;
  background: var(--vp-c-bg-soft);
  border-radius: 14px;
  padding: 28px;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.visual {
  flex: 0 0 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  display: flex;
  flex: 1 1 auto;
}

.code {
  font-size: 48px;
  line-height: 1;
  padding-top: 14px;
  margin-right: 8px;
  writing-mode: sideways-lr;
  text-orientation: mixed;
}

.title {
  text-align: left;
  font-size: 20px;
  margin: 8px 0 12px;
}

.quote {
  text-align: left;
  margin: 0 0 18px;
  color: var(--vp-c-text-2);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-items: start;
  align-items: start;
  gap: 12px;
}

.btn {
  display: inline-flex;
  width: auto;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid transparent;
}

.btn.primary {
  background: var(--vp-c-brand-1);
  color: white;
}

.btn.primary:hover {
  background: var(--vp-c-brand-2);
}

.btn.secondary {
  background: transparent;
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-1);
}

.btn.tertiary {
  background: transparent;
  color: var(--vp-c-text-2);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.translate-help {
  margin-top: 18px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.help-text {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

@media (max-width: 720px) {
  .card {
    flex-direction: column;
    text-align: center;
  }
  .visual {
    order: -1;
  }
  .btn {
    width: 100%;
  }
}
</style>
