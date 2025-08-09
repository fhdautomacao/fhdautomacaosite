import React from 'react'
import { useI18n } from '@/i18n/index.jsx'

const LanguageSwitcher = ({ variant = 'header', onSelected }) => {
  const { language, setLanguage, t } = useI18n()

  const optionClass = (active) => `px-3 py-1 rounded-md cursor-pointer ${active ? 'bg-blue-600 text-white' : 'bg-white/70 text-slate-700 hover:bg-white'} shadow-sm border border-slate-200`

  return (
    <div className={variant === 'menu' ? 'flex items-center gap-2 p-2' : 'flex items-center gap-2'}>
      <span className="text-sm text-slate-600 hidden md:inline">{t('common.language')}</span>
      <div className="flex items-center gap-1">
        {['pt','en','es'].map((lng) => (
          <button
            key={lng}
            className={optionClass(language === lng)}
            onClick={() => {
              setLanguage(lng)
              if (typeof onSelected === 'function') onSelected(lng)
            }}
            aria-label={`Switch to ${lng}`}
          >
            {lng.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}

export default LanguageSwitcher


