/**
 * Model profilu terapeutycznego
 */

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Nazwa profilu jest wymagana'],
    trim: true
  },
  therapyMethod: {
    type: String,
    enum: ['cognitive_behavioral', 'psychodynamic', 'humanistic', 'systemic', 'solution_focused'],
    default: 'cognitive_behavioral'
  },
  goals: [{
    description: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    }
  }],
  challenges: [{
    description: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  sessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  emotionalState: {
    anxiety: {
      type: Number,
      min: 0,
      max: 10,
      default: 5
    },
    depression: {
      type: Number,
      min: 0,
      max: 10,
      default: 5
    },
    optimism: {
      type: Number,
      min: 0,
      max: 10,
      default: 5
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  therapyProgress: {
    overallStatus: {
      type: String,
      enum: ['not_started', 'beginning', 'progressing', 'improving', 'maintaining', 'completed'],
      default: 'not_started'
    },
    keyInsights: [String],
    homeworkCompletion: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Metoda do aktualizacji stanu emocjonalnego
profileSchema.methods.updateEmotionalState = function(anxiety, depression, optimism) {
  this.emotionalState = {
    anxiety,
    depression,
    optimism,
    lastUpdated: new Date()
  };
  return this.save();
};

// Metoda do dodawania nowego celu
profileSchema.methods.addGoal = function(description, priority = 'medium') {
  this.goals.push({
    description,
    priority,
    status: 'active',
    createdAt: new Date()
  });
  return this.save();
};

// Metoda do oznaczania celu jako ukończonego
profileSchema.methods.completeGoal = function(goalId) {
  const goal = this.goals.id(goalId);
  if (!goal) throw new Error('Cel nie został znaleziony');
  
  goal.status = 'completed';
  goal.completedAt = new Date();
  return this.save();
};

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
