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

// Utility function to convert the service date to "YYYY-MM-DD"
export const convertServiceDate = (serviceDate) => {
  if (!serviceDate) return "";
  // Extract the number between the parentheses
  const timestampMatch = serviceDate.match(/\d+/);
  if (!timestampMatch) return "";
  const timestamp = parseInt(timestampMatch[0], 10);
  const date = new Date(timestamp);

  // Format date as YYYY-MM-DD using local time
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};
