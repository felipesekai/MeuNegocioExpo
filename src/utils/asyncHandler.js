export async function withRequest(action, { setLoading, onError, onFinally } = {}) {
  try {
    if (setLoading) setLoading(true);
    const data = await action();
    return { data, error: null };
  } catch (error) {
    console.error(error);
    if (onError) onError(error);
    return { data: null, error };
  } finally {
    if (setLoading) setLoading(false);
    if (onFinally) onFinally();
  }
}
