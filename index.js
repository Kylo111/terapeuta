const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
let Sentry;

// Warunkowy import Sentry
try {
  Sentry = require('@sentry/node');
} catch (error) {
  console.log('Sentry nie jest zainstalowany lub skonfigurowany');
  // Tworzymy pusty obiekt Sentry, aby uniknąć błędów
  Sentry = {
    init: () => {},
    Handlers: {
      requestHandler: () => (req, res, next) => next(),
      errorHandler: () => (err, req, res, next) => next(err)
    }
  };
}

// Załadowanie zmiennych środowiskowych
dotenv.config();

// Inicjalizacja Sentry
if (process.env.SENTRY_DSN && Sentry.init) {
  try {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: 1.0,
    });
    console.log('Sentry zainicjalizowany');
  } catch (error) {
    console.error('Błąd inicjalizacji Sentry:', error);
  }
}

// Inicjalizacja aplikacji Express
const app = express();

// Middleware
// Sentry request handler musi być pierwszym middleware
if (Sentry.Handlers && Sentry.Handlers.requestHandler) {
  app.use(Sentry.Handlers.requestHandler());
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importowanie tras API
// Tymczasowo wyłączamy importy, które mogą powodować problemy
// const authApi = require('./app/api/auth_api').router;
// const usersApi = require('./app/api/users_api');
// const profilesApi = require('./app/api/profiles_api');
// const sessionsApi = require('./app/api/sessions_api');
// const tasksApi = require('./app/api/tasks_api');
// const llmApi = require('./app/api/llm_api');
// const therapyApi = require('./app/api/therapy_api');
const healthRoutes = require('./app/routes/health.routes');
const therapyMethodRoutes = require('./app/routes/therapy-method.routes');
const promptRoutes = require('./app/routes/prompt.routes');

// Rejestracja tras API
// app.use('/api/auth', authApi);
// app.use('/api/users', usersApi);
// app.use('/api/profiles', profilesApi);
// app.use('/api', sessionsApi);
// app.use('/api', tasksApi);
// app.use('/api/llm', llmApi);
// app.use('/api/therapy', therapyApi);
app.use('/api/health', healthRoutes);
app.use('/api/therapy-methods', therapyMethodRoutes);
app.use('/api/prompts', promptRoutes);

// Podstawowa trasa
app.get('/', (req, res) => {
  res.json({
    message: 'Witaj w API aplikacji Terapeuta',
    status: 'online',
    version: '1.0.0'
  });
});

// Sentry error handler musi być przed innymi middleware obsługującymi błędy
if (Sentry.Handlers && Sentry.Handlers.errorHandler) {
  app.use(Sentry.Handlers.errorHandler());
}

// Obsługa błędów
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Wystąpił błąd serwera',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    eventId: res.sentry
  });
});

// Połączenie z bazą danych MongoDB
const connectDB = async () => {
  try {
    // Zawsze używamy MongoDB Atlas w tym przypadku
    // Próbujemy użyć zmiennej środowiskowej, a jeśli nie jest dostępna, używamy bezpośrednio URI
    const mongoURI = process.env.MONGODB_URI_PROD || 'mongodb+srv://terapeuta-admin:QlKtVvNZ95MJoD2C@cluster0.xhbixsy.mongodb.net/terapeuta?retryWrites=true&w=majority&appName=Cluster0';

    console.log('Próba połączenia z bazą danych MongoDB');

    await mongoose.connect(mongoURI);
    console.log('Połączono z bazą danych MongoDB');
    return true;
  } catch (error) {
    console.error('Błąd połączenia z bazą danych:', error.message);
    // Nie kończymy procesu w przypadku błędu
    // process.exit(1);
    return false;
  }
};

// Uruchomienie serwera
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Serwer uruchomiony na porcie ${PORT}`);
  // Połącz z bazą danych
  await connectDB();
  console.log(`Środowisko: ${process.env.NODE_ENV || 'development'}`);
});

// Obsługa zamknięcia aplikacji
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Połączenie z bazą danych zamknięte');
  process.exit(0);
});

// Eksport aplikacji dla testów
module.exports = app;
