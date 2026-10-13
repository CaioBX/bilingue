# WhatsApp Bilíngue · Hoje no Ceará

Página onde o turista escolhe o idioma, toca nas perguntas e envia tudo pelo WhatsApp do negócio, já com a tradução em português embaixo.

## Estrutura

```
bilingue/
├── motor/
│   ├── bilingue.js      ← motor: perguntas, idiomas, lógica (igual para todos)
│   └── bilingue.css     ← visual (igual para todos)
├── demo/index.html      ← demonstração para mostrar nas vendas (tem seletor de setores)
├── _modelo/index.html   ← modelo vazio para cada cliente novo
└── pousada-mare-alta/   ← exemplo de cliente pronto
    └── index.html
```

Cada cliente é **uma pasta com um index.html pequeno**. Quem faz o trabalho pesado é o motor.

## Configuração (uma vez só)

1. No GitHub, crie um repositório **público** chamado `bilingue`.
2. Na página do repositório, clique em **uploading an existing file** e arraste as pastas `motor`, `demo`, `_modelo` e `pousada-mare-alta` e este `README.md` (no Chrome ou no Edge, o GitHub mantém as pastas). Clique em **Commit changes**.
3. Vá em **Settings → Pages**, escolha **Deploy from a branch**, branch **main**, pasta **/ (root)**, e salve.
4. Em 1 ou 2 minutos, a demo fica no ar em: `https://caiobx.github.io/bilingue/demo/`

## Cliente novo (cerca de 5 minutos)

1. Mande a ficha para o cliente e cole as respostas no Projeto do Claude.
2. O Claude devolve **o nome da pasta** (ex.: `pousada-carcara`) e **o conteúdo do index.html**.
3. No GitHub: **Add file → Create new file**. No nome, digite `pousada-carcara/index.html` (ao digitar a barra, o GitHub cria a pasta). Cole o conteúdo e clique em **Commit changes**.
4. Em cerca de 1 minuto, fica no ar em `https://caiobx.github.io/bilingue/pousada-carcara/`
5. Teste: abra o link, escolha um idioma, toque numa pergunta e confira se a mensagem chega no WhatsApp do cliente.

## Colocar na matéria do Hoje no Ceará

Na aba **Incorporar** da Lenium:

```html
<iframe src="https://caiobx.github.io/bilingue/pousada-carcara/" title="Fale com a Pousada Carcará no seu idioma" style="width:100%;height:900px;border:0;border-radius:16px;" loading="lazy"></iframe>
```

## Campos do cliente (window.CLIENTE)

| Campo | O que é |
|---|---|
| `demo` | Sempre `false` para cliente. Só a demo usa `true`. |
| `nome` | Nome do negócio como aparece no topo |
| `local` | Cidade ou praia, ex.: `"Jericoacoara, Ceará"` |
| `whatsapp` | Só números: 55 + DDD + número, ex.: `"5588999998888"` |
| `segmento` | `hospedagem`, `restaurante`, `transfer` ou `passeio` |
| `idiomasFalados` | Idiomas que a equipe responde, ex.: `["pt","en","es"]` |
| `cor` | Cor da marca em HEX, ex.: `"#0e6a73"` |
| `linkMateria` | Link da matéria do cliente no Hoje no Ceará |
| `assuntosExtras` | Opcional: assuntos próprios do cliente (máximo 2, com até 5 perguntas cada) |

Formato de `assuntosExtras` (ordem dos idiomas: pt, en, es, fr, it):

```js
assuntosExtras: [
  { ic: "sun",
    titulo: ["Aulas de kite","Kite lessons","Clases de kite","Cours de kite","Lezioni di kite"],
    perguntas: [
      ["Têm aula para iniciantes?","Do you have beginner lessons?","¿Tienen clases para principiantes?","Proposez-vous des cours pour débutants ?","Avete lezioni per principianti?"]
    ] }
]
```

Ícones disponíveis: `tag`, `bed`, `cafe`, `pin`, `rules`, `card`, `clock`, `menu`, `home`, `route`, `plane`, `bag`, `compass`, `sun`, `chat`.

## Atualizar todos os clientes de uma vez

Qualquer melhoria em `motor/bilingue.js` ou `motor/bilingue.css` vale para todos os clientes na hora. Não é preciso mexer nas pastas dos clientes.

## Domínio próprio (quando quiser)

Settings → Pages → Custom domain. O endereço passa a ser `seudominio.com.br/bilingue/nome-do-cliente/` (ou sem o `/bilingue`, se o repositório for o principal do domínio).
