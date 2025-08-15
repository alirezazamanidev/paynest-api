

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_PORT: string;
      //DB
      DB_HOST: string;
      DB_PORT: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;
      //REDIS
      REDIS_URL: string;
      // Auth
      OTP_EXPIRATION_MINUTES:number
    }
  }
}
