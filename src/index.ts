export async function get(event: string) {
  return {
    statusCode: 302,
    headers: { Location: 'https://www.youtube.com/' },
  };
}
