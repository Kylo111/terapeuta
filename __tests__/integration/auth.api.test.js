const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../app/data/models/user');
const Device = require('../../app/data/models/device');

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
  await Device.deleteMany({});
});

// Zamknięcie połączenia z bazą danych po wszystkich testach
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.firstName).toBe(userData.firstName);
      expect(response.body.data.user.lastName).toBe(userData.lastName);
      
      // Sprawdzenie, czy użytkownik został zapisany w bazie danych
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
    });
    
    it('should return error if email already exists', async () => {
      // Utworzenie użytkownika
      const existingUser = new User({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      });
      await existingUser.save();
      
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toContain('Email already exists');
    });
    
    it('should return error if required fields are missing', async () => {
      const userData = {
        email: 'test@example.com',
        // Brak hasła
        firstName: 'Test',
        lastName: 'User',
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toContain('required');
    });
  });
  
  describe('POST /api/auth/login', () => {
    it('should login a user successfully and return tokens', async () => {
      // Utworzenie użytkownika
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };
      
      const user = new User(userData);
      await user.save();
      
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
        deviceName: 'Test Device',
      };
      
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.data.deviceId).toBeDefined();
      
      // Sprawdzenie, czy urządzenie zostało zapisane w bazie danych
      const device = await Device.findOne({ user: user._id });
      expect(device).toBeDefined();
      expect(device.name).toBe('Test Device');
    });
    
    it('should return error if email does not exist', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };
      
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect('Content-Type', /json/)
        .expect(401);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toContain('Invalid credentials');
    });
    
    it('should return error if password is incorrect', async () => {
      // Utworzenie użytkownika
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };
      
      const user = new User(userData);
      await user.save();
      
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect('Content-Type', /json/)
        .expect(401);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toContain('Invalid credentials');
    });
  });
});
