/**
 * Model zadania terapeutycznego
 */

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Opis zadania jest wymagany']
  },
  category: {
    type: String,
    enum: ['technika_terapeutyczna', 'refleksja', 'cwiczenie_behawioralne', 'dziennik', 'inne'],
    default: 'technika_terapeutyczna'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'incomplete'],
    default: 'pending'
  },
  completionData: {
    completionDate: {
      type: Date
    },
    successRating: {
      type: Number,
      min: 1,
      max: 10
    },
    challenges: String,
    reflections: String,
    emotionalResponse: String
  },
  discussedInSession: {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session'
    },
    date: {
      type: Date
    },
    outcome: String
  },
  reminders: [{
    time: {
      type: Date,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    isSent: {
      type: Boolean,
      default: false
    }
  }],
  deadlineReminderSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Metoda do oznaczania zadania jako ukończonego
taskSchema.methods.markAsCompleted = function(completionData) {
  this.status = 'completed';
  this.completionData = {
    completionDate: new Date(),
    ...completionData
  };
  return this.save();
};

// Metoda do oznaczania zadania jako nieukończonego
taskSchema.methods.markAsIncomplete = function(reason) {
  this.status = 'incomplete';
  this.completionData = {
    completionDate: new Date(),
    ...reason
  };
  return this.save();
};

// Metoda do aktualizacji statusu omówienia zadania
taskSchema.methods.updateDiscussionStatus = function(sessionId, outcome) {
  this.discussedInSession = {
    sessionId,
    date: new Date(),
    outcome
  };
  return this.save();
};

// Metoda do dodawania przypomnienia
taskSchema.methods.addReminder = function(time, message) {
  this.reminders.push({
    time,
    message,
    isSent: false
  });
  return this.save();
};

// Metoda do oznaczania przypomnienia jako wysłanego
taskSchema.methods.markReminderAsSent = function(reminderId) {
  const reminder = this.reminders.id(reminderId);
  if (!reminder) throw new Error('Przypomnienie nie zostało znalezione');

  reminder.isSent = true;
  return this.save();
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
