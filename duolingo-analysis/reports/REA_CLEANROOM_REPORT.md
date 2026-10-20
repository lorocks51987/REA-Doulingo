# Relatório clean-room — APK Android analisado

## Escopo

Análise estática do arquivo local `Duolingo v6.101.2 (Premium).apk`. O APK não foi executado. Este relatório não reproduz código, textos, imagens, marca, endpoints privados ou conteúdo proprietário.

## Identidade observada

- Pacote: `com.duolingo`
- Versão: `6.101.2` / código `2476`
- SHA-256: `19ae27b023cb2e323a7f5a497b55af966d7118195d3688764913de709a77539f`
- Classes carregadas pelo JADX: `76.741`
- Recursos: `17.882`
- `minSdk`: `29`; `targetSdk`: `36`
- Application: `com.duolingo.core.DuoApp`
- Activity inicial: `com.duolingo.splash.LaunchActivity`

Evidências REA: `ev_3d994d864c0dcf7565445ab9484a87457e332681b11cd33f5fef1f5aacf47238`, `ev_f53b1394922ef1e618c9b6e5c03789e7b9e2620e40ef8c2da2f57cb81191879b`.

## Observações estáticas relevantes

`DuoApp.onCreate()` inicia telemetria/performance, resolve dependências globais, cria rastreadores de abertura, registra callbacks de ciclo de vida, conecta observadores de usuário/login e agenda tarefas assíncronas de inicialização. Há tratamento de conectividade/modo avião e um ramo específico para ambiente chinês.

Os nomes de muitas classes estão ofuscados. Assinaturas e manifestos são observações; não demonstram comportamento em execução.

## Decisões da reimplementação

O projeto `LingoLab` usa nomes, textos, cores, exercícios e dados próprios. Ele implementa uma arquitetura didática equivalente em alto nível: estado de sessão, catálogo de lições, progresso, XP, sequência diária e execução de exercícios.
