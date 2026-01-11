import "~/styles/globals.css"
import "virtual:uno.css"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import type { QueryClient } from "@tanstack/react-query"
import { isMobile } from "react-device-detect"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import { columns } from "@shared/metadata"
import { Header } from "~/components/header"
import { GlobalOverlayScrollbar } from "~/components/common/overlay-scrollbar"
import { Footer } from "~/components/footer"
import { Toast } from "~/components/common/toast"
import { SearchBar } from "~/components/common/search-bar"

function getInitialLanguage() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("i18nextLng") || "zh"
  }
  return "zh"
}

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        columns: Object.fromEntries(
          Object.entries(columns).map(([key, value]) => [key, value.en]),
        ),
        navbar: {
          more: "More",
        },
        menu: {
          logout: "Logout",
          githubLogin: "Github Account Login",
          starOnGithub: "Star on Github",
          lightMode: "Light Mode",
          darkMode: "Dark Mode",
        },
        common: {
          goToTop: "Go To Top",
          refresh: "Refresh",
          github: "Github",
          language: "Language",
          english: "English",
          chinese: "Chinese",
        },
        pwa: {
          updateSuccess: "Update successful, try it now",
          viewUpdate: "View update",
          updateAvailable: "Update available, will update in 5 seconds",
          updateNow: "Update now",
        },
        sync: {
          authFailed: "Authentication failed, cannot sync, please login again",
          login: "Login",
        },
        refetch: {
          loginWarning: "You can force fetch latest data after login",
          login: "Login",
        },
        search: {
          placeholder: "Search for what you want",
          empty: "Not found, you can raise an issue on Github",
        },
        column: {
          update: " updated",
          loading: "Loading...",
          fetchFailed: "Fetch failed",
          uncategorized: "Uncategorized",
        },
        dnd: {
          swipeHint: "Swipe left/right for more",
          dragging: "Dragging",
        },
        time: {
          justNow: "Just now",
          minutesAgo: "{{count}} minutes ago",
          hoursAgo: "{{count}} hours ago",
          monthDay: "{{month}}/{{day}}",
        },
      },
    },
    zh: {
      translation: {
        columns: Object.fromEntries(
          Object.entries(columns).map(([key, value]) => [key, value.zh]),
        ),
        navbar: {
          more: "更多",
        },
        menu: {
          logout: "退出登录",
          githubLogin: "Github 账号登录",
          starOnGithub: "Star on Github",
          lightMode: "浅色模式",
          darkMode: "深色模式",
        },
        common: {
          goToTop: "回到顶部",
          refresh: "刷新",
          github: "Github",
          language: "语言",
          english: "English",
          chinese: "中文",
        },
        pwa: {
          updateSuccess: "更新成功，赶快体验吧",
          viewUpdate: "查看更新",
          updateAvailable: "有更新，5 秒后自动更新",
          updateNow: "立刻更新",
        },
        sync: {
          authFailed: "身份校验失败，无法同步，请重新登录",
          login: "登录",
        },
        refetch: {
          loginWarning: "登录后可以强制拉取最新数据",
          login: "登录",
        },
        search: {
          placeholder: "搜索你想要的",
          empty: "没有找到，可以前往 Github 提 issue",
        },
        column: {
          update: "更新",
          loading: "加载中...",
          fetchFailed: "获取失败",
          uncategorized: "未分类",
        },
        dnd: {
          swipeHint: "左右滑动查看更多",
          dragging: "拖拽中",
        },
        time: {
          justNow: "刚刚",
          minutesAgo: "{{count}}分钟前",
          hoursAgo: "{{count}}小时前",
          monthDay: "{{month}}月{{day}}日",
        },
      },
    },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
})

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("i18nextLng", lng)
})

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
})

function NotFoundComponent() {
  const nav = Route.useNavigate()
  nav({
    to: "/",
  })
}

function RootComponent() {
  useOnReload()
  useSync()
  usePWA()
  return (
    <>
      <GlobalOverlayScrollbar
        className={$([
          !isMobile && "px-4",
          "h-full overflow-x-auto",
          "md:(px-10)",
          "lg:(px-24)",
        ])}
      >
        <header
          className={$([
            "grid items-center py-4 px-5",
            "lg:(py-6)",
            "sticky top-0 z-10 backdrop-blur-md",
          ])}
          style={{
            gridTemplateColumns: "50px 1fr auto",
          }}
        >
          <Header />
        </header>
        <main className={$([
          "mt-2",
          "min-h-[calc(100vh-180px)]",
          "md:(min-h-[calc(100vh-175px)])",
          "lg:(min-h-[calc(100vh-194px)])",
        ])}
        >
          <Outlet />
        </main>
        <footer className="py-6 flex flex-col items-center justify-center text-sm text-neutral-500 font-mono">
          <Footer />
        </footer>
      </GlobalOverlayScrollbar>
      <Toast />
      <SearchBar />
      {import.meta.env.DEV && (
        <>
          <ReactQueryDevtools buttonPosition="bottom-left" />
          <TanStackRouterDevtools position="bottom-right" />
        </>
      )}
    </>
  )
}
