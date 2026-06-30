'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import type { Experiment, ReadingSection, Paragraph } from '@/types/api';

// ─── Complex words per paragraph (v1 reference) ─────────────────────────────
// These are the technical/domain terms that warrant a vocabulary pop-up when
// the cursor pauses on them for 4-5 seconds.
const COMPLEX_WORDS: Record<string, string[]> = {
  p_1: ['footprint', 'artificial intelligence', 'incorporated'],
  p_2: ['paradigm', 'algorithm', 'elusive', 'penalizing', 'thorny', 'top-down', 'bottom-up', 'unlabelled'],
  p_3: ['transformer', 'neural network', 'agentic', 'unstructured', 'nuance', 'autonomy', 'statistical prediction'],
  p_4: ['actuators', 'reinforcement learning', 'hybrid architectures', 'sensors', 'perceive', 'realm of atoms'],
  p_5: ['vector embeddings', 'cosine similarity', 'retrieval-augmented', 'vector database', 'embeddings'],
  p_6: ['exploitation', 'exploration', 'markov decision process', 'cumulative reward', 'policy', 'value function', 'iteratively'],
};

export const V1_PARAGRAPHS: Paragraph[] = [
  {
    id: 'p_1',
    section_id: 'sec_1',
    order: 1,
    word_count: 76,
    content: "Artificial Intelligence (AI) has a rich history and a rapidly expanding footprint. The term 'Artificial Intelligence' itself was first mentioned as early as 1956! Today, AI can beat world chess champions, Go champions, and even video game champions. Beyond gaming, there is some AI that can tell stories, create music, or even paint. According to industry experts, artificial intelligence will be incorporated into nearly all work and industries by the year 2030.",
    quiz: {
      question: "According to the text, by which year do experts predict AI will be incorporated into nearly all industries?",
      options: ["1956", "2024", "2030", "2050"],
      answer: 2
    }
  },
  {
    id: 'p_2',
    section_id: 'sec_1',
    order: 2,
    word_count: 112,
    content: "Machine learning, or artificial intelligence (AI), is a paradigm of computing in which the algorithm 'learns' from the top down rather than being designed from the bottom up. The top-down approach is achieved by letting the algorithm try solutions, rewarding it for good behaviour, and penalizing it for bad behaviour — a primitive form of 'learning.' Ideally, the algorithm becomes capable of correctly identifying the content of unseen and unlabelled pictures. Because the algorithm is not designed to carry out steps known to solve the problem, it often doesn't — and even when it does, the reason it makes any particular decision is elusive, underscoring the thorny problem of AI safety.",
    quiz: {
      question: "Why does machine learning present a challenging or 'thorny' problem for AI safety?",
      options: ["It cannot correctly process unseen or unlabelled images.", "It relies strictly on rigid bottom-up software design frameworks.", "The inner mathematical reasons behind its specific decisions are elusive and hard to trace.", "It is incapable of learning from performance penalties."],
      answer: 2
    }
  },
  {
    id: 'p_3',
    section_id: 'sec_1',
    order: 3,
    word_count: 191,
    content: "Large language models (LLMs) are a category of deep learning models trained on immense amounts of data, making them capable of understanding and generating natural language and other types of content to perform a wide range of tasks. LLMs are built on a type of neural network architecture called a transformer which excels at handling sequences of words and capturing patterns in text. LLMs work as giant statistical prediction machines that repeatedly predict the next word in a sequence. They learn patterns in their text and generate language that follows those patterns. LLMs represent a major leap in how humans interact with technology because they are the first AI system that can handle unstructured human language at scale, allowing for natural communication with machines. Where traditional search engines and other programmed systems used algorithms to match keywords, LLMs capture deeper context, nuance and reasoning. LLMs, once trained, can adapt to many applications that involve interpreting text, like summarizing an article, debugging code or drafting a legal clause. When given agentic capabilities, LLMs can perform, with varying degrees of autonomy, various tasks that would otherwise be performed by humans.",
    quiz: {
      question: "What structural capability allows LLMs to outperform traditional keyword-matching search engines?",
      options: ["They execute processing cycles faster.", "They capture deep contextual meaning, linguistic nuance, and reasoning structures.", "They avoid using neural networks.", "They store pre-written conversational template scripts."],
      answer: 1
    }
  },
  {
    id: 'p_4',
    section_id: 'sec_1',
    order: 4,
    word_count: 153,
    content: "Physical AI refers to artificial intelligence systems that operate in and interact with the physical world, rather than existing only in software or digital environments. Physical AI typically involves the combination of AI models with sensors, actuators and other control systems that allow models to act upon real-world environments, taking models from the realm of bits to the realm of atoms. With AI, advanced physical systems can now perceive the environment, reason with the power of a large language model (LLM), act accordingly, and then learn from the outcome of that action. In contrast, robotic AI agents equipped with general understanding from LLMs have a limited but still powerful 'common sense' about the world. These models can be paired with reinforcement learning techniques in high-performance hybrid architectures so that robots can possess both general knowledge and a specialized understanding of a specific use case.",
    quiz: {
      question: "According to the text, what does pairing an LLM with reinforcement learning allow a robot to possess?",
      options: ["Infinite battery life and memory storage configurations.", "Both broad general world knowledge and a specialized functional skill set.", "A complete shift from hardware components to software applications.", "An automated sequence that skips sensor readings entirely."],
      answer: 1
    }
  },
  {
    id: 'p_5',
    section_id: 'sec_1',
    order: 5,
    word_count: 114,
    content: "Retrieval-Augmented Generation (RAG) is a technique that gives a Large Language Model (LLM) access to outside information to make its answers more accurate. First, a business's documents are split into smaller text chunks and converted into math formulas called vector embeddings. These embeddings capture the core meaning of the text and are saved in a vector database. When a user asks a question, the system searches this database for the closest matching text chunks using mathematical formulas like Cosine Similarity. Finally, the system merges the user's question with these retrieved facts and feeds them into the LLM, allowing the model to write a highly accurate answer based on real data instead of guessing.",
    quiz: {
      question: "How does a RAG pipeline ensure an LLM writes an accurate response instead of guessing?",
      options: ["By changing the source programming language of the framework.", "By forcing the system to random-search online engines.", "By retrieving matching text chunks from an embedding database and feeding those verified facts directly into the model context.", "By limiting the user's prompt window query size."],
      answer: 2
    }
  },
  {
    id: 'p_6',
    section_id: 'sec_1',
    order: 6,
    word_count: 122,
    content: "Working of Reinforcement Learning: The agent interacts iteratively with its environment in a feedback loop. The agent observes the current state of the environment. It chooses and performs an action based on its policy. The environment responds by transitioning to a new state and providing a reward (or penalty). The agent updates its knowledge (policy, value function) based on the reward received and the new state. This cycle repeats with the agent balancing exploration (trying new actions) and exploitation (using known good actions) to maximize the cumulative reward over time. This process is mathematically framed as a Markov Decision Process (MDP) where future states depend only on the current state and action, not on the prior sequence of events.",
    quiz: {
      question: "What core independence rule defines a Markov Decision Process (MDP)?",
      options: ["Future outcomes are independent of the current state or choice.", "Future states depend strictly on the current state-action pair, ignoring historical paths.", "The agent must prioritize exploration over exploitation in every loop.", "Rewards cannot be calculated using numerical parameters."],
      answer: 1
    }
  }
];

const SUPPORT_TEXTS: Record<string, Record<string, string>> = {
  p_1: {
    A_definition: "Vocabulary Help: 'Footprint' refers to AI's expanding impact across society. 'Go' is a highly complex strategic board game requiring deep intuition.",
    B_summary: "Summary Highlight: AI originated in 1956, surpassed humans in games and creative fields, and is predicted to transform nearly all industries by 2030.",
    C_rephrase: "Simple Rephrase: AI started decades ago and grew fast. Today it wins world championships and creates art. Experts believe AI will be part of almost every job by 2030.",
    D_analogy: "Relatable Analogy: Think of AI like electricity in the early 1900s—starting out powering simple lightbulbs (chess games), but soon running factories and entire cities (all industries by 2030)."
  },
  p_2: {
    A_definition: "Vocabulary Help: 'Top-down' means learning by trial and error toward a goal, rather than following rigid step-by-step code ('bottom-up'). 'Elusive' means difficult to trace or explain.",
    B_summary: "Summary Highlight: Machine learning trains algorithms through rewards and penalties. Because internal decision pathways aren't explicitly programmed, tracing why it makes choices is difficult, raising safety concerns.",
    C_rephrase: "Simple Rephrase: Instead of giving AI exact step-by-step instructions, we reward it when it gets things right. Because it figures out its own rules, we often don't know how it reached a conclusion, which can be risky.",
    D_analogy: "Relatable Analogy: It's like teaching a dog tricks by giving treats. The dog learns what gets a treat, but you can't read the dog's mind to know the exact reasoning it used to jump."
  },
  p_3: {
    A_definition: "Vocabulary Help: 'Transformer' is a neural network architecture optimized for processing word patterns. 'Agentic capabilities' refers to AI autonomously planning and executing complex tasks.",
    B_summary: "Summary Highlight: LLMs use transformer networks to predict word sequences from massive datasets. Understanding nuance and context beyond keywords, they enable natural communication and autonomous agent workflows.",
    C_rephrase: "Simple Rephrase: Large language models learn pattern rules from huge amounts of text so they can guess the next word. This lets them understand context and talk naturally with us, rather than just matching exact keywords.",
    D_analogy: "Relatable Analogy: Imagine a master text autocomplete built by reading millions of books. It understands conversational flow so well that it can complete thoughts, summarize articles, and act as a smart assistant."
  },
  p_4: {
    A_definition: "Vocabulary Help: 'Actuators' are physical motors or mechanisms that enable robotic movement. 'Reinforcement learning' trains software through continuous physical feedback and environmental interaction.",
    B_summary: "Summary Highlight: Physical AI connects AI models with sensors and motors to operate in the real world. Hybrid architectures pair LLM general knowledge with reinforcement learning for specialized physical skills.",
    C_rephrase: "Simple Rephrase: Physical AI puts AI into robotic bodies using cameras and motors. By combining general AI brainpower with physical practice, robots can understand the world and perform specific physical tasks.",
    D_analogy: "Relatable Analogy: Having an LLM is like reading an encyclopedia on how to ride a bike (general sense). Reinforcement learning is actually getting on the bike and practicing until your muscles master the skill."
  },
  p_5: {
    A_definition: "Vocabulary Help: 'Vector embeddings' are mathematical arrays representing text meaning. 'Cosine Similarity' calculates how closely two vector meanings match in a database.",
    B_summary: "Summary Highlight: RAG improves LLM accuracy by splitting documents into searchable meaning vectors. When queried, it retrieves verified facts first and feeds them to the LLM to eliminate guessing.",
    C_rephrase: "Simple Rephrase: RAG gives AI an open textbook. Before answering your question, it searches a database for relevant facts and uses that verified info to write the answer, avoiding made-up statements.",
    D_analogy: "Relatable Analogy: Instead of taking a closed-book exam from memory (where you might guess), RAG lets the AI look up exact notes in an index card file before writing down the final answer."
  },
  p_6: {
    A_definition: "Vocabulary Help: 'Exploration' is trying unfamiliar actions to discover new rewards. 'Exploitation' is using known reliable actions. 'Markov Decision Process' assumes the next state depends solely on the current state.",
    B_summary: "Summary Highlight: Reinforcement learning operates in a feedback loop of actions, state transitions, and rewards. Balancing exploration and exploitation, it optimizes cumulative rewards under the Markov Decision Process rule.",
    C_rephrase: "Simple Rephrase: An AI agent learns by taking actions in an environment and seeing if it gets a reward or penalty. It balances trying new things with repeating what works, focusing only on the current situation.",
    D_analogy: "Relatable Analogy: Navigating a new video game level—you sometimes explore dark corners for hidden treasure (exploration) and sometimes stick to the safe, known path to keep your health high (exploitation)."
  }
};

export interface ParaStat {
  wordCount: number;
  dwellMs: number;
  rereadCount: number;
  backtrackCount: number;
  cursorStops: number;
  cursorStopNearComplexWord: boolean; // was the last idle near a complex word?
  mouseSpeeds: number[];
  struggleAccumulator: number;
  isRereadLockActive: boolean;
}

export interface InterventionLogItem {
  arm: string;
  struggle_type: string;
  accepted: boolean | null;
  support_text: string;
}

export const useReadingSession = (participantCode: string, initialSectionId?: string) => {
  const router = useRouter();
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');

  const [activeSectionId, setActiveSectionId] = useState<string>(initialSectionId || 'sec_1');
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState<boolean>(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState<boolean>(false);

  // Active paragraph in vertical view
  const [activeParaId, setActiveParaId] = useState<string | null>('p_1');
  const activeParaIdRef = useRef<string | null>('p_1');

  // Fine-grained telemetry stats matching v1
  const [paraStats, setParaStats] = useState<Record<string, ParaStat>>(() => {
    const init: Record<string, ParaStat> = {};
    V1_PARAGRAPHS.forEach(p => {
      init[p.id] = {
        wordCount: p.word_count,
        dwellMs: 0,
        rereadCount: 0,
        backtrackCount: 0,
        cursorStops: 0,
        cursorStopNearComplexWord: false,
        mouseSpeeds: [],
        struggleAccumulator: 0,
        isRereadLockActive: false,
      };
    });
    return init;
  });
  const paraStatsRef = useRef(paraStats);

  // AI Intervention logs per paragraph
  const [interventionLog, setInterventionLog] = useState<Record<string, InterventionLogItem>>({});
  const interventionLogRef = useRef(interventionLog);

  // Legacy state preservation for backward compatibility with existing components
  const [paragraphDwellTimes, setParagraphDwellTimes] = useState<Record<string, number>>({});
  const dwellTimesRef = useRef<Record<string, number>>({});
  const [backtrackCount, setBacktrackCount] = useState<number>(0);
  const [paragraphVisits, setParagraphVisits] = useState<Record<string, number>>({});
  const flushAnalyticsRef = useRef<any>(null);
  const [cursorIdleSeconds, setCursorIdleSeconds] = useState<number>(0);
  const [cursorIdleEpisodes, setCursorIdleEpisodes] = useState<number>(0);
  const [longestIdleDuration, setLongestIdleDuration] = useState<number>(0);

  // Telemetry pointers
  const lastMousePosRef = useRef({ x: 0, y: 0, time: Date.now(), maxY: 0 });
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isReadingStartedRef = useRef(false);
  // Track consecutive idle ticks near a complex word for vocab trigger (need 4-5s = 3 ticks @ 1.5s)
  const complexWordIdleTicksRef = useRef(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['participantSession', participantCode],
    queryFn: async () => {
      try {
        const statusRes = await apiClient.get<{ participant_id: string; experiment_id: string; session_id: string }>(`/api/participant/status/${participantCode}`);
        const expRes = await apiClient.get<Experiment>(`/api/cms/experiment/${statusRes.experiment_id || 1}`);
        return { status: statusRes, experiment: expRes };
      } catch {
        const mockExp: Experiment = {
          id: 'exp_runtime_1',
          title: 'Modern AI Paradigms: Core Concepts, Language Models, and Reinforcement Learning',
          description: 'Evaluating dynamic AI interventions on reading comprehension.',
          author_id: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          current_version: {
            id: 'v_1',
            experiment_id: 'exp_runtime_1',
            version_number: 1,
            status: 'published',
            config: {},
            conditions: [
              {
                id: 'cond_1',
                experiment_version_id: 'v_1',
                name: 'Experimental AI Cohort',
                ai_model: 'gpt-4o',
                reading_sections: [
                  {
                    id: 'sec_1',
                    condition_id: 'cond_1',
                    title: 'Modern AI Paradigms: Core Concepts, Language Models, and Reinforcement Learning',
                    content: '',
                    order: 1,
                    paragraphs: V1_PARAGRAPHS,
                  }
                ],
              },
            ],
          },
        };
        return {
          status: { participant_id: participantCode, experiment_id: 'exp_runtime_1', session_id: `${participantCode}` },
          experiment: mockExp,
        };
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const sections: ReadingSection[] = [
    {
      id: 'sec_1',
      condition_id: 'cond_1',
      title: 'Modern AI Paradigms: Core Concepts, Language Models, and Reinforcement Learning',
      content: '',
      order: 1,
      paragraphs: V1_PARAGRAPHS,
    }
  ];
  const activeSection = sections[0];
  const paragraphs = V1_PARAGRAPHS;

  // Sync refs
  useEffect(() => { activeParaIdRef.current = activeParaId; }, [activeParaId]);
  useEffect(() => { paraStatsRef.current = paraStats; }, [paraStats]);
  useEffect(() => { interventionLogRef.current = interventionLog; }, [interventionLog]);

  // Helper to retrieve participant name from localStorage
  const getParticipantName = useCallback(() => {
    if (typeof window === 'undefined') return '';
    try {
      const demoStr = localStorage.getItem(`aarrp_demographics_${participantCode}`);
      if (demoStr) return JSON.parse(demoStr).name || '';
    } catch (e) {}
    return '';
  }, [participantCode]);

  // ─── SUPABASE SYNC: send telemetry events to the backend ──────────────────
  const flushTelemetryToBackend = useCallback(async (eventType: string, extra?: Record<string, unknown>) => {
    const pid = activeParaIdRef.current;
    const stats = pid ? paraStatsRef.current[pid] : null;
    const pName = getParticipantName();
    const payload = {
      events: [{
        event_type: eventType,
        participant_id: participantCode,
        participant_name: pName,
        session_id: `${participantCode}`,
        section_id: 'sec_1',
        paragraph_id: pid || undefined,
        dwell_time_s: stats ? Math.round(stats.dwellMs / 1000) : 0,
        visit_count: stats ? stats.rereadCount + 1 : 1,
        backtrack_count: stats?.backtrackCount || 0,
        cursor_idle_seconds: Math.round(cursorIdleSeconds),
        cursor_idle_episodes: stats?.cursorStops || 0,
        longest_idle_s: 0,
        raw_metadata: { ...extra, paraStats: stats },
        timestamp: new Date().toISOString(),
      }]
    };
    try {
      await apiClient.post('/api/analytics/telemetry/batch', payload);
    } catch (err) {
      console.warn('[Supabase Sync] Telemetry flush failed (backend may be offline):', err);
    }
  }, [participantCode, cursorIdleSeconds]);

  const logEvent = useCallback((type: string, extra?: Record<string, unknown>) => {
    console.debug(`[Telemetry Event] ${type}`, { paragraph_id: activeParaIdRef.current, ...extra });
    // Fire-and-forget sync to Supabase on key events
    if (['intervention_assigned', 'intervention_feedback', 'session_completed', 'backtrack_detected', 'reread_detected'].includes(type)) {
      flushTelemetryToBackend(type, extra);
    }
  }, [flushTelemetryToBackend]);

  // ─── v1 TRIGGER RULES (FIXED) ─────────────────────────────────────────────
  //
  // Rule 1 — VOCABULARY (A_definition):
  //   Cursor pauses for 4-5 seconds near a COMPLEX word (not a simple word).
  //   Detected via consecutive idle ticks (each 1.5s) near a complex word span.
  //
  // Rule 2 — SUMMARY (B_summary):
  //   User is "stuck" on a paragraph — dwells beyond expected time after
  //   reading only ~4-5 words worth of content (very slow WPM < 40).
  //
  // Rule 3 — REPHRASE (C_rephrase):
  //   User rereads the same paragraph 2 or more times.
  //
  // Rule 4 — ANALOGY (D_analogy):
  //   Fallback when general struggle is detected but no specific pattern above.
  //

  const classifyStruggleType = useCallback((paraId: string): string => {
    const s = paraStatsRef.current[paraId];
    if (!s) return "general";

    // Rule 3: Reread >= 2 → REPHRASE (highest priority per v1)
    if (s.rereadCount >= 2) return "reread";

    // Rule 1: Cursor stopped near a complex word for 4-5s → VOCABULARY
    if (s.cursorStopNearComplexWord) return "complex_word_pause";

    // Rule 2: Stuck / paused after reading ~4-5 words → SUMMARY
    if (s.cursorStops >= 1 || s.dwellMs >= 6000) {
      if (s.backtrackCount < 2) return "slow_stuck";
    }

    // Rule 4: Backtracks / slow reading
    if (s.backtrackCount >= 2) return "backtrack";

    return "general";
  }, []);

  // Trigger the correct intervention ARM based on classified struggle
  const triggerArmForParagraph = useCallback((paraId: string, customArm?: string) => {
    if (interventionLogRef.current[paraId]) return;

    const struggleType = classifyStruggleType(paraId);
    let arm = customArm;
    if (!arm) {
      switch (struggleType) {
        case "complex_word_pause":
          arm = "A_definition";   // Vocabulary help for complex word pause
          break;
        case "slow_stuck":
          arm = "B_summary";      // Summary when stuck after 4-5 words
          break;
        case "reread":
          arm = "C_rephrase";     // Rephrase when rereading 2+ times (v1!)
          break;
        case "backtrack":
          arm = "D_analogy";      // Analogy for heavy backtracking
          break;
        default:
          arm = "D_analogy";      // Fallback
          break;
      }
    }

    const supportText = SUPPORT_TEXTS[paraId]?.[arm] || "Adaptive AI Scaffolding: Pay close attention to the core concepts and causal connections in this paragraph.";

    setInterventionLog(prev => ({
      ...prev,
      [paraId]: { arm: arm!, struggle_type: struggleType, accepted: null, support_text: supportText }
    }));
    logEvent("intervention_assigned", { arm, struggle_type: struggleType, paragraph_id: paraId });
  }, [classifyStruggleType, logEvent]);

  // ─── Helper: check if cursor is near a complex word in the DOM ─────────────
  const isCursorNearComplexWord = useCallback((x: number, y: number, paraId: string): boolean => {
    const complexTerms = COMPLEX_WORDS[paraId];
    if (!complexTerms || complexTerms.length === 0) return false;

    const el = document.elementFromPoint(x, y);
    if (!el) return false;

    const textContent = (el.textContent || '').toLowerCase();
    return complexTerms.some(term => textContent.includes(term.toLowerCase()));
  }, []);

  // Clock tick interval (1 second)
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);

      const pid = activeParaIdRef.current;
      if (pid && isReadingStartedRef.current) {
        setParaStats(prev => {
          const current = prev[pid] || { wordCount: 100, dwellMs: 0, rereadCount: 0, backtrackCount: 0, cursorStops: 0, cursorStopNearComplexWord: false, mouseSpeeds: [], struggleAccumulator: 0, isRereadLockActive: false };
          const newDwell = current.dwellMs + 1000;
          const updated = { ...prev, [pid]: { ...current, dwellMs: newDwell } };
          paraStatsRef.current = updated;
          return updated;
        });

        setParagraphDwellTimes(prev => ({ ...prev, [pid]: (prev[pid] || 0) + 1 }));

        // ─── v1 TRIGGER EVALUATION ────────────────────────────────────
        if (!interventionLogRef.current[pid]) {
          const s = paraStatsRef.current[pid];
          if (!s) return;

          const idleSec = (Date.now() - lastMousePosRef.current.time) / 1000;
          const nearComplex = isCursorNearComplexWord(lastMousePosRef.current.x, lastMousePosRef.current.y, pid);

          // Rule 3 check: reread >= 2 → instant trigger for REPHRASE
          if (s.rereadCount >= 2) {
            setTimeout(() => triggerArmForParagraph(pid, "C_rephrase"), 10);
            return;
          }

          // Rule 1 check: complex word pause (idle 4+ sec near complex word)
          if (nearComplex && idleSec >= 4) {
            setTimeout(() => triggerArmForParagraph(pid, "A_definition"), 10);
            return;
          }

          // Rule 2 check: stuck after ~4-5 words (idle 4+ sec on normal word or dwell >= 6s with stops)
          if (!nearComplex && (idleSec >= 4 || (s.dwellMs >= 6000 && s.cursorStops >= 1))) {
            if (s.rereadCount < 2 && s.backtrackCount < 2) {
              setTimeout(() => triggerArmForParagraph(pid, "B_summary"), 10);
              return;
            }
          }

          // Rule 4 check: backtrack >= 2
          if (s.backtrackCount >= 2) {
            setTimeout(() => triggerArmForParagraph(pid, "D_analogy"), 10);
            return;
          }
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [triggerArmForParagraph, isCursorNearComplexWord]);

  // Pointer tracking motor (mousemove & scroll)
  useEffect(() => {
    const BACKTRACK_PX = 25;
    const VERTICAL_REREAD_PX = 40;
    const IDLE_THRESHOLD_MS = 1500;

    const handlePointerMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = (now - lastMousePosRef.current.time) / 1000;
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;

      const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
      const closestParaEl = hoveredElement ? hoveredElement.closest('.reading-para') : null;

      if (closestParaEl) {
        const pId = closestParaEl.id;
        if (!isReadingStartedRef.current) {
          isReadingStartedRef.current = true;
        }

        if (activeParaIdRef.current !== pId) {
          setActiveParaId(pId);
          lastMousePosRef.current.maxY = e.pageY;
          complexWordIdleTicksRef.current = 0; // reset on paragraph change
          setParaStats(prev => {
            const current = prev[pId];
            if (!current) return prev;
            return { ...prev, [pId]: { ...current, isRereadLockActive: false } };
          });
        }

        const stats = paraStatsRef.current[pId];
        if (stats) {
          if (dt > 0) {
            const speed = Math.sqrt(dx * dx + dy * dy) / dt;
            stats.mouseSpeeds.push(speed);
          }

          // Backtrack detection
          if (dx < -BACKTRACK_PX && Math.abs(dy) < 15) {
            setParaStats(prev => {
              const cur = prev[pId];
              if (!cur) return prev;
              setBacktrackCount(b => b + 1);
              return { ...prev, [pId]: { ...cur, backtrackCount: cur.backtrackCount + 1 } };
            });
            logEvent("backtrack_detected", { dx });
          }

          // Reread detection (vertical scroll back up within paragraph)
          if (e.pageY > lastMousePosRef.current.maxY) {
            lastMousePosRef.current.maxY = e.pageY;
            stats.isRereadLockActive = false;
          } else if (lastMousePosRef.current.maxY - e.pageY > VERTICAL_REREAD_PX) {
            if (!stats.isRereadLockActive) {
              setParaStats(prev => {
                const cur = prev[pId];
                if (!cur) return prev;
                return { ...prev, [pId]: { ...cur, rereadCount: cur.rereadCount + 1, isRereadLockActive: true } };
              });
              logEvent("reread_detected", { vertical_recovery: lastMousePosRef.current.maxY - e.pageY });
            }
          }
        }
      }

      // Reset complex word idle counter on movement
      complexWordIdleTicksRef.current = 0;

      lastMousePosRef.current.x = e.clientX;
      lastMousePosRef.current.y = e.clientY;
      lastMousePosRef.current.time = now;

      // Idle tracking (fires after 1.5s of no movement)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        const pid = activeParaIdRef.current;
        if (pid && paraStatsRef.current[pid]) {
          // Check if cursor is near a complex word
          const nearComplex = isCursorNearComplexWord(e.clientX, e.clientY, pid);

          if (nearComplex) {
            complexWordIdleTicksRef.current += 1;
          }

          setParaStats(prev => {
            const cur = prev[pid];
            if (!cur) return prev;
            return {
              ...prev,
              [pid]: {
                ...cur,
                cursorStops: cur.cursorStops + 1,
                cursorStopNearComplexWord: nearComplex,
              }
            };
          });
          setCursorIdleSeconds(s => s + 1.5);
          logEvent("idle", { mouse_x: e.clientX, mouse_y: e.clientY, near_complex_word: nearComplex });
        }
      }, IDLE_THRESHOLD_MS);
    };

    const handleScroll = () => {
      const viewportMid = window.scrollY + window.innerHeight / 2;
      const paraElements = document.querySelectorAll('.reading-para');
      for (let i = 0; i < paraElements.length; i++) {
        const el = paraElements[i] as HTMLElement;
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        if (viewportMid >= top && viewportMid < bottom) {
          const newId = el.id;
          if (activeParaIdRef.current !== newId) {
            setActiveParaId(newId);
            lastMousePosRef.current.maxY = window.scrollY + window.innerHeight / 2;
          }
          break;
        }
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [logEvent, isCursorNearComplexWord]);

  // ─── SUPABASE SYNC: Periodic auto-save every 30 seconds ───────────────────
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (isReadingStartedRef.current) {
        flushTelemetryToBackend('auto_save', {
          elapsedSeconds,
          allParaStats: paraStatsRef.current,
          interventionLog: interventionLogRef.current,
        });
      }
    }, 30_000);
    return () => clearInterval(autoSave);
  }, [flushTelemetryToBackend, elapsedSeconds]);

  const computeFeatures = useCallback((paraId: string) => {
    const s = paraStatsRef.current[paraId] || { wordCount: 100, dwellMs: 0, rereadCount: 0, backtrackCount: 0, cursorStops: 0, mouseSpeeds: [] };
    const dwellSec = s.dwellMs / 1000;
    const wpm = dwellSec > 0 ? (s.wordCount / dwellSec) * 60 : 999;
    const dwellTerm = Math.min(dwellSec / 45, 1);
    const rereadTerm = Math.min(s.rereadCount / 3, 1);
    const backtrackTerm = Math.min(s.backtrackCount / 5, 1);
    const stopTerm = Math.min(s.cursorStops / 4, 1);
    const speedTerm = Math.max(0, 1 - wpm / 160);
    const score = 0.30 * dwellTerm + 0.25 * rereadTerm + 0.20 * backtrackTerm + 0.15 * stopTerm + 0.10 * speedTerm;
    return { score: Math.min(score, 1), dwellSec, wpm };
  }, []);

  const handleNextSlide = useCallback(() => {}, []);
  const handlePrevSlide = useCallback(() => {}, []);
  const restartSession = useCallback(() => {
    setActiveParaId('p_1');
    setElapsedSeconds(0);
    setInterventionLog({});
  }, []);

  // ─── SUPABASE SYNC: Full session save on finish ────────────────────────────
  const saveSessionToSupabase = useCallback(async (diffRatings: Record<string, number>, quizAnswers: Record<string, number>) => {
    const pName = getParticipantName();
    const fullPayload = {
      events: V1_PARAGRAPHS.map(p => ({
        event_type: 'session_complete',
        participant_id: participantCode,
        participant_name: pName,
        session_id: `${participantCode}`,
        section_id: 'sec_1',
        paragraph_id: p.id,
        dwell_time_s: Math.round((paraStatsRef.current[p.id]?.dwellMs || 0) / 1000),
        visit_count: (paraStatsRef.current[p.id]?.rereadCount || 0) + 1,
        backtrack_count: paraStatsRef.current[p.id]?.backtrackCount || 0,
        cursor_idle_seconds: paraStatsRef.current[p.id]?.cursorStops || 0,
        cursor_idle_episodes: paraStatsRef.current[p.id]?.cursorStops || 0,
        longest_idle_s: 0,
        raw_metadata: {
          difficulty_rating: diffRatings[p.id],
          quiz_answer: quizAnswers[p.id],
          quiz_correct: quizAnswers[p.id] === p.quiz?.answer,
          intervention: interventionLogRef.current[p.id] || null,
          full_stats: paraStatsRef.current[p.id],
          elapsed_seconds: elapsedSeconds,
        },
        timestamp: new Date().toISOString(),
      }))
    };

    try {
      await apiClient.post('/api/analytics/telemetry/batch', fullPayload);
      console.log('[Supabase Sync] ✅ Full session data saved successfully.');
    } catch (err) {
      console.error('[Supabase Sync] ❌ Full session save failed:', err);
    }

    // Also mark participant as completed
    try {
      const sessionExportData = {
        participant_identifier: participantCode,
        session_id: `${participantCode}`,
        completed_at: new Date().toISOString(),
        total_elapsed_seconds: elapsedSeconds,
        difficulty_ratings: diffRatings,
        quiz_answers: quizAnswers,
        paragraph_telemetry: paraStatsRef.current,
        ai_interventions_log: interventionLogRef.current,
      };
      await apiClient.post(`/api/participant/complete/${participantCode}`, sessionExportData);
    } catch (err) {
      console.warn('[Supabase Sync] Participant completion call failed:', err);
    }
  }, [participantCode, elapsedSeconds]);

  return {
    data,
    isLoading,
    error,
    sections,
    activeSection,
    paragraphs,
    currentSlideIdx,
    setCurrentSlideIdx,
    activeSectionId,
    setActiveSectionId,
    fontSize,
    setFontSize,
    elapsedSeconds,
    paragraphDwellTimes,
    dwellTimesRef,
    backtrackCount,
    paragraphVisits,
    flushAnalyticsRef,
    cursorIdleSeconds,
    cursorIdleEpisodes,
    longestIdleDuration,
    showRecoveryDialog,
    setShowRecoveryDialog,
    showCompleteDialog,
    setShowCompleteDialog,
    handleNextSlide,
    handlePrevSlide,
    restartSession,
    // New exports for vertical v1 parity
    activeParaId,
    setActiveParaId,
    paraStats,
    interventionLog,
    setInterventionLog,
    computeFeatures,
    classifyStruggleType,
    triggerArmForParagraph,
    logEvent,
    saveSessionToSupabase,
  };
};
