/**
 * App.tsx
 * Root Application Router & State Container for Omni-Teach Live
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { StudentVoiceHUD } from './pages/StudentVoiceHUD';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'tutor'>('dashboard');
  const [activeLesson, setActiveLesson] = useState<any>(null);

  // Sync initial URL routing
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/tutor/')) {
      const id = path.replace('/tutor/', '').trim();
      if (id) {
        // Fetch lesson from backend
        fetch(`/api/lesson/${id}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.lesson) {
              setActiveLesson(data.lesson);
              setCurrentView('tutor');
            }
          })
          .catch(err => console.warn('Could not load lesson by URL:', err));
      }
    }

    // Check backend config
    fetch('/api/config')
      .then(res => res.json())
      .then(cfg => {
        if (cfg.clientKey) {
          (window as any).__OMNI_GEMINI_KEY__ = cfg.clientKey;
        }
      })
      .catch(() => {});
  }, []);

  const handleLaunchTutor = (lessonId: string) => {
    window.history.pushState({}, '', `/tutor/${lessonId}`);
    setCurrentView('tutor');
  };

  const handleBackToDashboard = () => {
    window.history.pushState({}, '', '/');
    setCurrentView('dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090C15' }}>
      <Navbar
        currentView={currentView}
        onNavigate={(v) => {
          if (v === 'dashboard') handleBackToDashboard();
          else setCurrentView('tutor');
        }}
        activeLessonId={activeLesson?.lessonId}
      />

      {currentView === 'dashboard' ? (
        <TeacherDashboard
          onLaunchTutor={handleLaunchTutor}
          activeLesson={activeLesson}
          setActiveLesson={setActiveLesson}
        />
      ) : (
        <StudentVoiceHUD
          lessonId={activeLesson?.lessonId || 'demo_lesson'}
          lessonData={activeLesson}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
};
