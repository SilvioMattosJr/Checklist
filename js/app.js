// Aplicação principal
class ChecklistApp {
  static init() {
    console.log('🚀 Inicializando Checklist App...');
    
    // Inicializar módulos
    ThemeManager.init();
    ChecklistManager.init();
    SignatureManager.init();
    ModalManager.init();
    
    // Carregar dados salvos
    this.loadSavedData();
    
    // Configurar eventos globais
    this.setupGlobalEvents();
    
    // Atualizar ícones
    this.initializeIcons();
    
    console.log('✅ Checklist App inicializado com sucesso!');
  }

  // Carregar dados salvos
  static loadSavedData() {
    const savedData = StorageManager.loadChecklistData();
    if (savedData) {
      ChecklistManager.loadData(savedData);
    }
  }

  // Configurar eventos globais
  static setupGlobalEvents() {
    // Salvar dados automaticamente
    document.addEventListener('input', Helpers.debounce(() => {
      const data = ChecklistManager.getData();
      StorageManager.saveChecklistData(data);
    }, 1000));

    // Atualizar progresso quando checkboxes mudarem
    document.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        ChecklistManager.updateProgressBar();
        ChecklistManager.updateGenerateButton();
      }
    });
  }

  // Inicializar ícones Lucide
  static initializeIcons() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
      console.log('✅ Ícones Lucide inicializados');
    } else {
      console.error('❌ Lucide não carregado');
    }
  }
}

// Inicializar aplicação quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM Carregado - Iniciando aplicação...');
  ChecklistApp.init();
});

// Exportar para uso global
window.ChecklistApp = ChecklistApp;