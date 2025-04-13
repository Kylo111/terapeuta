const mongoose = require('mongoose');
const Task = require('../../app/data/models/task');
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
  await Task.deleteMany({});
  await Session.deleteMany({});
  await Profile.deleteMany({});
  await User.deleteMany({});
});

// Zamknięcie połączenia z bazą danych po wszystkich testach
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Task Model', () => {
  let testUser, testProfile, testSession;

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

    // Utworzenie testowej sesji
    testSession = new Session({
      profile: testProfile._id,
      therapyMethod: 'cognitive_behavioral',
      sessionNumber: 1,
      continuityStatus: 'new',
    });
    await testSession.save();
  });

  it('should create a new task successfully', async () => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);

    const taskData = {
      profile: testProfile._id,
      session: testSession._id,
      description: 'Dziennik myśli - zapisuj swoje myśli i emocje przez 7 dni',
      category: 'dziennik',
      deadline,
      priority: 'high',
      reminders: [
        {
          time: new Date(),
          message: 'Pamiętaj o wypełnieniu dziennika myśli',
        },
      ],
    };

    const task = new Task(taskData);
    const savedTask = await task.save();

    // Sprawdzenie, czy zadanie zostało zapisane
    expect(savedTask._id).toBeDefined();
    expect(savedTask.profile.toString()).toBe(testProfile._id.toString());
    expect(savedTask.session.toString()).toBe(testSession._id.toString());
    expect(savedTask.description).toBe(taskData.description);
    expect(savedTask.category).toBe(taskData.category);
    expect(savedTask.deadline).toEqual(taskData.deadline);
    expect(savedTask.priority).toBe(taskData.priority);
    expect(savedTask.status).toBe('pending');
    expect(savedTask.reminders.length).toBe(1);
    expect(savedTask.createdAt).toBeDefined();
  });

  it('should fail to create a task without a profile reference', async () => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);

    const taskData = {
      session: testSession._id,
      description: 'Dziennik myśli',
      deadline,
    };

    const task = new Task(taskData);
    
    await expect(task.save()).rejects.toThrow();
  });

  it('should fail to create a task without a session reference', async () => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);

    const taskData = {
      profile: testProfile._id,
      description: 'Dziennik myśli',
      deadline,
    };

    const task = new Task(taskData);
    
    await expect(task.save()).rejects.toThrow();
  });

  it('should fail to create a task without a description', async () => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);

    const taskData = {
      profile: testProfile._id,
      session: testSession._id,
      deadline,
    };

    const task = new Task(taskData);
    
    await expect(task.save()).rejects.toThrow();
  });

  it('should mark a task as completed correctly', async () => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);

    const taskData = {
      profile: testProfile._id,
      session: testSession._id,
      description: 'Dziennik myśli - zapisuj swoje myśli i emocje przez 7 dni',
      category: 'dziennik',
      deadline,
      priority: 'high',
    };

    const task = new Task(taskData);
    await task.save();

    // Oznaczenie zadania jako ukończonego
    const completionData = {
      successRating: 8,
      challenges: 'Trudno było znaleźć czas na codzienne wpisy',
      reflections: 'Zauważyłem, że moje myśli są często negatywne',
      emotionalResponse: 'Czuję się lepiej, gdy zapisuję swoje myśli',
    };
    
    await task.markAsCompleted(completionData);
    
    // Pobieranie zaktualizowanego zadania
    const updatedTask = await Task.findById(task._id);
    
    expect(updatedTask.status).toBe('completed');
    expect(updatedTask.completionData.completionDate).toBeDefined();
    expect(updatedTask.completionData.successRating).toBe(completionData.successRating);
    expect(updatedTask.completionData.challenges).toBe(completionData.challenges);
    expect(updatedTask.completionData.reflections).toBe(completionData.reflections);
    expect(updatedTask.completionData.emotionalResponse).toBe(completionData.emotionalResponse);
  });
});
