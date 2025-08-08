import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function TestModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Testar Modal</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modal de Teste</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Teste Select</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="opcao1">Opção 1</SelectItem>
                <SelectItem value="opcao2">Opção 2</SelectItem>
                <SelectItem value="opcao3">Opção 3</SelectItem>
                <SelectItem value="opcao4">Opção 4</SelectItem>
                <SelectItem value="opcao5">Opção 5</SelectItem>
                <SelectItem value="opcao6">Opção 6</SelectItem>
                <SelectItem value="opcao7">Opção 7</SelectItem>
                <SelectItem value="opcao8">Opção 8</SelectItem>
                <SelectItem value="opcao9">Opção 9</SelectItem>
                <SelectItem value="opcao10">Opção 10</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Outro Select</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione outra opção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">Opção A</SelectItem>
                <SelectItem value="b">Opção B</SelectItem>
                <SelectItem value="c">Opção C</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
