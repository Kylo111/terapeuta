const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const User = require('../../app/data/models/user');
const Profile = require('../../app/data/models/profile');

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
});

// Zamknięcie połączenia z bazą danych po wszystkich testach
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Profile API', () => {
  let testUser, accessToken;

  beforeEach(async () => {
    // Utworzenie testowego użytkownika
    testUser = new User({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    });
    await testUser.save();

    // Wygenerowanie tokenu dostępu
    accessToken = jwt.sign(
      { id: testUser._id },
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '1h' }
    );
  });

  describe('POST /api/profiles', () => {
    it('should create a new profile successfully', async () => {
      const profileData = {
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
      
      const response = await request(app)
        .post('/api/profiles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(profileData)
        .expect('Content-Type', /json/)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.profile).toBeDefined();
      expect(response.body.data.profile.name).toBe(profileData.name);
      expect(response.body.data.profile.therapyMethod).toBe(profileData.therapyMethod);
      expect(response.body.data.profile.user).toBe(testUser._id.toString());
      
      // Sprawdzenie, czy profil został zapisany w bazie danych
      const profile = await Profile.findOne({ name: profileData.name });
      expect(profile).toBeDefined();
      expect(profile.name).toBe(profileData.name);
      expect(profile.user.toString()).toBe(testUser._id.toString());
    });
    
    it('should return error if required fields are missing', async () => {
      const profileData = {
        // Brak nazwy
        therapyMethod: 'cognitive_behavioral',
      };
      
      const response = await request(app)
        .post('/api/profiles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(profileData)
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toContain('required');
    });
    
    it('should return error if not authenticated', async () => {
      const profileData = {
        name: 'Test Profile',
        therapyMethod: 'cognitive_behavioral',
      };
      
      const response = await request(app)
        .post('/api/profiles')
        .send(profileData)
        .expect('Content-Type', /json/)
        .expect(401);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toContain('authentication');
    });
  });
  
  describe('GET /api/profiles', () => {
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
      
      const response = await request(app)
        .get('/api/profiles')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.profiles).toBeDefined();
      expect(response.body.data.profiles.length).toBe(2);
      expect(response.body.data.profiles[0].name).toBe('Profile 1');
      expect(response.body.data.profiles[1].name).toBe('Profile 2');
    });
    
    it('should return empty array if user has no profiles', async () => {
      const response = await request(app)
        .get('/api/profiles')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.profiles).toBeDefined();
      expect(response.body.data.profiles.length).toBe(0);
    });
    
    it('should return error if not authenticated', async () => {
      const response = await request(app)
        .get('/api/profiles')
        .expect('Content-Type', /json/)
        .expect(401);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toContain('authentication');
    });
  });
  
  describe('GET /api/profiles/:id', () => {
    it('should get a specific profile by ID', async () => {
      // Utworzenie testowego profilu
      const profile = new Profile({
        user: testUser._id,
        name: 'Test Profile',
        therapyMethod: 'cognitive_behavioral',
      });
      await profile.save();
      
      const response = await request(app)
        .get(`/api/profiles/${profile._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.profile).toBeDefined();
      expect(response.body.data.profile.name).toBe('Test Profile');
      expect(response.body.data.profile.therapyMethod).toBe('cognitive_behavioral');
      expect(response.body.data.profile.user).toBe(testUser._id.toString());
    });
    
    it('should return error if profile does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/profiles/${nonExistentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', /json/)
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toContain('not found');
    });
    
    it('should return error if trying to access another user\'s profile', async () => {
      // Utworzenie drugiego użytkownika
      const anotherUser = new User({
        email: 'another@example.com',
        password: 'password123',
        firstName: 'Another',
        lastName: 'User',
      });
      await anotherUser.save();
      
      // Utworzenie profilu dla drugiego użytkownika
      const profile = new Profile({
        user: anotherUser._id,
        name: 'Another Profile',
        therapyMethod: 'cognitive_behavioral',
      });
      await profile.save();
      
      const response = await request(app)
        .get(`/api/profiles/${profile._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', /json/)
        .expect(403);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toContain('not authorized');
    });
  });
  
  describe('PUT /api/profiles/:id', () => {
    it('should update a profile successfully', async () => {
      // Utworzenie testowego profilu
      const profile = new Profile({
        user: testUser._id,
        name: 'Test Profile',
        therapyMethod: 'cognitive_behavioral',
      });
      await profile.save();
      
      const updateData = {
        name: 'Updated Profile',
        therapyMethod: 'psychodynamic',
      };
      
      const response = await request(app)
        .put(`/api/profiles/${profile._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.profile).toBeDefined();
      expect(response.body.data.profile.name).toBe('Updated Profile');
      expect(response.body.data.profile.therapyMethod).toBe('psychodynamic');
      
      // Sprawdzenie, czy profil został zaktualizowany w bazie danych
      const updatedProfile = await Profile.findById(profile._id);
      expect(updatedProfile.name).toBe('Updated Profile');
      expect(updatedProfile.therapyMethod).toBe('psychodynamic');
    });
  });
  
  describe('DELETE /api/profiles/:id', () => {
    it('should delete a profile successfully', async () => {
      // Utworzenie testowego profilu
      const profile = new Profile({
        user: testUser._id,
        name: 'Test Profile',
        therapyMethod: 'cognitive_behavioral',
      });
      await profile.save();
      
      const response = await request(app)
        .delete(`/api/profiles/${profile._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      
      // Sprawdzenie, czy profil został usunięty z bazy danych
      const deletedProfile = await Profile.findById(profile._id);
      expect(deletedProfile).toBeNull();
    });
  });
});
