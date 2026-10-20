# Varredura de telemetria, microanalytics e personalização

Data: 2026-10-20. Alvo: APK local `Duolingo v6.101.2 (Premium)`, SHA-256 `19ae27b023cb2e323a7f5a497b55af966d7118195d3688764913de709a77539f`.

Esta é uma análise estática com REA/JADX, smali, Ghidra e fontes públicas. Não houve execução do APK, login, interceptação de tráfego, compra ou acesso a conta. Portanto, a presença de uma classe/SDK prova capacidade instalada, não prova que cada evento seja enviado em todos os países ou sessões.

## O que o APK consegue observar

### Atividade de aprendizagem

Os modelos de sessão e desafio permitem registrar exercício apresentado, resposta, correção, erro, dica, áudio/TTS, duração e contexto adaptativo. O cliente também mantém combo atual, maior combo, combo inicial, idade da conta, elegibilidade e participação em experimento. Esses dados alimentam progresso, recompensas, quests, energia, ligas e seleção de desafios.

### Identidade e conta

O manifesto decodificado lista internet, estado de rede, notificações, calendário, contatos, contas, microfone, armazenamento e captura de tela. Permissão declarada não significa concessão nem uso efetivo. A política pública diz que conta pode envolver nome de usuário, idade, e-mail e, em alguns países, telefone; logins sociais podem fornecer e-mail e contatos. Ela também descreve perfil, seguidores, estatísticas, conquistas, atividade, dados de dispositivo e IP.

### Dispositivo, publicidade e consentimento

O smali contém um modelo com `advertisingId`, `gdprApplies`, `tcfConsentString` e `ccpaOptOut` (`smali/axa.smali`). Há integração Adjust para consentimento de medição (`smali/cm.smali`) e estruturas de consentimento IAB/Prebid. Isso indica uma cadeia de atribuição/ads condicionada à política e ao consentimento; não prova que o identificador de publicidade esteja sempre acessível.

### Experimentação

O APK possui `ExperimentsRepository`, `ClientExperimentsRepository`, `TreatmentRecord`, rollout, pesos e condições `isInExperiment`. O arquivo de estado de experimentos é montado como `users/<id>/experiments.json` (`smali/b6e.smali`). Os gates controlam escolhas de produto, combos, energia, onboarding, carregamento e possivelmente anúncios. A empresa informa publicamente que executa centenas de testes A/B por trimestre.

### Mensagens e retorno

Firebase Messaging está presente (`smali/ad7.smali`) e o manifesto declara recebimento de boot e notificações. Isso permite lembretes e reengajamento. A pesquisa pública da Duolingo publicou um conjunto de 200 milhões de exemplos de notificações, com template, conversão em duas horas e metadados; isso demonstra que notificações são tratadas como experimento mensurável, embora não revele os eventos privados da versão analisada.

### Compras e monetização

O APK contém Adjust e modelos de eventos de transação/loja. O manifesto e os pacotes não provam que dados de cartão sejam enviados ao aplicativo; a política informa que processadores como Stripe cuidam de pagamentos e prevenção de fraude. O nome “Premium” do arquivo não é prova de autenticidade ou estado de assinatura.

## Como ele parece “saber tanto”

O mecanismo é cumulativo. Cada resposta atualiza um perfil de domínio e dificuldade; cada sessão fornece tempo, erros, dicas e abandono; o servidor combina isso com histórico, dispositivo, idioma, fuso/IP aproximado, conta, coorte e tratamento experimental. O modelo Birdbrain estima a probabilidade de acerto por usuário e exercício, e o gerador escolhe uma sequência adequada. A empresa descreve esse uso de dados em seu relatório anual e em artigos técnicos.

O aplicativo também recebe decisões prontas do servidor: tratamento experimental, payload de sessão, recompensas, liga e conteúdo. Assim, parte do “conhecimento” é inferência remota e não uma base completa armazenada no APK.

## Mapa de dados

| Fonte | Sinais prováveis | Uso observado ou público | Certeza |
|---|---|---|---|
| Tentativas | acerto, erro, dicas, tempo, tipo de desafio | dificuldade, progresso, Birdbrain | alta |
| Sessões | início/fim, duração, abandono, contexto | retenção, XP, quests, A/B | média-alta |
| Conta | idioma, idade declarada, perfil, seguidores | personalização e social | média |
| Dispositivo | versão, rede, advertising ID condicionado | atribuição, segurança, ads | média |
| Consentimento | GDPR/TCF/CCPA, medição | habilitar/desabilitar parceiros | alta |
| Notificações | template, horário, conversão | reengajamento/bandits | pública; versão exata desconhecida |
| Voz | áudio e resultado de fala | exercícios de pronúncia/IA | média |
| Contatos/calendário | permissões declaradas | recursos sociais/lembretes | capacidade declarada; uso não provado |

## O que não foi encontrado

Não encontrei evidência estática suficiente para afirmar keylogging genérico, leitura indiscriminada de fotos, localização precisa contínua ou gravação de microfone fora dos exercícios de fala. Também não é possível extrair do APK as tabelas completas de eventos, pesos de Birdbrain, IDs de usuário de uma conta real, coortes, endpoints autenticados ou retenção individual.

## Cruzamento com fontes públicas

- Política de privacidade: https://www.duolingo.com/privacy
- Relatório anual 2025: https://investors.duolingo.com/static-files/f19d76fb-dee4-4f13-96ae-138ebfd0f2d3
- Estratégia e A/B testing: https://investors.duolingo.com/company-strategy-overview-0
- Birdbrain e personalização: https://blog.duolingo.com/large-language-model-duolingo-lessons/
- Estatísticas de sessão: https://blog.duolingo.com/how-i-saved-duolingo-40000year-in-my-summer-internship/
- Dados de notificações: https://research.duolingo.com/

As fontes públicas são declarações da própria empresa e descrevem sistemas em produção em datas diferentes do APK. Elas corroboram a arquitetura de personalização, mas não substituem evidência do artefato.

## Limitações

O Ghidra encontrou a ponte Unity/JNI, mas não forneceu uma lista completa de eventos no `libil2cpp.so`; a análise IL2CPP foi interrompida devido a metadados de exceção inconsistentes. A próxima etapa para comprovar o caminho de rede seria um ambiente autorizado com conta de teste e coleta consentida; isso não foi feito nesta varredura.
