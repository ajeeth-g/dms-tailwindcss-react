// Formats a Date object as "yyyy-MM-ddTHH:mm" (compatible with datetime-local inputs)
export function formatDateTime(date) {
  const pad = (num) => (num < 10 ? "0" + num : num);
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}
