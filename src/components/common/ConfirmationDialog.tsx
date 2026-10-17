/**
 * @file ConfirmationDialog.tsx
 * @description Accessible confirmation modal required for destructive actions.
 */

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';
import { useLanguage } from '../../context/LanguageContext';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            aria-label="Close dialog"
            className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-3 text-sm text-stone-600 leading-relaxed">{message}</p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelLabel || t('cancel')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            {confirmLabel || t('confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
};
