const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authController = require('../../app/controllers/auth.controller');
const User = require('../../app/data/models/user');
const Device = require('../../app/data/models/device');

// Mock dla req, res i next
const mockRequest = () => {
  const req = {};
  req.body = {};
  req.params = {};
  req.query = {};
  req.headers = {};
  return req;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

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
  jest.clearAllMocks();
});

// Zamknięcie połączenia z bazą danych po wszystkich testach
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth Controller', () => {
  describe('register', () => {
    it('should register a new user successfully', async () => {
      const req = mockRequest();
      req.body = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };
      
      const res = mockResponse();
      
      await authController.register(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            user: expect.objectContaining({
              email: 'test@example.com',
              firstName: 'Test',
              lastName: 'User',
            }),
          }),
        })
      );
      
      // Sprawdzenie, czy użytkownik został zapisany w bazie danych
      const user = await User.findOne({ email: 'test@example.com' });
      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
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
      
      const req = mockRequest();
      req.body = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };
      
      const res = mockResponse();
      
      await authController.register(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: expect.stringContaining('Email already exists'),
          }),
        })
      );
    });
    
    it('should return error if required fields are missing', async () => {
      const req = mockRequest();
      req.body = {
        email: 'test@example.com',
        // Brak hasła
        firstName: 'Test',
        lastName: 'User',
      };
      
      const res = mockResponse();
      
      await authController.register(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: expect.stringContaining('required'),
          }),
        })
      );
    });
  });
  
  describe('login', () => {
    it('should login a user successfully and return tokens', async () => {
      // Utworzenie użytkownika
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = new User({
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
      });
      await user.save();
      
      const req = mockRequest();
      req.body = {
        email: 'test@example.com',
        password: 'password123',
        deviceName: 'Test Device',
      };
      
      const res = mockResponse();
      
      await authController.login(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            user: expect.objectContaining({
              email: 'test@example.com',
              firstName: 'Test',
              lastName: 'User',
            }),
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
            deviceId: expect.any(String),
          }),
        })
      );
      
      // Sprawdzenie, czy urządzenie zostało zapisane w bazie danych
      const device = await Device.findOne({ user: user._id });
      expect(device).toBeDefined();
      expect(device.name).toBe('Test Device');
    });
    
    it('should return error if email does not exist', async () => {
      const req = mockRequest();
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };
      
      const res = mockResponse();
      
      await authController.login(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: expect.stringContaining('Invalid credentials'),
          }),
        })
      );
    });
    
    it('should return error if password is incorrect', async () => {
      // Utworzenie użytkownika
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = new User({
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
      });
      await user.save();
      
      const req = mockRequest();
      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      
      const res = mockResponse();
      
      await authController.login(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: expect.stringContaining('Invalid credentials'),
          }),
        })
      );
    });
  });
});
