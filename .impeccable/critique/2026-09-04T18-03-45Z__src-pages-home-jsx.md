---
target: homepage (src/pages/Home.jsx)
total_score: 23
max_score: 36
na_heuristics: 10
p0_count: 1
p1_count: 2
target_identity: "file:C:\\reactJs\\maciel\\src\\pages\\Home.jsx"
target_fingerprint: "sha256:b3b96a79dc1f92dcdc798ce08c8b373b171ba4d14b0854f6d9c9f2d22162bd7f"
target_path: "C:\\reactJs\\maciel\\src\\pages\\Home.jsx"
timestamp: 2026-09-04T18-03-45Z
slug: src-pages-home-jsx
---
Method: dual-agent (design review + detector/browser evidence, isolated)

## Achado urgente (fora do escore)
[P0] Imagem do hero (public/assets/hero-acougueiro.jpg) tem marca d'agua "Magnific" visivel repetida na diagonal - imagem de banco/gerador de IA nao licenciada, nao uma foto real da loja.

## Design Health Score
| # | Heuristica | Nota | Achado-chave |
|---|-----------|-------|-----------|
| 1 | Visibilidade do status | 3 | Envio pro WhatsApp sem feedback antes de sair da aba |
| 2 | Sistema x mundo real | 3 | "30 min de entrega" aparece mesmo na retirada na loja |
| 3 | Controle e liberdade | 3 | Remover item do carrinho sem desfazer |
| 4 | Consistencia | 3 | Estados desabilitados nunca explicam o motivo |
| 5 | Prevencao de erro | 2 | Botao desabilitado sem texto explicativo |
| 6 | Reconhecimento vs memorizacao | 2 | Etapa "dados" esconde a lista de itens |
| 7 | Flexibilidade e eficiencia | 1 | Atalhos de peso (300g/500g/1kg) documentados no codigo mas nao implementados |
| 8 | Estetico/minimalista | 4 | Ponto mais forte do site |
| 9 | Recuperacao de erro | 2 | Sem mensagem quando falta nome/endereco |
| 10 | Ajuda e documentacao | n/a | WhatsApp e o canal de ajuda, por design |

Total: 23/36 (Aceitavel, 64%)

## Veredito de especificidade
LLM: fluxo corte/tempero, categorias e cortes reais (Cupim, Mocoto, Bucho, Rabo) e checkout 100% WhatsApp sentem autoral, nao generico. Campo de peso puro numerico e o ponto mais generico.
Deterministico: 7 avisos design-system-color (texturas decorativas), zero falso positivo, zero padrao de template generico.

## O que funciona
1. Fluxo corte/tempero progressivo no modal de produto
2. Toast de confirmacao itemizado ao adicionar ao carrinho
3. Disciplina de cor (vermelho-sangue so em acao/preco)

## Prioridades
[P0] Marca d'agua na imagem do hero
[P1] Sem revisao do pedido antes do envio ao WhatsApp (CartDrawer.jsx etapa dados esconde itens)
[P1] Botao desabilitado sem explicacao (ProductModal e CartDrawer)
[P2] Atalhos de peso documentados mas nao implementados (ProductModal.jsx:13)
[P2] "30 min" mostrado mesmo na retirada (CartDrawer.jsx:393-397)
[P3] Nome acessivel do cabecalho da etapa dados embaralhado (SheetTitle)

## Persona red flags
Casey (mobile): peso manual em cada item, carrinho sem persistencia
Jordan (primeira vez): botao desabilitado sem feedback, pode achar que pedido foi confirmado so por abrir o WhatsApp
Riley (stress test): busca sem normalizacao de acento ("moida" nao acha "Moida")

## Observacoes menores
FloatingCart.jsx:43 aria-label "1 itens" (deveria ser "1 item")
Modal usa object-contain (fundo branco) vs card object-cover
