// Lightweight translation helpers with safe fallbacks
// Priority of providers (client-side):
// 1) DeepL/Google via server proxy (not implemented here)
// 2) MyMemory public API (no key, rate-limited) – default

const MYMEMORY_ENDPOINT = 'https://api.mymemory.translated.net/get'

async function translateWithMyMemory(text, sourceLang, targetLang) {
  try {
    const url = `${MYMEMORY_ENDPOINT}?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(sourceLang)}|${encodeURIComponent(targetLang)}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const out = data?.responseData?.translatedText || ''
    return out || text
  } catch (err) {
    // Fallback: return original text if translation fails
    return text
  }
}

export async function translateText(text, targetLang, sourceLang = 'pt') {
  if (!text || !text.trim()) return text
  return translateWithMyMemory(text, sourceLang, targetLang)
}

export async function translateArray(texts, targetLang, sourceLang = 'pt') {
  const results = []
  for (const t of texts || []) {
    // sequential to be gentle with rate limits
    // if needed, this can be batched later
    // eslint-disable-next-line no-await-in-loop
    const translated = await translateText(t, targetLang, sourceLang)
    results.push(translated)
  }
  return results
}

export async function autoTranslateService(servicePt, targetLangs = ['en', 'es']) {
  const translations = {}
  for (const lang of targetLangs) {
    const name = await translateText(servicePt.name || '', lang)
    const description = await translateText(servicePt.description || '', lang)
    const features = await translateArray(servicePt.features || [], lang)
    translations[lang] = { name, description, features }
  }
  return translations
}


