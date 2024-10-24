# Annotation tool for chat disentanglement

Work in progress

Versão 0.001 da Ferramenta de anotação, especificamente do layout para o modulo de chat disentanglement.

![image](https://github.com/user-attachments/assets/16f4947e-035c-4039-90f8-b57516efae56)

## Correr App

## Local

1. Install dependencies:
   ```
   npm install
   ```
2. Start the development server:
   ```
   npm start
   ```
3. http://localhost:3000 

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
3. http://localhost:3666

# Notas

Input csv: Obrigatorio seguir o formato colunas :
- **user_id**: consists of the ID of the user who sent the turn.
- **turn_id**: represents a unique ID for the sent turn.
- **turn_text**: consists of a text, containing one or more sentences sent by the user.
- **reply_to_turn**: also called reply-mark. This column indicates which turn the current turn explicitly replies to.
- **thread**: a column that should be filled in by the annotator through the identification of the threads.

# Todo's

- [ ] Sugestão de tags. Após já terem sido criadas algumas tags, deve sempre sugerir essas tags para ser apenas 1 click para as colocar no turno.
- [ ] Esquema de cores: Tanto em tags como na UI em geral
    - Ter o dark mode sempre ativo no meu browser não ajudou kk
- [ ] Se coluna reply_to_turn tiver referencia, então mostrar referencia a chat bubble (estilo whatsapp)
- [ ] Save file / Load file Resume

- [ ] Navegação das paginas, agora esta confuso com a landing page assim..
- [ ] O "see more" das mensagens longas tem que ser apenas para mensagens mesmo longas (so alterar o threshold)
- [ ] Thread Tag menu mais optimizado: Cartões editaveis com descrição por exemplo para a tag editada. 

- [x] Important: Load the tags já criadas no csv com um comportamento estranho. Deve mostrar logo todas as tags previamente anotadas e guardadas no ficheiro


- [ ] Resume Work (começar exatamente onde estava, mesmo a nivel de scroll no chat)
- [ ] Adicionar um Minimap (Code map - ao estilo do vscode) no chat, com highlights e cores, para permitir saltar diretamente para seções específicas das anotações no chat.


- [ ] Adicionar um 'File Picker' com uma lista de 'Arquivos Recentes' ou 'Arquivos Abertos Recentemente' no ecrã de upload do csv.

- [ ] Se clicar numa caixa de uma respetiva tag no thread menu, entao seria fixe aparecerem apenas mensagens tagadas com essa tag.

# Issues para resolver: 

Quando faço 'npm start' tenho este aviso:

```
One of your dependencies, babel-preset-react-app, is importing the
"@babel/plugin-proposal-private-property-in-object" package without
declaring it in its dependencies. This is currently working because
"@babel/plugin-proposal-private-property-in-object" is already in your
node_modules folder for unrelated reasons, but it may break at any time.

babel-preset-react-app is part of the create-react-app project, which
is not maintianed anymore. It is thus unlikely that this bug will
ever be fixed. Add "@babel/plugin-proposal-private-property-in-object" to
your devDependencies to work around this error. This will make this message
go away.
```

Fix !!!

---

# Questões 

- Como identificar os anotadores ao carregar os ficherios?
   - Pelo nome da coluna Thead_<nome>?