export function appendQueryParams(baseUrl: string, params?: Record<string, any>) {
  const url = new URL(baseUrl, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        if (typeof value === "object" && value !== null) {
          url.searchParams.append(key, JSON.stringify(value));
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });
  }

  return url.toString();
}