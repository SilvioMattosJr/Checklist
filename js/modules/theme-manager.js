// Gerenciador de temas e dropdown
class ThemeManager {
  static init() {
    // Carregar tema salvo
    this.loadTheme();
    
    // Configurar eventos do dropdown
    this.setupDropdownEvents();
  }

  // Alternar dropdown
  static toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    dropdownMenu.classList.toggle('show');
  }

  // Alternar tema
  static toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark');
    
    // Salvar preferência
    StorageManager.set(
      CONSTANTS.STORAGE_KEYS.DARK_MODE, 
      body.classList.contains('dark')
    );
  }

  // Carregar tema salvo
  static loadTheme() {
    const darkMode = StorageManager.get(CONSTANTS.STORAGE_KEYS.DARK_MODE, false);
    if (darkMode) {
      document.body.classList.add('dark');
    }
  }

  // Configurar eventos do dropdown
  static setupDropdownEvents() {
    // Fechar dropdown ao clicar fora
    document.addEventListener('click', (event) => {
      const dropdownContainer = document.querySelector('.dropdown-container');
      const dropdownMenu = document.getElementById('dropdownMenu');
      
      if (!dropdownContainer.contains(event.target)) {
        dropdownMenu.classList.remove('show');
      }
    });
  }
}

// Exportar para uso global
window.ThemeManager = ThemeManager;