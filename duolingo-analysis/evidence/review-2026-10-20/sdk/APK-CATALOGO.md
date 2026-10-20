# Catalogo estatico do APK Duolingo

Inventario local para orientar investigacao e uma especificacao independente. Nomes sao pistas; nao demonstram comportamento, disponibilidade ou contratos de rede. O JSON adjacente preserva todos os 9.021 nomes encontrados na busca com.duolingo, agrupados por namespace.

## Identidade e cobertura

- APK: `C:\dev\REA\duolingo-analysis\binaries\Duolingo v6.101.2 (Premium).apk`.
- SHA-256: `19ae27b023cb2e323a7f5a497b55af966d7118195d3688764913de709a77539f`.
- 200160388 bytes; 17882 entradas ZIP; 10 DEX; 91761 definicoes de classe nos cabecalhos DEX.
- JADX: 76741 classes no modelo; 9021 correspondencias. Esses totais nao medem a mesma unidade que DEX/smali.
- Evidence: `ev_581755dbf6a98201ad0e7289f086b5bd123784852ee20b26e278705d289f59bc`; provider {'id': 'jadx', 'name': 'JADX headless', 'version': '0.7.1'}.
- Nome Premium nao comprova origem oficial; assinatura oficial e integridade perante a distribuicao oficial permanecem desconhecidas.

## Namespaces observados

Agrupamento disjunto pelo terceiro segmento. Exemplos sao identificadores, sem afirmacao sobre funcionamento.

| Namespace | Classes | Candidatos |
|---|---:|---|
| core | 2342 | `com.duolingo.core.DuoApp`, `com.duolingo.core.account.AccountService`, `com.duolingo.core.adjust.AdjustUtils$Source` |
| data | 2009 | `com.duolingo.data.LeaderboardType`, `com.duolingo.data.LeaguesReactionVia`, `com.duolingo.data.achievements.Achievement` |
| feature | 1214 | `com.duolingo.feature.achievements.AchievementNumberCharacter`, `com.duolingo.feature.achievements.AchievementNumberDrawables`, `com.duolingo.feature.achievements.AchievementNumberDrawablesLayers` |
| session | 439 | `com.duolingo.session.BaseSessionActivity`, `com.duolingo.session.EasierLessonNudgeDialogFragment`, `com.duolingo.session.ExplanationAdFragment` |
| plus | 281 | `com.duolingo.plus.AggressiveFreeTrialHookFragment`, `com.duolingo.plus.HorizontalPurchaseOptionView`, `com.duolingo.plus.OptionOrder` |
| debug | 221 | `com.duolingo.debug.AchievementsV4LocalProgressDebugDialogFragment`, `com.duolingo.debug.AddPastXpDialogFragment`, `com.duolingo.debug.AvatarSuitsDebugActivity` |
| signuplogin | 204 | `com.duolingo.signuplogin.AbstractEmailAndPhoneLoginFragment`, `com.duolingo.signuplogin.AbstractEmailLoginFragment`, `com.duolingo.signuplogin.AddEmailActivity` |
| sessionend | 201 | `com.duolingo.sessionend.AdventuresSessionEndArgs`, `com.duolingo.sessionend.CircleIconImageView`, `com.duolingo.sessionend.FrameFirstLessonFragment` |
| streak | 194 | `com.duolingo.streak.StreakCountView`, `com.duolingo.streak.StreakIncreasedHeaderRedesignView`, `com.duolingo.streak.StreakNudgeHeaderView` |
| profile | 160 | `com.duolingo.profile.BaseProfileFragment`, `com.duolingo.profile.ChinaModerationView$ModerationStatus`, `com.duolingo.profile.CourseAdapter$Type` |
| home | 144 | `com.duolingo.home.CurrencyToolbarItemView`, `com.duolingo.home.DuoTabView`, `com.duolingo.home.FlagToolbarItemView` |
| adventureslib | 133 | `com.duolingo.adventureslib.data.AdventureObject`, `com.duolingo.adventureslib.data.AdventureStage`, `com.duolingo.adventureslib.data.AdventuresType` |
| videocall | 133 | `com.duolingo.videocall.data.AdventuresTaskCompletionData`, `com.duolingo.videocall.data.Anchor`, `com.duolingo.videocall.data.AnimationInputBoolean` |
| onboarding | 126 | `com.duolingo.onboarding.AcquisitionSource`, `com.duolingo.onboarding.AcquisitionSurveyFragment`, `com.duolingo.onboarding.AcquisitionSurveyResponse` |
| feedback | 102 | `com.duolingo.feedback.AdminSubmittedFeedbackFragment`, `com.duolingo.feedback.AdminSubmittedFeedbackViewModel`, `com.duolingo.feedback.AdminUserFeedbackFormFragment` |
| ai | 92 | `com.duolingo.ai.churn.TomorrowReturnProbabilityDebugDialogFragment`, `com.duolingo.ai.ema.EmaTracking$EmaContext`, `com.duolingo.ai.ema.EmaTracking$EmaVersion` |
| goals | 92 | `com.duolingo.goals.dailyquests.ComebackXpBoostRewardState`, `com.duolingo.goals.dailyquests.CompletedDailyQuest`, `com.duolingo.goals.dailyquests.DailyMonthlyItemView` |
| feed | 69 | `com.duolingo.feed.AvatarsWithReactionsView`, `com.duolingo.feed.FeedAdapter$ChangeType`, `com.duolingo.feed.FeedAdapter$ViewType` |
| rampup | 69 | `com.duolingo.rampup.RampUpFabView`, `com.duolingo.rampup.RampUpIntroActivity`, `com.duolingo.rampup.RampUpTimerBoostView` |
| leagues | 64 | `com.duolingo.leagues.ContestScreenState`, `com.duolingo.leagues.LeagueRepairOfferViewModel`, `com.duolingo.leagues.LeagueRepairOfferViewModel$Companion$Origin` |
| settings | 59 | `com.duolingo.settings.EnableSocialFeaturesBottomSheetFragment`, `com.duolingo.settings.HourPickerView`, `com.duolingo.settings.ManageCoursesFragment` |
| speechrecognition | 48 | `com.duolingo.speechrecognition.data.AudioFormat`, `com.duolingo.speechrecognition.data.FlashcardsClientMessage`, `com.duolingo.speechrecognition.data.FlashcardsGradingRequest` |
| notifications | 45 | `com.duolingo.notifications.DelayedReminderWorker`, `com.duolingo.notifications.ExpireStalePushesWorker`, `com.duolingo.notifications.FcmIntentService` |
| maker | 44 | `com.duolingo.maker.audio.MultiSourceAudioPlayer$AudioType`, `com.duolingo.maker.data.AnimateEvent`, `com.duolingo.maker.data.AnimationCurve` |
| stories | 42 | `com.duolingo.stories.HardcodedStorySessionsDialogFragment`, `com.duolingo.stories.IncorrectPhase`, `com.duolingo.stories.StoriesArrangeOptionView` |
| duoradio | 40 | `com.duolingo.duoradio.DuoRadioArrangeChallengeFragment`, `com.duolingo.duoradio.DuoRadioBinaryChallengeFragment`, `com.duolingo.duoradio.DuoRadioBinaryComprehensionChallengeFragment` |
| explanations | 35 | `com.duolingo.explanations.AccurateWidthExplanationTextView`, `com.duolingo.explanations.AlphabetsTipActivity`, `com.duolingo.explanations.ExplanationAdapter$ViewType` |
| adventures | 33 | `com.duolingo.adventures.AdventuresChoiceImageFragment`, `com.duolingo.adventures.AdventuresChoiceTextFragment`, `com.duolingo.adventures.AdventuresEpisodeActivity` |
| chess | 33 | `com.duolingo.chess.gamereview.ChessGameReviewActivity`, `com.duolingo.chess.match.ChessMatchActivity`, `com.duolingo.chess.match.ChessMatchQuitBottomSheetFragment` |
| achievements | 29 | `com.duolingo.achievements.AchievementV4DetailFragment`, `com.duolingo.achievements.AchievementV4ProgressFragment`, `com.duolingo.achievements.AchievementV4RewardFragment` |
| report | 29 | `com.duolingo.report.ReportActivity`, `com.duolingo.report.ReportResultDialogFragment`, `com.duolingo.report.ReportViewModel` |
| shop | 29 | `com.duolingo.shop.ItemGetView`, `com.duolingo.shop.RewardedVideoAwardActivity`, `com.duolingo.shop.ShopItemDeleteParams` |
| energy | 27 | `com.duolingo.energy.EnergyDripConfirmationActivity`, `com.duolingo.energy.EnergyHookType`, `com.duolingo.energy.EnergyTracking$EnergyContext` |
| legendary | 26 | `com.duolingo.legendary.LegendaryAttemptPurchaseOrigin`, `com.duolingo.legendary.LegendaryCompleteSessionEndFragment`, `com.duolingo.legendary.LegendaryCompleteSessionEndViewModel` |
| messages | 26 | `com.duolingo.messages.HomeMessageBottomSheet`, `com.duolingo.messages.dialogs.AgeBackfillAgeInputActivity`, `com.duolingo.messages.dialogs.AgeBackfillHardWallBottomSheetScreenKey` |
| alphabets | 19 | `com.duolingo.alphabets.AlphabetsTabFragment`, `com.duolingo.alphabets.AlphabetsTipListActivity`, `com.duolingo.alphabets.kanaChart.AnimatingStrokeView` |
| rewards | 19 | `com.duolingo.rewards.AddFriendsRewardContext`, `com.duolingo.rewards.AddFriendsRewardsActivity`, `com.duolingo.rewards.AddFriendsRewardsTracking$AddFriendsHookScreen` |
| splash | 19 | `com.duolingo.splash.CombinedLaunchHomeBridge$SeamlessRouteDestination`, `com.duolingo.splash.IntroFlowFragment`, `com.duolingo.splash.IntroRedesignCondition` |
| share | 18 | `com.duolingo.share.ApplicationShareManager$SaveRole`, `com.duolingo.share.ImageShareBottomSheetV2`, `com.duolingo.share.ImageShareBottomSheetV2$Companion$ViewType` |
| liveevents | 15 | `com.duolingo.liveevents.EventsIndividualOptInIntroActivity`, `com.duolingo.liveevents.EventsIndividualSessionEndFragment`, `com.duolingo.liveevents.EventsSocialCollaborationIntroActivity` |
| grade | 14 | `com.duolingo.grade.model.Base`, `com.duolingo.grade.model.Blame`, `com.duolingo.grade.model.CompactForms` |
| mathgrade | 14 | `com.duolingo.mathgrade.api.model.MathEntity$ShapeNameType`, `com.duolingo.mathgrade.api.model.MathEntity$SymbolType`, `com.duolingo.mathgrade.api.model.MathEntity$UnitType` |
| androidmath | 9 | `com.duolingo.androidmath.MTMathView$MTMathViewMode`, `com.duolingo.androidmath.MTMathView$MTTextAlignment`, `com.duolingo.androidmath.parse.MTColumnAlignment` |
| music | 7 | `com.duolingo.music.instrumenttab.InstrumentTabFragment`, `com.duolingo.music.landing.SongLandingActivity`, `com.duolingo.music.licensed.LicensedSongCutoffPromoFragment` |
| ads | 6 | `com.duolingo.ads.BackendInterstitialAdDecisionRequest`, `com.duolingo.ads.LessonAdFragment` |
| excess | 5 | `com.duolingo.excess.android.ExcessEndpoint`, `com.duolingo.excess.android.userProperty.AnalyticsUserPropertyTracker$PostUserPropertyResult`, `com.duolingo.excess.android.userProperty.UserPropertyEndpoint` |
| promocode | 5 | `com.duolingo.promocode.QueryPromoCodeResponse$Status`, `com.duolingo.promocode.RedeemPromoCodeActivity`, `com.duolingo.promocode.RedeemPromoCodeFragment` |
| web | 5 | `com.duolingo.web.WebViewActivity` |
| user | 4 | `com.duolingo.user.RefreshLoggedInUserWorker`, `com.duolingo.user.ResurrectionUserActiveStartupTask$UpdateType` |
| xpboost | 4 | `com.duolingo.xpboost.XpBoostAnimatedRewardActivity`, `com.duolingo.xpboost.XpBoostAnimatedRewardFragment` |
| deeplinks | 3 | `com.duolingo.deeplinks.DeepLinkHandler$EmailType`, `com.duolingo.deeplinks.DeepLinkHandler$LegacyDeepLinkHost`, `com.duolingo.deeplinks.DeepLinks` |
| referral | 3 | `com.duolingo.referral.ReferralInterstitialActivity`, `com.duolingo.referral.ReferralInterstitialFragment` |
| wechat | 3 | `com.duolingo.wechat.WeChatFollowInstructionsActivity` |
| billing | 2 | `com.duolingo.billing.GooglePlayBillingManager$PurchaseFlow` |
| delaysignup | 2 | `com.duolingo.delaysignup.MarketingOptInFragment` |
| math | 2 | `com.duolingo.math.tutor.MathTutorActivity` |
| resurrection | 2 | `com.duolingo.resurrection.ResurrectionAppUpdateDialogFragment` |
| schools | 2 | `com.duolingo.schools.SchoolsClassroom`, `com.duolingo.schools.SchoolsClassrooms` |
| transliterations | 2 | `com.duolingo.transliterations.BlankableJuicyTransliterableTextView`, `com.duolingo.transliterations.TransliterationUtils$TransliterationToggleSource` |
| (root) | 1 |  |
| mathcalculator | 1 | `com.duolingo.mathcalculator.CursorType` |
| tieredchest | 1 | `com.duolingo.tieredchest.DailyQuestTieredChestsTreatmentContext` |

## Assets e manifesto

- 599 entradas em assets/, 16064096 bytes descomprimidos; 81 bibliotecas nativas.
- Extensoes: {'.list': 1, '.xml': 1, '.bundle': 5, '.hash': 1, '.json': 28, '.dat': 5, '(sem extensao)': 545, '.config': 1, '.unity3d': 1, '.prof': 1, '.profm': 1, '.ico': 1, '.css': 3, '.html': 2, '.js': 2, '.m4a': 1}.
- Manifesto decodificado preexistente: 40 permissoes; 477 componentes.
- Tipos: {'provider': 4, 'activity': 233, 'activity-alias': 210, 'receiver': 17, 'service': 13}.
- exported literal: {'true': 228, '(omitido)': 214, 'false': 35}. Omitido nao equivale a falso.
- Proveniencia: pre-existing Apktool decoded XML; not independently tied to APK by this inventory.

Permissoes declaradas nao demonstram concessao ou uso:

- `android.permission.READ_CALENDAR`
- `android.permission.WRITE_CALENDAR`
- `android.permission.INTERNET`
- `android.permission.ACCESS_NETWORK_STATE`
- `android.permission.FOREGROUND_SERVICE`
- `android.permission.VIBRATE`
- `android.permission.RECEIVE_BOOT_COMPLETED`
- `android.permission.DETECT_SCREEN_CAPTURE`
- `android.permission.GET_ACCOUNTS`
- `android.permission.RECORD_AUDIO`
- `android.permission.POST_NOTIFICATIONS`
- `android.permission.READ_EXTERNAL_STORAGE`
- `android.permission.READ_CONTACTS`
- `com.google.android.c2dm.permission.RECEIVE`
- `android.permission.MODIFY_AUDIO_SETTINGS`
- `android.permission.CAMERA`
- `android.permission.SCHEDULE_EXACT_ALARM`
- `android.permission.USE_FULL_SCREEN_INTENT`
- `android.permission.WRITE_EXTERNAL_STORAGE`
- `android.permission.USE_BIOMETRIC`
- `android.permission.USE_FINGERPRINT`
- `android.permission.WAKE_LOCK`
- `com.duolingo.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`
- `com.sec.android.provider.badge.permission.READ`
- `com.sec.android.provider.badge.permission.WRITE`
- `com.htc.launcher.permission.READ_SETTINGS`
- `com.htc.launcher.permission.UPDATE_SHORTCUT`
- `com.sonyericsson.home.permission.BROADCAST_BADGE`
- `com.sonymobile.home.permission.PROVIDER_INSERT_BADGE`
- `com.anddoes.launcher.permission.UPDATE_COUNT`
- `com.majeur.launcher.permission.UPDATE_BADGE`
- `com.huawei.android.launcher.permission.CHANGE_BADGE`
- `com.huawei.android.launcher.permission.READ_SETTINGS`
- `com.huawei.android.launcher.permission.WRITE_SETTINGS`
- `android.permission.READ_APP_BADGE`
- `com.oppo.launcher.permission.READ_SETTINGS`
- `com.oppo.launcher.permission.WRITE_SETTINGS`
- `me.everything.badger.permission.BADGE_COUNT_READ`
- `me.everything.badger.permission.BADGE_COUNT_WRITE`
- `android.permission.ACCESS_WIFI_STATE`

## Descoberta smali

91761 arquivos; 558143165 bytes. Categorias por correspondencia literal, sobrepostas, incluindo dependencias e codigo gerado/ofuscado. Listas limitadas a 30 candidatos por categoria; hashes preservados no JSON.

| Categoria literal | Arquivos correspondentes |
|---|---:|
| lesson | 4886 |
| progress | 2225 |
| streak | 2736 |
| retention | 580 |
| notifications | 1016 |
| telemetry | 339 |
| experiments | 1899 |
| purchases | 2561 |
| location | 55 |
| network | 1178 |

## Limites

- Static decompiler observations do not establish runtime behavior; the APK is never executed.
- Method signatures use provider display types; exact DEX descriptors and instruction offsets are unavailable. Overload indices are local to this engine and artifact.
- Class inventories use parsed metadata before code generation, including synthetic members that may be omitted from decompiled source. Source positions remain unknown.
- Manifest summary fields are extracted by the upstream engine; decoded XML is retained for verification. APK signatures, split APKs, native libraries and Android runtime capture are not verified by this provider.
- Literal matching is candidate discovery, not verified behavior.
- Counts include SDKs, generated code, unused code and obfuscated classes.
- URLs were not requested. No APK execution.
- Candidate lists capped at 30 per category; file scanning itself exhaustive over encountered .smali files.
- Nome Premium nao prova origem oficial, assinatura, licenca ou recursos desbloqueados.
- Manifesto e smali preexistentes nao foram independentemente vinculados ao APK nesta etapa.
- Nomes de classes nao demonstram comportamento. Nenhum APK executado.
- Contagens DEX, smali e JADX medem unidades diferentes.
- Somente metadados foram copiados; nenhum codigo ou conteudo de assets.

Nenhum servidor, curso completo, compra, chamada de video ou fluxo de interface foi verificado nesta etapa. O catalogo contem somente nomes e metadados; nao reproduz implementacao proprietaria.

## Proveniencia

- `../../audit-2026-10-19/classes-duolingo.json` SHA-256 `06913a2371d4d482a13598320f33cb37f3ce164f04723d5cdd9a37f3160ff0d9`.
- `../../audit-2026-10-19/zip-inventory.json` SHA-256 `ade2e30e6ca0e88a657617e60f931379947b52f4398f139a3367b3cb277d18a2`.
- `../../audit-2026-10-19/manifest-components.json` SHA-256 `83bc1bc7a1f23bfa4ccc4997ab367bba41cd427dbf9afb5a1962043dfe53c6c3`.
- `../../audit-2026-10-19/smali-index.json` SHA-256 `6b8a817085f33109fbc756129851564f17d219909483cfc6b6d13eac80a682d2`.
