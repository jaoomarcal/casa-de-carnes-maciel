# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Clientes locais da Casa de Carnes Maciel (Auriflama-SP), pedindo carne para retirar na loja ou receber em casa (~30 min), majoritariamente pelo celular.

## Product Purpose

Catálogo online com carrinho que gera um pedido pronto para o WhatsApp da loja, substituindo o pedido feito por telefone ou presencialmente. A confirmação e o fechamento do pedido continuam acontecendo por conversa direta com a loja, não por checkout automatizado.

## Positioning

Qualidade e curadoria dos cortes é o diferencial central (não é uma corrida por preço). O atendimento continua pessoal — o pedido é combinado com a loja pelo WhatsApp, não processado por um app/marketplace terceiro.

## Operating Context

- Catálogo mantido manualmente pelo dono da loja via painel interno (`/painel`), com login restrito.
- Categorias: Ofertas do Dia, Bovinos, Suínos, Aves, Peixes, Linguiça, Temperados, Mercearia, Diversos, Bebidas.
- Produtos vendidos por kg (peso escolhido pelo cliente) ou por unidade.
- Cortes disponíveis por produto: bife, manta, cubos, moída, peça inteira; opção de "temperada" quando aplicável.
- Fechamento do pedido abre o WhatsApp com a mensagem pronta (itens, forma de pagamento, endereço se for entrega); pagamento combinado offline (PIX, dinheiro ou cartão).
- Tempo estimado de entrega fixo: 30 minutos.
- Backend Supabase mantido ativo por um heartbeat agendado via GitHub Actions.

## Capabilities and Constraints

- Sem pagamento online — todo pagamento é combinado por fora (PIX/dinheiro/cartão), confirmado via WhatsApp.
- Catálogo não é self-serve: só o dono/admin edita produtos pelo painel.
- Uso majoritariamente mobile — inclui ajuste para evitar zoom automático do iOS Safari em inputs.
- Loja física única, endereço em Auriflama-SP, com link direto para o Google Maps no hero.

## Brand Commitments

Nome "Casa de Carnes Maciel", logo com fundo transparente (`logo-maciel.png`), paleta em tons de vermelho-carne e carvão/preto já usada no Tailwind. Hero usa foto do açougueiro trabalhando (`hero-acougueiro.jpg`).

## Evidence on Hand

Existe prova social real (avaliações / tempo de mercado), mas o dono optou por não divulgar os números/detalhes agora. Não inventar depoimentos, avaliações ou estatísticas até que sejam fornecidos.

## Product Principles

1. Qualidade e curadoria dos cortes é a promessa central — não competir por preço.
2. O pedido é pessoal: a confirmação final acontece por conversa no WhatsApp, não por checkout 100% automatizado.
3. Mobile-first — a maioria dos clientes pede pelo celular.
4. A integridade do catálogo depende do painel manual do dono — manter esse fluxo simples é prioridade.
5. Nunca fabricar prova social (depoimentos, números, avaliações) sem confirmação do dono.
