# System powiadomień i przypomnień

## Przegląd

System powiadomień i przypomnień w aplikacji Terapeuta umożliwia informowanie użytkowników o ważnych wydarzeniach, takich jak nadchodzące sesje terapeutyczne, terminy zadań oraz niestandardowe przypomnienia. System ten składa się z kilku komponentów:

1. **Model powiadomień** - definiuje strukturę danych powiadomień
2. **Serwis powiadomień** - odpowiedzialny za zarządzanie i wysyłanie powiadomień
3. **Kontroler powiadomień** - obsługuje żądania API związane z powiadomieniami
4. **Trasy API dla powiadomień** - definiują endpointy API dla powiadomień
5. **Interfejs użytkownika dla zarządzania powiadomieniami** - umożliwia użytkownikom zarządzanie powiadomieniami

## Architektura systemu

### Model powiadomień

Model powiadomień definiuje strukturę danych powiadomień w bazie danych MongoDB. Główne pola modelu to:

- **user** - ID użytkownika, do którego należy powiadomienie
- **title** - tytuł powiadomienia
- **message** - treść powiadomienia
- **type** - typ powiadomienia (session, task, reminder, system, other)
- **priority** - priorytet powiadomienia (low, medium, high)
- **isRead** - czy powiadomienie zostało przeczytane
- **isSent** - czy powiadomienie zostało wysłane
- **sentAt** - data i czas wysłania powiadomienia
- **readAt** - data i czas przeczytania powiadomienia
- **scheduledFor** - data i czas zaplanowanego wysłania powiadomienia
- **action** - akcja powiadomienia (np. URL do przekierowania)
- **relatedId** - ID powiązanego obiektu (np. ID sesji, zadania)
- **relatedType** - typ powiązanego obiektu (session, task, profile, exercise, journal, other)
- **channels** - kanały dostarczenia powiadomienia (app, email, push)
- **metadata** - dodatkowe informacje o powiadomieniu

### Serwis powiadomień

Serwis powiadomień jest odpowiedzialny za zarządzanie i wysyłanie powiadomień. Główne funkcje serwisu to:

- **getNotifications** - pobieranie powiadomień użytkownika z możliwością filtrowania
- **getUnreadCount** - pobieranie liczby nieprzeczytanych powiadomień użytkownika
- **createNotification** - tworzenie nowego powiadomienia
- **markAsRead** - oznaczanie powiadomienia jako przeczytane
- **markAllAsRead** - oznaczanie wszystkich powiadomień użytkownika jako przeczytane
- **deleteNotification** - usuwanie powiadomienia
- **deleteAllNotifications** - usuwanie wszystkich powiadomień użytkownika
- **sendScheduledNotifications** - wysyłanie zaplanowanych powiadomień
- **sendEmailNotification** - wysyłanie powiadomienia e-mail
- **sendPushNotification** - wysyłanie powiadomienia push
- **createSessionNotification** - tworzenie powiadomienia o sesji
- **createTaskNotification** - tworzenie powiadomienia o zadaniu
- **createSystemNotification** - tworzenie powiadomienia systemowego
- **createReminder** - tworzenie przypomnienia

### Kontroler powiadomień

Kontroler powiadomień obsługuje żądania API związane z powiadomieniami. Główne endpointy to:

- **getNotifications** - pobieranie powiadomień użytkownika
- **getUnreadCount** - pobieranie liczby nieprzeczytanych powiadomień użytkownika
- **createNotification** - tworzenie nowego powiadomienia
- **markAsRead** - oznaczanie powiadomienia jako przeczytane
- **markAllAsRead** - oznaczanie wszystkich powiadomień użytkownika jako przeczytane
- **deleteNotification** - usuwanie powiadomienia
- **deleteAllNotifications** - usuwanie wszystkich powiadomień użytkownika
- **createReminder** - tworzenie przypomnienia

### Trasy API dla powiadomień

Trasy API dla powiadomień definiują endpointy API dla powiadomień:

- **GET /api/notifications** - pobieranie powiadomień użytkownika
- **GET /api/notifications/unread** - pobieranie liczby nieprzeczytanych powiadomień użytkownika
- **POST /api/notifications** - tworzenie nowego powiadomienia
- **PUT /api/notifications/:id/read** - oznaczanie powiadomienia jako przeczytane
- **PUT /api/notifications/read-all** - oznaczanie wszystkich powiadomień użytkownika jako przeczytane
- **DELETE /api/notifications/:id** - usuwanie powiadomienia
- **DELETE /api/notifications** - usuwanie wszystkich powiadomień użytkownika
- **POST /api/notifications/reminder** - tworzenie przypomnienia

### Interfejs użytkownika dla zarządzania powiadomieniami

Interfejs użytkownika dla zarządzania powiadomieniami składa się z kilku komponentów:

- **NotificationBell** - dzwonek powiadomień wyświetlany w nagłówku aplikacji
- **NotificationsPage** - strona powiadomień z filtrowaniem i sortowaniem
- **ReminderPage** - strona tworzenia przypomnienia
- **DateTimePicker** - komponent wyboru daty i czasu

## Zadania cron

System powiadomień wykorzystuje zadania cron do automatycznego wysyłania powiadomień i tworzenia przypomnień:

- **sendScheduledNotifications** - wysyłanie zaplanowanych powiadomień (co minutę)
- **createSessionReminders** - tworzenie przypomnień o sesjach (co godzinę)
- **createTaskReminders** - tworzenie przypomnień o zadaniach (co godzinę)

## Kanały dostarczenia powiadomień

System powiadomień obsługuje następujące kanały dostarczenia powiadomień:

- **app** - powiadomienia w aplikacji
- **email** - powiadomienia e-mail
- **push** - powiadomienia push (zaślepka, do implementacji w przyszłości)

## Typy powiadomień

System powiadomień obsługuje następujące typy powiadomień:

- **session** - powiadomienia o sesjach terapeutycznych
- **task** - powiadomienia o zadaniach
- **reminder** - przypomnienia
- **system** - powiadomienia systemowe
- **other** - inne powiadomienia

## Priorytety powiadomień

System powiadomień obsługuje następujące priorytety powiadomień:

- **low** - niski priorytet
- **medium** - średni priorytet
- **high** - wysoki priorytet

## Integracja z innymi systemami

System powiadomień jest zintegrowany z następującymi systemami:

- **System sesji** - tworzenie powiadomień o sesjach
- **System zadań** - tworzenie powiadomień o zadaniach
- **System e-mail** - wysyłanie powiadomień e-mail

## Przykłady użycia

### Tworzenie przypomnienia

```javascript
// Backend
const reminder = await notificationService.createReminder(
  userId,
  'Przypomnienie o sesji',
  'Przypominamy o nadchodzącej sesji terapeutycznej',
  new Date('2023-05-01T10:00:00'),
  '/sessions/123',
  sessionId,
  'session'
);

// Frontend
const reminderData = {
  title: 'Przypomnienie o sesji',
  message: 'Przypominamy o nadchodzącej sesji terapeutycznej',
  scheduledFor: '2023-05-01T10:00:00',
  action: '/sessions/123',
  relatedId: sessionId,
  relatedType: 'session'
};

const reminder = await createReminder(reminderData);
```

### Pobieranie powiadomień

```javascript
// Backend
const result = await notificationService.getNotifications(userId, {
  isRead: false,
  type: 'session',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 10
});

// Frontend
const options = {
  isRead: false,
  type: 'session',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 10
};

const result = await getNotifications(options);
```

### Oznaczanie powiadomienia jako przeczytane

```javascript
// Backend
const notification = await notificationService.markAsRead(notificationId, userId);

// Frontend
const notification = await markAsRead(notificationId);
```

## Przyszłe rozszerzenia

W przyszłości planowane są następujące rozszerzenia systemu powiadomień:

1. **Powiadomienia push** - implementacja wysyłania powiadomień push
2. **Powiadomienia SMS** - implementacja wysyłania powiadomień SMS
3. **Szablony powiadomień** - implementacja szablonów powiadomień
4. **Preferencje powiadomień** - implementacja preferencji powiadomień dla użytkowników
5. **Grupowanie powiadomień** - implementacja grupowania powiadomień
6. **Statystyki powiadomień** - implementacja statystyk powiadomień

