const mongoose = require('mongoose');
const taskController = require('../../app/controllers/task.controller');
const User = require('../../app/data/models/user');
const Profile = require('../../app/data/models/profile');
const Session = require('../../app/data/models/session');
const Task = require('../../app/data/models/task');

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
  await Task.deleteMany({});
  await Session.deleteMany({});
  await Profile.deleteMany({});
  await User.deleteMany({});
  jest.clearAllMocks();
});

// Zamknięcie połączenia z bazą danych po wszystkich testach
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Task Controller', () => {
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

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 7);

      const req = mockRequest();
      req.user = { id: testUser._id };
      req.body = {
        profile: testProfile._id,
        session: testSession._id,
        description: 'Dziennik myśli - zapisuj swoje myśli i emocje przez 7 dni',
        category: 'dziennik',
        deadline,
        priority: 'high',
      };
      
      const res = mockResponse();
      
      await taskController.createTask(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            task: expect.objectContaining({
              profile: testProfile._id.toString(),
              session: testSession._id.toString(),
              description: 'Dziennik myśli - zapisuj swoje myśli i emocje przez 7 dni',
              category: 'dziennik',
              priority: 'high',
            }),
          }),
        })
      );
      
      // Sprawdzenie, czy zadanie zostało zapisane w bazie danych
      const task = await Task.findOne({ description: 'Dziennik myśli - zapisuj swoje myśli i emocje przez 7 dni' });
      expect(task).toBeDefined();
      expect(task.profile.toString()).toBe(testProfile._id.toString());
      expect(task.session.toString()).toBe(testSession._id.toString());
    });
    
    it('should return error if required fields are missing', async () => {
      const req = mockRequest();
      req.user = { id: testUser._id };
      req.body = {
        profile: testProfile._id,
        session: testSession._id,
        // Brak opisu
        category: 'dziennik',
      };
      
      const res = mockResponse();
      
      await taskController.createTask(req, res, mockNext);
      
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
  
  describe('getTasks', () => {
    it('should get all tasks for the user', async () => {
      // Utworzenie testowych zadań
      const deadline1 = new Date();
      deadline1.setDate(deadline1.getDate() + 7);
      
      const task1 = new Task({
        profile: testProfile._id,
        session: testSession._id,
        description: 'Dziennik myśli - zadanie 1',
        category: 'dziennik',
        deadline: deadline1,
        priority: 'high',
      });
      await task1.save();
      
      const deadline2 = new Date();
      deadline2.setDate(deadline2.getDate() + 14);
      
      const task2 = new Task({
        profile: testProfile._id,
        session: testSession._id,
        description: 'Ćwiczenia relaksacyjne - zadanie 2',
        category: 'relaksacja',
        deadline: deadline2,
        priority: 'medium',
      });
      await task2.save();
      
      const req = mockRequest();
      req.user = { id: testUser._id };
      
      const res = mockResponse();
      
      await taskController.getTasks(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            tasks: expect.arrayContaining([
              expect.objectContaining({
                profile: testProfile._id.toString(),
                description: 'Dziennik myśli - zadanie 1',
              }),
              expect.objectContaining({
                profile: testProfile._id.toString(),
                description: 'Ćwiczenia relaksacyjne - zadanie 2',
              }),
            ]),
          }),
        })
      );
    });
    
    it('should filter tasks by profile ID', async () => {
      // Utworzenie drugiego profilu
      const testProfile2 = new Profile({
        user: testUser._id,
        name: 'Test Profile 2',
        therapyMethod: 'psychodynamic',
      });
      await testProfile2.save();
      
      // Utworzenie drugiej sesji
      const testSession2 = new Session({
        profile: testProfile2._id,
        therapyMethod: 'psychodynamic',
        sessionNumber: 1,
        continuityStatus: 'new',
      });
      await testSession2.save();
      
      // Utworzenie testowych zadań dla różnych profili
      const deadline1 = new Date();
      deadline1.setDate(deadline1.getDate() + 7);
      
      const task1 = new Task({
        profile: testProfile._id,
        session: testSession._id,
        description: 'Zadanie dla profilu 1',
        category: 'dziennik',
        deadline: deadline1,
        priority: 'high',
      });
      await task1.save();
      
      const deadline2 = new Date();
      deadline2.setDate(deadline2.getDate() + 14);
      
      const task2 = new Task({
        profile: testProfile2._id,
        session: testSession2._id,
        description: 'Zadanie dla profilu 2',
        category: 'relaksacja',
        deadline: deadline2,
        priority: 'medium',
      });
      await task2.save();
      
      const req = mockRequest();
      req.user = { id: testUser._id };
      req.query = { profileId: testProfile._id };
      
      const res = mockResponse();
      
      await taskController.getTasks(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            tasks: expect.arrayContaining([
              expect.objectContaining({
                profile: testProfile._id.toString(),
                description: 'Zadanie dla profilu 1',
              }),
            ]),
          }),
        })
      );
      
      // Sprawdzenie, czy zwrócono tylko jedno zadanie
      const tasks = res.json.mock.calls[0][0].data.tasks;
      expect(tasks.length).toBe(1);
    });
    
    it('should filter tasks by status', async () => {
      // Utworzenie testowych zadań o różnych statusach
      const deadline1 = new Date();
      deadline1.setDate(deadline1.getDate() + 7);
      
      const task1 = new Task({
        profile: testProfile._id,
        session: testSession._id,
        description: 'Zadanie w trakcie',
        category: 'dziennik',
        deadline: deadline1,
        priority: 'high',
        status: 'in_progress',
      });
      await task1.save();
      
      const deadline2 = new Date();
      deadline2.setDate(deadline2.getDate() + 14);
      
      const task2 = new Task({
        profile: testProfile._id,
        session: testSession._id,
        description: 'Zadanie ukończone',
        category: 'relaksacja',
        deadline: deadline2,
        priority: 'medium',
        status: 'completed',
      });
      await task2.save();
      
      const req = mockRequest();
      req.user = { id: testUser._id };
      req.query = { status: 'completed' };
      
      const res = mockResponse();
      
      await taskController.getTasks(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            tasks: expect.arrayContaining([
              expect.objectContaining({
                description: 'Zadanie ukończone',
                status: 'completed',
              }),
            ]),
          }),
        })
      );
      
      // Sprawdzenie, czy zwrócono tylko jedno zadanie
      const tasks = res.json.mock.calls[0][0].data.tasks;
      expect(tasks.length).toBe(1);
    });
  });
  
  describe('getTask', () => {
    it('should get a specific task by ID', async () => {
      // Utworzenie testowego zadania
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 7);
      
      const task = new Task({
        profile: testProfile._id,
        session: testSession._id,
        description: 'Testowe zadanie',
        category: 'dziennik',
        deadline,
        priority: 'high',
      });
      await task.save();
      
      const req = mockRequest();
      req.user = { id: testUser._id };
      req.params = { id: task._id };
      
      const res = mockResponse();
      
      await taskController.getTask(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            task: expect.objectContaining({
              profile: testProfile._id.toString(),
              session: testSession._id.toString(),
              description: 'Testowe zadanie',
              category: 'dziennik',
              priority: 'high',
            }),
          }),
        })
      );
    });
    
    it('should return error if task does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const req = mockRequest();
      req.user = { id: testUser._id };
      req.params = { id: nonExistentId };
      
      const res = mockResponse();
      
      await taskController.getTask(req, res, mockNext);
      
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
  
  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      // Utworzenie testowego zadania
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 7);
      
      const task = new Task({
        profile: testProfile._id,
        session: testSession._id,
        description: 'Testowe zadanie',
        category: 'dziennik',
        deadline,
        priority: 'high',
      });
      await task.save();
      
      const newDeadline = new Date();
      newDeadline.setDate(newDeadline.getDate() + 14);
      
      const req = mockRequest();
      req.user = { id: testUser._id };
      req.params = { id: task._id };
      req.body = {
        description: 'Zaktualizowane zadanie',
        category: 'relaksacja',
        deadline: newDeadline,
        priority: 'medium',
      };
      
      const res = mockResponse();
      
      await taskController.updateTask(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            task: expect.objectContaining({
              description: 'Zaktualizowane zadanie',
              category: 'relaksacja',
              priority: 'medium',
            }),
          }),
        })
      );
      
      // Sprawdzenie, czy zadanie zostało zaktualizowane w bazie danych
      const updatedTask = await Task.findById(task._id);
      expect(updatedTask.description).toBe('Zaktualizowane zadanie');
      expect(updatedTask.category).toBe('relaksacja');
      expect(updatedTask.priority).toBe('medium');
    });
  });
  
  describe('completeTask', () => {
    it('should mark a task as completed successfully', async () => {
      // Utworzenie testowego zadania
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 7);
      
      const task = new Task({
        profile: testProfile._id,
        session: testSession._id,
        description: 'Testowe zadanie',
        category: 'dziennik',
        deadline,
        priority: 'high',
        status: 'pending',
      });
      await task.save();
      
      const req = mockRequest();
      req.user = { id: testUser._id };
      req.params = { id: task._id };
      req.body = {
        reflection: 'Moje przemyślenia na temat zadania',
      };
      
      const res = mockResponse();
      
      await taskController.completeTask(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            task: expect.objectContaining({
              status: 'completed',
              completionData: expect.objectContaining({
                reflections: 'Moje przemyślenia na temat zadania',
              }),
            }),
          }),
        })
      );
      
      // Sprawdzenie, czy zadanie zostało oznaczone jako ukończone w bazie danych
      const updatedTask = await Task.findById(task._id);
      expect(updatedTask.status).toBe('completed');
      expect(updatedTask.completionData.reflections).toBe('Moje przemyślenia na temat zadania');
      expect(updatedTask.completionData.completionDate).toBeDefined();
    });
  });
});
