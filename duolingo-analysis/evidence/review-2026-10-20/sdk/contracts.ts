/**
 * Contratos documentais originais de um SDK independente de aprendizado.
 * Não são API do Duolingo, não implementam transporte e não são runtime REA.
 * Todos os valores recebidos externamente exigem validação de fronteira.
 */
export type Id = string;
export type Revision = string;
/** Instante UTC ISO 8601; validado na fronteira. */
export type Instant = string;
/** Data civil ISO yyyy-mm-dd; não representa instante nem duração. */
export type LocalDate = string;

export type ErrorCode =
  | "invalid_input" | "not_found" | "unauthorized" | "forbidden"
  | "conflict" | "resource_exhausted" | "unsupported"
  | "unavailable" | "cancelled";

export interface SdkError {
  code: ErrorCode;
  message: string;
  retryable: boolean;
  operationId?: Id;
  /** Preserva detalhes estruturados; não deve conter credenciais de transporte. */
  details?: Readonly<Record<string, unknown>>;
}

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: SdkError };

export interface CallOptions {
  signal?: AbortSignal;
}

export interface MutationOptions extends CallOptions {
  idempotencyKey: string;
}

export interface Course {
  id: Id;
  revision: Revision;
  subject: "language" | "math" | "music" | "chess";
  uiLocale: string;
  learningLocale?: string;
  title: string;
  sections: readonly Section[];
}

export interface Section {
  id: Id;
  title: string;
  units: readonly Unit[];
}

export interface Unit {
  id: Id;
  title: string;
  objectiveIds: readonly Id[];
  nodes: readonly PathNode[];
}

export interface PathNode {
  id: Id;
  kind: "lesson" | "practice" | "story" | "checkpoint";
  prerequisiteNodeIds: readonly Id[];
  lessonBlueprintIds: readonly Id[];
}

export interface Progress {
  userId: Id;
  courseId: Id;
  courseRevision: Revision;
  revision: Revision;
  nodes: readonly {
    nodeId: Id;
    state: "locked" | "available" | "in_progress" | "completed";
    completedAt?: Instant;
  }[];
}

export interface MediaRef {
  id: Id;
  /** Endereço do novo produto ou URI local explicitamente selecionada. */
  uri: string;
  sha256: string;
  bytes: number;
  mimeType: string;
  durationMs?: number;
}

export interface ChallengeBase {
  id: Id;
  revision: Revision;
  objectiveIds: readonly Id[];
  prompt: string;
  locale: string;
  media: readonly MediaRef[];
}

/** Payload público sem chave de respostas; nomes são novos. */
export type Challenge = ChallengeBase & (
  | { kind: "translate_text"; sourceText: string; targetLocale: string }
  | { kind: "arrange_tokens"; tokens: readonly { id: Id; text: string }[] }
  | { kind: "select_choice"; choices: readonly { id: Id; text: string }[] }
  | { kind: "fill_blank"; segments: readonly (
      { kind: "text"; text: string } | { kind: "blank"; id: Id }
    )[] }
  | { kind: "match_pairs"; left: readonly { id: Id; text: string }[];
      right: readonly { id: Id; text: string }[] }
  | { kind: "listen_type"; audio: MediaRef }
  | { kind: "speak"; text: string; recordingMaxMs: number }
  | { kind: "read_story"; sceneId: Id; stepId: Id; text: string }
  | { kind: "math_input"; notation: "plain" | "latex"; expression: string }
  | { kind: "music_performance"; scoreId: Id; tempoBpm: number }
  | { kind: "chess_move"; positionFen: string }
);

/** Resposta carrega sua modalidade; compatibilidade também é validada em runtime. */
export type Answer =
  | { kind: "text"; text: string }
  | { kind: "tokens"; tokenIds: readonly Id[] }
  | { kind: "choice"; choiceId: Id }
  | { kind: "blanks"; values: Readonly<Record<Id, string>> }
  | { kind: "pairs"; pairs: readonly { leftId: Id; rightId: Id }[] }
  | { kind: "speech"; recording: MediaRef }
  | { kind: "story_step"; stepId: Id; response: string }
  | { kind: "math"; expression: string; unit?: string }
  | { kind: "music"; events: readonly { midiNote: number; atMs: number;
      durationMs: number }[] }
  | { kind: "chess"; moveUci: string };

export interface AttemptInput {
  attemptId: Id;
  challengeId: Id;
  challengeRevision: Revision;
  expectedSessionRevision: Revision;
  answer: Answer;
  answeredAt: Instant;
  elapsedMs: number;
}

export type Evaluation =
  | { status: "correct" | "incorrect" | "partially_correct";
      evaluatorRevision: Revision; message?: string;
      normalizedAnswer?: Answer; confidence?: number }
  | { status: "needs_review"; reason: string; evaluatorRevision: Revision }
  | { status: "unavailable"; reason: string };

export interface AttemptReceipt {
  attemptId: Id;
  operationId: Id;
  sessionRevision: Revision;
  evaluation: Evaluation;
  nextCursor: string | null;
}

export type SessionState =
  | "created" | "active" | "finishing" | "completed"
  | "abandoned" | "expired";

export interface Session {
  id: Id;
  userId: Id;
  courseId: Id;
  courseRevision: Revision;
  revision: Revision;
  policyRevision: Revision;
  state: SessionState;
  cursor: string | null;
  createdAt: Instant;
  expiresAt: Instant | null;
}

export interface CreateSessionInput {
  userId: Id;
  courseId: Id;
  courseRevision: Revision;
  goal:
    | { kind: "path_node"; nodeId: Id }
    | { kind: "review"; objectiveIds: readonly Id[] };
  excludedModalities: readonly Challenge["kind"][];
}

export interface RewardEntry {
  id: Id;
  sourceOperationId: Id;
  policyRevision: Revision;
  unit: "xp" | "coin" | "streak_protection";
  delta: number;
  reason: string;
  issuedAt: Instant;
}

export interface CompletionReceipt {
  id: Id;
  operationId: Id;
  sessionId: Id;
  completedAt: Instant;
  qualifiedLocalDate: LocalDate | null;
  timeZone: string;
  rewards: readonly RewardEntry[];
  progressRevision: Revision;
}

export type AccessResource =
  | { kind: "none"; policyRevision: Revision }
  | { kind: "hearts" | "energy"; policyRevision: Revision;
      available: number; reserved: number; capacity: number;
      nextRefillAt: Instant | null };

export interface ReminderPolicy {
  enabled: boolean;
  timeZone: string;
  localTime: string;
  daysOfWeek: readonly number[];
  quietHours: { startLocalTime: string; endLocalTime: string } | null;
  maxPerDay: number;
  channel: "push" | "email" | "local";
  locale: string;
}

export type OperationResult =
  | { state: "pending"; id: Id }
  | { state: "attempt_recorded"; id: Id; receipt: AttemptReceipt }
  | { state: "session_created"; id: Id; session: Session }
  | { state: "session_completed"; id: Id; receipt: CompletionReceipt }
  | { state: "session_abandoned"; id: Id; session: Session }
  | { state: "failed"; id: Id; error: SdkError };

/** Contrato de referência; nenhuma implementação acompanha esta especificação. */
export interface LearningSdk {
  getCourse(id: Id, revision?: Revision,
    options?: CallOptions): Promise<Result<Course>>;
  getProgress(userId: Id, courseId: Id,
    options?: CallOptions): Promise<Result<Progress>>;
  createSession(input: CreateSessionInput,
    options: MutationOptions): Promise<Result<Session>>;
  getChallenge(sessionId: Id, cursor: string,
    options?: CallOptions): Promise<Result<Challenge>>;
  submitAttempt(sessionId: Id, input: AttemptInput,
    options: MutationOptions): Promise<Result<AttemptReceipt>>;
  finishSession(sessionId: Id, expectedRevision: Revision,
    options: MutationOptions): Promise<Result<CompletionReceipt>>;
  abandonSession(sessionId: Id, expectedRevision: Revision, reason: string,
    options: MutationOptions): Promise<Result<Session>>;
  getOperation(operationId: Id,
    options?: CallOptions): Promise<Result<OperationResult>>;
}
