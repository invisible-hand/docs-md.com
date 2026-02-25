export async function register() {
  if (process.env.NODE_ENV === 'development') {
    const { neonConfig } = await import('@neondatabase/serverless');
    neonConfig.fetchEndpoint = (host) => {
      const [, port] = host.split(':');
      if (!port) {
        return `http://${host}:4444/sql`;
      }
      return `http://${host}/sql`;
    };
    neonConfig.useSecureWebSocket = false;
    neonConfig.wsProxy = (host) => `${host}:4445/v1`;
    neonConfig.pipelineTLS = false;
    neonConfig.pipelineConnect = false;
  }
}
