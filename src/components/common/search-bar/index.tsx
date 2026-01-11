import { Command } from "cmdk"
import { useMount } from "react-use"
import type { SourceID } from "@shared/types"
import { useEffect, useMemo, useRef, useState } from "react"
import pinyin from "@shared/pinyin.json"
import { useTranslation } from "react-i18next"
import { OverlayScrollbar } from "../overlay-scrollbar"
import { useLanguageFilteredSourceIds, useLanguageFilteredSources } from "~/hooks/useLanguageFilteredSources"
import { CardWrapper } from "~/components/column/card"

import "./cmdk.css"

interface SourceItemProps {
  id: SourceID
  name: string
  title?: string
  column: any
  pinyin: string
}

function groupByColumn(items: SourceItemProps[]) {
  return items.reduce((acc, item) => {
    const k = acc.find(i => i.column === item.column)
    if (k) k.sources = [...k.sources, item]
    else acc.push({ column: item.column, sources: [item] })
    return acc
  }, [] as {
    column: string
    sources: SourceItemProps[]
  }[]).sort((m, n) => {
    if (m.column === "tech") return -1
    if (n.column === "tech") return 1

    if (m.column === "uncategorized") return 1
    if (n.column === "uncategorized") return -1

    return m.column.localeCompare(n.column)
  })
}

export function SearchBar() {
  const { opened, toggle } = useSearchBar()
  const { t } = useTranslation()
  const filteredSourceIds = useLanguageFilteredSourceIds()
  const filteredSources = useLanguageFilteredSources()
  const sourceItems = useMemo(
    () =>
      groupByColumn(filteredSourceIds
        .filter(id => !sources[id]!.redirect)
        .map(id => ({
          id,
          title: sources[id]!.title,
          column: sources[id]!.column || "uncategorized",
          name: sources[id]!.name,
          pinyin: pinyin?.[id as keyof typeof pinyin] ?? "",
        })))
    , [filteredSourceIds],
  )
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [value, setValue] = useState<SourceID>("github-trending-today")

  useEffect(() => {
    if (filteredSourceIds.length > 0 && !filteredSourceIds.includes(value)) {
      setValue(filteredSourceIds[0])
    }
  }, [filteredSourceIds, value])

  useMount(() => {
    inputRef?.current?.focus()
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener("keydown", keydown)
    return () => {
      document.removeEventListener("keydown", keydown)
    }
  })

  return (
    <Command.Dialog
      open={opened}
      onOpenChange={toggle}
      value={value}
      onValueChange={(v) => {
        if (v in filteredSources) {
          setValue(v as SourceID)
        }
      }}
    >
      <Command.Input
        ref={inputRef}
        autoFocus
        placeholder={t("search.placeholder")}
      />
      <div className="md:flex pt-2">
        <OverlayScrollbar defer className="overflow-y-auto md:min-w-275px">
          <Command.List>
            <Command.Empty>{t("search.empty")}</Command.Empty>
            {
              sourceItems.map(({ column, sources }) => (
                <Command.Group heading={column === "uncategorized" ? t("column.uncategorized") : t(`columns.${column}`)} key={column}>
                  {
                    sources.map(item => <SourceItem item={item} key={item.id} />)
                  }
                </Command.Group>
              ),
              )
            }
          </Command.List>
        </OverlayScrollbar>
        <div className="flex-1 pt-2 px-4 min-w-350px max-md:hidden">
          <CardWrapper id={value} />
        </div>
      </div>
    </Command.Dialog>
  )
}

function SourceItem({ item }: {
  item: SourceItemProps
}) {
  const { isFocused, toggleFocus } = useFocusWith(item.id)
  return (
    <Command.Item
      keywords={[item.name, item.title ?? "", item.pinyin]}
      value={item.id}
      className="flex justify-between items-center p-2"
      onSelect={toggleFocus}
    >
      <span className="flex gap-2 items-center">
        <span
          className={$("w-4 h-4 rounded-md bg-cover")}
          style={{
            backgroundImage: `url(/icons/${item.id.split("-")[0]}.png)`,
          }}
        />
        <span>{item.name}</span>
        <span className="text-xs text-neutral-400/80 self-end mb-3px">{item.title}</span>
      </span>
      <span className={$(isFocused ? "i-ph-star-fill" : "i-ph-star-duotone", "bg-primary op-40")}></span>
    </Command.Item>
  )
}
