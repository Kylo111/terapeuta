# System przypomnień i powiadomień

## Przegląd

System przypomnień i powiadomień w aplikacji Terapeuta umożliwia informowanie użytkowników o ważnych wydarzeniach, takich jak nadchodzące sesje terapeutyczne, terminy zadań oraz niestandardowe przypomnienia. System ten składa się z kilku komponentów:

1. **Serwis przypomnień** - odpowiedzialny za wysyłanie powiadomień
2. **Kontroler przypomnień** - obsługuje żądania API związane z przypomnieniami
3. **Trasy API dla przypomnień** - definiują endpointy API dla przypomnień
4. **Interfejs użytkownika dla zarządzania powiadomieniami** - umożliwia użytkownikom zarządzanie ustawieniami powiadomień i przeglądanie historii powiadomień

## Architektura systemu

### Serwis przypomnień

Serwis przypomnień (`app/services/reminder.service.js`) jest odpowiedzialny za:

- Inicjalizację transportera e-mail (nodemailer)
- Inicjalizację zadań cron (node-cron)
- Wysyłanie przypomnień o zadaniach
- Wysyłanie przypomnień o sesjach
- Wysyłanie przypomnień o zbliżających się terminach zadań
- Ręczne wysyłanie przypomnień

Serwis korzysta z zadań cron, które są uruchamiane w określonych interwałach czasowych:

- `taskReminders` - uruchamiane co 15 minut, wysyła przypomnienia o zadaniach
- `sessionReminders` - uruchamiane co godzinę, wysyła przypomnienia o sesjach
- `upcomingDeadlines` - uruchamiane codziennie o 9:00, wysyła przypomnienia o zbliżających się terminach zadań

### Kontroler przypomnień

Kontroler przypomnień (`app/controllers/reminder.controller.js`) obsługuje żądania API związane z przypomnieniami:

- `sendTaskReminder` - ręczne wysyłanie przypomnienia o zadaniu
- `sendSessionReminder` - ręczne wysyłanie przypomnienia o sesji
- `sendDeadlineReminder` - ręczne wysyłanie przypomnienia o zbliżającym się terminie zadania
- `getNotificationSettings` - pobieranie ustawień powiadomień użytkownika
- `updateNotificationSettings` - aktualizacja ustawień powiadomień użytkownika

### Trasy API dla przypomnień

Trasy API dla przypomnień (`app/routes/reminder.routes.js`) definiują endpointy API dla przypomnień:

- `POST /api/reminders/tasks/:taskId/:reminderId` - ręczne wysyłanie przypomnienia o zadaniu
- `POST /api/reminders/sessions/:sessionId` - ręczne wysyłanie przypomnienia o sesji
- `POST /api/reminders/deadlines/:taskId` - ręczne wysyłanie przypomnienia o zbliżającym się terminie zadania
- `GET /api/reminders/settings` - pobieranie ustawień powiadomień użytkownika
- `PUT /api/reminders/settings` - aktualizacja ustawień powiadomień użytkownika

### Modele danych

System przypomnień korzysta z następujących modeli danych:

#### Model zadania (Task)

Model zadania (`app/data/models/task.js`) zawiera pola związane z przypomnieniami:

```javascript
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
```

#### Model sesji (Session)

Model sesji (`app/data/models/session.js`) zawiera pola związane z przypomnieniami:

```javascript
reminderSent: {
  type: Boolean,
  default: false
},
reminderSent1h: {
  type: Boolean,
  default: false
}
```

#### Model użytkownika (User)

Model użytkownika (`app/data/models/user.js`) zawiera ustawienia powiadomień:

```javascript
settings: {
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    },
    taskReminders: {
      type: Boolean,
      default: true
    },
    sessionReminders: {
      type: Boolean,
      default: true
    },
    deadlineReminders: {
      type: Boolean,
      default: true
    }
  }
}
```

## Interfejs użytkownika

### Ustawienia powiadomień

Strona ustawień powiadomień (`/settings/notifications`) umożliwia użytkownikom zarządzanie ustawieniami powiadomień:

- Włączanie/wyłączanie różnych kanałów powiadomień (e-mail, push, SMS)
- Włączanie/wyłączanie różnych typów powiadomień (zadania, sesje, terminy)
- Zapisywanie ustawień powiadomień

### Historia powiadomień

Strona historii powiadomień (`/settings/notifications/history`) umożliwia użytkownikom przeglądanie historii wysłanych powiadomień:

- Przeglądanie historii wysłanych powiadomień
- Filtrowanie powiadomień według typu (zadania, sesje, terminy)
- Wyświetlanie szczegółów powiadomień (tytuł, treść, czas wysłania, status, kanał)

### Ręczne wysyłanie przypomnień

Funkcje ręcznego wysyłania przypomnień są dostępne na stronach szczegółów zadania i sesji:

- Strona szczegółów zadania (`/tasks/:id`) umożliwia:
  - Dodawanie nowych przypomnień
  - Ręczne wysyłanie przypomnień
  - Usuwanie przypomnień
  - Wysyłanie przypomnień o zbliżającym się terminie

- Strona szczegółów sesji (`/sessions/:id`) umożliwia:
  - Ręczne wysyłanie przypomnień o sesji

## Konfiguracja

System przypomnień wymaga następujących zmiennych środowiskowych:

```
# Konfiguracja powiadomień e-mail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com

# Konfiguracja frontendu
FRONTEND_URL=http://localhost:3000
```

## Rozszerzenia

System przypomnień może być rozszerzony o:

1. **Powiadomienia push** - wykorzystanie Web Push API do wysyłania powiadomień push w przeglądarce
2. **Powiadomienia SMS** - integracja z dostawcą usług SMS (np. Twilio) do wysyłania powiadomień SMS
3. **Powiadomienia w aplikacji** - wyświetlanie powiadomień w aplikacji
4. **Szablony powiadomień** - umożliwienie użytkownikom tworzenia własnych szablonów powiadomień
5. **Harmonogram powiadomień** - umożliwienie użytkownikom tworzenia harmonogramów powiadomień
