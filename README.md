# Checklist — Relatório de Manutenção Preventiva/Levantamento

Resumo
-------
Aplicação web para preencher um checklist de manutenção preventiva, validar campos obrigatórios, coletar assinaturas e gerar relatório em TXT/PDF. Projetada para uso em campo por técnicos — inclui modais para campos pendentes, validação em tempo real e exportação de PDF com nome de arquivo baseado no nome da empresa e data.

Principais funcionalidades
-------------------------
- Formulário de checklist com seções (Ao Chegar no Cliente, Treinamento, Infraestrutura, Máquinas, Encerramento).
- Campo obrigatório "Nome da empresa" (aceita id `companyName` ou `company-name`) mostrado no relatório e usado no nome do arquivo PDF.
- Validação completa via `js/modules/form-validator.js`:
  - Destaca em vermelho (`.invalid`) todos os campos obrigatórios não preenchidos.
  - Gera lista de campos faltantes para exibir no modal.
- Modal de campos pendentes gerenciado por `js/modules/modal-manager.js`.
- Geração de relatório e exportação para PDF em `js/modules/pdf-generator.js`:
  - Inclui nome da empresa no corpo do relatório.
  - Nome do arquivo: `Relatorio (Nome da empresa) - YYYY-MM-DD.pdf`.
  - Suporte para html2pdf / jsPDF + html2canvas como fallback.
- Gerenciamento do checklist (criação de seções, preenchimento e coleta de dados) em `js/modules/checklist-manager.js` (ex.: preserva headers, adiciona campo "Nome da empresa").

Instalação e execução
---------------------
1. Abra a pasta do projeto no VS Code:
   - c:\Users\silvi\Downloads\Checklist
2. Servir os arquivos localmente (recomendado para evitar problemas CORS com imagens):
   - Com Python (no terminal do VS Code, dentro da pasta do projeto):
     - python -m http.server 5500
     - ou py -m http.server 5500
   - Ou use a extensão Live Server do VS Code.
3. Abrir no navegador:
   - http://localhost:5500

Dependências (opcionais)
------------------------
- html2pdf.js (recomendado para exportar PDF com facilidade)
- html2canvas e jsPDF (usados como fallback caso html2pdf não esteja presente)
- Nenhuma instalação obrigatória para a validação modal — código usa DOM APIs nativas.

Estrutura de arquivos (resumo)
------------------------------
- index.html / checklist_melhorado_1.html — páginas principais (markup).
- css/ — estilos globais (assegure que `.invalid` destaque em vermelho).
- js/modules/
  - checklist-manager.js — criação das seções, preserva headers, adiciona input "Nome da empresa".
  - form-validator.js — validação de formulário, real-time validation, destaque `.invalid`.
  - modal-manager.js — abertura/fechamento de modais (ESC, clique no overlay).
  - pdf-generator.js — monta conteúdo do relatório e exporta para PDF/TXT.
  - signature-manager.js — coleta e valida verificação de assinaturas (canvas).
- assets/ — imagens e recursos usados no PDF (ex.: background FENITTI).

Uso rápido
---------
1. Preencher o campo "Nome da empresa" na seção "Ao Chegar no Cliente" (obrigatório).
2. Preencher demais campos do checklist. Campos obrigatórios não preenchidos ficarão com a classe `.invalid` e exibirão mensagem de erro.
3. Ao submeter, se houver campos faltantes, o modal "Campos Obrigatórios Pendentes" será exibido permitindo correção rápida.
4. Gerar PDF via botão de exportação — o arquivo será salvo como:
   - `Relatorio (Nome da empresa) - YYYY-MM-DD.pdf`

Customizações comuns
--------------------
- Alterar formato de data no nome do arquivo: editar método que formata a data em `pdf-generator.js` (`_todayIsoDate()` ou equivalente).
- Mudar id do campo empresa: atualizar `form-validator.js`, `checklist-manager.js` e `pdf-generator.js` para usar o mesmo id.
- Estilizar erro: editar CSS global para `.invalid` (ex.: `border-color: #d00; color: #d00;`).

Notas para desenvolvedores
--------------------------
- Procure por `companyName` / `company-name` se houver problemas com o campo "Nome da empresa".
- Modais são controlados por `ModalManager.openModal(modalId)` / `closeModal`.
- Validação retorna um objeto `{ isValid, missingFields }` — use-o para decidir abertura do modal.
- PDF: se imagens estiverem ausentes ou ocorrerem erros CORS, servir via servidor local corrige a maioria dos problemas.

Contribuição
-----------
Pull requests são bem-vindos. Antes de enviar:
- Testar em servidor local.
- Manter consistência de IDs e classes (`required-input`, `required-checkbox`, `.invalid`, `.error-message`).

Licença
-------
Adicionar sua licença (ex.: MIT) conforme preferir.
