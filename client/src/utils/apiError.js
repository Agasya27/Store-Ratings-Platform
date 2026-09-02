export function getApiError(error) {
  return error.response?.data?.error || error.message || 'Something went wrong';
}
