---
title: Diretrizes de UX e UI Educacional (ACK-ADMY & LingoLab)
tags:
  - ack-admy
  - lingolab
  - ui-ux
  - design-system
  - mobile-first
date: 2026-10-20
---

# 📱 Diretrizes de UX/UI Educacional (ACK-ADMY)

Como transpor os pontos fortes identificados na engenharia reversa do Duolingo para plataformas próprias (como o **ACK-ADMY** — segurança digital — e o **LingoLab**)?

Voltar ao [[00 - MOC (Índice Geral do Cofre)|MOC]].

---

## 🎨 1. Princípios Visuais e Sensoriais

* **Mobile-First Real**: Botões primários grandes (`min-height: 48px`), fáceis de tocar com o polegar na parte inferior da tela (área de alcance confortável).
* **Consistência de Feedback**:
  * **Verde de Sucesso**: Usar tom vibrante e acolhedor (não verde hospitalar ou fosco).
  * **Vermelho de Erro Construtivo**: Nunca punitivo. A mensagem de erro deve sempre explicar *por que* aquela resposta não era a correta e incentivar a tentar novamente.
* **Textos Curtos e Objetivos**: Eliminar blocos gigantescos de texto corporativo ou acadêmico. Transformar conceitos complexos de cibersegurança em cards dinâmicos de 1 a 2 frases.

---

## 🧭 2. Experiência do Aluno vs Experiência do Admin (ACK-ADMY)

Conforme as regras do produto:

| Visão do Aluno | Visão do Administrador / Professor |
| :--- | :--- |
| **Gamificada e Motivadora**: Trilha visual de cibersegurança (ex: Phishing, Senhas, 2FA, Engenharia Social). | **Analítica e Objetiva**: Dashboards com métricas claras de adesão, notas médias e pontos de vulnerabilidade da equipe. |
| **Microrecompensas**: Badges de "Guardião Digital", XP e ofensiva semanal. | **Visão de Risco**: Gráficos consolidados sem poluição visual ou elementos infantis. |
| **Feedback imediato** em simulações interativas. | **Gestão de Turmas** e relatórios exportáveis. |

---

## 📲 3. Boas Práticas para PWA e Navegadores

1. **Safe-Area Insets**: Respeitar o entalhe do iPhone (*notch/Dynamic Island*) e a barra de gestos do Android (`env(safe-area-inset-bottom)`).
2. **Offline-First**: Fazer cache dos módulos ativos usando Service Workers para que o aluno possa concluir lições no metrô ou sem conexão.
3. **Instalabilidade PWA**: Manifesto limpo com ícone adaptativo e splash screen elegante.

---

## 🔗 Notas Relacionadas
* [[Modelo de Implementação Própria (Clean-Room)]]
* [[Psicologia do Loop de Engajamento]]
* [[Sistema de Microlições e Trilha de Aprendizado]]
