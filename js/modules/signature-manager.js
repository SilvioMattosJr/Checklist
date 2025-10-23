// Gerenciador de assinaturas digitais
class SignatureManager {
  static init() {
    this.isDrawing = false;
    this.currentSignatureType = null;
    this.lastX = 0;
    this.lastY = 0;
    this.signatureCanvas = null;
    this.signatureCtx = null;

    // Inicializar seção de assinaturas
    this.initializeSignatureSection();
    
    // Carregar assinaturas salvas
    this.loadSignaturesFromStorage();
    this.loadNamesFromStorage();
  }

  // Inicializar seção de assinaturas
  static initializeSignatureSection() {
    const signaturesSection = document.querySelector('#signatures-section .signatures-container');
    if (!signaturesSection) {
      console.error('Seção de assinaturas não encontrada!');
      return;
    }
    
    signaturesSection.innerHTML = `
      <div class="signatures-grid">
        <!-- Assinatura do Cliente -->
        <div class="signature-column">
          <h3><i data-lucide="user"></i> Assinatura do Cliente</h3>
          <div class="signature-preview" id="clientSignaturePreview">
            <p>Nenhuma assinatura registrada</p>
          </div>
          <button onclick="SignatureManager.openSignatureModal('client')" class="signature-btn">
            <i data-lucide="pen-line"></i> Assinar
          </button>
          <div class="input-group">
            <label class="required-label">Nome do responsável</label>
            <input type="text" id="clientName" placeholder="Digite o nome do responsável" class="required-input">
            <div class="error-message">Este campo é obrigatório</div>
          </div>
        </div>
        
        <!-- Assinatura do Técnico -->
        <div class="signature-column">
          <h3><i data-lucide="user"></i> Assinatura do Técnico</h3>
          <div class="signature-preview" id="techSignaturePreview">
            <p>Nenhuma assinatura registrada</p>
          </div>
          <button onclick="SignatureManager.openSignatureModal('tech')" class="signature-btn">
            <i data-lucide="pen-line"></i> Assinar
          </button>
          <div class="input-group">
            <label class="required-label">Nome do técnico</label>
            <input type="text" id="techName" placeholder="Digite o nome do técnico" class="required-input">
            <div class="error-message">Este campo é obrigatório</div>
          </div>
        </div>
      </div>
    `;

    // Configurar eventos dos campos de nome
    this.setupNameInputEvents();
    
    // Atualizar ícones
    if (typeof lucide !== 'undefined') {
      setTimeout(() => lucide.createIcons(), 100);
    }
  }

  // Abrir modal de assinatura
  static openSignatureModal(type) {
    this.currentSignatureType = type;
    const modal = document.getElementById('signatureModal');
    const title = document.getElementById('signatureModalTitle');
    
    if (!modal) {
      this.createSignatureModal();
    }

    title.textContent = type === 'client' ? 'Assinatura do Cliente' : 'Assinatura do Técnico';
    
    // USAR ModalManager EM VEZ DE MANIPULAÇÃO DIRETA
    ModalManager.openModal('signatureModal');
    
    // Configurar canvas
    this.setupSignatureCanvas();
  }

  // Criar modal de assinatura
  static createSignatureModal() {
    const modalHTML = `
      <div class="modal-overlay" id="signatureModal" style="z-index: 3000;">
        <div class="modal" style="max-width: 500px;">
          <div class="modal-header">
            <h3 class="modal-title" id="signatureModalTitle">Assinar</h3>
          </div>
          <div class="modal-content">
            <div class="signature-instructions">
              <p><i data-lucide="info"></i> Desenhe sua assinatura no espaço abaixo</p>
            </div>
            <canvas id="signatureCanvas"></canvas>
            <div class="signature-actions">
              <button onclick="SignatureManager.clearSignatureCanvas()" class="btn-clear">
                <i data-lucide="trash-2"></i> Limpar
              </button>
              <button onclick="SignatureManager.saveSignature()" class="btn-save">
                <i data-lucide="check"></i> Salvar Assinatura
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Atualizar ícones
    if (typeof lucide !== 'undefined') {
      setTimeout(() => lucide.createIcons(), 100);
    }
  }

  // Configurar canvas de assinatura
  static setupSignatureCanvas() {
    this.signatureCanvas = document.getElementById('signatureCanvas');
    if (!this.signatureCanvas) {
      console.error('Canvas de assinatura não encontrado!');
      return;
    }
    
    this.signatureCtx = this.signatureCanvas.getContext('2d');
    
    // Configurar dimensões do canvas
    const rect = this.signatureCanvas.getBoundingClientRect();
    this.signatureCanvas.width = rect.width * 2; // Para alta resolução
    this.signatureCanvas.height = rect.height * 2;
    
    // Ajustar estilo CSS
    this.signatureCanvas.style.width = '99%';
    this.signatureCanvas.style.height = '200px';
    
    // Configurar contexto
    this.signatureCtx.scale(2, 2); // Compensar o scaling
    this.signatureCtx.lineCap = 'round';
    this.signatureCtx.lineJoin = 'round';
    this.signatureCtx.lineWidth = 3;
    this.signatureCtx.strokeStyle = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary') || '#ff7a00';
    
    // Limpar canvas
    this.clearSignatureCanvas();
    
    // Configurar eventos
    this.setupCanvasEvents();
  }

  // Configurar eventos do canvas
  static setupCanvasEvents() {
    if (!this.signatureCanvas) return;

    // Remover eventos anteriores
    this.signatureCanvas.removeEventListener('mousedown', this.handleMouseDown);
    this.signatureCanvas.removeEventListener('mousemove', this.handleMouseMove);
    this.signatureCanvas.removeEventListener('mouseup', this.handleMouseUp);
    this.signatureCanvas.removeEventListener('touchstart', this.handleTouchStart);
    this.signatureCanvas.removeEventListener('touchmove', this.handleTouchMove);
    this.signatureCanvas.removeEventListener('touchend', this.handleTouchEnd);

    // Adicionar novos eventos
    this.signatureCanvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.signatureCanvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.signatureCanvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.signatureCanvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.signatureCanvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.signatureCanvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  // Eventos de mouse
  static handleMouseDown(e) {
    this.isDrawing = true;
    const pos = this.getMousePos(e);
    [this.lastX, this.lastY] = pos;
  }

  static handleMouseMove(e) {
    if (!this.isDrawing) return;
    
    const [currentX, currentY] = this.getMousePos(e);
    
    this.signatureCtx.beginPath();
    this.signatureCtx.moveTo(this.lastX, this.lastY);
    this.signatureCtx.lineTo(currentX, currentY);
    this.signatureCtx.stroke();
    
    [this.lastX, this.lastY] = [currentX, currentY];
  }

  static handleMouseUp() {
    this.isDrawing = false;
  }

  // Eventos touch
  static handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    this.signatureCanvas.dispatchEvent(mouseEvent);
  }

  static handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    this.signatureCanvas.dispatchEvent(mouseEvent);
  }

  static handleTouchEnd(e) {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    this.signatureCanvas.dispatchEvent(mouseEvent);
  }

  // Obter posição do mouse/touch
  static getMousePos(e) {
    const rect = this.signatureCanvas.getBoundingClientRect();
    const scaleX = this.signatureCanvas.width / rect.width;
    const scaleY = this.signatureCanvas.height / rect.height;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    return [
      (clientX - rect.left) * scaleX / 2, // Dividir por 2 por causa do scale
      (clientY - rect.top) * scaleY / 2
    ];
  }

  // Limpar canvas de assinatura
  static clearSignatureCanvas() {
    if (this.signatureCtx && this.signatureCanvas) {
      this.signatureCtx.clearRect(0, 0, this.signatureCanvas.width, this.signatureCanvas.height);
    }
  }

  // Salvar assinatura
  static saveSignature() {
    if (!this.signatureCanvas) return;

    // Verificar se há assinatura
    const blankCanvas = document.createElement('canvas');
    blankCanvas.width = this.signatureCanvas.width;
    blankCanvas.height = this.signatureCanvas.height;
    
    if (this.isCanvasBlank(this.signatureCanvas, blankCanvas)) {
      alert('Por favor, desenhe sua assinatura antes de salvar.');
      return;
    }

    const signatureData = this.signatureCanvas.toDataURL('image/png');
    const previewId = this.currentSignatureType === 'client' ? 
      'clientSignaturePreview' : 'techSignaturePreview';
    const preview = document.getElementById(previewId);
    
    if (preview) {
      preview.innerHTML = `<img src="${signatureData}" alt="Assinatura" style="max-width: 100%; max-height: 100%;">`;
    }
    
    // Fechar modal usando ModalManager
    this.closeSignatureModal();
    
    // Atualizar botão de gerar relatório
    if (window.ChecklistManager) {
      ChecklistManager.updateGenerateButton();
    }
    
    // Salvar assinatura no localStorage
    this.saveSignatureToStorage(previewId, signatureData);
  }

  // Verificar se canvas está em branco
  static isCanvasBlank(canvas, blankCanvas) {
    const context = canvas.getContext('2d');
    const blankContext = blankCanvas.getContext('2d');
    
    const canvasData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const blankData = blankContext.getImageData(0, 0, blankCanvas.width, blankCanvas.height).data;
    
    return canvasData.every((color, index) => color === blankData[index]);
  }

  // Fechar modal de assinatura
  static closeSignatureModal() {
    // USAR ModalManager EM VEZ DE MANIPULAÇÃO DIRETA
    ModalManager.closeModal('signatureModal');
    this.clearSignatureCanvas();
  }

  // Salvar assinatura no localStorage
  static saveSignatureToStorage(key, data) {
    const signatures = StorageManager.get('signatures', {});
    signatures[key] = data;
    StorageManager.set('signatures', signatures);
  }

  // Carregar assinaturas salvas
  static loadSignaturesFromStorage() {
    const signatures = StorageManager.get('signatures', {});
    
    Object.keys(signatures).forEach(key => {
      const preview = document.getElementById(key);
      if (preview) {
        preview.innerHTML = `<img src="${signatures[key]}" alt="Assinatura" style="max-width: 100%; max-height: 100%;">`;
      }
    });
  }

  // Configurar eventos dos campos de nome
  static setupNameInputEvents() {
    const clientNameInput = document.getElementById('clientName');
    const techNameInput = document.getElementById('techName');
    
    if (clientNameInput) {
      clientNameInput.addEventListener('input', () => {
        if (window.ChecklistManager) {
          ChecklistManager.updateGenerateButton();
        }
        this.saveNameToStorage('clientName', clientNameInput.value);
      });
    }
    
    if (techNameInput) {
      techNameInput.addEventListener('input', () => {
        if (window.ChecklistManager) {
          ChecklistManager.updateGenerateButton();
        }
        this.saveNameToStorage('techName', techNameInput.value);
      });
    }
  }

  // Salvar nome no localStorage
  static saveNameToStorage(key, value) {
    const names = StorageManager.get('signatureNames', {});
    names[key] = value;
    StorageManager.set('signatureNames', names);
  }

  // Carregar nomes salvos
  static loadNamesFromStorage() {
    const names = StorageManager.get('signatureNames', {});
    
    Object.keys(names).forEach(key => {
      const input = document.getElementById(key);
      if (input && names[key]) {
        input.value = names[key];
      }
    });
  }

  // Obter dados das assinaturas para o relatório
  static getSignatureData() {
    const clientName = document.getElementById('clientName')?.value.trim() || '';
    const techName = document.getElementById('techName')?.value.trim() || '';
    const clientSignature = document.getElementById('clientSignaturePreview')?.querySelector('img');
    const techSignature = document.getElementById('techSignaturePreview')?.querySelector('img');
    
    return {
      clientName,
      techName,
      hasClientSignature: !!clientSignature,
      hasTechSignature: !!techSignature,
      clientSignatureData: clientSignature ? clientSignature.src : null,
      techSignatureData: techSignature ? techSignature.src : null
    };
  }

  // Limpar todas as assinaturas
  static clearAllSignatures() {
    if (confirm('Tem certeza que deseja limpar todas as assinaturas?')) {
      // Limpar previews
      const previews = document.querySelectorAll('.signature-preview');
      previews.forEach(preview => {
        preview.innerHTML = '<p>Nenhuma assinatura registrada</p>';
      });
      
      // Limpar campos de nome
      const nameInputs = document.querySelectorAll('#clientName, #techName');
      nameInputs.forEach(input => input.value = '');
      
      // Limpar localStorage
      StorageManager.remove('signatures');
      StorageManager.remove('signatureNames');
      
      // Atualizar botão
      if (window.ChecklistManager) {
        ChecklistManager.updateGenerateButton();
      }
    }
  }
}

// Exportar para uso global
window.SignatureManager = SignatureManager;