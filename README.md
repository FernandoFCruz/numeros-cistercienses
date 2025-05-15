# 🕯️ Gerador e Reconhecedor de Números Cistercienses

Este projeto permite **gerar representações visuais de números cistercienses** e **reconhecer números a partir de imagens**, utilizando uma interface web simples, Node.js, Python e a biblioteca `sharp` para manipulação de imagens.

---

## 📦 Funcionalidades

- ✅ Geração de imagens de números cistercienses (de 1 a 9999)
- 📤 Upload de imagem para reconhecer o número correspondente
- 🔍 Reconhecimento de números por similaridade usando script Python
- 🎨 Imagens combinadas com base nos algarismos individuais

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/FernandoFCruz/numeros-cistercienses.git
cd numeros-cistercienses

### 2. Instale as dependencias do python
pip install -r python/requirements.txt


### 🗂️ Estrutura de pastas
.
├── app.js                      # Servidor Express
├── public/                    # Arquivos front-end (index.html, CSS, etc.)
├── utils/
│   └── imageComposer.js       # Função para compor imagens dos números
├── output/                    # Imagens geradas
├── uploads/                   # Imagens enviadas pelo usuário
├── number-images/             # Imagens dos dígitos individuais (ex: 1.png, 2.png, ..., 9.png)
├── dataset-numbers/           # Base para reconhecimento de padrões
└── python/
    └── recognize_number.py    # Script de reconhecimento com OpenCV ou similar


### 🧪 Executando o servidor
npm start

🖼️ Como usar
🔢 Gerar número cisterciense
Digite um número entre 1 e 9999.

Clique em "Gerar".

A imagem será exibida abaixo.

🧠 Reconhecer número a partir de imagem
Faça upload de uma imagem que contenha um número no formato cisterciense.

O script Python tentará identificar o número com base na base de dados.

O número e a similaridade serão exibidos.

🛠️ Observações importantes
Certifique-se de que a pasta number-images/ contenha os arquivos 1.png a 9.png (os dígitos 0 são ignorados).

A função decomposeNumber ignora automaticamente os zeros.

Para o reconhecimento funcionar corretamente, é necessário que a base dataset-numbers/ tenha imagens consistentes.