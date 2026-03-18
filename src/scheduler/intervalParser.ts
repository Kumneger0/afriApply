export function parseInterval(interval: string): string {
  const trimmed = interval.toLowerCase().trim();

  const match = trimmed.match(/^(\d+)([mhd])$/);
  if (!match || !match[1] || !match[2]) {
    throw new Error(
      `Invalid interval format: ${interval}. Use formats like: 30m, 1h, 2h, 1d`,
    );
  }

  const [, value, unit] = match;
  const num = parseInt(value, 10);

  switch (unit) {
    case "m":
      if (num < 30) {
        throw new Error("Minimum interval is 30 minutes. Use 30m or higher.");
      }
      if (num >= 60) {
        throw new Error(
          "Minutes interval must be less than 60. Use hours (h) for longer intervals.",
        );
      }
      return `*/${num} * * * *`;

    case "h":
      if (num >= 24) {
        throw new Error(
          "Hours interval must be less than 24. Use days (d) for longer intervals.",
        );
      }
      return `0 */${num} * * *`;

    case "d":
      if (num > 30) {
        throw new Error("Days interval must be 30 or less.");
      }
      return `0 0 */${num} * *`;

    default:
      throw new Error(
        `Unsupported unit: ${unit}. Use m (minutes), h (hours), or d (days)`,
      );
  }
}

export function getIntervalExamples(): string[] {
  return [
    "30m - every 30 minutes",
    "45m - every 45 minutes",
    "1h - every hour",
    "2h - every 2 hours",
    "6h - every 6 hours",
    "12h - every 12 hours",
    "1d - every day",
    "2d - every 2 days",
    "7d - every week",
  ];
}

export function isValidInterval(interval: string): boolean {
  try {
    parseInterval(interval);
    return true;
  } catch {
    return false;
  }
}
