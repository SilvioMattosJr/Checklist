// Gerenciamento do localStorage
class StorageManager {
  // Salvar dados
  static set(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
      return false;
    }
  }

  // Recuperar dados
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Erro ao recuperar do localStorage:', error);
      return defaultValue;
    }
  }

  // Remover dados
  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
      return false;
    }
  }

  // Limpar todos os dados
  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
      return false;
    }
  }

  // Salvar configurações do PDF
  static savePdfConfig(config) {
    const configs = this.get(CONSTANTS.STORAGE_KEYS.PDF_CONFIGS, []);
    configs.push({
      ...config,
      id: Helpers.generateId(),
      createdAt: new Date().toISOString()
    });
    return this.set(CONSTANTS.STORAGE_KEYS.PDF_CONFIGS, configs);
  }

  // Carregar configurações do PDF
  static loadPdfConfigs() {
    return this.get(CONSTANTS.STORAGE_KEYS.PDF_CONFIGS, []);
  }

  // Salvar dados do checklist
  static saveChecklistData(data) {
    return this.set(CONSTANTS.STORAGE_KEYS.CHECKLIST_DATA, data);
  }

  // Carregar dados do checklist
  static loadChecklistData() {
    return this.get(CONSTANTS.STORAGE_KEYS.CHECKLIST_DATA, null);
  }
}

// Exportar para uso global
window.StorageManager = StorageManager;