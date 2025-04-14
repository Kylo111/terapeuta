/**
 * Zadanie cron do wysyłania powiadomień
 * @module cron/notification
 */

const cron = require('node-cron');
const notificationService = require('../services/notification.service');
const sessionService = require('../services/session.service');
const taskService = require('../services/task.service');
const config = require('../config');

/**
 * Inicjalizuje zadania cron do wysyłania powiadomień
 */
function initNotificationCron() {
  // Wysyłanie zaplanowanych powiadomień co minutę
  cron.schedule('* * * * *', async () => {
    try {
      console.log('Uruchomiono zadanie cron: wysyłanie zaplanowanych powiadomień');
      const sentCount = await notificationService.sendScheduledNotifications();
      console.log(`Wysłano ${sentCount} zaplanowanych powiadomień`);
    } catch (error) {
      console.error('Błąd podczas wysyłania zaplanowanych powiadomień:', error);
    }
  });

  // Tworzenie przypomnień o sesjach co godzinę
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Uruchomiono zadanie cron: tworzenie przypomnień o sesjach');
      await createSessionReminders();
      console.log('Zakończono tworzenie przypomnień o sesjach');
    } catch (error) {
      console.error('Błąd podczas tworzenia przypomnień o sesjach:', error);
    }
  });

  // Tworzenie przypomnień o zadaniach co godzinę
  cron.schedule('30 * * * *', async () => {
    try {
      console.log('Uruchomiono zadanie cron: tworzenie przypomnień o zadaniach');
      await createTaskReminders();
      console.log('Zakończono tworzenie przypomnień o zadaniach');
    } catch (error) {
      console.error('Błąd podczas tworzenia przypomnień o zadaniach:', error);
    }
  });
}

/**
 * Tworzy przypomnienia o sesjach
 */
async function createSessionReminders() {
  try {
    // Pobierz nadchodzące sesje
    const now = new Date();
    const endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 godziny od teraz
    
    const sessions = await sessionService.getUpcomingSessions(endDate);
    
    for (const session of sessions) {
      const sessionTime = new Date(session.startTime);
      const reminderTime = config.notifications.sessionReminderTime || 60; // Domyślnie 60 minut przed sesją
      
      // Oblicz czas przypomnienia
      const reminderDate = new Date(sessionTime.getTime() - reminderTime * 60 * 1000);
      
      // Sprawdź, czy czas przypomnienia jest w przyszłości i mniej niż 24 godziny od teraz
      if (reminderDate > now && reminderDate < endDate) {
        // Sprawdź, czy przypomnienie już istnieje
        const existingReminders = await notificationService.getNotifications(session.user, {
          type: 'session',
          relatedId: session._id,
          scheduledFor: reminderDate.toISOString()
        });
        
        if (existingReminders.notifications.length === 0) {
          // Utwórz przypomnienie
          await notificationService.createSessionNotification(
            session,
            session.user,
            'reminder',
            reminderDate
          );
          
          console.log(`Utworzono przypomnienie o sesji ${session._id} dla użytkownika ${session.user}`);
        }
      }
    }
  } catch (error) {
    console.error('Błąd podczas tworzenia przypomnień o sesjach:', error);
    throw error;
  }
}

/**
 * Tworzy przypomnienia o zadaniach
 */
async function createTaskReminders() {
  try {
    // Pobierz zadania z terminem wykonania w ciągu najbliższych 2 dni
    const now = new Date();
    const endDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 dni od teraz
    
    const tasks = await taskService.getTasksDueSoon(endDate);
    
    for (const task of tasks) {
      if (!task.dueDate) continue;
      
      const dueDate = new Date(task.dueDate);
      const reminderDays = config.notifications.taskReminderTime || 1; // Domyślnie 1 dzień przed terminem
      
      // Oblicz czas przypomnienia
      const reminderDate = new Date(dueDate.getTime() - reminderDays * 24 * 60 * 60 * 1000);
      
      // Sprawdź, czy czas przypomnienia jest w przyszłości i mniej niż 2 dni od teraz
      if (reminderDate > now && reminderDate < endDate) {
        // Sprawdź, czy przypomnienie już istnieje
        const existingReminders = await notificationService.getNotifications(task.user, {
          type: 'task',
          relatedId: task._id,
          scheduledFor: reminderDate.toISOString()
        });
        
        if (existingReminders.notifications.length === 0) {
          // Utwórz przypomnienie
          await notificationService.createTaskNotification(
            task,
            task.user,
            'reminder',
            reminderDate
          );
          
          console.log(`Utworzono przypomnienie o zadaniu ${task._id} dla użytkownika ${task.user}`);
        }
      }
      
      // Sprawdź, czy termin wykonania jest dzisiaj
      if (dueDate.toDateString() === now.toDateString()) {
        // Sprawdź, czy przypomnienie o terminie już istnieje
        const existingReminders = await notificationService.getNotifications(task.user, {
          type: 'task',
          relatedId: task._id,
          scheduledFor: { $gte: new Date(now.setHours(0, 0, 0, 0)).toISOString() }
        });
        
        if (existingReminders.notifications.length === 0) {
          // Utwórz przypomnienie o terminie
          await notificationService.createTaskNotification(
            task,
            task.user,
            'due',
            new Date(now.setHours(9, 0, 0, 0)) // Ustaw na godzinę 9:00
          );
          
          console.log(`Utworzono przypomnienie o terminie zadania ${task._id} dla użytkownika ${task.user}`);
        }
      }
    }
  } catch (error) {
    console.error('Błąd podczas tworzenia przypomnień o zadaniach:', error);
    throw error;
  }
}

module.exports = {
  initNotificationCron
};
