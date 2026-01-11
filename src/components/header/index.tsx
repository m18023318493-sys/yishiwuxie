import { Link } from "@tanstack/react-router"
import { useIsFetching } from "@tanstack/react-query"
import type { SourceID } from "@shared/types"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { NavBar } from "../navbar"
import { Menu } from "./menu"
import { currentSourcesAtom, goToTopAtom } from "~/atoms"

function LanguageButton() {
  const [show, setShow] = useState(false)
  const handleToggle = () => {
    setShow(prev => !prev)
  }

  const { i18n, t } = useTranslation()
  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <button
        type="button"
        className="flex items-center scale-90"
      >
        <img src="../../../public/icons/globe.svg" alt={t("common.language")} className="w-[24px] h-[24px] cursor-pointer" />

      </button>
      {show && (
        <div className="absolute right-0 z-99 bg-transparent pt-4 top-4" onClick={handleToggle}>
          <motion.div
            id="dropdown-menu"
            className={$([
              "w-105px",
              "bg-primary backdrop-blur-5 bg-op-70! rounded-lg shadow-xl",
            ])}
            initial={{
              scale: 0.9,
            }}
            animate={{
              scale: 1,
            }}
          >
            <ul className="bg-base bg-op-70! backdrop-blur-md p-2 rounded-lg color-base text-base">
              <li className="cursor-pointer inline-block" onClick={() => i18n.changeLanguage("zh")}>中文</li>
              <li className="cursor-pointer inline-block" onClick={() => i18n.changeLanguage("en")}>English</li>
            </ul>

          </motion.div>
        </div>

      )}
    </div>
  )
}

function GoTop() {
  const { ok, fn: goToTop } = useAtomValue(goToTopAtom)
  const { t } = useTranslation()
  return (
    <button
      type="button"
      title={t("common.goToTop")}
      className={$("i-ph:arrow-fat-up-duotone", ok ? "op-50 btn" : "op-0")}
      onClick={goToTop}
    />
  )
}

function Github() {
  const { t } = useTranslation()
  return (
    <button type="button" title={t("common.github")} className="i-ph:github-logo-duotone btn" onClick={() => window.open(Homepage)} />
  )
}

function Refresh() {
  const currentSources = useAtomValue(currentSourcesAtom)
  const { refresh } = useRefetch()
  const refreshAll = useCallback(() => refresh(...currentSources), [refresh, currentSources])
  const { t } = useTranslation()

  const isFetching = useIsFetching({
    predicate: (query) => {
      const [type, id] = query.queryKey as ["source" | "entire", SourceID]
      return (type === "source" && currentSources.includes(id)) || type === "entire"
    },
  })

  return (
    <button
      type="button"
      title={t("common.refresh")}
      className={$("i-ph:arrow-counter-clockwise-duotone btn", isFetching && "animate-spin i-ph:circle-dashed-duotone")}
      onClick={refreshAll}
    />
  )
}

export function Header() {
  return (
    <>
      <span className="flex justify-self-start">
        <Link to="/" className="flex gap-2 items-center">
          <div className="h-10 w-10 bg-cover" title="logo" style={{ backgroundImage: "url(/icon.svg)" }} />
          <span className="text-2xl font-brand line-height-none!">
            <p>News</p>
            <p className="mt--1">
              <span className="color-primary-6">N</span>
              <span>ow</span>
            </p>
          </span>
        </Link>
        <a target="_blank" href={`${Homepage}/releases/tag/v${Version}`} className="btn text-sm ml-1 font-mono">
          {`v${Version}`}
        </a>
      </span>
      <span className="justify-self-center">
        <span className="hidden md:(inline-block)">
          <NavBar />
        </span>
      </span>
      <span className="justify-self-end flex gap-2 items-center text-xl text-primary-600 dark:text-primary">
        <GoTop />
        <LanguageButton />
        <Refresh />
        <Github />
        <Menu />
      </span>
    </>
  )
}
