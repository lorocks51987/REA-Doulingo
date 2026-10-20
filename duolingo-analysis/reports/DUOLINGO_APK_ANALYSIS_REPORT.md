# Relatório técnico — APK Duolingo

## Identidade do artefato

- Arquivo: `Duolingo v6.101.2 (Premium).apk`
- SHA-256: `19ae27b023cb2e323a7f5a497b55af966d7118195d3688764913de709a77539f`
- Tamanho: aproximadamente 200 MB
- Pacote: `com.duolingo`
- Versão: `6.101.2` / código `2476`
- SDK mínimo: 29
- SDK alvo: 36

## REA/JADX

O REA carregou o APK através do provider JADX headless 0.7.1.

- Classes carregadas: 76.741
- Recursos: 17.882
- Classe de aplicação: `com.duolingo.core.DuoApp`
- Activity inicial: `com.duolingo.splash.LaunchActivity`
- JVM usada: Temurin JDK 21.0.12.1, 64-bit

Evidências REA:

- `ev_3d994d864c0dcf7565445ab9484a87457e332681b11cd33f5fef1f5aacf47238`
- `ev_2e173853d8f7cb8bb60d9d8f71c9e7e582b6ea8a6f1f90b6e7176d5a4ac2c6b0`
- `ev_f53b1394922ef1e618c9b6e5c03789e7b9e2620e40ef8c2da2f57cb81191879b`

Na classe `DuoApp`, a análise estática observou inicialização de dependências, estado de login, repositório de usuários, callbacks de ciclo de vida, rede, eventos de inicialização e telemetria/performance. Isso é observação estática; não prova o comportamento em execução.

## Bibliotecas nativas

Foram encontradas 22 bibliotecas ARM64 em `duolingo-native\lib\arm64-v8a`.

Bibliotecas prioritárias:

- `libil2cpp.so` — aproximadamente 29 MB; código Unity/IL2CPP gerado.
- `libunity.so` — aproximadamente 20 MB; runtime Unity.
- `librive.so` e `librive-android.so` — renderização/animação.
- `libgame.so` — biblioteca nativa específica do jogo.
- `libduolingounity.so` — integração específica com Unity.
- `libmain.so` — ponto de entrada nativo auxiliar.

## Ghidra

Projetos gerados:

- `ghidra-projects\Duolingo_ARM64_small`: bibliotecas menores analisadas com sucesso.
- `ghidra-projects\Duolingo_ARM64_v2`: projeto parcial com bibliotecas importadas e analisadas.

O Ghidra reconheceu as bibliotecas como ELF AArch64. As bibliotecas Unity/IL2CPP maiores produziram muitos avisos em tabelas de exceção e algumas análises excederam o limite de tempo. Isso limita a recuperação de pseudocódigo, mas não invalida o inventário, strings, seções e parte das funções detectadas.

## O que pode ser concluído

O APK combina uma camada Android extensa com componentes nativos Unity/IL2CPP, áudio, animação e armazenamento. A arquitetura sugere que funcionalidades de jogo e experiências interativas podem estar nos componentes nativos, enquanto autenticação, ciclo de vida, rede e integração Android ficam na camada DEX.

## O que permanece desconhecido

- A análise estática não confirma quais permissões são usadas em cada fluxo.
- Código obfuscado não permite reconstruir o código-fonte original fielmente.
- Não foi feita execução do APK, captura de tráfego ou instrumentação de runtime.
- Não é possível afirmar que uma string ou nome de função representa uma regra de produto sem referências e comportamento observado.
- O código proprietário original, backend, conteúdo e algoritmos não podem ser recuperados integralmente.

## Uso para o LingoLab

Os padrões seguros para implementação própria são: sessões curtas, progresso visível, metas configuráveis, feedback imediato, sequência opcional, retomada de lições interrompidas e métricas transparentes. O LingoLab já contém parte desses mecanismos em `lingolab\App.tsx`.
