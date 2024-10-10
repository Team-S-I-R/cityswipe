declare module 'amadeus' {
  export default class Amadeus {
    constructor(options: { clientId: string; clientSecret: string });
    client: {
      get: (endpoint: string, params?: any) => Promise<{ result: any }>;
    };
  }
}