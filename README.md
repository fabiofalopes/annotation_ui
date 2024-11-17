# Annotation tool for chat disentanglement

Work in progress

Versão 0.001 da Ferramenta de anotação, especificamente do layout para o modulo de chat disentanglement.

![image](https://github.com/user-attachments/assets/8d67cbf2-724f-4919-b610-dab906eecf1f)

## Correr App

## Local

1. Install dependencies:
   ```
   npm install
   ```
2. Start the development server:
   ```
   npm run dev
   ```
   This command starts both:
      - React development server on port 3721 (frontend)
      - Express server on port 3722 (handles file operations and API endpoints)

   Num projeto Node, é necessário um servidor (como o [Express.js](https://expressjs.com/en/starter/installing.html)) para lidar com operações de ficheiros porque o código do lado do cliente que é executado no navegador não tem acesso direto ao sistema de ficheiros do sistema devido a restrições de segurança, e o servidor atua como intermediário para salvar, recuperar e manipular ficheiros.

3. http://localhost:3721 

## Docker

1. Requisitos: Docker e Docker Compose
2. Build and run the Docker container:
   ```
   docker-compose up --build
   ```
   or
   ```
   docker compose build
   docker compose up -d
   ```
3. http://localhost:3721

# Notas

Input csv: Obrigatorio seguir o formato colunas :
- **user_id**: consists of the ID of the user who sent the turn.
- **turn_id**: represents a unique ID for the sent turn.
- **turn_text**: consists of a text, containing one or more sentences sent by the user.
- **reply_to_turn**: also called reply-mark. This column indicates which turn the current turn explicitly replies to.
- **thread**: a column that should be filled in by the annotator through the identification of the threads.

# Todo's

- [x] Esquema de cores: Tanto em tags como na UI em geral
   - Esta melhor mas pode ser melhorado!

- [x] O "see more" das mensagens longas tem que ser apenas para mensagens mesmo longas (so alterar o threshold)

- [x] Important: Load the tags já criadas no csv com um comportamento estranho. Deve mostrar logo todas as tags previamente anotadas e guardadas no ficheiro

- [x] Save file / Load file Resume

- [ ] Resume Work (começar exatamente onde estava, mesmo a nivel de scroll no chat)

- [x] Navegação das paginas, agora esta confuso com a landing page assim..

- [x] Thread Tag menu mais optimizado: Cartões editaveis com descrição por exemplo para a tag editada.
   - [ ] Colocada descrição, talvez possam haver mais campos???

- [x] Adicionar um 'File Picker' com uma lista de 'Arquivos Recentes' ou 'Arquivos Abertos Recentemente' no ecrã de upload do csv.
   - De momento a pagina 'upload' contem um componente workspace que lê diretamente da pasta 'files' na base do projecto, listanto assim todos os ficheiros que já foram carregados previamentem, visto que de momento, quando carregamos um ficheiro, é criada uma copia nesta pasta.

- [ ] Sugestão de tags. Após já terem sido criadas algumas tags, deve sempre sugerir essas tags para ser apenas 1 click para as colocar no turno.

- [ ] Se coluna reply_to_turn tiver referencia, então mostrar referencia a chat bubble (estilo whatsapp)

- [ ] Adicionar um Minimap (Code map - ao estilo do vscode) no chat, com highlights e cores, para permitir saltar diretamente para seções específicas das anotações no chat.

- [ ] Se clicar numa caixa de uma respetiva tag no thread menu, entao seria fixe aparecerem apenas mensagens tagadas com essa tag.

- [ ] Tentar fazer com que a função que gera random colours para as tags, nao use cores muito carregadas e muito brancas.

- [ ] Home page mais bonita..

- [x] Botão open folder, do componente workspace, da pagina '/upload'
   - [ ] Não abre em Docker..

## Novos To-dos:

- [ ] Ampliar width/tamanho geral da UI para melhor aproveitamento do espaço
- [ ] Reduzir tamanho dos cartões na seção de tags
- [ ] Implementar posicionamento do turn_id e user_id no canto superior esquerdo dos cartões
- [ ] Implementar highlight de tags selecionadas com blur nas demais
- [ ] Adicionar sistema de roles (admin/user normal)
- [ ] Implementar funcionalidade de upload de CSV para admins
- [ ] Adicionar datas de início e fim para tarefas
- [ ] Implementar visualização de salas anotadas vs não anotadas
- [ ] Adicionar referência "how to annotate" para cada sala
- [ ] Implementar menu lateral esquerdo com lista de salas
- [ ] Adicionar toggle para o menu lateral
- [ ] Implementar indicadores de progresso nas salas (verde: concluído, amarelo: em progresso, vermelho: não iniciado)

# Issues para resolver: 

- [ ] Nomes dew ficheiros e pastas:
   - [ ] 'files' -> 'workspace'
   - [ ] 'chatRoom.js' e 'chatRoom.css' -> 'disentanglementChatRoom' ??
   - [ ] 'ThreadMenu' -> 'TheadTagsMenu' ??? 
   - [ ] '/upload' caminho -> '/manage-files' ou outra coisa ???
- [ ] 'App.js' gigante, segregar coisas...
   - Perceber melhor o route!!! (... from 'react-router-dom';)
- [ ] Drag and drop do csv na pagina /upload nao da em Firefox, mas dá em Chrome..

## Novas Issues para resolver:

- [ ] Implementar sistema completo de gestão de utilizadores com login
- [ ] Desenvolver backend para autenticação e autorização
- [ ] Criar sistema de distribuição automática de tarefas
- [ ] Implementar ferramentas de monitorização do progresso das anotações

# Questões 

- Como identificar os anotadores ao carregar os ficherios?
   - Pelo nome da coluna Thead_<nome>?

## Novas Questões:

- Como implementar o sistema de indicadores de progresso nas salas?
- Como estruturar a hierarquia de permissões entre admin e utilizador normal?
- Como integrar o novo menu lateral com o design atual?

---

# Tracking de Desenvolvimento

## Início do Projeto
- **Data de Início**: 7 de outubro de 2024
- **Período de Desenvolvimento Inicial**: 7 de outubro - 8 de novembro de 2024
- **Estado Atual**: Esboço funcional
- **Escopo**: Desenvolvimento de template e funcionalidades base

## Tarefas Realizadas
Formato de registro: 
```
[Data Início - Data Fim] Nome da Tarefa
- Descrição breve
- Esforço estimado (em horas)
- Observações relevantes
```

### Semana 1 (7-11 outubro/2024)
- **[07/10 - 08/10] Setup Inicial do Projeto**
  - Configuração base do projeto React
  - Esforço: 5h
  - Resultado: Estrutura inicial funcional

- **[09/10 - 10/10] Interface de Chat Base**
  - Implementação do layout básico de chat
  - Esforço: 6h
  - Obs: Foco em estrutura básica funcional

### Semana 2-3 (14-27 outubro/2024)
- **[14/10 - 16/10] Sistema de Tags**
  - Desenvolvimento do menu de gestão de tags
  - Esforço: 8h (distribuídos em 3 dias)
  - Obs: Implementação inicial com funcionalidades básicas

- **[21/10 - 23/10] Gestão de Arquivos**
  - Sistema de upload e processamento de CSVs
  - Esforço: 9h (distribuídos em 3 dias)
  - Obs: Inclui testes de diferentes abordagens

### Semana 4-5 (28 outubro - 10 novembro/2024)
- **[28/10 - 01/11] Avaliação e Testes**
  - Testes de frameworks e viabilidade técnica de um backend. 
  - Esforço: 20h
  - Obs: Período de validação de escolhas técnicas

- **[28/10 - 10/11] Melhorias e Ajustes**
  - Melhorias gerais na interface e funcionalidades
  - Esforço: 15h
  - Obs: Foco em estabilidade e usabilidade

## Métricas de Desenvolvimento
- **Média de esforço diário**: 2-3 horas
- **Tempo total investido**: FAZER APROXIMAÇÃO

## Formato para Novas Entradas
```markdown
### [Período]
- **[Data Início - Data Fim] Nome da Tarefa**
  - Descrição clara e concisa
  - Esforço: Xh
  - Obs: Informações relevantes sobre desenvolvimento/implementação
```

## Observações Gerais
1. Projeto em fase de esboço funcional
2. Desenvolvimento focado em provas de conceito
3. Tarefas executadas de forma sequencial
4. Estimativas baseadas no tempo de desenvolvimento

## Próximas Etapas
- [ ] Definição de arquitetura definitiva
- [ ] Início de desenvolvimento avançado
- [ ] Estabelecimento de padrões de código
- [ ] Implementação de testes sistemáticos

Nota: Este formato tem como objectivo servir como base para futura elaboração do gráfico Gantt.