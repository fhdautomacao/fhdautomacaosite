import React, { Fragment, useState } from 'react'
import { Dialog, Transition, Listbox } from '@headlessui/react'

const companies = [
  { id: 1, name: 'Empresa A' },
  { id: 2, name: 'Empresa B' },
  { id: 3, name: 'Empresa C' },
]

export default function TesteFramework() {
  const [open, setOpen] = useState(false)
  const [company, setCompany] = useState(companies[0])
  const [type, setType] = useState('receivable')

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Teste de Modal e Select (Headless UI)</h1>
      <p>Abra o modal e role a página para verificar se o dropdown se mantém posicionado corretamente.</p>
      <div className="h-[1200px] bg-gray-50 rounded border p-4">
        <button className="px-4 py-2 bg-black text-white rounded" onClick={()=>setOpen(true)}>Abrir Modal</button>
        <div className="mt-6">Conteúdo de preenchimento para testar scroll...</div>
      </div>

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-[10000]" onClose={setOpen}>
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl">
                <Dialog.Title className="text-lg font-semibold">Novo Boleto (Teste)</Dialog.Title>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Empresa</label>
                    <Listbox value={company} onChange={setCompany}>
                      <div className="relative mt-1">
                        <Listbox.Button className="relative w-full cursor-pointer rounded-md border px-3 py-2 text-left focus:outline-none">{company.name}</Listbox.Button>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                          <Listbox.Options className="absolute z-[10050] mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 text-base shadow-lg focus:outline-none">
                            {companies.map((c) => (
                              <Listbox.Option key={c.id} value={c} className={({ active }) => `relative cursor-pointer select-none py-2 px-3 ${active ? 'bg-gray-100' : ''}`}>
                                {c.name}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Tipo</label>
                    <Listbox value={type} onChange={setType}>
                      <div className="relative mt-1">
                        <Listbox.Button className="relative w-full cursor-pointer rounded-md border px-3 py-2 text-left focus:outline-none">{type === 'receivable' ? 'A Receber' : 'A Pagar'}</Listbox.Button>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                          <Listbox.Options className="absolute z-[10050] mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 text-base shadow-lg focus:outline-none">
                            <Listbox.Option value="receivable" className={({ active }) => `relative cursor-pointer select-none py-2 px-3 ${active ? 'bg-gray-100' : ''}`}>A Receber</Listbox.Option>
                            <Listbox.Option value="payable" className={({ active }) => `relative cursor-pointer select-none py-2 px-3 ${active ? 'bg-gray-100' : ''}`}>A Pagar</Listbox.Option>
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button className="px-4 py-2 rounded border" onClick={()=>setOpen(false)}>Cancelar</button>
                  <button className="px-4 py-2 rounded bg-black text-white" onClick={()=>setOpen(false)}>Salvar</button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}
