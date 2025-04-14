/**
 * Model raportu
 * @module models/report
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema raportu
 */
const reportSchema = new Schema({
  /**
   * Użytkownik, do którego należy raport
   */
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  /**
   * Profil, którego dotyczy raport
   */
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },

  /**
   * Tytuł raportu
   */
  title: {
    type: String,
    required: true
  },

  /**
   * Typ raportu
   * - session: raport z pojedynczej sesji
   * - progress: raport postępu (z wielu sesji)
   * - tasks: raport z wykonania zadań
   * - emotional: raport emocjonalny
   * - summary: raport podsumowujący (tygodniowy, miesięczny)
   */
  type: {
    type: String,
    enum: ['session', 'progress', 'tasks', 'emotional', 'summary'],
    required: true
  },

  /**
   * Data początkowa okresu raportu
   */
  startDate: {
    type: Date,
    required: true
  },

  /**
   * Data końcowa okresu raportu
   */
  endDate: {
    type: Date,
    required: true
  },

  /**
   * Data wygenerowania raportu
   */
  generatedAt: {
    type: Date,
    default: Date.now
  },

  /**
   * Dane raportu
   */
  data: {
    /**
     * Dane sesji (dla raportów typu 'session')
     */
    session: {
      sessionId: {
        type: Schema.Types.ObjectId,
        ref: 'Session'
      },
      startTime: Date,
      endTime: Date,
      duration: Number,
      therapyMethod: String,
      emotionalStateStart: {
        anxiety: Number,
        depression: Number,
        optimism: Number
      },
      emotionalStateEnd: {
        anxiety: Number,
        depression: Number,
        optimism: Number
      },
      keyTopics: [String],
      insights: [String],
      sessionEffectivenessRating: Number
    },

    /**
     * Dane postępu (dla raportów typu 'progress')
     */
    progress: {
      sessionsCount: Number,
      totalDuration: Number,
      emotionalStateChanges: [{
        date: Date,
        anxiety: Number,
        depression: Number,
        optimism: Number
      }],
      therapyMethods: [{
        method: String,
        count: Number,
        effectiveness: Number
      }],
      keyTopicsFrequency: [{
        topic: String,
        count: Number
      }],
      overallProgress: Number,
      recommendations: [String]
    },

    /**
     * Dane zadań (dla raportów typu 'tasks')
     */
    tasks: {
      totalTasks: Number,
      completedTasks: Number,
      incompleteTasks: Number,
      pendingTasks: Number,
      completionRate: Number,
      averageSuccessRating: Number,
      tasksByCategory: [{
        category: String,
        count: Number,
        completedCount: Number,
        completionRate: Number
      }],
      tasksByPriority: [{
        priority: String,
        count: Number,
        completedCount: Number,
        completionRate: Number
      }],
      mostChallengingTasks: [{
        taskId: {
          type: Schema.Types.ObjectId,
          ref: 'Task'
        },
        description: String,
        challenges: String,
        successRating: Number
      }],
      mostSuccessfulTasks: [{
        taskId: {
          type: Schema.Types.ObjectId,
          ref: 'Task'
        },
        description: String,
        reflections: String,
        successRating: Number
      }]
    },

    /**
     * Dane emocjonalne (dla raportów typu 'emotional')
     */
    emotional: {
      moodChanges: [{
        date: Date,
        mood: Number,
        notes: String
      }],
      anxietyChanges: [{
        date: Date,
        level: Number,
        triggers: [String]
      }],
      depressionChanges: [{
        date: Date,
        level: Number,
        factors: [String]
      }],
      optimismChanges: [{
        date: Date,
        level: Number,
        factors: [String]
      }],
      emotionalPatterns: [{
        pattern: String,
        frequency: Number,
        triggers: [String],
        copingStrategies: [String]
      }],
      sentimentAnalysis: {
        overallSentiment: Number,
        positiveWords: [{
          word: String,
          count: Number
        }],
        negativeWords: [{
          word: String,
          count: Number
        }]
      }
    },

    /**
     * Dane podsumowujące (dla raportów typu 'summary')
     */
    summary: {
      period: {
        type: String,
        enum: ['weekly', 'monthly', 'quarterly', 'yearly']
      },
      sessionsCount: Number,
      tasksCompletionRate: Number,
      emotionalStateAverage: {
        anxiety: Number,
        depression: Number,
        optimism: Number
      },
      emotionalStateChange: {
        anxiety: Number,
        depression: Number,
        optimism: Number
      },
      keyAchievements: [String],
      keyInsights: [String],
      challengingAreas: [String],
      recommendations: [String],
      nextSteps: [String]
    }
  },

  /**
   * Czy raport został wyeksportowany
   */
  exported: {
    type: Boolean,
    default: false
  },

  /**
   * Format eksportu raportu
   */
  exportFormat: {
    type: String,
    enum: ['pdf', 'json', 'csv', null],
    default: null
  },

  /**
   * Data eksportu raportu
   */
  exportedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

/**
 * Model raportu
 */
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
