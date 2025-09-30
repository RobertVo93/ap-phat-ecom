export function appendQueryParams(baseUrl: string, params?: Record<string, any>) {
  const url = new URL(baseUrl, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}