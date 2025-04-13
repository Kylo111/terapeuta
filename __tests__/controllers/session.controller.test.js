const mongoose = require('mongoose');
const sessionController = require('../../app/controllers/session.controller');
const User = require('../../app/data/models/user');
const Profile = require('../../app/data/models/profile');
const Session = require('../../app/data/models/session');

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
  await Session.deleteMany({});
  await Profile.deleteMany({});
  await User.deleteMany({});
  jest.clearAllMocks();
});

// Zamknięcie połączenia z bazą danych po wszystkich testach
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Session Controller', () => {
  let testUser, testProfile;

  beforeEach(async () => {
    // Utworzenie testowego użytkownika
    testUser = new User({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    });
    await testUser.save();

    // Utworzenie testowego profilu
    testProfile = new Profile({
      user: testUser._id,
      name: 'Test Profile',
      therapyMethod: 'cognitive_behavioral',
    });
    await testProfile.save();
  });

  describe('createSession', () => {
    it('should create a new session successfully', async () => {
      const req = mockRequest();
      req.user = { id: testUser._id };
      req.body = {
        profile: testProfile._id,
        therapyMethod: 'cognitive_behavioral',
        initialMessage: 'Dzień dobry, jak się dzisiaj czujesz?',
        mood: 5,
      };
      
      const res = mockResponse();
      
      await sessionController.createSession(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            session: expect.objectContaining({
              profile: testProfile._id.toString(),
              therapyMethod: 'cognitive_behavioral',
            }),
          }),
        })
      );
      
      // Sprawdzenie, czy sesja została zapisana w bazie danych
      const session = await Session.findOne({ profile: testProfile._id });
      expect(session).toBeDefined();
      expect(session.therapyMethod).toBe('cognitive_behavioral');
    });
    
    it('should return error if required fields are missing', async () => {
      const req = mockRequest();
      req.user = { id: testUser._id };
      req.body = {
        // Brak profilu
        therapyMethod: 'cognitive_behavioral',
      };
      
      const res = mockResponse();
      
      await sessionController.createSession(req, res, mockNext);
      
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
  
  describe('getSessions', () => {
    it('should get all sessions for the user', async () => {
      // Utworzenie testowych sesji
      const session1 = new Session({
        profile: testProfile._id,
        therapyMethod: 'cognitive_behavioral',
        sessionNumber: 1,
        continuityStatus: 'new',
      });
      await session1.save();
      
      const session2 = new Session({
        profile: testProfile._id,
        therapyMethod: 'cognitive_behavioral',
        sessionNumber: 2,
        continuityStatus: 'continuation',
      });
      await session2.save();
      
      const req = mockRequest();
      req.user = { id: testUser._id };
      
      const res = mockResponse();
      
      await sessionController.getSessions(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            sessions: expect.arrayContaining([
              expect.objectContaining({
                profile: testProfile._id.toString(),
                sessionNumber: 1,
              }),
              expect.objectContaining({
                profile: testProfile._id.toString(),
                sessionNumber: 2,
              }),
            ]),
          }),
        })
      );
    });
    
    it('should filter sessions by profile ID', async () => {
      // Utworzenie drugiego profilu
      const testProfile2 = new Profile({
        user: testUser._id,
        name: 'Test Profile 2',
        therapyMethod: 'psychodynamic',
      });
      await testProfile2.save();
      
      // Utworzenie testowych sesji dla różnych profili
      const session1 = new Session({
        profile: testProfile._id,
        therapyMethod: 'cognitive_behavioral',
        sessionNumber: 1,
      });
      await session1.save();
      
      const session2 = new Session({
        profile: testProfile2._id,
        therapyMethod: 'psychodynamic',
        sessionNumber: 1,
      });
      await session2.save();
      
      const req = mockRequest();
      req.user = { id: testUser._id };
      req.query = { profileId: testProfile._id };
      
      const res = mockResponse();
      
      await sessionController.getSessions(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            sessions: expect.arrayContaining([
              expect.objectContaining({
                profile: testProfile._id.toString(),
                therapyMethod: 'cognitive_behavioral',
              }),
            ]),
          }),
        })
      );
      
      // Sprawdzenie, czy zwrócono tylko jedną sesję
      const sessions = res.json.mock.calls[0][0].data.sessions;
      expect(sessions.length).toBe(1);
    });
  });
  
  describe('getSession', () => {
    it('should get a specific session by ID', async () => {
      // Utworzenie testowej sesji
      const session = new Session({
        profile: testProfile._id,
        therapyMethod: 'cognitive_behavioral',
        sessionNumber: 1,
        continuityStatus: 'new',
      });
      await session.save();
      
      const req = mockRequest();
      req.user = { id: testUser._id };
      req.params = { id: session._id };
      
      const res = mockResponse();
      
      await sessionController.getSession(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            session: expect.objectContaining({
              profile: testProfile._id.toString(),
              therapyMethod: 'cognitive_behavioral',
              sessionNumber: 1,
            }),
          }),
        })
      );
    });
    
    it('should return error if session does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const req = mockRequest();
      req.user = { id: testUser._id };
      req.params = { id: nonExistentId };
      
      const res = mockResponse();
      
      await sessionController.getSession(req, res, mockNext);
      
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
  
  describe('updateSession', () => {
    it('should update a session successfully', async () => {
      // Utworzenie testowej sesji
      const session = new Session({
        profile: testProfile._id,
        therapyMethod: 'cognitive_behavioral',
        sessionNumber: 1,
        continuityStatus: 'new',
      });
      await session.save();
      
      const req = mockRequest();
      req.user = { id: testUser._id };
      req.params = { id: session._id };
      req.body = {
        summary: 'Omówienie technik radzenia sobie ze stresem',
        notes: 'Pacjent zgłasza poprawę w radzeniu sobie ze stresem',
      };
      
      const res = mockResponse();
      
      await sessionController.updateSession(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            session: expect.objectContaining({
              summary: 'Omówienie technik radzenia sobie ze stresem',
              notes: 'Pacjent zgłasza poprawę w radzeniu sobie ze stresem',
            }),
          }),
        })
      );
      
      // Sprawdzenie, czy sesja została zaktualizowana w bazie danych
      const updatedSession = await Session.findById(session._id);
      expect(updatedSession.summary).toBe('Omówienie technik radzenia sobie ze stresem');
      expect(updatedSession.notes).toBe('Pacjent zgłasza poprawę w radzeniu sobie ze stresem');
    });
  });
});
