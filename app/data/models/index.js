/**
 * Indeks modeli danych
 * Eksportuje wszystkie modele z jednego miejsca dla łatwiejszego importu
 */

const User = require('./user');
const Profile = require('./profile');
const Session = require('./session');
const Task = require('./task');
const TherapyMethod = require('./therapy-method');
const Prompt = require('./prompt');

module.exports = {
  User,
  Profile,
  Session,
  Task,
  TherapyMethod,
  Prompt
};
