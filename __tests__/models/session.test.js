const mongoose = require('mongoose');
const Session = require('../../app/data/models/session');
const Profile = require('../../app/data/models/profile');
const User = require('../../app/data/models/user');

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
});

// Zamknięcie połączenia z bazą danych po wszystkich testach
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Session Model', () => {
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

  it('should create a new session successfully', async () => {
    const sessionData = {
      profile: testProfile._id,
      therapyMethod: 'cognitive_behavioral',
      sessionNumber: 1,
      continuityStatus: 'new',
      conversation: [
        {
          role: 'system',
          content: 'Rozpoczynamy sesję terapii poznawczo-behawioralnej.',
        },
      ],
    };

    const session = new Session(sessionData);
    const savedSession = await session.save();

    // Sprawdzenie, czy sesja została zapisana
    expect(savedSession._id).toBeDefined();
    expect(savedSession.profile.toString()).toBe(testProfile._id.toString());
    expect(savedSession.therapyMethod).toBe(sessionData.therapyMethod);
    expect(savedSession.sessionNumber).toBe(sessionData.sessionNumber);
    expect(savedSession.continuityStatus).toBe(sessionData.continuityStatus);
    expect(savedSession.conversation.length).toBe(1);
    expect(savedSession.startTime).toBeDefined();
    expect(savedSession.isCompleted).toBe(false);
  });

  it('should fail to create a session without a profile reference', async () => {
    const sessionData = {
      therapyMethod: 'cognitive_behavioral',
      sessionNumber: 1,
    };

    const session = new Session(sessionData);
    
    await expect(session.save()).rejects.toThrow();
  });

  it('should fail to create a session without a therapy method', async () => {
    const sessionData = {
      profile: testProfile._id,
      sessionNumber: 1,
    };

    const session = new Session(sessionData);
    
    await expect(session.save()).rejects.toThrow();
  });

  it('should add a message to conversation correctly', async () => {
    const sessionData = {
      profile: testProfile._id,
      therapyMethod: 'cognitive_behavioral',
      sessionNumber: 1,
      continuityStatus: 'new',
      conversation: [
        {
          role: 'system',
          content: 'Rozpoczynamy sesję terapii poznawczo-behawioralnej.',
        },
      ],
    };

    const session = new Session(sessionData);
    await session.save();

    // Dodanie nowej wiadomości
    await session.addMessage('assistant', 'Jak się dzisiaj czujesz?');
    
    // Pobieranie zaktualizowanej sesji
    const updatedSession = await Session.findById(session._id);
    
    expect(updatedSession.conversation.length).toBe(2);
    expect(updatedSession.conversation[1].role).toBe('assistant');
    expect(updatedSession.conversation[1].content).toBe('Jak się dzisiaj czujesz?');
    expect(updatedSession.conversation[1].timestamp).toBeDefined();
  });

  it('should end a session correctly', async () => {
    const sessionData = {
      profile: testProfile._id,
      therapyMethod: 'cognitive_behavioral',
      sessionNumber: 1,
      continuityStatus: 'new',
      metrics: {
        emotionalStateStart: {
          anxiety: 7,
          depression: 5,
          optimism: 3,
        },
      },
    };

    const session = new Session(sessionData);
    await session.save();

    // Zakończenie sesji
    const summary = {
      mainTopics: ['Stres w pracy', 'Techniki relaksacyjne'],
      keyInsights: 'Pacjent zidentyfikował główne źródła stresu',
      progress: 'Widoczna poprawa w radzeniu sobie ze stresem',
      homework: 'Dziennik myśli, ćwiczenia relaksacyjne',
    };
    
    const emotionalStateEnd = {
      anxiety: 5,
      depression: 4,
      optimism: 6,
    };
    
    const effectivenessRating = 8;
    
    await session.endSession(summary, emotionalStateEnd, effectivenessRating);
    
    // Pobieranie zaktualizowanej sesji
    const updatedSession = await Session.findById(session._id);
    
    expect(updatedSession.isCompleted).toBe(true);
    expect(updatedSession.endTime).toBeDefined();
    expect(updatedSession.summary).toEqual(summary);
    expect(updatedSession.metrics.emotionalStateEnd).toEqual(emotionalStateEnd);
    expect(updatedSession.metrics.sessionEffectivenessRating).toBe(effectivenessRating);
  });
});
