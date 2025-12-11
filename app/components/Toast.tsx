'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

export default function Toast({ message, show, onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-2">
      {message}
    </div>
  );
}
