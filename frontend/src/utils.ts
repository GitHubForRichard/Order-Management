/**
 * Formats a UTC date string to PST timezone.
 * @param utc
 * @returns
 */
export const formatUTCToPST = (utcDate: Date) =>
  utcDate
    ? new Date(utcDate).toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";
