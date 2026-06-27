export interface User {
  id: string;
  username: string;
  email?: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export interface Admin extends User {
  permissions: string[];
}

export interface LoginRequest {
  username: string;
  password?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Paragraph {
  id: string;
  section_id: string;
  content: string;
  order: number;
  word_count: number;
  created_at?: string;
}

export interface ReadingSection {
  id: string;
  condition_id: string;
  title: string;
  content: string;
  order: number;
  paragraphs?: Paragraph[];
  created_at?: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  prompt: string;
  options: string[];
  correct_option_index: number;
  explanation?: string;
  order: number;
}

export interface Quiz {
  id: string;
  section_id: string;
  title: string;
  questions?: Question[];
  created_at?: string;
}

export interface Condition {
  id: string;
  experiment_version_id: string;
  name: string;
  description?: string;
  ai_model: string;
  system_prompt?: string;
  intervention_threshold?: number;
  reading_sections?: ReadingSection[];
  quizzes?: Quiz[];
  created_at?: string;
}

export interface ExperimentVersion {
  id: string;
  experiment_id: string;
  version_number: number;
  status: 'draft' | 'published' | 'archived';
  config: Record<string, unknown>;
  conditions?: Condition[];
  created_at?: string;
  published_at?: string;
}

export interface Experiment {
  id: string;
  title: string;
  description?: string;
  author_id: string;
  current_version?: ExperimentVersion;
  versions?: ExperimentVersion[];
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  external_id?: string;
  demographics?: Record<string, unknown>;
  enrolled_at: string;
}

export interface Session {
  id: string;
  participant_id: string;
  experiment_id: string;
  condition_id: string;
  status: 'active' | 'completed' | 'interrupted' | 'abandoned';
  started_at: string;
  completed_at?: string;
  metadata?: Record<string, unknown>;
}

export interface AIIntervention {
  id: string;
  session_id: string;
  paragraph_id: string;
  trigger_reason: string;
  prompt_sent: string;
  response_generated: string;
  latency_ms: number;
  created_at: string;
}

export interface DashboardSummary {
  total_participants: number;
  completed_participants: number;
  active_participants: number;
  interrupted_sessions: number;
  avg_experiment_duration: number;
}

export interface Analytics {
  experiment_id: string;
  total_sessions: number;
  completion_rate: number;
  average_comprehension_score: number;
  total_interventions: number;
  average_intervention_latency: number;
  metrics_by_condition: Record<string, Record<string, unknown>>;
}

export interface HealthResponse {
  status: string;
  database: string;
  timestamp: string;
  version?: string;
}
