/**
 * Model promptu dla metod terapeutycznych
 */

const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tytuł promptu jest wymagany'],
    trim: true
  },
  therapyMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TherapyMethod',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Treść promptu jest wymagana']
  },
  purpose: {
    type: String,
    enum: ['session_start', 'session_end', 'goal_setting', 'challenge_identification', 'technique_application', 'homework', 'reflection', 'crisis_intervention', 'progress_evaluation', 'custom'],
    default: 'custom'
  },
  variables: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    defaultValue: {
      type: String
    }
  }],
  tags: [{
    type: String
  }],
  version: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  usageCount: {
    type: Number,
    default: 0
  },
  effectivenessRating: {
    type: Number,
    min: 1,
    max: 10
  },
  feedback: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Metoda do aktualizacji treści promptu
promptSchema.methods.updateContent = function(content) {
  this.content = content;
  this.version += 1;
  this.updatedAt = Date.now();
  return this.save();
};

// Metoda do zwiększania licznika użyć
promptSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

// Metoda do dodawania oceny skuteczności
promptSchema.methods.addEffectivenessRating = function(rating) {
  // Jeśli nie ma jeszcze oceny, po prostu ją ustawiamy
  if (!this.effectivenessRating) {
    this.effectivenessRating = rating;
  } else {
    // Jeśli już jest ocena, obliczamy średnią ważoną
    // Waga poprzedniej oceny to liczba użyć - 1
    const previousWeight = this.usageCount - 1;
    const newWeight = 1;
    const totalWeight = previousWeight + newWeight;
    
    this.effectivenessRating = 
      (this.effectivenessRating * previousWeight + rating * newWeight) / totalWeight;
  }
  
  return this.save();
};

// Metoda do dodawania opinii użytkownika
promptSchema.methods.addFeedback = function(userId, rating, comment) {
  this.feedback.push({
    user: userId,
    rating,
    comment,
    createdAt: Date.now()
  });
  
  return this.save();
};

// Metoda do renderowania promptu z podstawionymi zmiennymi
promptSchema.methods.render = function(variables = {}) {
  let renderedContent = this.content;
  
  // Zastępowanie zmiennych w treści promptu
  for (const variable of this.variables) {
    const value = variables[variable.name] || variable.defaultValue || '';
    const regex = new RegExp(`\\{\\{${variable.name}\\}\\}`, 'g');
    renderedContent = renderedContent.replace(regex, value);
  }
  
  return renderedContent;
};

const Prompt = mongoose.model('Prompt', promptSchema);

module.exports = Prompt;
