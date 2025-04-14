/**
 * Konfiguracja aplikacji
 * @module config
 */

const config = {
  // Konfiguracja serwera
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
  },

  // Konfiguracja bazy danych
  db: {
    uri: process.env.MONGODB_URI_PROD || 'mongodb+srv://terapeuta-admin:QlKtVvNZ95MJoD2C@cluster0.xhbixsy.mongodb.net/terapeuta?retryWrites=true&w=majority&appName=Cluster0'
  },

  // Konfiguracja JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'terapeuta-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // Konfiguracja e-mail
  email: {
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || 'user@example.com',
    password: process.env.EMAIL_PASSWORD || 'password',
    from: process.env.EMAIL_FROM || 'Terapeuta <noreply@terapeuta.app>'
  },

  // Konfiguracja aplikacji
  app: {
    name: 'Terapeuta',
    url: process.env.APP_URL || 'http://localhost:3000'
  },

  // Konfiguracja LLM
  llm: {
    provider: process.env.LLM_PROVIDER || 'openai',
    apiKey: process.env.LLM_API_KEY || '',
    model: process.env.LLM_MODEL || 'gpt-3.5-turbo'
  },

  // Konfiguracja powiadomień
  notifications: {
    // Czas w minutach przed sesją, kiedy wysyłane jest przypomnienie
    sessionReminderTime: 60,
    // Czas w dniach przed terminem zadania, kiedy wysyłane jest przypomnienie
    taskReminderTime: 1
  }
};

module.exports = config;
