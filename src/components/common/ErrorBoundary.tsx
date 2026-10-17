/**
 * @file ErrorBoundary.tsx
 * @description Bulletproof React Error Boundary preventing white screens and page breaks.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Unhandled React Error in Gardenvaly:', error, errorInfo);
  }

  handleReload = (): void => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  handleGoHome = (): void => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F5EC] px-4 py-12 text-slate-800">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-stone-200/80 p-6 sm:p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h1 className="text-xl sm:text-2xl font-serif-botanical font-bold text-stone-900 mb-2">
              কিছু একটা সমস্যা হয়েছে
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mb-6 leading-relaxed">
              অ্যাপটি লোড করতে অপ্রত্যাশিত ত্রুটি দেখা দিয়েছে। নিচের বাটনে ক্লিক করে পেজটি আবার রিফ্রেশ করুন।
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#174D35] hover:bg-[#123e2a] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>পুনরায় লোড করুন</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>হোমে যান</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
