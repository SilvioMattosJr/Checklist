// Gerenciador principal do checklist
class ChecklistManager {
  static machineCounter = 0;
  static infraCounter = 0;
  
  static init() {
    this.machineCounter = 0;
    this.infraCounter = 0;
    
    // Inicializar seções padrão
    this.initializeDefaultSections();
    
    // Configurar eventos
    this.setupEventListeners();
    
    console.log('✅ ChecklistManager inicializado');
  }

  // Inicializar seções padrão do checklist
  static initializeDefaultSections() {
    this.createArrivalSection();
    this.createTrainingSection();
    this.createClosureSection();
  }

  // Seção: Ao Chegar no Cliente
  static createArrivalSection() {
    const section = document.getElementById('arrival-section');
    if (!section) return;

    // preserva header existente
    const headerHtml = section.querySelector('h2')?.outerHTML ||
      `<h2><i data-lucide="user-check"></i> Ao Chegar no Cliente</h2>`;

    const contentHtml = `
      <div class="section-body">
        <!-- Campo obrigatório: Nome da empresa -->
        <div class="form-row">
          <label for="company-name">Nome da empresa <span class="required-asterisk">*</span></label>
          <input id="company-name" type="text" class="required-field" placeholder="Digite o nome da empresa" />
        </div>

        <div class="form-row">
          <label><input type="checkbox" class="required-checkbox"> Abrir chamado no Milvus <span class="required-asterisk">*</span></label>
        </div>

        <div class="form-row">
          <label><input type="checkbox" class="required-checkbox"> Iniciar atendimento <span class="required-asterisk">*</span></label>
        </div>
      </div>
    `;

    section.innerHTML = headerHtml + contentHtml;
  }

  // Seção: Treinamento (ALTERADO - Campos agora são obrigatórios)
  static createTrainingSection() {
    const section = document.getElementById('training-section');
    if (!section) return;

    const headerHtml = section.querySelector('h2')?.outerHTML ||
      `<h2><i data-lucide="users"></i> Treinamento</h2>`;

    const contentHtml = `
      <div class="section-body">
        <label><input type="checkbox" class="required-checkbox"> Demonstrar como abrir chamado via Client Core Helpdesk <span class="required-asterisk">*</span></label>
        <label><input type="checkbox" class="required-checkbox"> Explicar procedimentos básicos de manutenção <span class="required-asterisk">*</span></label>
        <label><input type="checkbox" class="required-checkbox"> Orientar sobre: Sempre manter o sistema atualizado <span class="required-asterisk">*</span></label>
      </div>
    `;

    section.innerHTML = headerHtml + contentHtml;
  }

  // Seção: Encerramento
  static createClosureSection() {
    const section = document.getElementById('closure-section');
    if (!section) return;

    const headerHtml = section.querySelector('h2')?.outerHTML ||
      `<h2><i data-lucide="check-circle-2"></i> Encerramento</h2>`;

    const contentHtml = `
      <div class="section-body">
        <label><input type="checkbox"> Escrever relatório no Milvus</label>
        <label><input type="checkbox"> Coletar assinatura do responsável</label>
        <label><input type="checkbox"> Coletar assinatura do técnico</label>
        <label><input type="checkbox"> Encerrar chamado na frente do responsável</label>
        <label><input type="checkbox"> Verificar satisfação do cliente</label>
      </div>
    `;

    section.innerHTML = headerHtml + contentHtml;
  }

  // Adicionar máquina
  static addMachine() {
    this.machineCounter++;
    const container = document.getElementById('machines-container');
    const machineId = `machine-${this.machineCounter}`;
    
    const machineHTML = `
      <div class="card machine-block" id="${machineId}">
        <div class="machine-header">
          <h2><i data-lucide="monitor-smartphone"></i> Máquina ${this.machineCounter}</h2>
          <button class="btn-remove" onclick="ChecklistManager.removeMachine('${machineId}')">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
        
        <div class="input-group">
          <label class="required-label">Nome da Máquina</label>
          <input type="text" placeholder="Digite o nome da máquina" class="required-input" data-field="name">
          <div class="error-message">Este campo é obrigatório</div>
        </div>
        
        <div class="input-group">
          <label class="required-label">Sistema Operacional</label>
          <input type="text" placeholder="Digite o sistema operacional" class="required-input" data-field="os">
          <div class="error-message">Este campo é obrigatório</div>
        </div>
        
        <div class="input-group">
          <label class="required-label">Verificar armazenamento</label>
          <input type="text" placeholder="Informe o status do armazenamento" class="required-input" data-field="storage">
          <div class="error-message">Este campo é obrigatório</div>
        </div>
        
        <div class="input-group">
          <label class="required-label">Verificar memória RAM</label>
          <input type="text" placeholder="Informe o status da memória RAM" class="required-input" data-field="ram">
          <div class="error-message">Este campo é obrigatório</div>
        </div>
        
        <fieldset>
          <legend>Windows está ativado:</legend>
          <label>
            <input type="radio" name="ativado-${this.machineCounter}" value="sim" 
                   onchange="ChecklistManager.toggleWindowsSection(this, ${this.machineCounter})"> Sim
          </label>
          <label>
            <input type="radio" name="ativado-${this.machineCounter}" value="nao" 
                   onchange="ChecklistManager.toggleWindowsSection(this, ${this.machineCounter})"> Não
          </label>
        </fieldset>
        
        <div class="windows-not-activated" style="display:none;">
          <h3>Caso o Windows não esteja ativado:</h3>
          <label><input type="checkbox" data-field="windows-mas"> Utilizar MAS_1.0_CRC32_1D90323C.cmd</label>
          <label><input type="checkbox" data-field="windows-cmd"> Executar comando: irm https://get.activated.win | iex</label>
        </div>
        
        <h3>Processos de Manutenção:</h3>
        <label><input type="checkbox" data-field="check-updates"> Verificar Windows Update</label>
        <label><input type="checkbox" data-field="check-programs"> Verificar programas instalados</label>
        <label><input type="checkbox" data-field="install-milvus"> Instalar Milvus</label>
        <label><input type="checkbox" data-field="update-browsers"> Atualizar Navegadores</label>
        <label><input type="checkbox" data-field="install-office"> Verificar o Pacote Office, instalar e ativar</label>
        <label><input type="checkbox" data-field="install-adobe"> Instalar o Adobe Reader</label>
        <label><input type="checkbox" data-field="install-winrar"> Instalar o WinRAR</label>
        <label><input type="checkbox" data-field="run-aida"> Passar o AIDA</label>
        
        <div class="input-group">
          <label class="required-label">ID do Anydesk</label>
          <input type="text" placeholder="Digite o ID do Anydesk" class="required-input" data-field="anydesk">
          <div class="error-message">Este campo é obrigatório</div>
        </div>
        
        <h3>Documentação:</h3>
        <div class="photos-container" id="photos-container-${this.machineCounter}">
          <!-- Fotos serão adicionadas aqui dinamicamente -->
        </div>
        
        <div class="add-photo-section">
          <button type="button" class="btn-add-photo" onclick="ChecklistManager.addPhoto('${machineId}', 'machine')">
            <div class="add-photo-icon">+</div>
            <span>Adicionar Foto</span>
          </button>
        </div>
        
        <!-- NOVO CAMPO: Observações da Máquina -->
        <div class="input-group">
          <label class="required-label">Observações da Máquina</label>
          <textarea placeholder="Digite observações específicas sobre esta máquina" 
                    class="required-input machine-observations" 
                    data-field="machine-observations"></textarea>
          <div class="error-message">Este campo é obrigatório</div>
        </div>
      </div>
    `;
    
    container.insertAdjacentHTML('beforeend', machineHTML);
    this.updateProgressBar();
    
    // ✅ MELHORIA: Configurar validação em tempo real para os novos campos
    setTimeout(() => {
      FormValidator.setupRealTimeValidation();
      this.updateGenerateButton(); // ATUALIZAR BOTÃO IMEDIATAMENTE
    }, 100);
    
    lucide.createIcons();
  }

  // Adicionar infraestrutura (ATUALIZADO - REMOVIDO STATUS GLOBAL)
  static addInfra() {
    this.infraCounter++;
    const container = document.getElementById('infraestruturas-container');
    const infraId = `infra-${this.infraCounter}`;
    
    const infraHTML = `
      <div class="card infra-block" id="${infraId}">
        <div class="infra-header">
          <h2><i data-lucide="camera"></i> Infraestrutura ${this.infraCounter}</h2>
          <button class="btn-remove" onclick="ChecklistManager.removeInfra('${infraId}')">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
        
        <div class="input-group">
          <label class="required-label">Descrição do Item</label>
          <input type="text" placeholder="Ex: Roteador, Câmera, Modem, etc." class="required-input" data-field="description">
          <div class="error-message">Este campo é obrigatório</div>
        </div>
        
        <div class="input-group">
          <label class="required-label">Localização</label>
          <input type="text" placeholder="Onde está instalado este item" class="required-input" data-field="location">
          <div class="error-message">Este campo é obrigatório</div>
        </div>
        
        <h3>Documentação:</h3>
        <div class="photos-container" id="infra-photos-container-${this.infraCounter}">
          <!-- Fotos serão adicionadas aqui dinamicamente -->
        </div>
        
        <div class="add-photo-section">
          <button type="button" class="btn-add-photo" onclick="ChecklistManager.addPhoto('${infraId}', 'infra')">
            <div class="add-photo-icon">+</div>
            <span>Adicionar Foto</span>
          </button>
        </div>
        
        <div class="input-group">
          <label class="required-label">Observações</label>
          <textarea placeholder="Anotações sobre este item de infraestrutura" class="required-input" data-field="notes"></textarea>
          <div class="error-message">Este campo é obrigatório</div>
        </div>
      </div>
    `;
    
    container.insertAdjacentHTML('beforeend', infraHTML);
    this.updateProgressBar();
    
    // ✅ MELHORIA: Configurar validação em tempo real para os novos campos
    setTimeout(() => {
      FormValidator.setupRealTimeValidation();
      this.updateGenerateButton(); // ATUALIZAR BOTÃO IMEDIATAMENTE
    }, 100);
    
    lucide.createIcons();
  }

  // Inicializar selects customizados
  static initializeCustomSelects() {
    // Configurar evento para atualizar o botão quando select mudar
    document.querySelectorAll('.custom-select').forEach(select => {
      select.addEventListener('change', () => {
        this.updateGenerateButton();
      });
    });
    
    // Atualizar ícones Lucide
    if (typeof lucide !== 'undefined') {
      setTimeout(() => lucide.createIcons(), 100);
    }
  }

  // Adicionar foto para uma máquina ou infraestrutura (ATUALIZADO COM STATUS POR FOTO)
  static addPhoto(itemId, type = 'machine') {
    const item = document.getElementById(itemId);
    const photosContainerId = type === 'machine' ? `photos-container-${itemId.split('-')[1]}` : `infra-photos-container-${itemId.split('-')[1]}`;
    const photosContainer = item.querySelector(`#${photosContainerId}`) || item.querySelector('.photos-container');
    const photoIndex = photosContainer.children.length + 1;
    
    const photoHTML = `
      <div class="photo-item" data-photo-index="${photoIndex}">
        <div class="photo-header">

          <button type="button" class="btn-remove-photo" onclick="ChecklistManager.removePhoto(this)">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
        
        <div class="photo-upload-area">
          <div class="photo-preview-container">
            <img class="photo-preview" style="display:none;" />
            <div class="photo-placeholder">
              <i data-lucide="camera"></i>
              <span>⇊ Escolher arquivo ⇊</span>
            </div>
          </div>
          
          <input type="file" 
                 accept="image/*" 
                 class="photo-input" 
                 onchange="ChecklistManager.handlePhotoUpload(event, this)"
                 data-item="${itemId}"
                 data-type="${type}"
                 data-photo-index="${photoIndex}" />
                 
          <div class="camera-options">
            <button type="button" class="btn-camera" onclick="ChecklistManager.takePhoto(this)">
              <i data-lucide="camera"></i>
              Tirar Foto
            </button>
          </div>
        </div>
        
        <div class="photo-caption">
          <label>Legenda da Foto ${photoIndex}</label>
          <textarea placeholder="Digite a legenda para esta foto" 
                    class="photo-caption-input"
                    data-item="${itemId}"
                    data-type="${type}"
                    data-photo-index="${photoIndex}"></textarea>
        </div>
        
        <!-- NOVO: Campo Status para cada foto -->
        <div class="photo-status">
          <label class="required-label">Status do Item</label>
          <div class="custom-select-wrapper">
            <select class="required-input custom-select" data-field="status" data-item="${itemId}" data-type="${type}" data-photo-index="${photoIndex}">
              <option value="">Selecione o status</option>
              <option value="operacional">✅ Operacional</option>
              <option value="manutencao">🛠️ Em Manutenção</option>
              <option value="defeito">❌ Com Defeito</option>
              <option value="substituido">🔄 Substituído</option>
              <option value="instalado">📥 Instalado</option>
              <option value="configurado">⚙️ Configurado</option>
              <option value="testado">🧪 Testado</option>
            </select>
            <div class="custom-select-arrow">
              <i data-lucide="chevron-down"></i>
            </div>
          </div>
          <div class="error-message">Este campo é obrigatório</div>
        </div>
      </div>
    `;
    
    photosContainer.insertAdjacentHTML('beforeend', photoHTML);
    lucide.createIcons();
    
    // Inicializar o select customizado
    this.initializeCustomSelects();
  }

  // Remover foto
  static removePhoto(button) {
    const photoItem = button.closest('.photo-item');
    if (confirm('Tem certeza que deseja remover esta foto?')) {
      photoItem.remove();
      // Reorganizar os índices das fotos restantes
      this.renumberPhotos(photoItem.closest('.machine-block, .infra-block'));
    }
  }

  // Renumerar fotos após remoção
  static renumberPhotos(item) {
    const photosContainer = item.querySelector('.photos-container');
    if (!photosContainer) return;
    
    const photoItems = photosContainer.querySelectorAll('.photo-item');
    
    photoItems.forEach((item, index) => {
      const newIndex = index + 1;
      item.setAttribute('data-photo-index', newIndex);
      
      // Atualizar cabeçalho
      const header = item.querySelector('h4');
      header.textContent = `Foto ${newIndex}`;
      
      // Atualizar legenda
      const captionLabel = item.querySelector('.photo-caption label');
      captionLabel.textContent = `Legenda da Foto ${newIndex}`;
      
      // Atualizar data attributes
      const fileInput = item.querySelector('.photo-input');
      const captionInput = item.querySelector('.photo-caption-input');
      const statusSelect = item.querySelector('.custom-select[data-field="status"]');
      
      if (fileInput) {
        fileInput.setAttribute('data-photo-index', newIndex);
      }
      if (captionInput) {
        captionInput.setAttribute('data-photo-index', newIndex);
      }
      if (statusSelect) {
        statusSelect.setAttribute('data-photo-index', newIndex);
      }
    });
  }

  // Manipular upload de foto
  static handlePhotoUpload(event, input) {
    const file = event.target.files[0];
    if (!file) return;
    
    const photoItem = input.closest('.photo-item');
    const preview = photoItem.querySelector('.photo-preview');
    const placeholder = photoItem.querySelector('.photo-placeholder');
    
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
      placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  // Tirar foto com câmera (MELHORADO COM ALTA QUALIDADE)
  static async takePhoto(button) {
    console.log('📸 Tentando acessar a câmera com alta qualidade...');
    try {
      // Verificar se a API de câmera está disponível
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('A API de câmera não é suportada pelo seu navegador.');
      }
      
      // ✅ MELHORIA DE QUALIDADE: Definir constraints para solicitar uma resolução alta
      const constraints = {
        video: {
          width: { ideal: 1920 },  // Largura ideal (Full HD)
          height: { ideal: 1080 }, // Altura ideal (Full HD)
          facingMode: 'environment' // Prioriza a câmera traseira em dispositivos móveis
        }
      };
      
      console.log('🔧 Solicitando câmera com as seguintes restrições:', constraints);
      
      // Acessar a câmera com as novas restrições
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('✅ Câmera acessada com sucesso. Resolução do stream:', 
                  `${stream.getVideoTracks()[0].getSettings().width}x${stream.getVideoTracks()[0].getSettings().height}`);
                  
      const photoItem = button.closest('.photo-item');
      const preview = photoItem.querySelector('.photo-preview');
      const placeholder = photoItem.querySelector('.photo-placeholder');
      const fileInput = photoItem.querySelector('.photo-input');
      
      // Criar elemento de vídeo temporário
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Criar overlay para captura
      const cameraOverlay = this.createCameraOverlay(video, stream, preview, placeholder, fileInput);
      document.body.appendChild(cameraOverlay);
      
    } catch (error) {
      console.error('❌ Erro ao acessar a câmera:', error);
      let errorMessage = 'Não foi possível acessar a câmera.';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Permissão para acessar a câmera foi negada. Por favor, permita o acesso nas configurações do seu navegador.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'Nenhuma câmera foi encontrada no dispositivo.';
      } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
        errorMessage = 'A câmera do seu dispositivo não suporta a resolução solicitada. Tentando com qualidade padrão...';
        // Opcional: aqui você poderia tentar novamente com constraints menores como fallback
        alert(errorMessage);
        return; // Interrompe a execução por enquanto
      } else if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        errorMessage = 'Acesso à câmera requer uma conexão segura (HTTPS) ou execução em localhost (servidor local).';
      }
      alert(errorMessage);
    }
  }

  // Criar overlay da câmera (MELHORADO)
  static createCameraOverlay(video, stream, preview, placeholder, fileInput) {
    const overlay = document.createElement('div');
    overlay.className = 'camera-overlay';
    overlay.style.zIndex = '4000'; // Garante que fique acima de tudo
    
    overlay.innerHTML = `
      <div class="camera-modal">
        <div class="camera-header">
          <h3>Tirar Foto</h3>
          <button type="button" class="btn-close-camera">
            <i data-lucide="x"></i>
          </button>
        </div>
        <div class="camera-preview">
          <div class="video-container"></div>
        </div>
        <div class="camera-controls">
          <button type="button" class="btn-capture">
            <i data-lucide="camera"></i>
            Capturar
          </button>
        </div>
      </div>
    `;
    
    // Adicionar vídeo ao container
    const videoContainer = overlay.querySelector('.video-container');
    videoContainer.appendChild(video);
    
    // Configurar eventos
    const closeBtn = overlay.querySelector('.btn-close-camera');
    const captureBtn = overlay.querySelector('.btn-capture');
    
    const cleanup = () => {
      stream.getTracks().forEach(track => track.stop());
      document.body.removeChild(overlay);
    };

    closeBtn.onclick = cleanup;
    
    captureBtn.onclick = () => {
      this.capturePhoto(video, preview, placeholder, fileInput, stream, overlay);
    };
    
    // Fechar ao clicar fora do modal
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            cleanup();
        }
    });

    return overlay;
  }

  // Capturar foto da câmera (MELHORADO)
  static capturePhoto(video, preview, placeholder, fileInput, stream, overlay) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Converter para blob e criar arquivo
    canvas.toBlob((blob) => {
      const fileName = `camera-photo-${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      
      // Atualizar preview
      preview.src = URL.createObjectURL(blob);
      preview.style.display = 'block';
      placeholder.style.display = 'none';
      
      // Atualizar file input (criar DataTransfer)
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
      
      // ✅ MELHORIA: Disparar evento 'change' para ativar validação em tempo real
      fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      console.log('📸 Foto capturada e salva com sucesso.');
      
      // Fechar câmera e remover overlay
      stream.getTracks().forEach(track => track.stop());
      document.body.removeChild(overlay);
      
    }, 'image/jpeg', 0.8);
  }

  // Remover máquina
  static removeMachine(machineId) {
    const machine = document.getElementById(machineId);
    if (machine && confirm('Tem certeza que deseja remover esta máquina?')) {
      machine.remove();
      this.updateProgressBar();
      this.updateGenerateButton();
    }
  }

  // Remover infraestrutura
  static removeInfra(infraId) {
    const infra = document.getElementById(infraId);
    if (infra && confirm('Tem certeza que deseja remover este item de infraestrutura?')) {
      infra.remove();
      this.updateProgressBar();
      this.updateGenerateButton();
    }
  }

  // Alternar seção do Windows
  static toggleWindowsSection(radio, machineNumber) {
    const machineBlock = radio.closest('.machine-block');
    const windowsSection = machineBlock.querySelector('.windows-not-activated');
    
    if (radio.value === 'nao' && radio.checked) {
      windowsSection.style.display = 'block';
    } else {
      windowsSection.style.display = 'none';
    }
  }

  // Prévia de imagem (método antigo mantido para compatibilidade)
  static previewImage(event, input) {
    const img = input.parentElement.querySelector("img");
    if (event.target.files && event.target.files[0]) {
      img.src = URL.createObjectURL(event.target.files[0]);
      img.style.display = "block";
    }
  }

  // Atualizar barra de progresso
  static updateProgressBar() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const checked = [...checkboxes].filter(i => i.checked).length;
    const total = checkboxes.length;
    const percent = total ? (checked / total) * 100 : 0;
    
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
      progressBar.style.width = percent + "%";
    }
  }

  // ✅ MELHORIA: Atualizar botão de gerar relatório (CORRIGIDO)
  static updateGenerateButton() {
    const generateButton = document.getElementById('generateReportBtn');
    if (!generateButton) {
      console.error('❌ Botão generateReportBtn não encontrado!');
      return;
    }
    
    // ✅ MELHORIA: Forçar validação completa do formulário
    const formValidation = FormValidator.validateForm();
    const signatureValidation = FormValidator.validateSignatures();
    
    const isValid = formValidation.isValid && signatureValidation.isValid;
    
    console.log('🔄 Atualizando botão gerar relatório:', { 
      formValid: formValidation.isValid, 
      signaturesValid: signatureValidation.isValid,
      totalValid: isValid,
      missingFields: formValidation.missingFields
    });
    
    if (isValid) {
      generateButton.classList.remove('btn-disabled');
      generateButton.disabled = false;
      generateButton.style.opacity = '1';
      generateButton.style.cursor = 'pointer';
    } else {
      generateButton.classList.add('btn-disabled');
      generateButton.disabled = true;
      generateButton.style.opacity = '0.6';
      generateButton.style.cursor = 'not-allowed';
    }
  }

  // Coletar dados das fotos de uma máquina ou infraestrutura (ATUALIZADO COM STATUS)
  static collectItemPhotos(itemElement, type = 'machine') {
    const photos = [];
    const photoItems = itemElement.querySelectorAll('.photo-item');
    
    photoItems.forEach((item, index) => {
      const fileInput = item.querySelector('.photo-input');
      const captionInput = item.querySelector('.photo-caption-input');
      const statusSelect = item.querySelector('.custom-select[data-field="status"]');
      const preview = item.querySelector('.photo-preview');
      
      if (fileInput.files.length > 0 || preview.src) {
        photos.push({
          index: index + 1,
          file: fileInput.files[0],
          dataUrl: preview.src || '',
          caption: captionInput ? captionInput.value : '',
          status: statusSelect ? statusSelect.value : '',
          type: type
        });
      }
    });
    
    return photos;
  }

  // Coletar dados de uma máquina
  static collectMachineData(machineElement) {
    const data = {};
    
    // Campos de texto
    machineElement.querySelectorAll('input[type="text"], textarea').forEach(input => {
      const field = input.getAttribute('data-field');
      if (field) {
        data[field] = input.value;
      }
    });

    // Checkboxes
    machineElement.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      const field = checkbox.getAttribute('data-field');
      if (field) {
        data[field] = checkbox.checked;
      }
    });

    // Radio buttons
    const windowsRadio = machineElement.querySelector('input[type="radio"]:checked');
    if (windowsRadio) {
      data.windowsActivated = windowsRadio.value === 'sim';
    }

    // Fotos
    data.photos = this.collectItemPhotos(machineElement, 'machine');
    
    return data;
  }

  // Coletar dados de infraestrutura (ATUALIZADO)
  static collectInfraData(infraElement) {
    const data = {};
    
    // Campos de texto
    infraElement.querySelectorAll('input[type="text"], textarea, select').forEach(input => {
      const field = input.getAttribute('data-field');
      if (field) {
        data[field] = input.value;
      }
    });

    // Fotos
    data.photos = this.collectItemPhotos(infraElement, 'infra');
    
    return data;
  }

  // Obter dados do checklist
  static getData() {
    const data = {
      machines: [],
      infrastructures: [],
      observations: document.getElementById('observacoes')?.value || '',
      timestamp: new Date().toISOString()
    };

    // Coletar dados das máquinas
    document.querySelectorAll('.machine-block').forEach(machine => {
      const machineData = this.collectMachineData(machine);
      data.machines.push(machineData);
    });

    // Coletar dados da infraestrutura
    document.querySelectorAll('.infra-block').forEach(infra => {
      const infraData = this.collectInfraData(infra);
      data.infrastructures.push(infraData);
    });

    return data;
  }

  // Carregar dados salvos
  static loadData(data) {
    if (!data) return;

    // Carregar observações
    if (data.observations) {
      const observationsField = document.getElementById('observacoes');
      if (observationsField) {
        observationsField.value = data.observations;
      }
    }

    // TODO: Implementar carregamento de máquinas e infraestruturas
    console.log('Dados carregados:', data);
  }

  // ✅ MELHORIA: Configurar event listeners (ATUALIZADO)
  static setupEventListeners() {
    console.log('🔧 Configurando event listeners...');
    
    // Atualizar progresso quando checkboxes mudarem
    document.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox' || 
          e.target.type === 'text' || 
          e.target.type === 'textarea' ||
          e.target.tagName === 'SELECT') {
        this.updateProgressBar();
        
        // ✅ MELHORIA: Atualizar botão imediatamente após mudanças
        Helpers.debounce(() => {
          this.updateGenerateButton();
        }, 300)();
      }
    });

    // Atualizar botão gerar quando campos de texto mudarem
    document.addEventListener('input', (e) => {
      if (e.target.type === 'text' || 
          e.target.type === 'textarea' ||
          e.target.tagName === 'SELECT') {
        
        // ✅ MELHORIA: Validar campo individual em tempo real
        if (e.target.classList.contains('required-input')) {
          FormValidator.validateField(e.target);
        }
        
        Helpers.debounce(() => {
          this.updateGenerateButton();
        }, 300)();
      }
    });
    
    // ✅ MELHORIA: Atualizar também quando fotos são adicionadas/removidas
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-add-photo') || 
          e.target.closest('.btn-add-photo') ||
          e.target.classList.contains('btn-remove-photo') ||
          e.target.closest('.btn-remove-photo')) {
        setTimeout(() => {
          this.updateGenerateButton();
        }, 200);
      }
    });
    
    // Atualizar também no carregamento da página
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        this.updateGenerateButton();
        this.initializeCustomSelects();
      }, 1000);
    });
  }

  // Validar campos obrigatórios (ATUALIZADO - Organizado por seção)
  static validateRequiredFields() {
    const missingFieldsBySection = {};
    let isValid = true;
    
    // Limpar classes de erro anteriores
    document.querySelectorAll('.invalid').forEach(el => {
      el.classList.remove('invalid');
    });
    
    // Seção: Ao Chegar no Cliente
    const arrivalSection = document.getElementById('arrival-section');
    if (arrivalSection) {
      const sectionTitle = 'Ao Chegar no Cliente';
      const sectionFields = [];
      
      // Verificar nome da empresa
      const companyNameInput = arrivalSection.querySelector('#company-name');
      if (companyNameInput && (!companyNameInput.value || !companyNameInput.value.trim())) {
        companyNameInput.classList.add('invalid');
        sectionFields.push('Nome da empresa');
        isValid = false;
      }
      
      // Verificar checkboxes obrigatórios
      arrivalSection.querySelectorAll('.required-checkbox').forEach(label => {
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (checkbox && !checkbox.checked) {
          label.classList.add('invalid');
          const text = label.textContent.replace('*', '').trim();
          sectionFields.push(text);
          isValid = false;
        }
      });
      
      if (sectionFields.length > 0) {
        missingFieldsBySection[sectionTitle] = sectionFields;
      }
    }
    
    // Seção: Treinamento
    const trainingSection = document.getElementById('training-section');
    if (trainingSection) {
      const sectionTitle = 'Treinamento';
      const sectionFields = [];
      
      trainingSection.querySelectorAll('.required-checkbox').forEach(label => {
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (checkbox && !checkbox.checked) {
          label.classList.add('invalid');
          const text = label.textContent.replace('*', '').trim();
          sectionFields.push(text);
          isValid = false;
        }
      });
      
      if (sectionFields.length > 0) {
        missingFieldsBySection[sectionTitle] = sectionFields;
      }
    }
    
    // Seção: Máquinas
    const machinesSection = document.getElementById('machines-container');
    if (machinesSection) {
      const machines = machinesSection.querySelectorAll('.machine-block');
      
      machines.forEach((machine, index) => {
        const machineTitle = `Máquina ${index + 1}`;
        const sectionFields = [];
        
        // Verificar campos obrigatórios
        machine.querySelectorAll('.required-input').forEach(input => {
          if (!input.value || !input.value.trim()) {
            input.classList.add('invalid');
            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
              const labelText = label.textContent.replace('*', '').trim();
              sectionFields.push(labelText);
              isValid = false;
            }
          }
        });
        
        if (sectionFields.length > 0) {
          missingFieldsBySection[machineTitle] = sectionFields;
        }
      });
    }
    
    // Seção: Infraestrutura
    const infraSection = document.getElementById('infraestruturas-container');
    if (infraSection) {
      const infras = infraSection.querySelectorAll('.infra-block');
      
      infras.forEach((infra, index) => {
        const infraTitle = `Infraestrutura ${index + 1}`;
        const sectionFields = [];
        
        // Verificar campos obrigatórios
        infra.querySelectorAll('.required-input').forEach(input => {
          if (!input.value || !input.value.trim()) {
            input.classList.add('invalid');
            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
              const labelText = label.textContent.replace('*', '').trim();
              sectionFields.push(labelText);
              isValid = false;
            }
          }
        });
        
        if (sectionFields.length > 0) {
          missingFieldsBySection[infraTitle] = sectionFields;
        }
      });
    }
    
    // Seção: Observações Técnicas
    const observationsSection = document.getElementById('observacoes-section');
    if (observationsSection) {
      const sectionTitle = 'Observações Técnicas';
      const sectionFields = [];
      
      const observationsInput = observationsSection.querySelector('#observacoes');
      if (observationsInput && (!observationsInput.value || !observationsInput.value.trim())) {
        observationsInput.classList.add('invalid');
        sectionFields.push('Observações técnicas');
        isValid = false;
      }
      
      if (sectionFields.length > 0) {
        missingFieldsBySection[sectionTitle] = sectionFields;
      }
    }
    
    return {
      isValid,
      missingFieldsBySection,
      hasMissingFields: Object.keys(missingFieldsBySection).length > 0
    };
  }

  // Gerar HTML do relatório
  static generateReportHtml() {
    const companyName = document.getElementById('company-name')?.value.trim() || '';

    let reportHtml = `
      <h2>Relatório</h2>
      <p><strong>Nome da empresa:</strong> ${companyName}</p>
    `;

    // anexar resto do relatório conforme já existente (itens, checkboxes, etc.)
    // ...existing code to append checks e outros campos...

    return reportHtml;
  }
}

// Exportar para uso global
window.ChecklistManager = ChecklistManager;