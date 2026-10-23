import { useQuery } from '@tanstack/react-query';
import { CheckCircleSolid, MediaVideo } from 'iconoir-react';
import { useSearchParams } from 'react-router-dom';
import { getLearn } from '../../../../api/admin/learn';
import Loader from '../../../loader/loader';
import CoursePlayer from './CoursePlayer';
import { Bar, formatDuration, formatLongDuration, Ring, Thumbnail } from './learnUi';

const getFirstName = () => {
  try {
    return JSON.parse(window.localStorage.getItem('MDA__TOKEN'))?.firstname || '';
  } catch {
    return '';
  }
};

const StatTile = ({ label, value }) => (
  <div className="rounded-xl bg-white p-6">
    <p className="text-[13px] text-gray-500">{label}</p>
    <p className="text-[21px] font-semibold mt-0.5">{value}</p>
  </div>
);

const ContinueCard = ({ course, onOpen }) => {
  const { progress, lessons } = course;
  const resume = lessons.find((l) => l._id === progress.resumeLessonId);

  if (!resume) {
    return (
      <div className="rounded-2xl bg-white p-7 flex flex-col justify-center gap-3">
        <CheckCircleSolid width={36} height={36} color="#27ae60" />
        <h3 className="text-[20px] font-semibold">You've completed the course</h3>
        <p className="text-[14px] text-gray-500">
          Well done. Revisit any lesson below whenever you need a refresher.
        </p>
      </div>
    );
  }

  const index = lessons.indexOf(resume) + 1;
  const percent = resume.duration ? Math.round((resume.position / resume.duration) * 100) : 0;

  return (
    <div className="rounded-2xl bg-white p-7 flex flex-col justify-center gap-4">
      <p className="text-[12px] font-semibold uppercase tracking-wider text-[#27ae60]">
        {progress.started ? 'Pick up from where you left off' : 'Start learning'}
      </p>
      <h3 className="text-[16px] font-semibold leading-snug">
        Lesson {index}: {resume.title}
      </h3>
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          {resume.position > 0 ? (
            <>
              <Bar percent={percent} />
              <p className="text-[12px] text-gray-500 mt-2">
                Stopped at {formatDuration(resume.position)} of {formatDuration(resume.duration)}
              </p>
            </>
          ) : (
            <p className="text-[13px] text-gray-500">
              {formatDuration(resume.duration)} · Ready when you are
            </p>
          )}
        </div>
        <button
          onClick={() => onOpen(resume._id)}
          className="shrink-0 px-5 py-2.5 rounded-xl bg-[#27ae60] hover:bg-[#219150] text-white text-[14px] font-semibold cursor-pointer transition-colors"
        >
          {resume.position > 0 ? 'Resume' : 'Start'}
        </button>
      </div>
    </div>
  );
};

const LessonCard = ({ lesson, index, isNext, onOpen }) => {
  const percent = lesson.duration ? Math.round((lesson.position / lesson.duration) * 100) : 0;
  const inProgress = !lesson.completed && percent > 0;

  return (
    <div
      onClick={() => onOpen(lesson._id)}
      className="bg-white rounded-2xl p-3 cursor-pointer hover:-translate-y-0.5 transition-all flex flex-col"
    >
      <div className="relative rounded-xl overflow-hidden">
        <Thumbnail lesson={lesson} className="w-full aspect-video" />

        {lesson.completed ? (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[12px] font-medium text-green-700">
            <CheckCircleSolid width={14} height={14} color="#27ae60" /> Completed
          </span>
        ) : isNext ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#c5e554] text-[12px] font-semibold text-[#011810]">
            {inProgress ? 'In progress' : 'Up next'}
          </span>
        ) : null}

        {inProgress && (
          <div className="absolute left-3 right-3 bottom-3 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur flex items-center gap-2">
            <Bar percent={percent} track="bg-white/25" fill="bg-[#c5e554]" className="flex-1" />
            <span className="text-[11px] text-white font-medium">{percent}%</span>
          </div>
        )}
      </div>

      <div className="px-2 pt-4 pb-2 flex flex-col gap-1.5">
        <h3 className="text-[16px] font-semibold leading-snug">{lesson.title}</h3>
        <p className="text-[13px] text-gray-500 line-clamp-2">{lesson.description}</p>
        <p className="text-[12px] font-semibold text-[#27ae60] mt-1">
          Lesson {index + 1} <span className="mx-1">·</span> {formatDuration(lesson.duration)}
        </p>
      </div>
    </div>
  );
};

const Learn = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonId = searchParams.get('lesson');

  const {
    data: course,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['learn'],
    queryFn: getLearn,
  });

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading the course</p>
          <p className="text-gray-500 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-[75vh] gap-3">
        <MediaVideo width={40} height={40} color="#374151" />
        <h1 className="text-[20px] font-semibold">No Course Yet</h1>
        <p className="text-[14px] text-gray-500 w-[400px] text-center">
          The training course from Lagos State Government will appear here once it's published.
        </p>
      </div>
    );
  }

  if (lessonId) {
    return (
      <CoursePlayer
        course={course}
        lessonId={lessonId}
        onSelect={(id) => setSearchParams({ lesson: id })}
        onBack={() => setSearchParams({})}
      />
    );
  }

  const { progress } = course;
  const open = (id) => setSearchParams({ lesson: id });
  const firstName = getFirstName();

  return (
    <div className="flex flex-col gap-5 mt-0">
      <div className=" gap-4 max-xl:grid-cols-1">
        {/* Course + progress */}
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-8 max-md:flex-col bg-white p-8 rounded-2xl">
            <div className="flex flex-col gap-3 min-w-0">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#27ae60]">
                Learning course
              </p>
              <h2 className="text-[24px] font-semibold leading-snug">{course.title}</h2>
              <p className="text-[15px] leading-6 text-gray-500 line-clamp-5 whitespace-pre-line w-3/4">
                {course.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 max-md:grid-cols-2 mb-5">
            <StatTile label="Lessons" value={course.lessonCount} />
            <StatTile label="Duration" value={formatLongDuration(course.totalDuration)} />
            <StatTile
              label="Completed"
              value={`${progress.completedCount} / ${course.lessonCount}`}
            />
            <StatTile label="Completion rate" value={`${progress.completionRate}%`} />
            <StatTile label="Completion" value={`${progress.watchedPercent}%`} />
          </div>
        </div>

        <ContinueCard course={course} onOpen={open} />
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold">Lessons</h2>
          <span className="px-4 py-2 rounded-full border border-gray-200 bg-white text-[13px] font-medium">
            {progress.completedCount} of {course.lessonCount} complete
          </span>
        </div>

        <div className="grid grid-cols-4 gap-5 max-2xl:grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1">
          {course.lessons.map((lesson, i) => (
            <LessonCard
              key={lesson._id}
              lesson={lesson}
              index={i}
              isNext={lesson._id === progress.resumeLessonId}
              onOpen={open}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learn;
