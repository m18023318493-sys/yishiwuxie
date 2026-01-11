import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import sources from "@shared/sources"
import type { Source, SourceID } from "@shared/types"

/**
 * Hook to get sources filtered by current language
 * Returns sources where source.lang matches current language or is 'both'
 *
 * @example
 * // In a component:
 * const filteredSources = useLanguageFilteredSources()
 * const filteredIds = useLanguageFilteredSourceIds()
 *
 * // To iterate over filtered sources:
 * Object.entries(filteredSources).forEach(([id, source]) => {
 *   // source is guaranteed to be available in current language
 * })
 */
export function useLanguageFilteredSources(): Partial<Record<SourceID, Source>> {
  const { i18n } = useTranslation()
  const currentLanguage = (i18n.language.startsWith("zh") ? "zh" : "en") as "zh" | "en"

  const filteredSources = useMemo(() => {
    const result: Partial<Record<SourceID, Source>> = {}

    for (const [id, source] of Object.entries(sources)) {
      const sourceId = id as SourceID
      const sourceLang = source.lang || "both"

      // Include source if:
      // 1. Source language matches current language
      // 2. Source language is 'both'
      // 3. Source has no language specified (default to 'both')
      if (sourceLang === currentLanguage || sourceLang === "both") {
        result[sourceId] = source
      }
    }

    return result
  }, [currentLanguage])

  return filteredSources
}

/**
 * Hook to get source IDs filtered by current language
 * Returns array of source IDs where source.lang matches current language or is 'both'
 */
export function useLanguageFilteredSourceIds(): SourceID[] {
  const { i18n } = useTranslation()
  const currentLanguage = (i18n.language.startsWith("zh") ? "zh" : "en") as "zh" | "en"

  const filteredSourceIds = useMemo(() => {
    const result: SourceID[] = []

    for (const [id, source] of Object.entries(sources)) {
      const sourceId = id as SourceID
      const sourceLang = source.lang || "both"

      if (sourceLang === currentLanguage || sourceLang === "both") {
        result.push(sourceId)
      }
    }

    return result
  }, [currentLanguage])

  return filteredSourceIds
}
