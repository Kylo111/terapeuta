const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const notificationCron = require('./app/cron/notification.cron');
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
const healthRoutes = require('./app/routes/health.routes');
const therapyMethodRoutes = require('./app/routes/therapy-method.routes');
const promptRoutes = require('./app/routes/prompt.routes');
const authRoutes = require('./app/routes/auth.routes');
const sessionRoutes = require('./app/routes/session.routes');
const llmRoutes = require('./app/routes/llm.routes');
const taskRoutes = require('./app/routes/task.routes');
const reminderRoutes = require('./app/routes/reminder.routes');
const reportRoutes = require('./app/routes/report.routes');
const exportRoutes = require('./app/routes/export.routes');
const exerciseRoutes = require('./app/routes/exercise.routes');
const thoughtJournalRoutes = require('./app/routes/thought-journal.routes');
const notificationRoutes = require('./app/routes/notification.routes');
// Tymczasowo wyłączamy importy, które mogą powodować problemy
// const usersApi = require('./app/api/users_api');
// const profilesApi = require('./app/api/profiles_api');
// const therapyApi = require('./app/api/therapy_api');

// Rejestracja tras API
app.use('/api/health', healthRoutes);
app.use('/api/therapy-methods', therapyMethodRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', sessionRoutes);
app.use('/api/llm', llmRoutes);
app.use('/api', taskRoutes);
app.use('/api', reminderRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/journal', thoughtJournalRoutes);
app.use('/api/notifications', notificationRoutes);
// app.use('/api/users', usersApi);
// app.use('/api/profiles', profilesApi);
// app.use('/api/therapy', therapyApi);

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

  // Inicjalizacja zadań cron
  notificationCron.initNotificationCron();
  console.log('Zainicjalizowano zadania cron do wysyłania powiadomień');
});

// Obsługa zamknięcia aplikacji
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Połączenie z bazą danych zamknięte');
  process.exit(0);
});

// Eksport aplikacji dla testów
module.exports = app;
