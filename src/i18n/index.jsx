import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import pt from './pt.json'
import en from './en.json'
import es from './es.json'

const I18nContext = createContext({
  language: 'pt',
  setLanguage: () => {},
  t: (key, fallback) => fallback ?? key,
})

const dictionaries = { pt, en, es }

function getNavigatorLang() {
  try {
    const lang = (navigator.language || navigator.userLanguage || 'pt').slice(0, 2)
    return ['pt', 'en', 'es'].includes(lang) ? lang : 'pt'
  } catch {
    return 'pt'
  }
}

export function I18nProvider({ children }) {
  const queryLang = new URLSearchParams(window.location.search).get('lang')
  const initial = queryLang && ['pt', 'en', 'es'].includes(queryLang)
    ? queryLang
    : (localStorage.getItem('lang') || getNavigatorLang())

  const [language, setLanguage] = useState(initial)

  useEffect(() => {
    document.documentElement.lang = language
    localStorage.setItem('lang', language)
  }, [language])

  const t = useMemo(() => {
    const dict = dictionaries[language] || dictionaries.pt
    const dictPt = dictionaries.pt
    const getter = (key, fallback) => {
      const value = key.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), dict)
      if (value !== undefined) return value
      const valuePt = key.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), dictPt)
      return valuePt ?? (fallback ?? key)
    }
    return getter
  }, [language])

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx || typeof ctx.t !== 'function') {
    const fallback = (key, fallbackText) => fallbackText ?? key
    return { language: 'pt', setLanguage: () => {}, t: fallback }
  }
  return ctx
}


