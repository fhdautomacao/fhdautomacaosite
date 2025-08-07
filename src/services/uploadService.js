import { supabase } from '../lib/supabase';

class UploadService {
  constructor() {
    this.bucketName = 'arquivos';
    this.folderName = 'payment-receipts';
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.allowedTypes = ['application/pdf'];
  }

  // Inicializar pasta de comprovantes no bucket existente
  async initializeReceiptsFolder() {
    try {
      // Verificar se a pasta payment-receipts existe
      const { data: folders, error } = await supabase.storage
        .from(this.bucketName)
        .list('', {
          limit: 100,
          offset: 0,
        });

      if (error) {
        console.error('Erro ao listar pastas:', error);
        throw error;
      }

      // Verificar se a pasta payment-receipts já existe
      const receiptsFolderExists = folders.some(folder => folder.name === this.folderName);
      
      if (!receiptsFolderExists) {
        // Criar um arquivo temporário para criar a pasta
        const tempFile = new File([''], 'temp.txt', { type: 'text/plain' });
        const { error: createError } = await supabase.storage
          .from(this.bucketName)
          .upload(`${this.folderName}/.keep`, tempFile);

        if (createError) {
          console.error('Erro ao criar pasta de comprovantes:', createError);
          throw createError;
        }

        console.log('Pasta payment-receipts criada com sucesso');
      }

      console.log('Pasta payment-receipts verificada/criada');
    } catch (error) {
      console.error('Erro ao inicializar pasta de comprovantes:', error);
      throw error;
    }
  }

  // Validar arquivo
  validateFile(file) {
    const errors = [];

    // Verificar tamanho
    if (file.size > this.maxFileSize) {
      errors.push(`Arquivo muito grande. Máximo: ${this.maxFileSize / (1024 * 1024)}MB`);
    }

    // Verificar tipo - multer pode usar mimetype
    const fileType = file.mimetype || file.type;
    if (!this.allowedTypes.includes(fileType)) {
      errors.push('Apenas arquivos PDF são permitidos');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Gerar nome único para o arquivo
  generateFileName(originalName, billId, installmentNumber) {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    return `bill_${billId}_installment_${installmentNumber}_${timestamp}.${extension}`;
  }

  // Upload de comprovante de pagamento
  async uploadPaymentReceipt(file, billId, installmentNumber) {
    try {
      // Inicializar pasta se necessário
      await this.initializeReceiptsFolder();

      // Validar arquivo
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Gerar nome único
      const fileName = this.generateFileName(file.originalname || file.name, billId, installmentNumber);
      const filePath = `${this.folderName}/${billId}/${fileName}`;

      // Upload do arquivo - usar buffer do multer se disponível
      const fileBuffer = file.buffer || file;
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, fileBuffer, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erro no upload:', error);
        throw new Error('Erro ao fazer upload do arquivo');
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return {
        success: true,
        url: urlData.publicUrl,
        filename: fileName,
        path: filePath
      };

    } catch (error) {
      console.error('Erro no upload de comprovante:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Deletar comprovante
  async deletePaymentReceipt(filePath) {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Erro ao deletar arquivo:', error);
        throw new Error('Erro ao deletar arquivo');
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar comprovante:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Baixar comprovante
  async downloadPaymentReceipt(filePath) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .download(filePath);

      if (error) {
        console.error('Erro ao baixar arquivo:', error);
        throw new Error('Erro ao baixar arquivo');
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Erro ao baixar comprovante:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Listar arquivos de um boleto
  async listBillReceipts(billId) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list(`${this.folderName}/${billId}`);

      if (error) {
        console.error('Erro ao listar arquivos:', error);
        throw new Error('Erro ao listar arquivos');
      }

      return {
        success: true,
        files: data || []
      };
    } catch (error) {
      console.error('Erro ao listar comprovantes:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verificar se arquivo existe
  async fileExists(filePath) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list(filePath.split('/').slice(0, -1).join('/'));

      if (error) {
        return false;
      }

      const fileName = filePath.split('/').pop();
      return data.some(file => file.name === fileName);
    } catch (error) {
      return false;
    }
  }

  // Obter informações do arquivo
  async getFileInfo(filePath) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list(filePath.split('/').slice(0, -1).join('/'));

      if (error) {
        throw new Error('Erro ao obter informações do arquivo');
      }

      const fileName = filePath.split('/').pop();
      const fileInfo = data.find(file => file.name === fileName);

      if (!fileInfo) {
        throw new Error('Arquivo não encontrado');
      }

      return {
        success: true,
        info: fileInfo
      };
    } catch (error) {
      console.error('Erro ao obter informações do arquivo:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obter URL pública de um arquivo
  getPublicUrl(filePath) {
    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }
}

// Instância singleton
const uploadService = new UploadService();

export default uploadService;
