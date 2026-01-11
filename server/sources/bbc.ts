import { XMLParser } from "fast-xml-parser"
import type { NewsItem } from "@shared/types"
import { myFetch } from "#/utils/fetch.ts"

const hot = defineSource(async () => {
  const parser = new XMLParser({
    ignoreAttributes: false,
  })
  const xmlText = await myFetch(
    "https://feeds.bbci.co.uk/news/rss.xml",
    { responseType: "text" },
  )
  if (!xmlText) {
    return []
  }
  const parsed = parser.parse(xmlText)
  const items = Array.isArray(parsed.rss.channel.item)
    ? parsed.rss.channel.item
    : [parsed.rss.channel.item]
  const news: NewsItem[] = []
  for (const item of items) {
    const url
      = typeof item.link === "string"
        ? item.link
        : item.link?.["#text"]
    if (!url) continue
    news.push({
      id: item.guid ?? item.link,
      title: item.title,
      url,
    })
  }
  return news
})

export default defineSource({
  bbc: hot,
})
