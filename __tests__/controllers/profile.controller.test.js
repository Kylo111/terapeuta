const mongoose = require('mongoose');
const profileController = require('../../app/controllers/profile.controller');
const User = require('../../app/data/models/user');
const Profile = require('../../app/data/models/profile');

// Mock dla req, res i next
const mockRequest = () => {
  const req = {};
  req.body = {};
  req.params = {};
  req.query = {};
  req.user = {};
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
  await Profile.deleteMany({});
  await User.deleteMany({});
  jest.clearAllMocks();
});

// Zamknięcie połączenia z bazą danych po wszystkich testach
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Profile Controller', () => {
  let testUser;

  beforeEach(async () => {
    // Utworzenie testowego użytkownika
    testUser = new User({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    });
    await testUser.save();
  });

  describe('createProfile', () => {
    it('should create a new profile successfully', async () => {
      const req = mockRequest();
      req.user = { id: testUser._id };
      req.body = {
        name: 'Test Profile',
        therapyMethod: 'cognitive_behavioral',
        goals: [
          {
            description: 'Reduce anxiety',
            priority: 'high',
          },
        ],
        challenges: [
          {
            description: 'Panic attacks',
            severity: 'high',
          },
        ],
      };
      
      const res = mockResponse();
      
      await profileController.createProfile(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            profile: expect.objectContaining({
              name: 'Test Profile',
              therapyMethod: 'cognitive_behavioral',
              user: testUser._id.toString(),
            }),
          }),
        })
      );
      
      // Sprawdzenie, czy profil został zapisany w bazie danych
      const profile = await Profile.findOne({ name: 'Test Profile' });
      expect(profile).toBeDefined();
      expect(profile.name).toBe('Test Profile');
      expect(profile.user.toString()).toBe(testUser._id.toString());
    });
    
    it('should return error if required fields are missing', async () => {
      const req = mockRequest();
      req.user = { id: testUser._id };
      req.body = {
        // Brak nazwy
        therapyMethod: 'cognitive_behavioral',
      };
      
      const res = mockResponse();
      
      await profileController.createProfile(req, res, mockNext);
      
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
  
  describe('getProfiles', () => {
    it('should get all profiles for the user', async () => {
      // Utworzenie testowych profili
      const profile1 = new Profile({
        user: testUser._id,
        name: 'Profile 1',
        therapyMethod: 'cognitive_behavioral',
      });
      await profile1.save();
      
      const profile2 = new Profile({
        user: testUser._id,
        name: 'Profile 2',
        therapyMethod: 'psychodynamic',
      });
      await profile2.save();
      
      const req = mockRequest();
      req.user = { id: testUser._id };
      
      const res = mockResponse();
      
      await profileController.getProfiles(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            profiles: expect.arrayContaining([
              expect.objectContaining({
                name: 'Profile 1',
                therapyMethod: 'cognitive_behavioral',
              }),
              expect.objectContaining({
                name: 'Profile 2',
                therapyMethod: 'psychodynamic',
              }),
            ]),
          }),
        })
      );
    });
  });
  
  describe('getProfile', () => {
    it('should get a specific profile by ID', async () => {
      // Utworzenie testowego profilu
      const profile = new Profile({
        user: testUser._id,
        name: 'Test Profile',
        therapyMethod: 'cognitive_behavioral',
      });
      await profile.save();
      
      const req = mockRequest();
      req.user = { id: testUser._id };
      req.params = { id: profile._id };
      
      const res = mockResponse();
      
      await profileController.getProfile(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            profile: expect.objectContaining({
              name: 'Test Profile',
              therapyMethod: 'cognitive_behavioral',
            }),
          }),
        })
      );
    });
    
    it('should return error if profile does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const req = mockRequest();
      req.user = { id: testUser._id };
      req.params = { id: nonExistentId };
      
      const res = mockResponse();
      
      await profileController.getProfile(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: expect.stringContaining('not found'),
          }),
        })
      );
    });
  });
  
  describe('updateProfile', () => {
    it('should update a profile successfully', async () => {
      // Utworzenie testowego profilu
      const profile = new Profile({
        user: testUser._id,
        name: 'Test Profile',
        therapyMethod: 'cognitive_behavioral',
      });
      await profile.save();
      
      const req = mockRequest();
      req.user = { id: testUser._id };
      req.params = { id: profile._id };
      req.body = {
        name: 'Updated Profile',
        therapyMethod: 'psychodynamic',
      };
      
      const res = mockResponse();
      
      await profileController.updateProfile(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            profile: expect.objectContaining({
              name: 'Updated Profile',
              therapyMethod: 'psychodynamic',
            }),
          }),
        })
      );
      
      // Sprawdzenie, czy profil został zaktualizowany w bazie danych
      const updatedProfile = await Profile.findById(profile._id);
      expect(updatedProfile.name).toBe('Updated Profile');
      expect(updatedProfile.therapyMethod).toBe('psychodynamic');
    });
  });
  
  describe('deleteProfile', () => {
    it('should delete a profile successfully', async () => {
      // Utworzenie testowego profilu
      const profile = new Profile({
        user: testUser._id,
        name: 'Test Profile',
        therapyMethod: 'cognitive_behavioral',
      });
      await profile.save();
      
      const req = mockRequest();
      req.user = { id: testUser._id };
      req.params = { id: profile._id };
      
      const res = mockResponse();
      
      await profileController.deleteProfile(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: null,
        })
      );
      
      // Sprawdzenie, czy profil został usunięty z bazy danych
      const deletedProfile = await Profile.findById(profile._id);
      expect(deletedProfile).toBeNull();
    });
  });
});
