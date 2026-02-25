export async function register() {
  if (process.env.NODE_ENV === 'development') {
    (globalThis as Record<string, unknown>).__neonLocalProxy = {
      fetchEndpoint: () => `http://localhost:4444/sql`,
      wsProxy: () => `localhost:4445/v1`,
      fetchFunction: (url: string | URL | Request, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        const connStr = headers.get('Neon-Connection-String');
        if (connStr) {
          headers.set(
            'Neon-Connection-String',
            connStr.replace('@localhost:', '@db.localtest.me:')
          );
        }
        return fetch(url, { ...init, headers });
      },
    };
  }
}
