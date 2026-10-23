import { useQueryClient } from '@tanstack/react-query';
import { CheckCircleSolid, NavArrowRight } from 'iconoir-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { saveProgress, saveProgressOnExit } from '../../../../api/admin/learn';
import LessonChat from './LessonChat';
import { Bar, formatDuration, formatLongDuration, Thumbnail } from './learnUi';

// Renders the light markup used in lesson notes: "## Heading", "1. step", text
const Notes = ({ text }) => {
  const lines = text.split('\n').filter((line) => line.trim());
  return (
    <div className="flex flex-col gap-2.5">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return (
            <h4 key={i} className="text-[14px] font-semibold mt-3 first:mt-0">
              {line.slice(3)}
            </h4>
          );
        }
        const step = line.match(/^(\d+)\.\s+(.*)/);
        if (step) {
          return (
            <div key={i} className="flex gap-3 text-[14px] text-gray-700">
              <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 text-[12px] font-semibold flex items-center justify-center">
                {step[1]}
              </span>
              <span className="pt-0.5">{step[2]}</span>
            </div>
          );
        }
        return (
          <p key={i} className="text-[14px] text-gray-600">
            {line}
          </p>
        );
      })}
    </div>
  );
};

// How often (in seconds of playback) the resume point is sent to the server
const SAVE_EVERY = 10;

const CoursePlayer = ({ course, lessonId, onSelect, onBack }) => {
  const queryClient = useQueryClient();
  const videoRef = useRef(null);
  const lastSavedAt = useRef(0);
  const [ended, setEnded] = useState(false);
  const [tab, setTab] = useState('description');

  const lessons = course.lessons;
  const index = lessons.findIndex((l) => l._id === lessonId);
  const lesson = lessons[index];
  const next = lessons[index + 1];

  // Keeps the cached course in step with what we've saved, so the landing page
  // and revisiting a lesson show the right resume point without a refetch.
  const updateCache = useCallback(
    (id, position, completed) => {
      queryClient.setQueryData(['learn'], (old) => {
        if (!old) return old;
        const updated = old.lessons.map((l) =>
          l._id === id ? { ...l, position, completed: l.completed || completed } : l
        );
        return { ...old, lessons: updated };
      });
    },
    [queryClient]
  );

  const save = useCallback(
    async (position, endedNow = false) => {
      if (!lesson) return;
      try {
        const res = await saveProgress(lesson._id, position, endedNow);
        updateCache(lesson._id, endedNow || res.completed ? 0 : position, res.completed);
      } catch {
        // Progress is best-effort; the next save will catch up
      }
    },
    [lesson?._id, updateCache]
  );

  useEffect(() => {
    setEnded(false);
    lastSavedAt.current = 0;
  }, [lessonId]);

  // Save the resume point when leaving the lesson or closing the tab
  useEffect(() => {
    const video = videoRef.current;
    const flushOnExit = () => {
      if (video && video.currentTime > 1 && !video.ended)
        saveProgressOnExit(lessonId, video.currentTime);
    };
    window.addEventListener('pagehide', flushOnExit);
    return () => {
      window.removeEventListener('pagehide', flushOnExit);
      if (video && video.currentTime > 1 && !video.ended) {
        saveProgressOnExit(lessonId, video.currentTime);
        updateCache(lessonId, video.currentTime, false);
      }
      // Refetch the server-computed stats (completion %, resume lesson) once the
      // final save above has had a moment to land
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ['learn'] }), 1000);
    };
  }, [lessonId, queryClient, updateCache]);

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-3">
        <p className="text-red-600">Lesson not found</p>
        <button onClick={onBack} className="text-[14px] underline cursor-pointer">
          Back to course
        </button>
      </div>
    );
  }

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    // Resume from where they stopped (never within the last few seconds)
    if (lesson.position > 0 && lesson.position < video.duration - 3) {
      video.currentTime = lesson.position;
    }
  };

  const handleTimeUpdate = () => {
    const time = videoRef.current.currentTime;
    if (Math.abs(time - lastSavedAt.current) >= SAVE_EVERY) {
      lastSavedAt.current = time;
      save(time);
    }
  };

  const handleEnded = () => {
    setEnded(true);
    save(0, true);
  };

  const { progress } = course;
  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'notes', label: 'Notes' },
    { id: 'course', label: 'Course' },
  ];
  // A lesson without notes hides that tab, so fall back if it was selected
  const activeTab = tab === 'notes' && !lesson.notes ? 'description' : tab;

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[14px] text-gray-500">
        <button onClick={onBack} className="hover:text-black cursor-pointer">
          Learn
        </button>
        <span>/</span>
        <span className="max-md:hidden">{course.title}</span>
        <span className="max-md:hidden">/</span>
        <span className="text-black font-medium truncate">Lesson {index + 1}</span>
      </nav>

      <div className="flex flex-col gap-6 xl:pr-[424px]">
        {/* Lesson header, player and tabs */}
        <div className="flex flex-col gap-5 min-w-0">
          <div className="bg-white rounded-2xl p-7 flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3.5 py-1.5 rounded-full bg-[#011810] text-white text-[12px] font-medium">
                Lesson {index + 1} of {lessons.length}
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-gray-100 text-[12px] font-medium">
                {formatDuration(lesson.duration)}
              </span>
              {(ended || lesson.completed) && (
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-green-50 text-green-700 text-[12px] font-medium">
                  <CheckCircleSolid width={14} height={14} color="#27ae60" /> Completed
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-6 max-md:flex-col max-md:items-start">
              <h2 className="text-[18px] font-semibold leading-snug">{lesson.title}</h2>

              {next ? (
                <button
                  onClick={() => onSelect(next._id)}
                  className={`shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-semibold cursor-pointer transition-colors ${
                    ended ? 'bg-[#27ae60] text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Next lesson <NavArrowRight width={16} height={16} />
                </button>
              ) : (
                ended && (
                  <button
                    onClick={onBack}
                    className="shrink-0 px-6 py-3 rounded-xl text-[14px] font-semibold bg-[#27ae60] text-white cursor-pointer"
                  >
                    Finish course
                  </button>
                )
              )}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-black min-h-[300px] max-h-[720px]">
            <video
              key={lesson._id}
              ref={videoRef}
              src={lesson.videoUrl}
              poster={lesson.thumbnail || undefined}
              controls
              autoPlay
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onPause={() => {
                const video = videoRef.current;
                if (video && !video.ended && video.currentTime > 1) save(video.currentTime);
              }}
              onPlay={() => setEnded(false)}
              onEnded={handleEnded}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="flex gap-1 px-4 pt-3 border-b border-gray-200">
              {tabs
                .filter((t) => t.id !== 'notes' || lesson.notes)
                .map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`px-4 py-3 text-[14px] font-medium cursor-pointer border-b-2 -mb-px transition-colors ${
                      activeTab === t.id
                        ? 'border-[#27ae60] text-black'
                        : 'border-transparent text-gray-500 hover:text-black'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
            </div>

            <div className="p-7">
              {activeTab === 'description' && (
                <p className="text-[15px] text-gray-600 leading-relaxed whitespace-pre-line">
                  {lesson.description}
                </p>
              )}

              {activeTab === 'notes' && <Notes text={lesson.notes} />}

              {activeTab === 'course' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[18px] font-semibold leading-snug">{course.title}</h3>
                    <div>
                      <Bar percent={progress.watchedPercent} />
                      <p className="text-[12px] text-gray-500 mt-2">
                        {progress.watchedPercent}% watched · {progress.completedCount} of{' '}
                        {course.lessonCount} lessons complete ·{' '}
                        {formatLongDuration(course.totalDuration)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
                    {lessons.map((l, i) => {
                      const active = l._id === lesson._id;
                      const percent = l.duration ? Math.round((l.position / l.duration) * 100) : 0;
                      return (
                        <button
                          key={l._id}
                          onClick={() => onSelect(l._id)}
                          className={`text-left rounded-xl border overflow-hidden cursor-pointer transition-colors ${
                            active
                              ? 'border-[#27ae60] bg-green-50/50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 p-2.5">
                            <div className="relative shrink-0">
                              <Thumbnail lesson={l} className="w-[104px] aspect-video rounded-lg" />
                              <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-white/90 text-[11px] font-semibold flex items-center justify-center">
                                {l.completed ? (
                                  <CheckCircleSolid width={16} height={16} color="#27ae60" />
                                ) : (
                                  i + 1
                                )}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-[13.5px] leading-snug line-clamp-2 ${active ? 'font-semibold' : 'font-medium'}`}
                              >
                                {l.title}
                              </p>
                              <p className="text-[12px] text-gray-500 mt-1">
                                {formatDuration(l.duration)}
                              </p>
                            </div>
                          </div>
                          {!l.completed && percent > 0 && !active && (
                            <div className="px-2.5 pb-2.5">
                              <Bar percent={percent} />
                            </div>
                          )}
                          {active && (
                            <div className="px-3 py-1.5 bg-[#27ae60] text-white text-[11px] font-medium text-right">
                              Currently watching
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI assistant: fixed to the right edge, full height under the top bar */}
        <div className="h-[600px] xl:fixed xl:top-[100px] xl:right-[70px] xl:bottom-6 xl:h-auto xl:w-[400px] xl:z-10">
          <LessonChat lessonId={lesson._id} />
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
