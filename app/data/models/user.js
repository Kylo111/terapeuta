/**
 * Model użytkownika
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email jest wymagany'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Proszę podać prawidłowy adres email']
  },
  password: {
    type: String,
    required: [true, 'Hasło jest wymagane'],
    minlength: [8, 'Hasło musi mieć co najmniej 8 znaków'],
    select: false
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  profiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  }],
  settings: {
    preferredLLMProvider: {
      type: String,
      enum: ['openai', 'anthropic', 'google', 'huggingface', 'ollama'],
      default: 'openai'
    },
    preferredModel: {
      type: String,
      default: 'gpt-4'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    language: {
      type: String,
      enum: ['pl', 'en'],
      default: 'pl'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Middleware do hashowania hasła przed zapisem
userSchema.pre('save', async function(next) {
  // Tylko jeśli hasło zostało zmodyfikowane
  if (!this.isModified('password')) return next();
  
  try {
    // Generowanie salt
    const salt = await bcrypt.genSalt(10);
    // Hashowanie hasła
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Metoda do porównywania hasła
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Metoda do generowania tokenu JWT
userSchema.methods.generateAuthToken = function() {
  // Implementacja zostanie dodana po dodaniu JWT
};

const User = mongoose.model('User', userSchema);

module.exports = User;
