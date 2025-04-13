const mongoose = require('mongoose');
const User = require('../../app/data/models/user');
const bcrypt = require('bcrypt');

// Konfiguracja połączenia z bazą danych testową
beforeAll(async () => {
  const url = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/terapeuta_test';
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Czyszczenie bazy danych po testach
afterEach(async () => {
  await User.deleteMany({});
});

// Zamknięcie połączenia z bazą danych po wszystkich testach
afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Model', () => {
  it('should create a new user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    const user = new User(userData);
    const savedUser = await user.save();

    // Sprawdzenie, czy użytkownik został zapisany
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.firstName).toBe(userData.firstName);
    expect(savedUser.lastName).toBe(userData.lastName);
    expect(savedUser.createdAt).toBeDefined();
    expect(savedUser.isActive).toBe(true);

    // Sprawdzenie, czy hasło zostało zahaszowane
    expect(savedUser.password).not.toBe(userData.password);
  });

  it('should fail to create a user with invalid email', async () => {
    const userData = {
      email: 'invalid-email',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    const user = new User(userData);
    
    await expect(user.save()).rejects.toThrow();
  });

  it('should fail to create a user with missing required fields', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
    };

    const user = new User(userData);
    
    await expect(user.save()).rejects.toThrow();
  });

  it('should correctly compare passwords', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    const user = new User(userData);
    await user.save();

    // Pobieranie użytkownika z hasłem
    const savedUser = await User.findOne({ email: userData.email }).select('+password');
    
    // Sprawdzenie poprawnego hasła
    const isMatch = await savedUser.comparePassword(userData.password);
    expect(isMatch).toBe(true);

    // Sprawdzenie niepoprawnego hasła
    const isNotMatch = await savedUser.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });

  it('should have default settings', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    const user = new User(userData);
    const savedUser = await user.save();

    // Sprawdzenie domyślnych ustawień
    expect(savedUser.settings).toBeDefined();
    expect(savedUser.settings.preferredLLMProvider).toBe('openai');
    expect(savedUser.settings.preferredModel).toBe('gpt-4');
    expect(savedUser.settings.theme).toBe('system');
    expect(savedUser.settings.language).toBe('pl');
    expect(savedUser.settings.notifications.email).toBe(true);
    expect(savedUser.settings.notifications.push).toBe(true);
  });
});
