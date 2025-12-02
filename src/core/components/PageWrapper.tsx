import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

/**
 * Professional page wrapper with centered gradient background
 * Used across all service/feature pages for consistent styling
 */
export function PageWrapper({ children, title, subtitle }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-lg text-slate-600 dark:text-slate-300">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default PageWrapper;
