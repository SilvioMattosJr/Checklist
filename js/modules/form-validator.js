// Validador de formulários
class FormValidator {
  // Validar formulário completo (CORREÇÃO PARA DETECTAR NOVOS CAMPOS DINÂMICOS)
  static validateForm() {
    let isValid = true;
    const missingFields = [];

    // ✅ CORREÇÃO: Log detalhado para debug
    console.log('🔍 [VALIDATOR] Iniciando validação completa do formulário...');
    
    // Validação: Nome da empresa (obrigatório)
    const companyInput = document.getElementById('companyName') || document.getElementById('company-name');
    if (companyInput) {
      if (!companyInput.value || !companyInput.value.trim()) {
        isValid = false;
        companyInput.classList.add('invalid');
        this.showError(companyInput, 'Campo obrigatório');
        missingFields.push('Nome da empresa');
        console.log('❌ [VALIDATOR] Nome da empresa faltando');
      } else {
        companyInput.classList.remove('invalid');
        this.hideError(companyInput);
        console.log('✅ [VALIDATOR] Nome da empresa preenchido');
      }
    } else {
      console.warn('❌ [VALIDATOR] Campo company-name não encontrado');
      isValid = false;
      missingFields.push('Nome da empresa');
    }

    // Validar checkboxes obrigatórios iniciais
    const requiredCheckboxes = document.querySelectorAll('.required-checkbox');
    console.log(`🔍 [VALIDATOR] Checkboxes obrigatórios encontrados: ${requiredCheckboxes.length}`);
    
    requiredCheckboxes.forEach(checkbox => {
      if (!checkbox.checked) {
        isValid = false;
        checkbox.classList.add('invalid');
        const labelText = checkbox.closest('label')?.textContent?.replace('*', '').trim() || 'Checkbox obrigatório';
        missingFields.push(labelText);
        console.log(`❌ [VALIDATOR] Checkbox não marcado: ${labelText}`);
      } else {
        checkbox.classList.remove('invalid');
        console.log(`✅ [VALIDATOR] Checkbox marcado: ${checkbox.closest('label')?.textContent?.trim()}`);
      }
    });

    // ✅ CORREÇÃO CRÍTICA: Validar se há pelo menos uma máquina
    const machines = document.querySelectorAll('.machine-block');
    console.log(`🔍 [VALIDATOR] Máquinas encontradas: ${machines.length}`);
    
    if (machines.length === 0) {
      isValid = false;
      missingFields.push('Adicionar pelo menos uma máquina');
      console.log('❌ [VALIDATOR] Nenhuma máquina adicionada');
    } else {
      console.log(`✅ [VALIDATOR] ${machines.length} máquina(s) adicionada(s)`);
    }

    // ✅ CORREÇÃO CRÍTICA: Validar campos obrigatórios das máquinas (MELHOR DETECÇÃO)
    machines.forEach((machine, index) => {
      const machineNumber = index + 1;
      console.log(`🔍 [VALIDATOR] Validando máquina ${machineNumber}...`);
      
      // Validar campos de texto obrigatórios - CORREÇÃO: BUSCAR TODOS OS CAMPOS
      const requiredInputs = machine.querySelectorAll('input[class*="required"], textarea[class*="required"], .required-input');
      console.log(`🔍 [VALIDATOR] Máquina ${machineNumber} - Campos obrigatórios: ${requiredInputs.length}`);
      
      requiredInputs.forEach(input => {
        // Pular selects (validamos separadamente)
        if (input.tagName === 'SELECT') return;
        // Pular textareas das fotos (validamos separadamente)
        if (input.classList.contains('photo-caption-input')) return;
        
        const fieldName = this.getFieldName(input, machineNumber, 'Máquina');
        
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('invalid');
          this.showError(input, 'Campo obrigatório');
          missingFields.push(fieldName);
          console.log(`❌ [VALIDATOR] ${fieldName} - Campo vazio`);
        } else {
          input.classList.remove('invalid');
          this.hideError(input);
          console.log(`✅ [VALIDATOR] ${fieldName} - Preenchido: ${input.value.substring(0, 20)}...`);
        }
      });

      // Validar observações da máquina - CORREÇÃO: BUSCAR ESPECIFICAMENTE
      const observationsField = machine.querySelector('.machine-observations');
      if (observationsField) {
        if (!observationsField.value.trim()) {
          isValid = false;
          observationsField.classList.add('invalid');
          this.showError(observationsField, 'Campo obrigatório');
          missingFields.push(`Máquina ${machineNumber}: Observações da Máquina`);
          console.log(`❌ [VALIDATOR] Máquina ${machineNumber}: Observações da Máquina - Campo vazio`);
        } else {
          observationsField.classList.remove('invalid');
          this.hideError(observationsField);
          console.log(`✅ [VALIDATOR] Máquina ${machineNumber}: Observações preenchidas`);
        }
      }

      // ✅ CORREÇÃO: Validar fotos da máquina (DETECÇÃO MELHORADA)
      const photoValidation = this.validateMachinePhotos(machine, machineNumber, 'Máquina');
      if (!photoValidation.isValid) {
        isValid = false;
        missingFields.push(...photoValidation.missingFields);
        console.log(`❌ [VALIDATOR] Máquina ${machineNumber} - Problemas nas fotos:`, photoValidation.missingFields);
      } else {
        console.log(`✅ [VALIDATOR] Máquina ${machineNumber} - Fotos validadas`);
      }
    });

    // ✅ CORREÇÃO CRÍTICA: Validar infraestruturas (MELHOR DETECÇÃO)
    const infras = document.querySelectorAll('.infra-block');
    console.log(`🔍 [VALIDATOR] Infraestruturas encontradas: ${infras.length}`);
    
    infras.forEach((infra, index) => {
      const infraNumber = index + 1;
      console.log(`🔍 [VALIDATOR] Validando infraestrutura ${infraNumber}...`);
      
      // CORREÇÃO: BUSCAR TODOS OS CAMPOS OBRIGATÓRIOS
      const requiredInputs = infra.querySelectorAll('input[class*="required"], textarea[class*="required"], .required-input');
      console.log(`🔍 [VALIDATOR] Infra ${infraNumber} - Campos obrigatórios: ${requiredInputs.length}`);
      
      requiredInputs.forEach(input => {
        // Pular selects (validamos separadamente)
        if (input.tagName === 'SELECT') return;
        // Pular textareas das fotos (validamos separadamente)
        if (input.classList.contains('photo-caption-input')) return;
        
        const fieldName = this.getFieldName(input, infraNumber, 'Infraestrutura');
        
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('invalid');
          this.showError(input, 'Campo obrigatório');
          missingFields.push(fieldName);
          console.log(`❌ [VALIDATOR] ${fieldName} - Campo vazio`);
        } else {
          input.classList.remove('invalid');
          this.hideError(input);
          console.log(`✅ [VALIDATOR] ${fieldName} - Preenchido: ${input.value.substring(0, 20)}...`);
        }
      });

      // ✅ CORREÇÃO: Validar fotos da infraestrutura (DETECÇÃO MELHORADA)
      const photoValidation = this.validateMachinePhotos(infra, infraNumber, 'Infraestrutura');
      if (!photoValidation.isValid) {
        isValid = false;
        missingFields.push(...photoValidation.missingFields);
        console.log(`❌ [VALIDATOR] Infra ${infraNumber} - Problemas nas fotos:`, photoValidation.missingFields);
      } else {
        console.log(`✅ [VALIDATOR] Infra ${infraNumber} - Fotos validadas`);
      }
    });

    // ✅ CORREÇÃO: Log final detalhado
    console.log('📋 [VALIDATOR] RESULTADO FINAL:', { 
      isValid, 
      totalMissing: missingFields.length,
      missingFields: missingFields 
    });
    
    return { isValid, missingFields };
  }

  // ✅ NOVO MÉTODO: Obter nome do campo para mensagem
  static getFieldName(input, itemNumber, itemType) {
    const label = input.closest('.input-group')?.querySelector('label');
    const placeholder = input.placeholder;
    const dataField = input.getAttribute('data-field');
    
    let fieldName = 'Campo obrigatório';
    
    if (label) {
      fieldName = label.textContent.replace('*', '').trim();
    } else if (placeholder) {
      fieldName = placeholder;
    } else if (dataField) {
      // Mapear data-field para nomes legíveis
      const fieldMap = {
        'name': 'Nome da Máquina',
        'os': 'Sistema Operacional', 
        'storage': 'Armazenamento',
        'ram': 'Memória RAM',
        'anydesk': 'ID do Anydesk',
        'description': 'Descrição do Item',
        'location': 'Localização',
        'notes': 'Observações',
        'machine-observations': 'Observações da Máquina'
      };
      fieldName = fieldMap[dataField] || dataField;
    }
    
    return `${itemType} ${itemNumber}: ${fieldName}`;
  }

  // Validar fotos da máquina/infraestrutura (CORREÇÃO PARA DETECÇÃO MELHORADA)
  static validateMachinePhotos(itemElement, itemNumber, itemType) {
    const missingFields = [];
    const photoItems = itemElement.querySelectorAll('.photo-item');
    
    console.log(`🔍 [VALIDATOR] ${itemType} ${itemNumber} - Fotos encontradas: ${photoItems.length}`);
    
    photoItems.forEach((photoItem, photoIndex) => {
      const captionInput = photoItem.querySelector('.photo-caption-input');
      const statusSelect = photoItem.querySelector('.custom-select[data-field="status"]');
      const fileInput = photoItem.querySelector('.photo-input');
      const preview = photoItem.querySelector('.photo-preview');
      
      const hasPhoto = fileInput.files.length > 0 || (preview && preview.style.display !== 'none' && preview.src);
      const hasCaption = captionInput && captionInput.value.trim();
      const hasStatus = statusSelect && statusSelect.value.trim();
      
      console.log(`🔍 [VALIDATOR] ${itemType} ${itemNumber} - Foto ${photoIndex + 1}:`, {
        hasPhoto,
        hasCaption, 
        hasStatus
      });
      
      // Se tem foto, valida legenda e status
      if (hasPhoto) {
        if (!hasCaption) {
          missingFields.push(`${itemType} ${itemNumber}: Legenda da Foto ${photoIndex + 1}`);
          if (captionInput) {
            captionInput.classList.add('invalid');
            this.showError(captionInput, 'Legenda obrigatória para foto');
          }
          console.log(`❌ [VALIDATOR] ${itemType} ${itemNumber}: Legenda da Foto ${photoIndex + 1} - Faltando`);
        } else {
          if (captionInput) {
            captionInput.classList.remove('invalid');
            this.hideError(captionInput);
          }
          console.log(`✅ [VALIDATOR] ${itemType} ${itemNumber}: Legenda da Foto ${photoIndex + 1} - Preenchida`);
        }
        
        if (!hasStatus) {
          missingFields.push(`${itemType} ${itemNumber}: Status da Foto ${photoIndex + 1}`);
          if (statusSelect) {
            statusSelect.classList.add('invalid');
            this.showError(statusSelect, 'Status obrigatório para foto');
          }
          console.log(`❌ [VALIDATOR] ${itemType} ${itemNumber}: Status da Foto ${photoIndex + 1} - Faltando`);
        } else {
          if (statusSelect) {
            statusSelect.classList.remove('invalid');
            this.hideError(statusSelect);
          }
          console.log(`✅ [VALIDATOR] ${itemType} ${itemNumber}: Status da Foto ${photoIndex + 1} - Preenchido: ${statusSelect.value}`);
        }
      }
      
      // Se tem legenda ou status mas não tem foto
      if ((hasCaption || hasStatus) && !hasPhoto) {
        missingFields.push(`${itemType} ${itemNumber}: Foto ${photoIndex + 1} (dados preenchidos sem foto)`);
        console.log(`❌ [VALIDATOR] ${itemType} ${itemNumber}: Foto ${photoIndex + 1} - Dados sem foto`);
      }
    });

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }

  // Validar assinaturas (MANTIDO IGUAL)
  static validateSignatures() {
    const missingFields = [];
    
    const clientName = document.getElementById('clientName')?.value.trim();
    const techName = document.getElementById('techName')?.value.trim();
    
    // Buscar as imagens de assinatura dos previews
    const clientSignatureImg = document.getElementById('clientSignaturePreview')?.querySelector('img');
    const techSignatureImg = document.getElementById('techSignaturePreview')?.querySelector('img');

    console.log('🔍 [VALIDATOR] Validando assinaturas...');

    if (!clientName) {
      missingFields.push('Nome do responsável');
      console.log('❌ [VALIDATOR] Nome do responsável - Faltando');
    } else {
      console.log('✅ [VALIDATOR] Nome do responsável - Preenchido');
    }
    
    if (!techName) {
      missingFields.push('Nome do técnico');
      console.log('❌ [VALIDATOR] Nome do técnico - Faltando');
    } else {
      console.log('✅ [VALIDATOR] Nome do técnico - Preenchido');
    }
    
    // Verificar se as assinaturas são válidas
    if (!clientSignatureImg || !this.isValidSignature(clientSignatureImg)) {
      missingFields.push('Assinatura do responsável');
      console.log('❌ [VALIDATOR] Assinatura do responsável - Faltando ou inválida');
    } else {
      console.log('✅ [VALIDATOR] Assinatura do responsável - Válida');
    }
    
    if (!techSignatureImg || !this.isValidSignature(techSignatureImg)) {
      missingFields.push('Assinatura do técnico');
      console.log('❌ [VALIDATOR] Assinatura do técnico - Faltando ou inválida');
    } else {
      console.log('✅ [VALIDATOR] Assinatura do técnico - Válida');
    }

    const result = {
      isValid: missingFields.length === 0,
      missingFields
    };

    console.log('📋 [VALIDATOR] Resultado assinaturas:', result);
    return result;
  }

  // Verificar se a assinatura é válida (não é placeholder) - MANTIDO
  static isValidSignature(signatureImg) {
    if (!signatureImg || !signatureImg.src) {
      return false;
    }
    
    const src = signatureImg.src;
    
    // Verificar se não é um placeholder ou imagem vazia
    const isValid = !(src === 'data:,' || 
                     src.includes('data:image/png;base64,AAAA') ||
                     src.length < 1000);
    
    return isValid;
  }

  // Mostrar erro - MANTIDO
  static showError(input, message) {
    let errorElement = input.nextElementSibling;
    
    if (!errorElement || !errorElement.classList.contains('error-message')) {
      errorElement = input.closest('.input-group')?.querySelector('.error-message');
    }
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      
      const inputGroup = input.closest('.input-group');
      if (inputGroup) {
        inputGroup.appendChild(errorElement);
      } else {
        input.parentNode.insertBefore(errorElement, input.nextSibling);
      }
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    input.classList.add('invalid');
  }

  // Esconder erro - MANTIDO
  static hideError(input) {
    const errorElement = input.closest('.input-group')?.querySelector('.error-message') || 
                         input.nextElementSibling;
    
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.style.display = 'none';
    }
    
    input.classList.remove('invalid');
  }

  // Validar email - MANTIDO
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validar telefone (formato brasileiro) - MANTIDO
  static validatePhone(phone) {
    const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Limpar validações - MANTIDO
  static clearValidations() {
    document.querySelectorAll('.invalid').forEach(el => {
      el.classList.remove('invalid');
    });
    
    document.querySelectorAll('.error-message').forEach(el => {
      el.style.display = 'none';
    });
  }

  // Validar um campo individual em tempo real - MANTIDO
  static validateField(input) {
    const value = input.value.trim();
    
    const isRequired = input.classList.contains('required-input') || 
                      input.classList.contains('required-field') ||
                      input.hasAttribute('required');
    
    if (isRequired && !value) {
      this.showError(input, 'Campo obrigatório');
      return false;
    } else {
      this.hideError(input);
      
      if (input.type === 'email' && value) {
        if (!this.validateEmail(value)) {
          this.showError(input, 'Email inválido');
          return false;
        }
      }
      
      if (input.type === 'tel' && value) {
        if (!this.validatePhone(value)) {
          this.showError(input, 'Telefone inválido');
          return false;
        }
      }
      
      return true;
    }
  }

  // Configurar validação em tempo real - MANTIDO
  static setupRealTimeValidation() {
    document.addEventListener('blur', (e) => {
      if (e.target.classList.contains('required-input') || 
          e.target.classList.contains('required-field') ||
          e.target.hasAttribute('required')) {
        this.validateField(e.target);
      }
    }, true);
    
    document.addEventListener('input', (e) => {
      if (e.target.classList.contains('invalid')) {
        this.validateField(e.target);
      }
    });
  }

  // Método auxiliar para debug - MANTIDO
  static debugValidation() {
    const formResult = this.validateForm();
    const signatureResult = this.validateSignatures();
    
    console.log('=== DEBUG VALIDAÇÃO ===');
    console.log('Formulário:', formResult);
    console.log('Assinaturas:', signatureResult);
    console.log('=======================');
    
    return {
      form: formResult,
      signatures: signatureResult
    };
  }
}

// Inicializar validação em tempo real quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  FormValidator.setupRealTimeValidation();
});

// Exportar para uso global
window.FormValidator = FormValidator;