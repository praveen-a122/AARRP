'use client';

import React, { useState, useEffect } from 'react';
import { useWizardStore } from '@/store/wizardStore';
import { AssessmentEditor } from '@/components/cms/editors/AssessmentEditor';
import { QuizStatisticsPanel, ExtendedQuestion } from '@/components/cms/editors/QuizStatisticsPanel';
import { QuestionSettingsPanel, QuizSettings } from '@/components/cms/editors/QuestionSettingsPanel';
import { Button } from '@/components/ui/Button';
import type { Quiz } from '@/types/api';
import type { ValidationIssue } from '@/components/cms/ValidationPanel';

export const QuizBuilder: React.FC = () => {
  const {
    conditions,
    questions,
    addItem,
    removeItem,
    duplicateItem,
    reorderItems,
    setValidation,
    validation,
  } = useWizardStore();

  // Extract quizzes from conditions or state
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    { id: 'quiz_default', section_id: 'default', title: 'Main Assessment Module' },
  ]);
  const [activeTab, setActiveTab] = useState<'editor' | 'settings' | 'telemetry'>('editor');
  const [settings, setSettings] = useState<QuizSettings>({
    passingScore: 70,
    shuffleQuestions: false,
    shuffleOptions: true,
    mandatoryCompletion: true,
    feedbackVisibility: 'on_submit',
  });

  const extQuestions = (questions as unknown as ExtendedQuestion[]) || [];

  // Validate quiz configuration
  useEffect(() => {
    const issues: ValidationIssue[] = [];
    if (extQuestions.length === 0) {
      issues.push({
        id: 'quiz-no-questions',
        fieldId: 'quiz',
        message: 'At least one assessment question must be configured.',
        severity: 'critical',
      });
    }

    extQuestions.forEach((q, idx) => {
      if (!q.prompt || !q.prompt.trim()) {
        issues.push({
          id: `q-empty-${q.id || idx}`,
          fieldId: 'quiz',
          message: `Question #${idx + 1} is missing a prompt text.`,
          severity: 'warning',
        });
      }
      if (q.type !== 'short_answer' && q.type !== 'long_answer') {
        if (!q.options || q.options.length < 2) {
          issues.push({
            id: `q-opts-${q.id || idx}`,
            fieldId: 'quiz',
            message: `Question #${idx + 1} requires at least 2 multiple-choice options.`,
            severity: 'critical',
          });
        }
      }
    });

    const otherIssues = validation.filter((v) => !v.fieldId || !v.fieldId.startsWith('quiz'));
    setValidation([...otherIssues, ...issues]);
  }, [extQuestions, setValidation]);

  const handleAddQuiz = () => {
    const newQ: Quiz = {
      id: `quiz_${Date.now()}`,
      section_id: conditions[0]?.id || 'default',
      title: `Assessment Module ${quizzes.length + 1}`,
    };
    setQuizzes([...quizzes, newQ]);
  };

  const handleAddQuestion = (quizId: string) => {
    const quizQs = extQuestions.filter((q) => q.quiz_id === quizId);
    const newQ: ExtendedQuestion = {
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      quiz_id: quizId,
      prompt: '',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct_option_index: 0,
      order: quizQs.length + 1,
      type: 'mcq',
      points: 10,
      required: true,
    };
    addItem('questions', newQ);
  };

  const isValid = extQuestions.length > 0 && !validation.some((v) => v.fieldId === 'quiz' && v.severity === 'critical');

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          {[
            { id: 'editor', label: '1. Assessment Editor' },
            { id: 'settings', label: '2. Runtime Rules' },
            { id: 'telemetry', label: '3. Score & Time Summary' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'editor' && (
          <Button variant="default" size="md" onClick={handleAddQuiz} className="text-xs">
            + Add Quiz Module
          </Button>
        )}
      </div>

      {/* Tab Contents */}
      {activeTab === 'editor' && (
        <div className="space-y-6">
          {quizzes.map((q, qIdx) => (
            <AssessmentEditor
              key={q.id}
              quiz={q}
              questions={extQuestions}
              index={qIdx}
              onQuizChange={(updated) => setQuizzes(quizzes.map((item) => (item.id === updated.id ? updated : item)))}
              onDeleteQuiz={() => setQuizzes(quizzes.filter((item) => item.id !== q.id))}
              onDuplicateQuiz={() => setQuizzes([...quizzes, { ...q, id: `quiz_copy_${Date.now()}`, title: `${q.title} (Copy)` }])}
              onAddQuestion={handleAddQuestion}
              onQuestionChange={(updated) => {
                const copy = extQuestions.map((item) => (item.id === updated.id ? updated : item));
                reorderItems('questions', copy);
              }}
              onDeleteQuestion={(id) => removeItem('questions', id)}
              onDuplicateQuestion={(id) => duplicateItem('questions', id)}
              onReorderQuestions={(newQs) => {
                const otherQs = extQuestions.filter((item) => item.quiz_id !== q.id);
                reorderItems('questions', [...otherQs, ...newQs]);
              }}
            />
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <QuestionSettingsPanel settings={settings} onChange={setSettings} />
      )}

      {activeTab === 'telemetry' && (
        <QuizStatisticsPanel questions={extQuestions} isValid={isValid} />
      )}
    </div>
  );
};
