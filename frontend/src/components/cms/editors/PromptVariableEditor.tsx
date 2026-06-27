'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface PromptVariableEditorProps {
  systemPrompt: string;
  userPrompt: string;
  variables: string[];
  onVariablesChange: (newVars: string[]) => void;
  onRenameVariable: (oldName: string, newName: string) => void;
}

export const PromptVariableEditor: React.FC<PromptVariableEditorProps> = ({
  systemPrompt,
  userPrompt,
  variables,
  onVariablesChange,
  onRenameVariable,
}) => {
  const [newVarName, setNewVarName] = useState('');
  const [editingVar, setEditingVar] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Automatically detect {{variable}} patterns
  useEffect(() => {
    const combined = `${systemPrompt} ${userPrompt}`;
    const matches = combined.match(/\{\{([a-zA-Z0-9_.-]+)\}\}/g);
    if (matches) {
      const extracted = Array.from(new Set(matches.map((m) => m.replace(/[\{\}]/g, ''))));
      // Merge detected with existing custom ones without duplicates
      const merged = Array.from(new Set([...variables, ...extracted]));
      if (merged.length !== variables.length || !merged.every((v) => variables.includes(v))) {
        onVariablesChange(merged);
      }
    }
  }, [systemPrompt, userPrompt, variables, onVariablesChange]);

  const handleAdd = () => {
    const clean = newVarName.trim().replace(/[\{\}]/g, '');
    if (!clean) return;
    if (variables.includes(clean)) {
      alert('Variable already exists.');
      return;
    }
    onVariablesChange([...variables, clean]);
    setNewVarName('');
  };

  const handleRemove = (varName: string) => {
    onVariablesChange(variables.filter((v) => v !== varName));
  };

  const handleSaveRename = (oldName: string) => {
    const clean = renameValue.trim().replace(/[\{\}]/g, '');
    if (!clean || clean === oldName) {
      setEditingVar(null);
      return;
    }
    if (variables.includes(clean)) {
      alert('Variable name conflict.');
      return;
    }
    onRenameVariable(oldName, clean);
    setEditingVar(null);
  };

  const duplicateCount = variables.length - new Set(variables).size;

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-slate-800/60 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-white">Placeholder Variable Engine</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-extracted and custom runtime injection arguments.
          </p>
        </div>
        {duplicateCount > 0 && (
          <span className="text-[10px] font-mono bg-error/10 text-error px-2 py-0.5 rounded border border-error/30">
            Duplicate Variables Detected
          </span>
        )}
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Add manual variable input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newVarName}
            onChange={(e) => setNewVarName(e.target.value)}
            placeholder="New variable name (e.g. custom_threshold)..."
            className="flex-1 h-8 rounded-lg bg-slate-950 border border-slate-800 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary font-mono"
          />
          <Button variant="secondary" size="sm" onClick={handleAdd} className="text-xs h-8 px-3">
            + Define Variable
          </Button>
        </div>

        {variables.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4 italic">
            No variables detected. Type <code className="text-accent">&#123;&#123;variable_name&#125;&#125;</code> inside prompt text to auto-bind.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {variables.map((v) => (
              <div
                key={v}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono group"
              >
                {editingVar === v ? (
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">&#123;&#123;</span>
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className="w-24 bg-slate-900 border border-primary px-1 rounded text-white text-xs focus:outline-none"
                      autoFocus
                    />
                    <span className="text-slate-500">&#125;&#125;</span>
                    <button onClick={() => handleSaveRename(v)} className="text-emerald-400 font-bold px-1">✓</button>
                    <button onClick={() => setEditingVar(null)} className="text-slate-500 px-1">✕</button>
                  </div>
                ) : (
                  <>
                    <span className="text-accent font-bold">&#123;&#123;{v}&#125;&#125;</span>
                    <button
                      onClick={() => {
                        setEditingVar(v);
                        setRenameValue(v);
                      }}
                      className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Rename variable everywhere"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleRemove(v)}
                      className="text-slate-500 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                      title="Remove variable"
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
