# Cruzamento REA/JADX + Ghidra

## 1. Identidade comum

Todas as fontes apontam para o mesmo APK:

- `com.duolingo`
- versão `6.101.2`, código `2476`
- SHA-256 `19ae27b023cb2e323a7f5a497b55af966d7118195d3688764913de709a77539f`

## 2. Camada Android — REA/JADX

O REA carregou 76.741 classes e 17.882 recursos. A classe de aplicação observada foi `com.duolingo.core.DuoApp`, com inicialização de dependências, usuário/login, callbacks de ciclo de vida, rede e métricas de inicialização.

O manifesto declara suporte a internet, áudio, microfone, câmera, notificações, calendário, contatos, armazenamento e biometria. Declarações de permissão não provam uso em cada fluxo.

O APK contém muitas classes obfuscadas e bibliotecas de terceiros. Por isso, uma busca textual por `lesson` encontrou 1.179 arquivos smali e uma busca combinada por termos de produto encontrou 17.277 arquivos; esses números não representam 1.179 implementações de lição. Eles incluem dependências, recursos gerados e código genérico.

## 3. Camada nativa — Ghidra

O Ghidra analisou `libgame.so` como ELF AArch64 e exportou 7 funções candidatas a partir de strings.

O resultado principal foi:

- `_ShowImpl`: teclado virtual e entrada de texto Android.
- `GameActivityEventsInit`: ponte JNI para eventos de toque e teclado.
- outras funções: `libunwind`, leitura de exceções e decodificação de dados.

Não foram encontradas funções claramente identificadas como XP, sequência, lição ou telemetria de produto em `libgame.so`.

## 4. Conclusão cruzada

O REA/JADX aponta que o fluxo de produto e estado de usuário está principalmente na camada Android/Dex, enquanto `libgame.so` contém infraestrutura nativa de entrada e integração com Android. As bibliotecas Unity/IL2CPP maiores podem conter lógica nativa, mas precisam de análise separada e não expõem automaticamente o código original.

Não há evidência suficiente, nesta amostra estática, para afirmar que o APK verifica se o usuário está em casa. Também não apareceu localização precisa no conjunto de permissões reportado.

## 5. Tradução autoral para o LingoLab

Com base no cruzamento, o LingoLab usa uma separação equivalente, mas original:

- `src/learning/model.ts`: estado de exercícios e revisão.
- `src/learning/catalog.ts`: trilha e conteúdo próprio.
- `src/privacy/telemetry.ts`: eventos locais e consentimento.
- `App.tsx`: fluxo de sessão, progresso, abandono e feedback.

Esses arquivos implementam comportamentos de produto semelhantes sem copiar código, conteúdo ou backend proprietário.

## Evidências

- REA APK: `ev_3d994d864c0dcf7565445ab9484a87457e332681b11cd33f5fef1f5aacf47238`
- REA busca Android: `ev_f4f2bdf998f50d1b4c7ba96436e04619950c559d42b5a3cd22ee16706b94e951`
- REA `DuoApp`: `ev_f53b1394922ef1e618c9b6e5c03789e7b9e2620e40ef8c2da2f57cb81191879b`
- Ghidra pseudocódigo: `ghidra-interesting-functions.txt`
