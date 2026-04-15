export async function getUserSubscription() {
  const response = await fetch('/api/subscription');
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data.subscription;
}