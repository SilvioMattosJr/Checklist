// Gerenciador de modais com suporte a tecla ESC
class ModalManager {
  static init() {
    this.setupEscapeKeyListener();
    this.setupOverlayClickListeners();
  }

  // Configurar listener para tecla ESC
  static setupEscapeKeyListener() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  // Configurar clique no overlay para fechar modais
  static setupOverlayClickListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.closeModal(e.target.id);
      }
    });
  }

  // Fechar todos os modais abertos
  static closeAllModals() {
    const openModals = document.querySelectorAll('.modal-overlay.active');
    
    openModals.forEach(modal => {
      modal.classList.remove('active');
    });
    
    // Restaurar scroll do body
    document.body.style.overflow = 'auto';
    
    // Limpar canvas de assinatura se estiver aberto
    if (window.SignatureManager) {
      SignatureManager.clearSignatureCanvas();
    }
  }

  // Fechar modal específico
  static closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
      
      // Limpar canvas de assinatura se for o modal de assinatura
      if (modalId === 'signatureModal' && window.SignatureManager) {
        SignatureManager.clearSignatureCanvas();
      }
    }
  }

  // Abrir modal específico
  static openModal(modalId) {
    this.closeAllModals(); // Fechar outros modais antes de abrir um novo
    
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  // Verificar se algum modal está aberto
  static isAnyModalOpen() {
    return document.querySelector('.modal-overlay.active') !== null;
  }
}

// Exportar para uso global
window.ModalManager = ModalManager;