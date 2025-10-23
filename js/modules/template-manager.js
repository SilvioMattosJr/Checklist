// ... (código anterior permanece igual)

  // Configurar eventos de cores
  static setupColorEvents() {
    const colorInputs = ['primaryColor', 'secondaryColor', 'textColor', 'backgroundColor'];
    
    colorInputs.forEach(colorId => {
      const element = document.getElementById(colorId);
      const hexElement = document.getElementById(colorId + 'Hex');
      
      if (element && hexElement) {
        element.addEventListener('input', () => this.updateColors());
        hexElement.addEventListener('change', () => this.updateColorsFromHex());
      }
    });
  }

  // Configurar eventos de texto
  static setupTextEvents() {
    const textControls = [
      'fontFamily', 'titleFontSize', 'subtitleFontSize', 
      'bodyFontSize', 'footerFontSize'
    ];
    
    textControls.forEach(controlId => {
      const element = document.getElementById(controlId);
      if (element) {
        element.addEventListener('input', () => this.updateTextPreview());
      }
    });
  }

  // Configurar eventos de segurança
  static setupSecurityEvents() {
    // Já implementado em setupTabEvents()
  }

  // Atualizar cores
  static updateColors() {
    const primaryColor = document.getElementById('primaryColor').value;
    const secondaryColor = document.getElementById('secondaryColor').value;
    const textColor = document.getElementById('textColor').value;
    const backgroundColor = document.getElementById('backgroundColor').value;
    
    // Atualizar campos hex
    document.getElementById('primaryColorHex').value = primaryColor.toUpperCase();
    document.getElementById('secondaryColorHex').value = secondaryColor.toUpperCase();
    document.getElementById('textColorHex').value = textColor.toUpperCase();
    document.getElementById('backgroundColorHex').value = backgroundColor.toUpperCase();
    
    this.updatePreview();
  }

  // Atualizar cores a partir dos campos hex
  static updateColorsFromHex() {
    const primaryHex = document.getElementById('primaryColorHex').value;
    const secondaryHex = document.getElementById('secondaryColorHex').value;
    const textHex = document.getElementById('textColorHex').value;
    const backgroundHex = document.getElementById('backgroundColorHex').value;
    
    // Validar formato hex
    const hexRegex = /^#[0-9A-F]{6}$/i;
    
    if (hexRegex.test(primaryHex)) {
      document.getElementById('primaryColor').value = primaryHex;
    }
    if (hexRegex.test(secondaryHex)) {
      document.getElementById('secondaryColor').value = secondaryHex;
    }
    if (hexRegex.test(textHex)) {
      document.getElementById('textColor').value = textHex;
    }
    if (hexRegex.test(backgroundHex)) {
      document.getElementById('backgroundColor').value = backgroundHex;
    }
    
    this.updatePreview();
  }

  // Atualizar prévia de texto
  static updateTextPreview() {
    const fontFamily = document.getElementById('fontFamily').value;
    const titleFontSize = document.getElementById('titleFontSize').value;
    const subtitleFontSize = document.getElementById('subtitleFontSize').value;
    const bodyFontSize = document.getElementById('bodyFontSize').value;
    
    // Aplicar estilos na prévia
    const previewContent = document.getElementById('textPreviewContent');
    if (previewContent) {
      previewContent.style.fontFamily = fontFamily;
    }
    
    const previewTitle = document.getElementById('previewTitle');
    if (previewTitle) {
      previewTitle.style.fontSize = titleFontSize + 'pt';
    }
    
    const previewSubtitle = document.getElementById('previewSubtitle');
    if (previewSubtitle) {
      previewSubtitle.style.fontSize = subtitleFontSize + 'pt';
    }
    
    const previewBodies = document.querySelectorAll('.preview-body');
    previewBodies.forEach(body => {
      body.style.fontSize = bodyFontSize + 'pt';
    });
    
    this.updatePreview();
  }

  // Alternar estilo de texto
  static toggleStyle(styleName) {
    const button = document.getElementById(styleName + 'Toggle');
    button.classList.toggle('active');
    this.updatePreview();
  }

  // Definir alinhamento
  static setAlignment(alignment) {
    // Remover classe active de todos os botões
    document.querySelectorAll('.alignment-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Adicionar classe active ao botão selecionado
    const button = document.getElementById('align' + 
      alignment.charAt(0).toUpperCase() + alignment.slice(1));
    if (button) {
      button.classList.add('active');
    }
    
    this.updatePreview();
  }

  // Atualizar logo
  static updateLogo(input) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.logoImageData = e.target.result;
        
        // Mostrar prévia
        const previewContainer = document.getElementById('logoPreviewContainer');
        previewContainer.innerHTML = `<img src="${this.logoImageData}" class="logo-preview" alt="Logo Preview">`;
        
        this.updatePreview();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // Atualizar imagem de fundo
  static updateBackgroundImage(input) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.backgroundImageData = e.target.result;
        
        // Mostrar prévia
        const previewContainer = document.getElementById('bgImagePreviewContainer');
        previewContainer.innerHTML = `
          <img src="${this.backgroundImageData}" 
               style="max-width: 200px; max-height: 100px; margin-top: 10px; border-radius: 5px; border: 1px solid #ddd;" 
               alt="Background Preview">
        `;
        
        // Mostrar controle de opacidade
        document.getElementById('bgImageOpacitySection').style.display = 'block';
        
        this.updatePreview();
      };
      reader.readAsDataURL(input.files[0]);
    } else {
      this.backgroundImageData = null;
      document.getElementById('bgImagePreviewContainer').innerHTML = '';
      document.getElementById('bgImageOpacitySection').style.display = 'none';
      this.updatePreview();
    }
  }

  // Atualizar prévia
  static updatePreview() {
    const previewContent = document.getElementById('pdfPreviewContent');
    if (!previewContent) return;

    // Obter valores dos controles
    const companyName = document.getElementById('pdfCompanyName')?.value || 'Nome da Empresa';
    const technicianName = document.getElementById('pdfTechnicianName')?.value || 'Nome do Técnico';
    const reportDate = document.getElementById('pdfReportDate')?.value;
    const formattedDate = reportDate ? 
      new Date(reportDate).toLocaleDateString('pt-BR') : Helpers.formatDate();

    // Cores
    const primaryColor = document.getElementById('primaryColor')?.value || '#ff7a00';
    const backgroundColor = document.getElementById('backgroundColor')?.value || '#ffffff';

    // Gerar HTML da prévia baseado no template selecionado
    let previewHTML = this.generatePreviewHTML(
      companyName, technicianName, formattedDate, primaryColor, backgroundColor
    );
    
    previewContent.innerHTML = previewHTML;
  }

  // Gerar HTML da prévia
  static generatePreviewHTML(companyName, technicianName, date, primaryColor, backgroundColor) {
    return `
      <div style="
        width: 100%;
        height: 100%;
        background-color: ${backgroundColor};
        font-family: 'Segoe UI', sans-serif;
        padding: 30px;
        box-sizing: border-box;
        position: relative;
      ">
        <!-- Cabeçalho -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid ${primaryColor}; padding-bottom: 20px;">
          ${this.logoImageData ? `
            <div style="margin-bottom: 15px;">
              <img src="${this.logoImageData}" style="max-height: 60px; max-width: 200px;" alt="Logo">
            </div>
          ` : ''}
          
          <h1 style="color: ${primaryColor}; margin: 10px 0; font-size: 24px;">
            RELATÓRIO DE MANUTENÇÃO PREVENTIVA
          </h1>
          
          <div style="color: #666; font-size: 14px;">
            <div>Empresa: ${companyName}</div>
            <div>Data: ${date}</div>
            <div>Técnico: ${technicianName}</div>
          </div>
        </div>

        <!-- Conteúdo de exemplo -->
        <div style="margin-bottom: 20px;">
          <h2 style="color: ${primaryColor}; font-size: 16px; border-bottom: 1px solid ${primaryColor}; padding-bottom: 5px;">
            Checklist Realizado
          </h2>
          <p style="color: #333; font-size: 12px; margin: 10px 0;">
            ✓ Verificação completa do sistema<br>
            ✓ Atualização de software<br>
            ✓ Backup de dados<br>
            ✓ Limpeza interna
          </p>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: ${primaryColor}; font-size: 16px; border-bottom: 1px solid ${primaryColor}; padding-bottom: 5px;">
            Observações
          </h2>
          <p style="color: #333; font-size: 12px;">
            Sistema operando dentro dos parâmetros normais. 
            Recomendada nova verificação em 30 dias.
          </p>
        </div>

        <!-- Rodapé -->
        <div style="
          position: absolute;
          bottom: 30px;
          left: 30px;
          right: 30px;
          border-top: 1px solid #ddd;
          padding-top: 15px;
          color: #666;
          font-size: 10px;
          text-align: center;
        ">
          ${document.getElementById('customFooter')?.value || 'Relatório gerado automaticamente - Sistema de Checklist Preventiva'}
        </div>

        <!-- Marca d'água -->
        ${this.generateWatermarkHTML()}
      </div>
    `;
  }

  // Gerar HTML da marca d'água
  static generateWatermarkHTML() {
    const enableWatermark = document.getElementById('enableWatermark')?.checked;
    const watermarkText = document.getElementById('watermarkText')?.value;
    const watermarkOpacity = document.getElementById('watermarkOpacity')?.value || 30;
    
    if (!enableWatermark || !watermarkText) return '';

    return `
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 48px;
        color: rgba(0, 0, 0, ${watermarkOpacity / 100});
        font-weight: bold;
        pointer-events: none;
        z-index: 100;
        white-space: nowrap;
      ">
        ${watermarkText}
      </div>
    `;
  }

  // Salvar configuração
  static saveConfiguration() {
    const configName = document.getElementById('configName')?.value.trim();
    if (!configName) {
      alert('Por favor, digite um nome para a configuração.');
      return;
    }

    const config = {
      name: configName,
      template: this.selectedTemplate,
      companyName: document.getElementById('pdfCompanyName')?.value || '',
      technicianName: document.getElementById('pdfTechnicianName')?.value || '',
      reportDate: document.getElementById('pdfReportDate')?.value || '',
      colors: {
        primary: document.getElementById('primaryColor')?.value || '#ff7a00',
        secondary: document.getElementById('secondaryColor')?.value || '#2c3e50',
        text: document.getElementById('textColor')?.value || '#333333',
        background: document.getElementById('backgroundColor')?.value || '#ffffff'
      },
      logo: this.logoImageData,
      backgroundImage: this.backgroundImageData,
      customFooter: document.getElementById('customFooter')?.value || '',
      createdAt: new Date().toISOString()
    };

    // Verificar se já existe
    const existingIndex = this.savedConfigurations.findIndex(c => c.name === configName);
    if (existingIndex !== -1) {
      if (!confirm('Já existe uma configuração com este nome. Deseja substituir?')) {
        return;
      }
      this.savedConfigurations[existingIndex] = config;
    } else {
      this.savedConfigurations.push(config);
    }

    // Salvar no localStorage
    StorageManager.set(CONSTANTS.STORAGE_KEYS.PDF_CONFIGS, this.savedConfigurations);
    
    // Atualizar lista
    this.loadSavedConfigurationsList();
    
    // Limpar campo
    document.getElementById('configName').value = '';
    
    alert('Configuração salva com sucesso!');
  }

  // Carregar configuração
  static loadConfiguration() {
    if (this.savedConfigurations.length === 0) {
      alert('Nenhuma configuração salva encontrada.');
      return;
    }

    const configNames = this.savedConfigurations.map(c => c.name);
    const selectedName = prompt(
      'Configurações salvas:\n' + configNames.join('\n') + '\n\nDigite o nome da configuração que deseja carregar:'
    );

    if (!selectedName) return;

    const config = this.savedConfigurations.find(c => c.name === selectedName);
    if (!config) {
      alert('Configuração não encontrada.');
      return;
    }

    // Aplicar configuração
    this.applyConfiguration(config);
    alert('Configuração carregada com sucesso!');
  }

  // Aplicar configuração
  static applyConfiguration(config) {
    this.selectedTemplate = config.template;
    this.selectTemplate(config.template);

    document.getElementById('pdfCompanyName').value = config.companyName || '';
    document.getElementById('pdfTechnicianName').value = config.technicianName || '';
    document.getElementById('pdfReportDate').value = config.reportDate || '';

    // Cores
    if (config.colors) {
      document.getElementById('primaryColor').value = config.colors.primary;
      document.getElementById('primaryColorHex').value = config.colors.primary;
      document.getElementById('secondaryColor').value = config.colors.secondary;
      document.getElementById('secondaryColorHex').value = config.colors.secondary;
      document.getElementById('textColor').value = config.colors.text;
      document.getElementById('textColorHex').value = config.colors.text;
      document.getElementById('backgroundColor').value = config.colors.background;
      document.getElementById('backgroundColorHex').value = config.colors.background;
    }

    // Logo
    if (config.logo) {
      this.logoImageData = config.logo;
      document.getElementById('logoPreviewContainer').innerHTML = 
        `<img src="${config.logo}" class="logo-preview" alt="Logo Preview">`;
    }

    // Background
    if (config.backgroundImage) {
      this.backgroundImageData = config.backgroundImage;
      document.getElementById('bgImagePreviewContainer').innerHTML = 
        `<img src="${config.backgroundImage}" style="max-width: 200px; max-height: 100px; margin-top: 10px; border-radius: 5px; border: 1px solid #ddd;" alt="Background Preview">`;
      document.getElementById('bgImageOpacitySection').style.display = 'block';
    }

    // Footer
    document.getElementById('customFooter').value = config.customFooter || '';

    this.updatePreview();
  }

  // Carregar lista de configurações salvas
  static loadSavedConfigurationsList() {
    const listContainer = document.getElementById('savedConfigsList');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (this.savedConfigurations.length === 0) {
      listContainer.innerHTML = '<p style="text-align: center; color: #6c757d;">Nenhuma configuração salva</p>';
      return;
    }

    this.savedConfigurations.forEach((config, index) => {
      const configItem = document.createElement('div');
      configItem.className = 'config-item';
      configItem.innerHTML = `
        <div>
          <strong>${config.name}</strong>
          <small style="display: block; color: #6c757d;">
            ${new Date(config.createdAt).toLocaleDateString('pt-BR')} - Template: ${config.template}
          </small>
        </div>
        <div class="config-actions">
          <button class="config-btn" onclick="TemplateManager.loadConfigurationByIndex(${index})" style="background-color: #28a745;">
            <i data-lucide="folder-open"></i> Carregar
          </button>
          <button class="config-btn" onclick="TemplateManager.deleteConfiguration(${index})" style="background-color: #dc3545;">
            <i data-lucide="trash-2"></i> Excluir
          </button>
        </div>
      `;
      listContainer.appendChild(configItem);
    });

    lucide.createIcons();
  }

  // Carregar configuração por índice
  static loadConfigurationByIndex(index) {
    const config = this.savedConfigurations[index];
    if (config) {
      this.applyConfiguration(config);
    }
  }

  // Excluir configuração
  static deleteConfiguration(index) {
    if (confirm('Tem certeza que deseja excluir esta configuração?')) {
      this.savedConfigurations.splice(index, 1);
      StorageManager.set(CONSTANTS.STORAGE_KEYS.PDF_CONFIGS, this.savedConfigurations);
      this.loadSavedConfigurationsList();
    }
  }
}

// Exportar para uso global
window.TemplateManager = TemplateManager;