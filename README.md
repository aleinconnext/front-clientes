
# Cadastro de Clientes - Frontend

Este é o frontend do projeto **Cadastro de Clientes**, desenvolvido com **Angular Standalone** para facilitar a gestão de clientes, como cadastro, consulta, atualização e exclusão.

## 🚀 Funcionalidades
- **Cadastro de clientes**: Validações de CPF/CNPJ, CEP, e outros campos obrigatórios.
- **Consulta de clientes**: Filtragem por CPF/CNPJ, nome, e outros critérios.
- **Atualização e exclusão**: Permite alterar e excluir registros existentes.
- **Integração com API Via CEP**: Preenche automaticamente os dados do endereço a partir do CEP.

## 🛠️ Tecnologias Utilizadas
- **Angular**: Framework frontend para desenvolvimento de interfaces responsivas.
- **Bootstrap**: Para estilização e layout responsivo.
- **RxJS**: Para chamadas assíncronas e manipulação de dados.

## 📦 Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/aleinconnext/front-clientes.git
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd front-clientes
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Execute o projeto:
   ```bash
   ng serve
   ```
5. Acesse no navegador:
   ```
   http://localhost:4200
   ```

## 🌐 Demonstração
O frontend está publicado e pode ser acessado em:  
[https://front-clientes-iota.vercel.app](https://front-clientes-iota.vercel.app)

## 🧑‍💻 Estrutura do Projeto
- `src/app`:
  - **Components**: Componentes da aplicação, como formulário e lista de clientes.
  - **Services**: Comunicação com a API backend.

## 📖 Requisitos
- Node.js versão 14+.
- Angular CLI 14+.

## 📜 Licença
Este projeto é licenciado sob a MIT License.
