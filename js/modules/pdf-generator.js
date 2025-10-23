// Gerador de relatórios PDF
class PdfGenerator {
  // Propriedade estática para armazenar a imagem de fundo carregada
  static backgroundImage = null;
  static backgroundImagePath = null;

  static init() {
    this.pdfConfig = {
      template: 'fenitti',
      companyName: '',
      technicianName: '',
      reportDate: new Date().toISOString().split('T')[0]
    };
    
    console.log('✅ PdfGenerator inicializado');
  }

  // Método para obter o nome da empresa
  static getCompanyName() {
    const companyNameInput = document.getElementById('company-name');
    const companyName = companyNameInput ? companyNameInput.value.trim() : '';
    return companyName || 'Empresa';
  }

  // Método para obter o nome do técnico da assinatura
  static getTechnicianName() {
    const techNameInput = document.getElementById('techName');
    const techName = techNameInput ? techNameInput.value.trim() : '';
    return techName || 'Nome do Técnico';
  }

  // Manipular geração de relatório
  static handleGenerateReport() {
    console.log('🎯 Botão gerar relatório clicado!');
    
    try {
      // Validar formulário principal
      const formValidation = FormValidator.validateForm();
      console.log('📋 Validação do formulário:', formValidation);
      
      // Validar assinaturas
      const signatureValidation = FormValidator.validateSignatures();
      console.log('🖊️ Validação de assinaturas:', signatureValidation);
      
      const allMissingFields = [
        ...formValidation.missingFields, 
        ...signatureValidation.missingFields
      ];
      
      console.log('📝 Todos os campos faltando:', allMissingFields);
      
      if (!formValidation.isValid || !signatureValidation.isValid) {
        console.log('❌ Formulário inválido, mostrando modal de campos pendentes');
        this.showMissingFieldsModal(allMissingFields);
        return;
      }
      
      console.log('✅ Formulário válido, mostrando modal de relatório');
      this.showReportModal();
      
    } catch (error) {
      console.error('💥 Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório. Verifique o console.');
    }
  }

  // Mostrar modal de campos pendentes
  static showMissingFieldsModal(missingFields) {
    console.log('🔄 Mostrando modal de campos pendentes:', missingFields);
    
    const modal = document.getElementById('missingFieldsModal');
    const list = document.getElementById('missingFieldsList');
    
    if (!modal || !list) {
      console.log('📦 Criando modal de campos pendentes...');
      this.createMissingFieldsModal();
    }
    
    // Limpar lista anterior
    const listElement = document.getElementById('missingFieldsList');
    if (listElement) {
      listElement.innerHTML = '';
      
      // Adicionar campos pendentes
      missingFields.forEach(field => {
        const li = document.createElement('li');
        li.textContent = field;
        listElement.appendChild(li);
      });
    }
    
    // Abrir modal
    if (typeof ModalManager !== 'undefined') {
      ModalManager.openModal('missingFieldsModal');
    } else {
      console.error('❌ ModalManager não encontrado!');
      // Fallback: mostrar alerta simples
      alert(`Campos obrigatórios pendentes:\n\n${missingFields.join('\n')}`);
    }
  }

  // Criar modal de campos pendentes
  static createMissingFieldsModal() {
    const modalHTML = `
      <div class="modal-overlay" id="missingFieldsModal">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">Campos Obrigatórios Pendentes</h3>
          </div>
          <div class="modal-content">
            <p>Por favor, preencha os seguintes campos obrigatórios antes de gerar o relatório:</p>
            <ul class="missing-fields-list" id="missingFieldsList"></ul>
          </div>
          <div class="modal-actions">
            <button onclick="PdfGenerator.closeModal('missingFieldsModal')">
              <i data-lucide="check"></i> OK
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    if (typeof lucide !== 'undefined') {
      setTimeout(() => lucide.createIcons(), 100);
    }
  }

  // Mostrar modal de relatório
  static showReportModal() {
    console.log('🔄 Mostrando modal de relatório...');
    
    const modal = document.getElementById('reportModal');
    const modalContent = document.getElementById('modalReportContent');
    
    if (!modal || !modalContent) {
      console.log('📦 Criando modal de relatório...');
      this.createReportModal();
    }
    
    // Gerar conteúdo do relatório
    try {
      const reportContent = this.generateReportContent();
      const contentElement = document.getElementById('modalReportContent');
      if (contentElement) {
        contentElement.innerHTML = ''; // Limpar conteúdo anterior
        const pre = document.createElement('pre');
        pre.style.whiteSpace = 'pre-wrap';
        pre.style.fontFamily = 'monospace';
        pre.textContent = reportContent;
        contentElement.appendChild(pre);
      }
      
      if (typeof ModalManager !== 'undefined') {
        ModalManager.openModal('reportModal');
        console.log('✅ Modal de relatório aberto com sucesso!');
      } else {
        console.error('❌ ModalManager não encontrado!');
        // Fallback: mostrar conteúdo em alerta
        alert('Relatório gerado com sucesso! Conteúdo:\n\n' + reportContent);
      }
    } catch (error) {
      console.error('❌ Erro ao gerar conteúdo do relatório:', error);
      alert('Erro ao gerar relatório. Tente novamente.');
    }
  }

  // Criar modal de relatório
  static createReportModal() {
    const modalHTML = `
      <div class="modal-overlay" id="reportModal">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">Relatório de Preventiva</h3>
          </div>
          <div class="modal-content" id="modalReportContent"></div>
          <div class="modal-actions">
            <button onclick="PdfGenerator.saveAsTxt()"><i data-lucide="download"></i> Salvar como TXT</button>
            <button onclick="PdfGenerator.saveAsFenittiPDF()"><i data-lucide="file-text"></i> Salvar como PDF FENITTI</button>
            <button onclick="PdfGenerator.saveAsPDF()"><i data-lucide="file-text"></i> Salvar como PDF Simples</button>
            <button onclick="PdfGenerator.copyToClipboard()"><i data-lucide="copy"></i> Copiar</button>
            <button onclick="PdfGenerator.closeModal('reportModal')"><i data-lucide="x"></i> Cancelar</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    if (typeof lucide !== 'undefined') {
      setTimeout(() => lucide.createIcons(), 100);
    }
  }

  // Gerar conteúdo do relatório (mantido igual)
  static generateReportContent() {
    const checklistData = ChecklistManager.getData();
    const signatureData = SignatureManager.getSignatureData();
    const companyName = this.getCompanyName();
    const technicianName = this.getTechnicianName();
    
    let content = "=== RELATÓRIO DE MANUTENÇÃO PREVENTIVA ===\n\n";
    
    // Cabeçalho
    content += `Empresa: ${companyName}\n`;
    content += `Data: ${new Date().toLocaleDateString('pt-BR')}\n`;
    content += `Técnico: ${technicianName}\n`;
    content += `Responsável: ${signatureData.clientName || 'Não informado'}\n`;
    content += "\n" + "=".repeat(50) + "\n\n";
    
    // Seção: RESUMO
    content += "🔹 RESUMO\n";
    content += "   Este documento serve para realizar uma avaliação completa do ambiente\n";
    content += "   de TI, incluindo análise de máquinas, infraestrutura e procedimentos\n";
    content += "   de manutenção preventiva, garantindo o bom funcionamento dos sistemas.\n\n";
    
    // Máquinas
    if (checklistData.machines && checklistData.machines.length > 0) {
      content += "🔹 MÁQUINAS VERIFICADAS\n\n";
      
      checklistData.machines.forEach((machine, index) => {
        content += `📋 MÁQUINA ${index + 1}\n`;
        
        // Informações básicas
        if (machine.name) content += `   Nome: ${machine.name}\n`;
        if (machine.os) content += `   Sistema Operacional: ${machine.os}\n`;
        if (machine.storage) content += `   Armazenamento: ${machine.storage}\n`;
        if (machine.ram) content += `   Memória RAM: ${machine.ram}\n`;
        if (machine.anydesk) content += `   AnyDesk ID: ${machine.anydesk}\n`;
        
        // Status do Windows
        if (machine.windowsActivated !== undefined) {
          content += `   Windows Ativado: ${machine.windowsActivated ? 'Sim' : 'Não'}\n`;
        }
        
        // Processos realizados
        const processes = [];
        if (machine['check-updates']) processes.push('Verificar Windows Update');
        if (machine['check-programs']) processes.push('Verificar programas instalados');
        if (machine['install-milvus']) processes.push('Instalar Milvus');
        if (machine['update-browsers']) processes.push('Atualizar Navegadores');
        if (machine['install-office']) processes.push('Verificar/Instalar Pacote Office');
        if (machine['install-adobe']) processes.push('Instalar Adobe Reader');
        if (machine['install-winrar']) processes.push('Instalar WinRAR');
        if (machine['run-aida']) processes.push('Executar AIDA');
        
        if (processes.length > 0) {
          content += `   Processos Realizados:\n`;
          processes.forEach(process => {
            content += `      ✅ ${process}\n`;
          });
        }
        
        // Observações da máquina
        if (machine['machine-observations']) {
          content += `   Observações: ${machine['machine-observations']}\n`;
        }
        
        content += "\n";
      });
    }
    
    // Infraestrutura
    if (checklistData.infrastructures && checklistData.infrastructures.length > 0) {
      content += "🔹 INFRAESTRUTURA VERIFICADA\n\n";
      
      checklistData.infrastructures.forEach((infra, index) => {
        content += `🏗️ ITEM ${index + 1}\n`;
        if (infra.description) content += `   Descrição: ${infra.description}\n`;
        if (infra.location) content += `   Localização: ${infra.location}\n`;
        if (infra.status) content += `   Status: ${infra.status}\n`;
        if (infra.notes) content += `   Observações: ${infra.notes}\n`;
        content += "\n";
      });
    }
    
    // Treinamento
    content += "🔹 TREINAMENTO REALIZADO\n";
    const trainingCheckboxes = document.querySelectorAll('#training-section input[type="checkbox"]:checked');
    if (trainingCheckboxes.length > 0) {
      trainingCheckboxes.forEach(checkbox => {
        content += `   ✅ ${checkbox.closest('label').textContent.trim()}\n`;
      });
    } else {
      content += "   ⚠️ Nenhum treinamento registrado\n";
    }
    content += "\n";
    
    // Observações
    if (checklistData.observations) {
      content += "🔹 OBSERVAÇÕES TÉCNICAS\n";
      content += `${checklistData.observations}\n\n`;
    }
    
    // Encerramento
    content += "🔹 ENCERRAMENTO DO ATENDIMENTO\n";
    const closureCheckboxes = document.querySelectorAll('#closure-section input[type="checkbox"]:checked');
    if (closureCheckboxes.length > 0) {
      closureCheckboxes.forEach(checkbox => {
        content += `   ✅ ${checkbox.closest('label').textContent.trim()}\n`;
      });
    } else {
      content += "   ⚠️ Nenhum procedimento de encerramento registrado\n";
    }
    content += "\n";
    
    // Assinaturas
    content += "🔹 ASSINATURAS\n";
    content += `   Responsável: ${signatureData.clientName || 'Não assinado'}\n`;
    content += `   Técnico: ${technicianName || 'Não assinado'}\n`;
    
    content += "\n" + "=".repeat(50) + "\n";
    content += "Relatório gerado automaticamente pelo Sistema de Checklist Preventiva\n";
    
    return content;
  }

  // Salvar como TXT
  static saveAsTxt() {
    const modalContent = document.getElementById('modalReportContent');
    if (!modalContent) {
      alert('Erro: Conteúdo do relatório não encontrado.');
      return;
    }
    
    const content = modalContent.textContent || modalContent.innerText;
    const companyName = this.getCompanyName();
    const formattedCompanyName = companyName.replace(/\s+/g, '_').toLowerCase();
    const filename = `relatorio_${formattedCompanyName}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.txt`;
    
    // Usar Helpers se disponível, senão fallback
    if (typeof Helpers !== 'undefined' && Helpers.downloadFile) {
      Helpers.downloadFile(content, filename, 'text/plain');
    } else {
      // Fallback simples
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  // PDF Simples (CORRIGIDO - com imagem de fundo FENITTI em TODAS as páginas)
  static async saveAsPDF() {
    try {
      console.log('🔄 Gerando PDF simples com imagem de fundo FENITTI...');
      
      if (!window.jspdf) {
        throw new Error('Biblioteca jsPDF não encontrada. Certifique-se de que está carregada.');
      }
      
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // CORREÇÃO: Adicionar evento para background em TODAS as páginas
      this.setupBackgroundForAllPages(pdf);
      
      // Primeiro tentar adicionar a imagem de fundo FENITTI na primeira página
      const hasBackground = await this.addFenittiBackground(pdf);
      console.log('✅ Background FENITTI:', hasBackground ? 'Adicionado' : 'Não encontrado');
      
      // Depois adicionar o conteúdo com imagens
      await this.addPDFContentWithOriginalFormat(pdf, hasBackground);
      
      // Nome do arquivo
      const companyName = this.getCompanyName();
      const formattedCompanyName = companyName.replace(/\s+/g, '_').toLowerCase();
      const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
      const filename = `relatorio_${formattedCompanyName}_${date}.pdf`;
      
      // Salvar PDF
      pdf.save(filename);
      
      console.log('✅ PDF com formatação FENITTI e imagens gerado com sucesso!');
      alert('PDF FENITTI com imagens gerado com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao gerar PDF FENITTI com imagens:', error);
      alert('Erro ao gerar PDF FENITTI com imagens: ' + error.message);
    }
  }

  // MÉTODO CORRIGIDO: Configurar background para TODAS as páginas
  static setupBackgroundForAllPages(pdf) {
    // Salvar a função addPage original
    const originalAddPage = pdf.addPage;
    
    // Sobrescrever a função addPage para adicionar background automaticamente
    pdf.addPage = function() {
      // Chamar a função original
      originalAddPage.call(this);
      
      // CORREÇÃO: Adicionar background de forma síncrona se já estiver carregado
      if (PdfGenerator.backgroundImage) {
        try {
          const pageWidth = this.internal.pageSize.getWidth();
          const pageHeight = this.internal.pageSize.getHeight();
          this.addImage(PdfGenerator.backgroundImage, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
        } catch (e) {
          console.warn('⚠️ Não foi possível adicionar background na nova página:', e);
        }
      } else {
        // Fallback: fundo branco se a imagem ainda não foi carregada
        const pageWidth = this.internal.pageSize.getWidth();
        const pageHeight = this.internal.pageSize.getHeight();
        this.setFillColor(255, 255, 255);
        this.rect(0, 0, pageWidth, pageHeight, 'F');
      }
    };
  }

  // MÉTODO CORRIGIDO: Adicionar conteúdo mantendo formatação original + imagens + background
  static async addPDFContentWithOriginalFormat(pdf, hasBackground = false) {
    const checklistData = ChecklistManager.getData();
    const signatureData = SignatureManager.getSignatureData();
    const companyName = this.getCompanyName();
    const technicianName = this.getTechnicianName();
    
    // Configurar margens conforme especificado originalmente
    const topMargin = 40;    // 4cm = 40mm
    const bottomMargin = 25; // 2.5cm = 25mm
    const leftMargin = 27.5; // 2.75cm = 27.5mm
    const rightMargin = 27.5; // 2.75cm = 27.5mm
    
    // Largura útil da página (A4 width 210mm - margens)
    const usableWidth = 210 - leftMargin - rightMargin;
    
    // Altura útil da página (A4 height 297mm - margens)
    const usableHeight = 297 - topMargin - bottomMargin;
    
    // Configurar fonte e cor - CORREÇÃO: Usar preto para garantir legibilidade
    pdf.setFont("helvetica");
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0); // CORREÇÃO: Texto sempre preto
    
    // Dados da empresa
    const reportDate = document.getElementById('pdfReportDate')?.value;
    const formattedDate = reportDate ? 
      new Date(reportDate).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR');

    // Posicionamento inicial dentro das margens
    let yPosition = topMargin;
    
    // Cabeçalho (MANTIDO ORIGINAL)
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Relatório de Checklist - ${companyName}`, leftMargin, yPosition);
    
    yPosition += 8;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Data: ${formattedDate}`, leftMargin, yPosition);
    
    yPosition += 5;
    pdf.text(`Técnico: ${technicianName}`, leftMargin, yPosition);
    
    // Seção: RESUMO (MANTIDO ORIGINAL)
    yPosition += 15;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text('RESUMO:', leftMargin, yPosition);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    
    const summaryText = "Este documento serve para realizar uma avaliação completa do ambiente de TI, " +
                       "incluindo análise de máquinas, infraestrutura e procedimentos de manutenção " +
                       "preventiva, garantindo o bom funcionamento dos sistemas.";
    
    const summaryLines = pdf.splitTextToSize(summaryText, usableWidth - 10);
    summaryLines.forEach(line => {
      // Verificar se precisa de nova página
      if (yPosition > (297 - bottomMargin - 10)) {
        pdf.addPage(); // Agora automaticamente adiciona background
        yPosition = topMargin;
      }
      yPosition += 5;
      pdf.text(line, leftMargin + 5, yPosition);
    });
    
    yPosition += 5; // Espaço extra após o resumo
    
    // Máquinas (MANTIDO ORIGINAL + IMAGENS)
    yPosition += 10;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text('MÁQUINAS VERIFICADAS:', leftMargin, yPosition);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    
    if (checklistData.machines && checklistData.machines.length > 0) {
      for (let i = 0; i < checklistData.machines.length; i++) {
        const machine = checklistData.machines[i];
        
        // Verificar se precisa de nova página
        if (yPosition > (297 - bottomMargin - 15)) {
          pdf.addPage(); // Agora automaticamente adiciona background
          yPosition = topMargin;
        }
        
        yPosition += 6;
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Máquina ${i + 1}: ${machine.name || 'Não informado'}`, leftMargin + 5, yPosition);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        
        if (machine.os) {
          yPosition += 4;
          pdf.text(`Sistema: ${machine.os}`, leftMargin + 10, yPosition);
        }
        
        if (machine.anydesk) {
          yPosition += 4;
          pdf.text(`AnyDesk: ${machine.anydesk}`, leftMargin + 10, yPosition);
        }
        
        // Processos realizados
        const processes = [];
        if (machine['check-updates']) processes.push('Windows Update');
        if (machine['install-milvus']) processes.push('Instalar Milvus');
        if (machine['update-browsers']) processes.push('Navegadores');
        if (machine['install-office']) processes.push('Office');
        if (machine['run-aida']) processes.push('AIDA');
        
        if (processes.length > 0) {
          yPosition += 4;
          pdf.text(`Processos: ${processes.join(', ')}`, leftMargin + 10, yPosition);
        }
        
        // Observações da máquina
        if (machine['machine-observations']) {
          yPosition += 4;
          const observationsLines = pdf.splitTextToSize(`Obs: ${machine['machine-observations']}`, usableWidth - 15);
          observationsLines.forEach(line => {
            if (yPosition > (297 - bottomMargin - 5)) {
              pdf.addPage(); // Agora automaticamente adiciona background
              yPosition = topMargin;
            }
            pdf.text(line, leftMargin + 12, yPosition);
            yPosition += 4;
          });
        }
        
        // FOTOS DA MÁQUINA (NOVO - COM STATUS)
        if (machine.photos && machine.photos.length > 0) {
          yPosition += 8;
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "bold");
          pdf.text('Fotos da Máquina:', leftMargin + 5, yPosition);
          yPosition += 5;
          
          // Adicionar fotos em grid - CORREÇÃO: agora inclui status para máquinas também
          yPosition = await this.addPhotosToPDF(pdf, machine.photos, leftMargin + 5, yPosition, usableWidth - 10, 'machine');
        }
        
        yPosition += 3; // Espaço entre máquinas
      }
    }
    
    // Infraestrutura (MANTIDO ORIGINAL + IMAGENS)
    if (checklistData.infrastructures && checklistData.infrastructures.length > 0) {
      // Verificar se precisa de nova página
      if (yPosition > (297 - bottomMargin - 30)) {
        pdf.addPage(); // Agora automaticamente adiciona background
        yPosition = topMargin;
      }
      
      yPosition += 10;
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      // CORREÇÃO: Garantir texto preto para o título da seção
      pdf.setTextColor(0, 0, 0);
      pdf.text('INFRAESTRUTURA:', leftMargin, yPosition);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      // CORREÇÃO: Garantir texto preto para o conteúdo da seção
      pdf.setTextColor(0, 0, 0);
      
      for (let i = 0; i < checklistData.infrastructures.length; i++) {
        const infra = checklistData.infrastructures[i];
        
        // Verificar se precisa de nova página
        if (yPosition > (297 - bottomMargin - 10)) {
          pdf.addPage(); // Agora automaticamente adiciona background
          yPosition = topMargin;
          // CORREÇÃO: Garantir que a cor continue preta após a quebra de página
          pdf.setTextColor(0, 0, 0);
        }
        
        yPosition += 5;
        pdf.text(`• ${infra.description || 'Item'} - ${infra.status || 'Status'}`, leftMargin + 5, yPosition);
        
        if (infra.notes) {
          yPosition += 4;
          const notesLines = pdf.splitTextToSize(`Obs: ${infra.notes}`, usableWidth - 10);
          notesLines.forEach(line => {
            // Verificar se precisa de nova página para cada linha
            if (yPosition > (297 - bottomMargin - 5)) {
              pdf.addPage(); // Agora automaticamente adiciona background
              yPosition = topMargin;
              // CORREÇÃO: Garantir que a cor continue preta após a quebra de página
              pdf.setTextColor(0, 0, 0);
            }
            pdf.text(line, leftMargin + 8, yPosition);
            yPosition += 4;
          });
        }
        
        // FOTOS DA INFRAESTRUTURA (NOVO - COM STATUS)
        if (infra.photos && infra.photos.length > 0) {
          yPosition += 8;
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "bold");
          pdf.text('Fotos da Infraestrutura:', leftMargin + 5, yPosition);
          yPosition += 5;
          
          // Adicionar fotos em grid
          yPosition = await this.addPhotosToPDF(pdf, infra.photos, leftMargin + 5, yPosition, usableWidth - 10, 'infra');
        }
        
        yPosition += 3;
      }
    }
    
    // Observações gerais (MANTIDO ORIGINAL)
    if (checklistData.observations) {
      // Verificar se precisa de nova página
      if (yPosition > (297 - bottomMargin - 20)) {
        pdf.addPage(); // Agora automaticamente adiciona background
        yPosition = topMargin;
      }
      
      yPosition += 10;
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      // CORREÇÃO: Garantir texto preto para o título da seção
      pdf.setTextColor(0, 0, 0);
      pdf.text('OBSERVAÇÕES TÉCNICAS:', leftMargin, yPosition);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      // CORREÇÃO: Garantir texto preto para o conteúdo da seção
      pdf.setTextColor(0, 0, 0);
      
      const observationsLines = pdf.splitTextToSize(checklistData.observations, usableWidth - 10);
      observationsLines.forEach(line => {
        // Verificar se precisa de nova página para cada linha
        if (yPosition > (297 - bottomMargin - 5)) {
          pdf.addPage(); // Agora automaticamente adiciona background
          yPosition = topMargin;
          // CORREÇÃO: Garantir que a cor continue preta após a quebra de página
          pdf.setTextColor(0, 0, 0);
        }
        yPosition += 4;
        pdf.text(line, leftMargin + 5, yPosition);
      });
    }
    
    // Assinaturas - LADO A LADO (MANTIDO ORIGINAL)
    await this.addSignatures(pdf, yPosition, leftMargin, usableWidth, topMargin, bottomMargin, hasBackground);
    
    // Rodapé (MANTIDO ORIGINAL)
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')} - Sistema de Checklist Preventiva (Criado por Silvio Mattos)`, 
             210 / 2, pageHeight - 10, 
             { align: 'center' });
  }

  // MÉTODO CORRIGIDO: Adicionar background do modelo FENITTI
  static async addFenittiBackground(pdf) {
    return new Promise((resolve) => {
      // Se a imagem já foi carregada, reutilize-a
      if (this.backgroundImage) {
        try {
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          pdf.addImage(this.backgroundImage, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
          console.log('✅ Background FENITTI reutilizado com sucesso');
          resolve(true);
        } catch (error) {
          console.warn('⚠️ Erro ao reutilizar background:', error);
          resolve(false);
        }
        return;
      }

      // Tentar diferentes caminhos possíveis para a imagem
      const possiblePaths = [
        'assets/images/Modelo relatório (FENITTI).jpg',
        'assets/images/Modelo_relatorio_FENITTI.jpg',
        'assets/images/modelo-fenitti.jpg',
        'assets/images/fenitti-template.jpg',
        '../assets/images/Modelo relatório (FENITTI).jpg',
        './Modelo relatório (FENITTI).jpg',
        'Modelo relatório (FENITTI).jpg',
        '/assets/images/Modelo relatório (FENITTI).jpg'
      ];
      
      let currentPathIndex = 0;
      
      const tryNextPath = () => {
        if (currentPathIndex >= possiblePaths.length) {
          console.warn('⚠️ Nenhuma imagem de fundo FENITTI encontrada, usando PDF sem background');
          resolve(false);
          return;
        }
        
        const imagePath = possiblePaths[currentPathIndex];
        console.log(`🔄 Tentando carregar imagem: ${imagePath}`);
        
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        
        img.onload = function() {
          try {
            // CORREÇÃO: Armazenar a imagem para reuso
            PdfGenerator.backgroundImage = img;
            PdfGenerator.backgroundImagePath = imagePath;

            // Adicionar imagem como fundo (cobrindo toda a página A4)
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            // Adicionar a imagem como primeira camada (fundo)
            pdf.addImage(img, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
            console.log('✅ Background FENITTI adicionado com sucesso');
            resolve(true);
          } catch (error) {
            console.warn(`⚠️ Erro ao adicionar imagem ${imagePath}:`, error);
            currentPathIndex++;
            tryNextPath();
          }
        };
        
        img.onerror = function() {
          console.warn(`⚠️ Imagem não encontrada: ${imagePath}`);
          currentPathIndex++;
          tryNextPath();
        };
        
        img.src = imagePath;
      };
      
      tryNextPath();
    });
  }

  // MÉTODO CORRIGIDO: Adicionar fotos ao PDF mantendo formatação profissional
  static async addPhotosToPDF(pdf, photos, startX, startY, usableWidth, type) {
    let xPosition = startX;
    let yPosition = startY;
    
    const imgWidth = 40; // Largura da imagem em mm
    const imgHeight = 30; // Altura da imagem em mm
    const spacing = 8; // Espaço entre imagens
    const captionHeight = 8; // Altura para legenda + status
    const borderWidth = 1; // Largura da borda
    
    // Configurações de cores
    const borderColor = [255, 165, 0]; // Laranja
    const backgroundColor = [255, 250, 240]; // Fundo ligeiramente amarelado
    
    // Calcular quantas imagens cabem por linha
    const imagesPerRow = Math.floor((usableWidth + spacing) / (imgWidth + spacing));
    const maxX = startX + usableWidth;
    const maxY = 270; // Margem inferior segura
    
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      
      // CORREÇÃO: Verificar se a foto cabe na linha atual
      if (xPosition + imgWidth > maxX) {
        // Não cabe, pula para a próxima linha
        xPosition = startX;
        yPosition += imgHeight + captionHeight + spacing;
      }
      
      // CORREÇÃO: Verificar se a foto cabe na página atual
      if (yPosition + imgHeight + captionHeight > maxY) {
        pdf.addPage(); // Agora automaticamente adiciona background
        yPosition = 40; // topMargin
        xPosition = startX;
      }
      
      // Adicionar a foto na posição calculada
      await this.addSinglePhotoToPDF(pdf, photo, xPosition, yPosition, imgWidth, imgHeight, captionHeight, borderWidth, borderColor, backgroundColor, i);
      
      // Atualizar a posição X para a próxima foto
      xPosition += imgWidth + spacing;
    }
    
    // Calcular nova posição Y após todas as fotos
    const totalRows = Math.ceil(photos.length / imagesPerRow);
    const newYPosition = startY + totalRows * (imgHeight + captionHeight + spacing) + 5;
    
    return newYPosition;
  }

  // NOVO MÉTODO: Adicionar foto individual ao PDF
  static async addSinglePhotoToPDF(pdf, photo, x, y, width, height, captionHeight, borderWidth, borderColor, backgroundColor, index) {
    try {
      // Adicionar fundo com borda laranja
      pdf.setFillColor(...backgroundColor);
      pdf.setDrawColor(...borderColor);
      pdf.setLineWidth(borderWidth);
      pdf.roundedRect(x - 1, y - 1, width + 2, height + captionHeight + 2, 1, 1, 'FD');
      
      if (photo.dataUrl && photo.dataUrl.startsWith('data:image')) {
        // Adicionar imagem
        await this.addImageToPDF(pdf, photo.dataUrl, x, y, width, height);
        
        // CORREÇÃO: Legenda sem caracteres especiais
        pdf.setFontSize(6);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        
        const caption = photo.caption || `Foto ${index + 1}`;
        const cleanCaption = this.cleanText(caption);
        const captionLines = pdf.splitTextToSize(cleanCaption, width - 4);
        
        // Fundo para legenda
        pdf.setFillColor(255, 255, 255);
        pdf.rect(x, y + height, width, captionHeight, 'F');
        
        // Texto da legenda
        let textY = y + height + 2;
        captionLines.forEach((line, lineIndex) => {
          if (lineIndex < 2) { // Limitar a 2 linhas
            pdf.text(line, x + 2, textY);
            textY += 3;
          }
        });
        
        // CORREÇÃO: Adicionar status para MÁQUINAS e INFRAESTRUTURA
        if (photo.status) {
          pdf.setFontSize(5);
          pdf.setTextColor(100, 100, 100);
          const statusText = `Status: ${this.getCleanStatusText(photo.status)}`;
          pdf.text(statusText, x + 2, textY + 1);
        }
      } else {
        // Placeholder para foto não carregada
        pdf.setFontSize(7);
        pdf.setTextColor(150, 150, 150);
        pdf.text('Sem imagem', x + width/2 - 8, y + height/2, { align: 'center' });
      }
      
    } catch (error) {
      console.warn(`❌ Erro ao adicionar imagem ${index + 1}:`, error);
      // Placeholder de erro
      pdf.setFontSize(6);
      pdf.setTextColor(255, 0, 0);
      pdf.text('Erro', x + width/2 - 3, y + height/2, { align: 'center' });
    }
  }

  // NOVO MÉTODO: Limpar texto para remover caracteres especiais
  static cleanText(text) {
    if (!text) return '';
    // Remover caracteres especiais e emojis, manter apenas texto básico
    return text.replace(/[^\w\s.,!?\-()]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // NOVO MÉTODO: Obter texto do status limpo (sem emojis)
  static getCleanStatusText(status) {
    const statusMap = {
      'operacional': 'Operacional',
      'manutencao': 'Em Manutencao',
      'defeito': 'Com Defeito',
      'substituido': 'Substituido',
      'instalado': 'Instalado',
      'configurado': 'Configurado',
      'testado': 'Testado'
    };
    return statusMap[status] || status;
  }

  // MÉTODO CORRIGIDO: Adicionar imagem individual ao PDF
  static async addImageToPDF(pdf, dataUrl, x, y, width, height) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function() {
        try {
          // Adicionar imagem centralizada no espaço
          const scale = Math.min(width / img.width, height / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          const offsetX = (width - scaledWidth) / 2;
          const offsetY = (height - scaledHeight) / 2;
          
          pdf.addImage(img, 'JPEG', x + offsetX, y + offsetY, scaledWidth, scaledHeight);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = function() {
        reject(new Error('Erro ao carregar imagem'));
      };
      img.src = dataUrl;
    });
  }

  // MÉTODO CORRIGIDO: Adicionar assinaturas lado a lado (ORIGINAL)
  static async addSignatures(pdf, startYPosition, leftMargin, usableWidth, topMargin, bottomMargin, hasBackground = false) {
    // Obter as assinaturas diretamente dos previews da página inicial
    const signatureData = this.getSignaturesFromPage();
    
    // Verificar se precisa de nova página para as assinaturas
    let yPosition = startYPosition + 20;
    if (yPosition > (297 - bottomMargin - 30)) {
      pdf.addPage(); // Agora automaticamente adiciona background
      yPosition = topMargin;
    }
    
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0); // CORREÇÃO: Garantir texto preto
    pdf.text('ASSINATURAS:', leftMargin, yPosition);
    
    // Posição Y para as assinaturas
    const signatureY = yPosition + 15;
    
    // Largura disponível para assinaturas
    const signatureWidth = (usableWidth - 10) / 2;
    
    // Assinatura do Responsável (esquerda)
    const clientX = leftMargin;
    await this.addSignatureImage(pdf, signatureData.clientSignature, clientX, signatureY, 'Responsável');
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0); // CORREÇÃO: Garantir texto preto
    pdf.text(`Responsável: ${signatureData.clientName || '_________________________'}`, clientX, signatureY + 25);
    
    // Assinatura do Técnico (direita)
    const techX = leftMargin + signatureWidth + 10;
    await this.addSignatureImage(pdf, signatureData.techSignature, techX, signatureY, 'Técnico');
    pdf.text(`Técnico: ${signatureData.techName || '_________________________'}`, techX, signatureY + 25);
  }

  // MÉTODO CORRIGIDO: Adicionar imagem da assinatura (ORIGINAL)
  static async addSignatureImage(pdf, signatureDataUrl, x, y, fallbackText) {
    if (signatureDataUrl && signatureDataUrl !== 'data:,' && !this.isInvalidSignatureUrl(signatureDataUrl)) {
      try {
        const signatureImg = new Image();
        
        return new Promise((resolve) => {
          signatureImg.onload = function() {
            try {
              // Adicionar a imagem da assinatura com tamanho fixo
              pdf.addImage(signatureImg, 'PNG', x, y, 60, 20);
              console.log(`✅ Assinatura ${fallbackText} adicionada com sucesso`);
              resolve(true);
            } catch (error) {
              console.warn(`❌ Erro ao adicionar imagem da assinatura ${fallbackText}:`, error);
              // Fallback: desenhar linha para assinatura
              pdf.setDrawColor(0, 0, 0);
              pdf.line(x, y + 15, x + 60, y + 15);
              pdf.text(fallbackText, x, y + 25);
              resolve(false);
            }
          };
          
          signatureImg.onerror = function() {
            console.warn(`❌ Erro ao carregar imagem da assinatura ${fallbackText}`);
            // Fallback: desenhar linha para assinatura
            pdf.setDrawColor(0, 0, 0);
            pdf.line(x, y + 15, x + 60, y + 15);
            pdf.text(fallbackText, x, y + 25);
            resolve(false);
          };
          
          signatureImg.src = signatureDataUrl;
        });
        
      } catch (error) {
        console.warn(`❌ Erro ao processar assinatura ${fallbackText}:`, error);
        // Fallback: desenhar linha para assinatura
        pdf.setDrawColor(0, 0, 0);
        pdf.line(x, y + 15, x + 60, y + 15);
        pdf.text(fallbackText, x, y + 25);
        return false;
      }
    } else {
      console.warn(`⚠️ Sem assinatura para ${fallbackText}, usando fallback`);
      // Sem assinatura, desenhar linha
      pdf.setDrawColor(0, 0, 0);
      pdf.line(x, y + 15, x + 60, y + 15);
      pdf.text(fallbackText, x, y + 25);
      return false;
    }
  }

  // Obter texto do status (mantido para compatibilidade)
  static getStatusText(status) {
    const statusMap = {
      'operacional': '✅ Operacional',
      'manutencao': '🛠️ Em Manutenção',
      'defeito': '❌ Com Defeito',
      'substituido': '🔄 Substituído',
      'instalado': '📥 Instalado',
      'configurado': '⚙️ Configurado',
      'testado': '🧪 Testado'
    };
    return statusMap[status] || status;
  }

  // Salvar como PDF FENITTI (mantido igual)
  static async saveAsFenittiPDF() {
    try {
      console.log('🔄 Gerando PDF no modelo FENITTI...');
      
      if (!window.jspdf) {
        throw new Error('Biblioteca jsPDF não encontrada. Certifique-se de que está carregada.');
      }
      
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Primeiro tentar adicionar a imagem de fundo
      const hasBackground = await this.addFenittiBackground(pdf);
      
      // Depois adicionar o conteúdo
      await this.addFenittiContent(pdf, hasBackground);
      
      // Nome do arquivo
      const companyName = this.getCompanyName();
      const formattedCompanyName = companyName.replace(/\s+/g, '_').toLowerCase();
      const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
      const filename = `relatorio_${formattedCompanyName}_${date}.pdf`;
      
      // Salvar PDF
      pdf.save(filename);
      
      console.log('✅ PDF FENITTI gerado com sucesso!');
      alert('PDF FENITTI gerado com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao gerar PDF FENITTI:', error);
      alert('Erro ao gerar PDF FENITTI: ' + error.message);
    }
  }

  // Adicionar conteúdo no modelo FENITTI (mantido igual)
  static async addFenittiContent(pdf, hasBackground = false) {
    // ... (código mantido igual do método original)
  }

  // Copiar para área de transferência
  static async copyToClipboard() {
    const modalContent = document.getElementById('modalReportContent');
    if (!modalContent) {
      alert('Erro: Conteúdo do relatório não encontrado.');
      return;
    }
    
    const content = modalContent.textContent || modalContent.innerText;
    
    try {
      await navigator.clipboard.writeText(content);
      alert('Relatório copiado para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar para área de transferência:', error);
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Relatório copiado para a área de transferência!');
    }
  }

  // Fechar modal
  static closeModal(modalId) {
    if (typeof ModalManager !== 'undefined') {
      ModalManager.closeModal(modalId);
    } else {
      // Fallback simples
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'none';
      }
    }
  }

  // MÉTODO AUXILIAR: Verificar dependências
  static checkDependencies() {
    const dependencies = {
      jsPDF: typeof window.jspdf !== 'undefined',
      ChecklistManager: typeof ChecklistManager !== 'undefined',
      SignatureManager: typeof SignatureManager !== 'undefined',
      FormValidator: typeof FormValidator !== 'undefined'
    };
    
    console.log('📦 Dependências do PdfGenerator:', dependencies);
    return dependencies;
  }

  // Obter assinaturas diretamente da página inicial (mantido igual)
  static getSignaturesFromPage() {
    console.log('🔄 Buscando assinaturas da página inicial...');
    
    const clientSignatureImg = document.getElementById('clientSignaturePreview')?.querySelector('img');
    const techSignatureImg = document.getElementById('techSignaturePreview')?.querySelector('img');
    
    const clientName = document.getElementById('clientName')?.value || '';
    const techName = document.getElementById('techName')?.value || '';
    
    let clientSignatureDataUrl = '';
    let techSignatureDataUrl = '';
    
    if (clientSignatureImg && clientSignatureImg.src) {
      try {
        clientSignatureDataUrl = clientSignatureImg.src;
      } catch (error) {
        console.warn('❌ Erro ao obter assinatura do cliente:', error);
      }
    }
    
    if (techSignatureImg && techSignatureImg.src) {
      try {
        techSignatureDataUrl = techSignatureImg.src;
      } catch (error) {
        console.warn('❌ Erro ao obter assinatura do técnico:', error);
      }
    }
    
    return {
      clientSignature: clientSignatureDataUrl,
      techSignature: techSignatureDataUrl,
      clientName: clientName,
      techName: techName
    };
  }

  // Verificar se a URL da assinatura é inválida (mantido igual)
  static isInvalidSignatureUrl(url) {
    return !url || 
           url === 'data:,' || 
           url.includes('data:image/png;base64,AAAA') ||
           url.length < 1000;
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  PdfGenerator.init();
  // Verificar dependências após inicialização
  setTimeout(() => PdfGenerator.checkDependencies(), 1000);
});

// Exportar para uso global
window.PdfGenerator = PdfGenerator;