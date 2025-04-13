const mongoose = require('mongoose');
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
  await Profile.deleteMany({});
  await User.deleteMany({});
});

// Zamknięcie połączenia z bazą danych po wszystkich testach
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Profile Model', () => {
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

  it('should create a new profile successfully', async () => {
    const profileData = {
      user: testUser._id,
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

    const profile = new Profile(profileData);
    const savedProfile = await profile.save();

    // Sprawdzenie, czy profil został zapisany
    expect(savedProfile._id).toBeDefined();
    expect(savedProfile.name).toBe(profileData.name);
    expect(savedProfile.therapyMethod).toBe(profileData.therapyMethod);
    expect(savedProfile.goals.length).toBe(1);
    expect(savedProfile.challenges.length).toBe(1);
    expect(savedProfile.createdAt).toBeDefined();
    expect(savedProfile.isActive).toBe(true);
  });

  it('should fail to create a profile without a user reference', async () => {
    const profileData = {
      name: 'Test Profile',
      therapyMethod: 'cognitive_behavioral',
    };

    const profile = new Profile(profileData);
    
    await expect(profile.save()).rejects.toThrow();
  });

  it('should fail to create a profile without a name', async () => {
    const profileData = {
      user: testUser._id,
      therapyMethod: 'cognitive_behavioral',
    };

    const profile = new Profile(profileData);
    
    await expect(profile.save()).rejects.toThrow();
  });

  it('should update emotional state correctly', async () => {
    const profileData = {
      user: testUser._id,
      name: 'Test Profile',
      therapyMethod: 'cognitive_behavioral',
    };

    const profile = new Profile(profileData);
    await profile.save();

    // Aktualizacja stanu emocjonalnego
    await profile.updateEmotionalState(3, 2, 8);
    
    // Pobieranie zaktualizowanego profilu
    const updatedProfile = await Profile.findById(profile._id);
    
    expect(updatedProfile.emotionalState.anxiety).toBe(3);
    expect(updatedProfile.emotionalState.depression).toBe(2);
    expect(updatedProfile.emotionalState.optimism).toBe(8);
    expect(updatedProfile.emotionalState.lastUpdated).toBeDefined();
  });

  it('should add a goal correctly', async () => {
    const profileData = {
      user: testUser._id,
      name: 'Test Profile',
      therapyMethod: 'cognitive_behavioral',
    };

    const profile = new Profile(profileData);
    await profile.save();

    // Dodanie nowego celu
    await profile.addGoal('Improve sleep quality', 'medium');
    
    // Pobieranie zaktualizowanego profilu
    const updatedProfile = await Profile.findById(profile._id);
    
    expect(updatedProfile.goals.length).toBe(1);
    expect(updatedProfile.goals[0].description).toBe('Improve sleep quality');
    expect(updatedProfile.goals[0].priority).toBe('medium');
    expect(updatedProfile.goals[0].status).toBe('active');
    expect(updatedProfile.goals[0].createdAt).toBeDefined();
  });

  it('should complete a goal correctly', async () => {
    const profileData = {
      user: testUser._id,
      name: 'Test Profile',
      therapyMethod: 'cognitive_behavioral',
      goals: [
        {
          description: 'Reduce anxiety',
          priority: 'high',
          status: 'active',
        },
      ],
    };

    const profile = new Profile(profileData);
    await profile.save();

    // Oznaczenie celu jako ukończonego
    const goalId = profile.goals[0]._id;
    await profile.completeGoal(goalId);
    
    // Pobieranie zaktualizowanego profilu
    const updatedProfile = await Profile.findById(profile._id);
    
    expect(updatedProfile.goals[0].status).toBe('completed');
    expect(updatedProfile.goals[0].completedAt).toBeDefined();
  });
});
