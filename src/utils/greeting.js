export function getTimeOfDayGreeting() {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 0 && hour < 12) {
    return '🌞 Good morning';
  } else if (hour >= 12 && hour < 17) {
    return '💪 Good afternoon';
  } else if (hour >= 17 && hour < 24) {
    return '🌙 Good evening';
  } else {
    return 'Good night';
  }
}
