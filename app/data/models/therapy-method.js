/**
 * Model metody terapeutycznej
 */

const mongoose = require('mongoose');

const therapyMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nazwa metody terapeutycznej jest wymagana'],
    unique: true,
    trim: true
  },
  key: {
    type: String,
    required: [true, 'Klucz metody terapeutycznej jest wymagany'],
    unique: true,
    enum: ['cognitive_behavioral', 'psychodynamic', 'humanistic', 'systemic', 'solution_focused'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Opis metody terapeutycznej jest wymagany']
  },
  principles: [{
    type: String
  }],
  techniques: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    applicationAreas: [String]
  }],
  suitableFor: [{
    type: String
  }],
  contraindications: [{
    type: String
  }],
  prompts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prompt'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Metoda do dodawania nowej techniki
therapyMethodSchema.methods.addTechnique = function(technique) {
  this.techniques.push(technique);
  return this.save();
};

// Metoda do aktualizacji opisu
therapyMethodSchema.methods.updateDescription = function(description) {
  this.description = description;
  this.updatedAt = Date.now();
  return this.save();
};

// Metoda do powiązania promptu
therapyMethodSchema.methods.addPrompt = function(promptId) {
  if (!this.prompts.includes(promptId)) {
    this.prompts.push(promptId);
  }
  return this.save();
};

const TherapyMethod = mongoose.model('TherapyMethod', therapyMethodSchema);

module.exports = TherapyMethod;
