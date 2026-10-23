// Time-of-day greeting in Lagos time (not the visitor's device clock), shared
// by the home hero and the chat welcome screen.
export const greeting = (now = new Date()) => {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Africa/Lagos' }).format(now)
  );
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17) return 'Good evening';
  return 'Hello'; // 00:00–04:59
};
