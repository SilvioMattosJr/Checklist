// Constantes do aplicativo
const CONSTANTS = {
  SELECTORS: {
    CONTAINER: '.container',
    PROGRESS_BAR: '#progressBar',
    MACHINES_CONTAINER: '#machines-container',
    INFRA_CONTAINER: '#infraestruturas-container',
    GENERATE_BTN: '#generateReportBtn'
  },
  
  TEMPLATES: {
    MODERN: 'modern',
    CORPORATE: 'corporate',
    MINIMAL: 'minimal'
  },
  
  STORAGE_KEYS: {
    DARK_MODE: 'darkMode',
    PDF_CONFIGS: 'pdfConfigurations',
    CHECKLIST_DATA: 'checklistData'
  },
  
  MESSAGES: {
    REQUIRED_FIELD: 'Este campo é obrigatório',
    CONFIG_SAVED: 'Configuração salva com sucesso!',
    CONFIG_LOADED: 'Configuração carregada com sucesso!',
    PDF_GENERATED: 'PDF gerado com sucesso!'
  }
};

// Exportar para uso global
window.CONSTANTS = CONSTANTS;