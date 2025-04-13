/**
 * Model sesji terapeutycznej
 */

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now,
    required: true
  },
  endTime: {
    type: Date
  },
  therapyMethod: {
    type: String,
    enum: ['cognitive_behavioral', 'psychodynamic', 'humanistic', 'systemic', 'solution_focused'],
    required: true
  },
  sessionNumber: {
    type: Number,
    required: true
  },
  continuityStatus: {
    type: String,
    enum: ['new', 'continued', 'resumed_after_break'],
    default: 'new'
  },
  conversation: [{
    role: {
      type: String,
      enum: ['system', 'assistant', 'user'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  summary: {
    mainTopics: [String],
    keyInsights: String,
    progress: String,
    homework: String
  },
  metrics: {
    emotionalStateStart: {
      anxiety: {
        type: Number,
        min: 0,
        max: 10
      },
      depression: {
        type: Number,
        min: 0,
        max: 10
      },
      optimism: {
        type: Number,
        min: 0,
        max: 10
      }
    },
    emotionalStateEnd: {
      anxiety: {
        type: Number,
        min: 0,
        max: 10
      },
      depression: {
        type: Number,
        min: 0,
        max: 10
      },
      optimism: {
        type: Number,
        min: 0,
        max: 10
      }
    },
    sessionEffectivenessRating: {
      type: Number,
      min: 1,
      max: 10
    }
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Metoda do dodawania wiadomości do konwersacji
sessionSchema.methods.addMessage = function(role, content) {
  this.conversation.push({
    role,
    content,
    timestamp: new Date()
  });
  return this.save();
};

// Metoda do zakończenia sesji
sessionSchema.methods.endSession = function(summary, emotionalStateEnd, effectivenessRating) {
  this.endTime = new Date();
  this.isCompleted = true;
  
  if (summary) {
    this.summary = summary;
  }
  
  if (emotionalStateEnd) {
    this.metrics.emotionalStateEnd = emotionalStateEnd;
  }
  
  if (effectivenessRating) {
    this.metrics.sessionEffectivenessRating = effectivenessRating;
  }
  
  return this.save();
};

// Metoda do generowania podsumowania sesji
sessionSchema.methods.generateSummary = async function() {
  // Tutaj będzie implementacja generowania podsumowania z wykorzystaniem LLM
  // Zostanie dodana po implementacji integracji z LLM
};

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
