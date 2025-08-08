import React, { useMemo } from 'react'
import ReactSelect from 'react-select'

/**
 * AdminSelect
 * - Encapsula react-select com portal para document.body e menu em position: fixed
 * - Garante z-index alto para sobrepor Dialogs e Overlays
 * - Mapeia value (string|number) <-> option de forma transparente
 */
export default function AdminSelect({
  value,
  onChange,
  options,
  placeholder,
  isClearable = false,
  className,
  isDisabled = false,
}) {
  const selectedOption = useMemo(() => {
    return options?.find(opt => String(opt.value) === String(value)) || null
  }, [options, value])

  return (
    <div className={className}>
      <ReactSelect
        value={selectedOption}
        onChange={(opt) => onChange?.(opt ? opt.value : null)}
        options={options}
        isDisabled={isDisabled}
        isClearable={isClearable}
        placeholder={placeholder}
        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
        menuPosition="fixed"
        menuShouldScrollIntoView={false}
        styles={{
          control: (base, state) => ({
            ...base,
            borderRadius: 8,
            borderColor: state.isFocused ? '#3b82f6' : '#e5e7eb',
            boxShadow: state.isFocused ? '0 0 0 3px rgba(59,130,246,0.25)' : 'none',
            minHeight: 36,
            ':hover': { borderColor: state.isFocused ? '#3b82f6' : '#cbd5e1' },
            fontSize: 14,
          }),
          option: (base, state) => ({
            ...base,
            fontSize: 14,
            backgroundColor: state.isSelected
              ? '#3b82f6'
              : state.isFocused
              ? '#eff6ff'
              : 'white',
            color: state.isSelected ? 'white' : '#0f172a',
          }),
          menuPortal: base => ({ ...base, zIndex: 10050 }),
          menu: base => ({ ...base, borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e7eb' }),
          placeholder: base => ({ ...base, color: '#9ca3af' }),
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 8,
          colors: {
            ...theme.colors,
            primary25: '#eff6ff',
            primary: '#3b82f6',
            neutral0: '#ffffff',
            neutral20: '#e5e7eb',
            neutral30: '#cbd5e1',
            neutral40: '#94a3b8',
            neutral80: '#0f172a',
          }
        })}
      />
    </div>
  )
}
