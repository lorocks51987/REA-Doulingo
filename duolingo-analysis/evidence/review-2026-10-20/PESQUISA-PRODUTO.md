# Pesquisa pública do produto Duolingo

Consulta: **20 de outubro de 2026**. Escopo: fontes oficiais abertas na web. Este documento registra comportamento divulgado, não execução do APK, contrato de API ou garantia de disponibilidade para uma conta. Blogs antigos podem ser atualizados no mesmo URL: a idade mostrada na busca não fixa a versão do texto. Disponibilidade varia por curso, idioma de interface, plataforma, região e experimento.

## Trilha e aprendizagem

O redesenho da tela inicial documenta uma trilha linear com lições agrupadas em unidades, conceitos intercalados e prática embutida. Stories entram na trilha quando suportadas; guidebooks agrupam dicas por unidade; conteúdo concluído pode ser revisitado. A descrição do redesenho é histórica e não deve fixar a quantidade atual de lições, nós ou requisitos Legendary. [Fonte oficial](https://blog.duolingo.com/new-duolingo-home-screen-design/).

O Duolingo Score representa progresso no material do curso. A página consultada usa escala 0–160 e relaciona faixas a conteúdo CEFR: 0–29/A1, 30–59/A2, 60–99/B1, 100–129/B2, 130–160/C1–C2. A própria página diz que seus cursos mais avançados cobrem até 129; portanto a escala não demonstra oferta de todo o conteúdo até C2, nem certificação individual. [Fonte oficial](https://blog.duolingo.com/duolingo-score/). O balanço de 2025 afirma expansão do Score para todos os cursos de idiomas, enquanto o artigo dedicado ainda menciona disponibilidade inicial menor: discrepância temporal que exige validação por conta. [Balanço oficial](https://blog.duolingo.com/product-highlights/).

## Prática e explicações: mudança de acesso

A página atual da aba Practice declara prática gratuita para todos: revisão de erros, palavras, fala e escuta. Indica iOS e Android e acesso pelo haltere ou menu de três pontos. Stories, Radio e Adventures aparecem para revisão quando existem no curso; Max acrescenta revisão de Video Call e Roleplay. A mesma página declara Explain My Answer gratuito. [Fonte oficial](https://blog.duolingo.com/guide-to-duolingo-practice-hub/).

Isso impede tratar “Practice Hub exclusivo de Super” ou “Explain My Answer exclusivo de Max” como regra universal atual: descrições antigas de assinatura registram outro momento. O lançamento de Super descrevia Practice Hub personalizado e revisão de erros como benefícios pagos. [Documento histórico](https://blog.duolingo.com/super-duolingo-launch/).

## Hearts e Energy

Na descrição oficial de Energy, Hearts descontava um coração por erro de usuário gratuito. Energy consome carga ao longo das lições, devolve carga por sequências corretas e não cobra a revisão de erros ao final. O texto informa recarga em aproximadamente um dia, anúncios recompensados e recarga com gems. Também descreve bonificações para determinados eventos, como lição perfeita e baús. A página ainda caracteriza o sistema como teste com disponibilidade limitada: não comprova substituição universal nem fórmula numérica estável. [Fonte oficial](https://blog.duolingo.com/duolingo-energy/).

Para uma implementação independente, saldo, custo por ação, recarga, recompensas e elegibilidade devem ser políticas configuráveis. Essa é uma proposta de arquitetura, não informação extraída sobre o backend do Duolingo.

## Sequência e relações sociais

Friend Streak usa convites aceitos entre amigos que se seguem mutuamente. A divulgação estabelece até cinco amigos, uma sequência separada para cada relação e manutenção por lição diária dos dois participantes. Há lembretes para o amigo. [Fonte oficial](https://blog.duolingo.com/friend-streak/). O relato de desenvolvimento confirma que notificações, convites e responsabilidade social foram escolhas deliberadas; seu protótipo inicialmente local não descreve o backend de produção. [Relato de produto](https://blog.duolingo.com/product-lessons-friend-streak/).

Streak Freeze deve estar equipado antes da ausência para preservar a continuidade. Um artigo de engenharia descreve também proteção extraordinária durante indisponibilidade: guardar o instante da tentativa e preencher o dia afetado posteriormente. É evidência histórica dessa estratégia, não promessa de reparo automático em todo incidente. [Fonte oficial](https://blog.duolingo.com/protecting-streaks-from-site-issues/).

Friends Quests são objetivos compartilhados semanais; não são o mesmo estado de Friend Streak. A página social descreve pareamento com amigo ou seleção de parceiro, dependendo da disponibilidade. [Fonte oficial](https://blog.duolingo.com/friends-social-features/).

## Ligas, XP e missões

O guia de ligas descreve competição semanal por XP, dez ligas, grupos com hábitos e fusos semelhantes e participantes de cursos diferentes. Diamond Tournament tem quartas, semifinais e final, com elegibilidade dos dez primeiros quando há torneio. O artigo ainda contém restrições antigas de plataforma; não assumir que elas valem em 2026. Perfil privado desativa leaderboards segundo essa fonte. [Fonte oficial](https://blog.duolingo.com/duolingo-leagues-leaderboards/).

O artigo sobre Time Spent Learning Well divulga uma aproximação da métrica: minutos na trilha + 0,5 × minutos em outras lições. Explica Daily Quests de dificuldade crescente, migração de desafios mensais de XP para missões e rebalanceamento de XP para favorecer avanço na trilha. São decisões de produto e medição divulgadas, não algoritmo completo nem fórmula de recompensa atual. [Fonte oficial](https://blog.duolingo.com/time-spent-learning-well/).

## Assinaturas e IA

A página atual de Max o posiciona acima de Super, com Energy ilimitada, ausência de anúncios e recursos de IA. Roleplay apresenta cenários com personagens, concede XP e oferece feedback sobre respostas. Video Call permite conversa falada com Lily, revisão de transcrição e continuidade contextual entre chamadas. Especialistas humanos escrevem cenários e mensagens iniciais de Roleplay. [Fonte oficial](https://blog.duolingo.com/duolingo-max/).

A mesma página anuncia Max em 188 países, iOS e Android, mas a matriz de idiomas é específica: espanhol, francês, alemão, italiano e português para falantes de inglês têm ambos os recursos; japonês, coreano e chinês são citados para Video Call. Esses números são declarações do texto consultado, não teste de acesso. A menção a GPT-4 na página não estabelece o modelo usado hoje em cada requisição. [Fonte oficial](https://blog.duolingo.com/duolingo-max/).

O Family Plan foi divulgado para seis contas no total; não exige parentesco ou residência comum. Preços não foram coletados porque dependem da oferta, loja e região. [Fonte oficial](https://blog.duolingo.com/friends-social-features/).

## Música, matemática e xadrez

Music ensina ritmo, reconhecimento de notas, teclado, leitura de partitura e percepção auditiva por exercícios interativos e execução de músicas. O curso é baseado em teclado de piano na descrição consultada; não exige instrumento físico para começar. Lições de Music e Math contam para sequência, XP e missões. [Fonte oficial](https://blog.duolingo.com/music-course/).

Chess usa lições curtas e exercícios com Oscar. A apresentação descreve tarefas para iniciantes e partidas contra o personagem; não fornece protocolo de jogo ou parâmetros internos do motor. [Fonte oficial](https://blog.duolingo.com/chess-course/).

O balanço oficial de **2025** anuncia Chess em iOS, Android e web, PvP, minimatches e lições de aberturas; para Math, 60 unidades novas dos anos escolares 6–9 e navegação por tema; para Music, seção de iniciantes e prática com piano real. Anuncia ainda push-to-talk, legendas iniciais e feedback em Video Call, novos widgets e notificações de personagens, matching de Friends Quests para pessoas sem amigos e maiores recompensas pelas três Daily Quests. Isso documenta anúncios e retrospectiva daquele ano, não comprova que todos aparecem no APK local 6.101.2. [Fonte oficial](https://blog.duolingo.com/product-highlights/).

## Implicações para uma especificação independente

**Proposta**, derivada das capacidades públicas acima: separar progresso curricular de XP; separar sequência pessoal, sequência entre amigos e missões; representar permissões de assinatura como capacidades que podem mudar; selecionar atividades por curso/plataforma/experimento; preservar histórico de lições e erros para revisão; tratar sessões de IA como atividades com consentimento, transcrição, feedback e denúncia.

Não foram recuperados aqui currículo completo, conteúdo licenciado, pesos de personalização, regras antifraude, experimentos ativos, preços, endpoints privados ou contratos operacionais. O material público não estabelece um SDK oficial de integração. Para clean-room, este arquivo é pesquisa do produto; uma especificação destinada ao implementador deve transformar as observações em requisitos independentes e manter componentes extraídos do APK em evidências separadas.
