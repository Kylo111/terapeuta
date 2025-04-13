const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Załadowanie zmiennych środowiskowych
dotenv.config();

// Inicjalizacja aplikacji Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Podstawowa trasa
app.get('/', (req, res) => {
  res.json({
    message: 'Witaj w API aplikacji Terapeuta',
    status: 'online',
    version: '1.0.0'
  });
});

// Obsługa błędów
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Wystąpił błąd serwera',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// Połączenie z bazą danych MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI_PROD 
      : process.env.MONGODB_URI;
    
    await mongoose.connect(mongoURI);
    console.log('Połączono z bazą danych MongoDB');
  } catch (error) {
    console.error('Błąd połączenia z bazą danych:', error.message);
    process.exit(1);
  }
};

// Uruchomienie serwera
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Serwer uruchomiony na porcie ${PORT}`);
  // Połącz z bazą danych
  // await connectDB();
  console.log(`Środowisko: ${process.env.NODE_ENV || 'development'}`);
});

// Obsługa zamknięcia aplikacji
process.on('SIGINT', async () => {
  // await mongoose.connection.close();
  console.log('Połączenie z bazą danych zamknięte');
  process.exit(0);
});
