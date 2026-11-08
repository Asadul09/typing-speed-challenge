import React, { useState } from 'react';
import { Edit3, X, Check, RefreshCw } from 'lucide-react';
import { ThemeColors } from '../types';

interface CustomTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCustomText: (text: string) => void;
  theme: ThemeColors;
}

export const CustomTextModal: React.FC<CustomTextModalProps> = ({
  isOpen,
  onClose,
  onApplyCustomText,
  theme
}) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleApply = () => {
    const cleaned = text.trim().replace(/\s+/g, ' ');
    if (cleaned.length < 10) {
      setError('Please provide at least 10 characters of practice text.');
      return;
    }
    onApplyCustomText(cleaned);
    onClose();
  };

  const handleSample = () => {
    setText("The quick brown fox jumps over the lazy dog. Programming is the art of telling another human being what one wants the computer to do. Clean code always looks like it was written by someone who cares.");
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl flex flex-col rounded-3xl glass-panel border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${theme.primary}25`, color: theme.primary }}
            >
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Custom Practice Text</h3>
              <p className="text-xs text-slate-400">Paste your own articles, essays, or paragraphs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <textarea
            value={text}
            onChange={e => {
              setText(e.target.value);
              setError('');
            }}
            placeholder="Type or paste custom text here..."
            rows={6}
            className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono resize-none"
          />

          {error && <div className="text-xs text-red-400">{error}</div>}

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <div>
              <span>{wordCount} words</span> • <span>{charCount} characters</span>
            </div>
            <button
              onClick={handleSample}
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
            >
              <RefreshCw className="w-3 h-3" />
              Load Sample Text
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-white text-xs font-semibold shadow"
            style={{ backgroundColor: theme.primary }}
          >
            <Check className="w-4 h-4" />
            Apply & Practice
          </button>
        </div>
      </div>
    </div>
  );
};
