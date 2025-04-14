/**
 * Domyślne ćwiczenia terapeutyczne
 * @module data/default-exercises
 */

const defaultExercises = [
  // Ćwiczenia mindfulness
  {
    name: 'Uważne oddychanie',
    description: 'Proste ćwiczenie mindfulness polegające na skupieniu uwagi na oddechu.',
    category: 'mindfulness',
    difficulty: 'beginner',
    duration: 5,
    instructions: [
      'Znajdź wygodną pozycję siedzącą lub leżącą.',
      'Zamknij oczy lub skieruj wzrok w dół.',
      'Skup swoją uwagę na oddechu. Nie próbuj go zmieniać, po prostu obserwuj.',
      'Zauważ, jak powietrze wpływa i wypływa z twojego ciała.',
      'Gdy twój umysł zacznie wędrować, delikatnie skieruj uwagę z powrotem na oddech.',
      'Kontynuuj przez 5 minut.'
    ],
    tips: [
      'Możesz liczyć oddechy od 1 do 10, a następnie zacząć od nowa.',
      'Jeśli trudno ci się skupić, spróbuj położyć dłoń na brzuchu i poczuć, jak unosi się i opada z każdym oddechem.'
    ],
    benefits: [
      'Redukcja stresu i niepokoju',
      'Poprawa koncentracji',
      'Zwiększenie świadomości ciała'
    ],
    contraindications: []
  },
  {
    name: 'Skanowanie ciała',
    description: 'Ćwiczenie mindfulness polegające na systematycznym kierowaniu uwagi na różne części ciała.',
    category: 'mindfulness',
    difficulty: 'beginner',
    duration: 15,
    instructions: [
      'Połóż się na plecach w wygodnej pozycji.',
      'Zamknij oczy i weź kilka głębokich oddechów.',
      'Skieruj uwagę na palce stóp. Zauważ wszelkie doznania: ciepło, zimno, mrowienie, napięcie.',
      'Powoli przesuwaj uwagę w górę ciała: stopy, kostki, łydki, kolana, uda...',
      'Kontynuuj skanowanie całego ciała aż do czubka głowy.',
      'Zakończ, kierując uwagę na całe ciało jako jedność.'
    ],
    tips: [
      'Nie oceniaj doznań jako przyjemne lub nieprzyjemne, po prostu je obserwuj.',
      'Jeśli twój umysł zacznie wędrować, delikatnie skieruj uwagę z powrotem na ciało.'
    ],
    benefits: [
      'Zwiększenie świadomości ciała',
      'Redukcja napięcia mięśniowego',
      'Poprawa jakości snu'
    ],
    contraindications: []
  },
  {
    name: 'Uważne jedzenie',
    description: 'Ćwiczenie mindfulness polegające na świadomym spożywaniu posiłku z pełną uwagą.',
    category: 'mindfulness',
    difficulty: 'beginner',
    duration: 10,
    instructions: [
      'Wybierz niewielki kawałek jedzenia, np. rodzynkę, kawałek czekolady lub owoc.',
      'Przyjrzyj się mu dokładnie. Zauważ jego kolor, kształt, teksturę.',
      'Powąchaj jedzenie i zauważ, jakie wrażenia wywołuje zapach.',
      'Włóż jedzenie do ust, ale nie gryź go od razu. Zauważ, jak czuje się na języku.',
      'Powoli zacznij żuć, zwracając uwagę na smak i teksturę.',
      'Zauważ moment, gdy przełykasz i jak jedzenie przemieszcza się w dół gardła.'
    ],
    tips: [
      'Staraj się jeść w ciszy, bez rozpraszaczy jak telewizja czy telefon.',
      'Możesz praktykować to ćwiczenie podczas jednego posiłku dziennie.'
    ],
    benefits: [
      'Zwiększenie przyjemności z jedzenia',
      'Poprawa trawienia',
      'Większa świadomość nawyków żywieniowych'
    ],
    contraindications: []
  },

  // Techniki relaksacyjne
  {
    name: 'Progresywna relaksacja mięśni',
    description: 'Technika relaksacyjna polegająca na naprzemiennym napinaniu i rozluźnianiu grup mięśni.',
    category: 'relaxation',
    difficulty: 'beginner',
    duration: 15,
    instructions: [
      'Znajdź wygodną pozycję siedzącą lub leżącą.',
      'Zacznij od stóp. Napnij mięśnie stóp na 5 sekund, a następnie rozluźnij je na 10 sekund.',
      'Przenieś uwagę na łydki. Napnij mięśnie łydek na 5 sekund, a następnie rozluźnij je na 10 sekund.',
      'Kontynuuj ten proces dla wszystkich głównych grup mięśni, poruszając się w górę ciała: uda, pośladki, brzuch, plecy, ramiona, dłonie, szyja, twarz.',
      'Zakończ, skupiając się na całym ciele i zauważając różnicę w napięciu mięśni.'
    ],
    tips: [
      'Oddychaj naturalnie podczas ćwiczenia.',
      'Jeśli odczuwasz ból podczas napinania jakiejś grupy mięśni, pomiń ją.'
    ],
    benefits: [
      'Redukcja napięcia mięśniowego',
      'Zmniejszenie objawów stresu i niepokoju',
      'Poprawa jakości snu'
    ],
    contraindications: [
      'Osoby z historią urazów mięśni powinny skonsultować się z lekarzem przed wykonaniem ćwiczenia.'
    ]
  },
  {
    name: 'Głębokie oddychanie przeponowe',
    description: 'Technika relaksacyjna wykorzystująca głębokie oddychanie przeponą do redukcji stresu.',
    category: 'relaxation',
    difficulty: 'beginner',
    duration: 5,
    instructions: [
      'Znajdź wygodną pozycję siedzącą lub leżącą.',
      'Połóż jedną rękę na klatce piersiowej, a drugą na brzuchu.',
      'Weź powolny, głęboki wdech przez nos, licząc do 4. Poczuj, jak brzuch unosi się pod twoją dłonią.',
      'Zatrzymaj oddech na 2 sekundy.',
      'Powoli wydychaj powietrze przez usta, licząc do 6. Poczuj, jak brzuch opada.',
      'Powtórz ten cykl 10 razy.'
    ],
    tips: [
      'Staraj się, aby ręka na klatce piersiowej poruszała się minimalnie, a główny ruch był widoczny na brzuchu.',
      'Praktykuj to ćwiczenie regularnie, najlepiej kilka razy dziennie.'
    ],
    benefits: [
      'Aktywacja układu przywspółczulnego (odpowiedzialnego za relaks)',
      'Redukcja tętna i ciśnienia krwi',
      'Zmniejszenie poziomu kortyzolu (hormonu stresu)'
    ],
    contraindications: []
  },
  {
    name: 'Wizualizacja spokojnego miejsca',
    description: 'Technika relaksacyjna wykorzystująca wyobraźnię do stworzenia mentalnego obrazu spokojnego miejsca.',
    category: 'relaxation',
    difficulty: 'intermediate',
    duration: 10,
    instructions: [
      'Znajdź wygodną pozycję i zamknij oczy.',
      'Weź kilka głębokich oddechów, aby się zrelaksować.',
      'Wyobraź sobie spokojne, bezpieczne miejsce. Może to być plaża, las, góry lub inne miejsce, które kojarzy ci się z relaksem.',
      'Angażuj wszystkie zmysły: Co widzisz? Jakie dźwięki słyszysz? Jakie zapachy czujesz? Jakie tekstury możesz dotknąć?',
      'Spędź kilka minut, eksplorując to miejsce w swojej wyobraźni.',
      'Gdy będziesz gotowy, powoli wróć do rzeczywistości, otwierając oczy.'
    ],
    tips: [
      'Możesz nagrać instrukcje i odtwarzać je podczas ćwiczenia.',
      'Staraj się wybrać miejsce, które ma dla ciebie osobiste znaczenie.'
    ],
    benefits: [
      'Redukcja stresu i niepokoju',
      'Poprawa nastroju',
      'Zwiększenie poczucia kontroli w trudnych sytuacjach'
    ],
    contraindications: []
  },

  // Techniki poznawcze
  {
    name: 'Identyfikacja zniekształceń poznawczych',
    description: 'Ćwiczenie polegające na rozpoznawaniu i nazywaniu zniekształceń poznawczych w myśleniu.',
    category: 'cognitive',
    difficulty: 'intermediate',
    duration: 20,
    instructions: [
      'Przygotuj kartkę papieru i długopis.',
      'Zapisz trudną sytuację, która wywołała u ciebie negatywne emocje.',
      'Zapisz automatyczne myśli, które pojawiły się w tej sytuacji.',
      'Przeanalizuj te myśli pod kątem zniekształceń poznawczych, takich jak: czarno-białe myślenie, nadmierne uogólnianie, filtrowanie negatywne, katastrofizacja, personalizacja, itp.',
      'Przy każdej myśli zapisz, jakie zniekształcenie poznawcze reprezentuje.',
      'Zastanów się, jak możesz przeformułować te myśli w bardziej realistyczny sposób.'
    ],
    tips: [
      'Zapoznaj się z listą zniekształceń poznawczych przed rozpoczęciem ćwiczenia.',
      'Bądź dla siebie wyrozumiały - wszyscy mamy zniekształcenia poznawcze.'
    ],
    benefits: [
      'Zwiększenie świadomości własnych wzorców myślenia',
      'Redukcja negatywnych emocji',
      'Rozwój bardziej realistycznego myślenia'
    ],
    contraindications: []
  },
  {
    name: 'Kwestionowanie myśli automatycznych',
    description: 'Technika poznawcza polegająca na kwestionowaniu i testowaniu automatycznych myśli.',
    category: 'cognitive',
    difficulty: 'intermediate',
    duration: 15,
    instructions: [
      'Zidentyfikuj automatyczną myśl, która wywołuje negatywne emocje.',
      'Zadaj sobie następujące pytania:',
      '- Jakie dowody przemawiają za tą myślą?',
      '- Jakie dowody przemawiają przeciwko tej myśli?',
      '- Czy istnieje alternatywne wyjaśnienie sytuacji?',
      '- Jakie są konsekwencje myślenia w ten sposób?',
      '- Co bym powiedział przyjacielowi w podobnej sytuacji?',
      'Na podstawie odpowiedzi sformułuj bardziej zrównoważoną myśl.'
    ],
    tips: [
      'Zapisuj swoje odpowiedzi, aby lepiej śledzić proces myślowy.',
      'Praktykuj regularnie, aby rozwinąć nawyk kwestionowania automatycznych myśli.'
    ],
    benefits: [
      'Zmniejszenie intensywności negatywnych emocji',
      'Rozwój bardziej elastycznego myślenia',
      'Zwiększenie poczucia kontroli nad własnymi myślami'
    ],
    contraindications: []
  },
  {
    name: 'Analiza za i przeciw',
    description: 'Technika poznawcza polegająca na analizie korzyści i kosztów określonego przekonania lub zachowania.',
    category: 'cognitive',
    difficulty: 'intermediate',
    duration: 15,
    instructions: [
      'Zidentyfikuj przekonanie lub zachowanie, które chcesz przeanalizować.',
      'Narysuj tabelę z dwiema kolumnami: "Za" i "Przeciw".',
      'W kolumnie "Za" wypisz wszystkie korzyści płynące z tego przekonania lub zachowania.',
      'W kolumnie "Przeciw" wypisz wszystkie koszty i negatywne konsekwencje.',
      'Przeanalizuj obie listy i zastanów się, czy przekonanie lub zachowanie jest dla ciebie korzystne w dłuższej perspektywie.'
    ],
    tips: [
      'Staraj się być jak najbardziej obiektywny w swojej analizie.',
      'Rozważ zarówno krótko-, jak i długoterminowe konsekwencje.'
    ],
    benefits: [
      'Podejmowanie bardziej świadomych decyzji',
      'Zmiana niekorzystnych przekonań i zachowań',
      'Rozwój umiejętności krytycznego myślenia'
    ],
    contraindications: []
  },

  // Techniki emocjonalne
  {
    name: 'Dziennik emocji',
    description: 'Ćwiczenie polegające na monitorowaniu i zapisywaniu swoich emocji w ciągu dnia.',
    category: 'emotional',
    difficulty: 'beginner',
    duration: 10,
    instructions: [
      'Przygotuj notatnik lub aplikację do prowadzenia dziennika.',
      'Kilka razy dziennie (np. rano, w południe i wieczorem) zapisuj:',
      '- Jakie emocje odczuwasz w danym momencie?',
      '- Jaka jest intensywność tych emocji w skali 1-10?',
      '- Co wywołało te emocje?',
      '- Jakie myśli towarzyszą tym emocjom?',
      '- Jak reagujesz na te emocje?',
      'Pod koniec dnia przejrzyj swoje notatki i poszukaj wzorców.'
    ],
    tips: [
      'Staraj się nazywać emocje jak najdokładniej, używając bogatego słownictwa emocjonalnego.',
      'Bądź szczery wobec siebie - dziennik jest tylko dla ciebie.'
    ],
    benefits: [
      'Zwiększenie świadomości emocjonalnej',
      'Identyfikacja wyzwalaczy emocjonalnych',
      'Rozwój umiejętności regulacji emocji'
    ],
    contraindications: []
  },
  {
    name: 'Akceptacja emocji',
    description: 'Ćwiczenie polegające na rozwijaniu postawy akceptacji wobec trudnych emocji.',
    category: 'emotional',
    difficulty: 'intermediate',
    duration: 10,
    instructions: [
      'Znajdź spokojne miejsce, gdzie nikt ci nie przeszkodzi.',
      'Skup się na trudnej emocji, którą obecnie odczuwasz lub często doświadczasz.',
      'Zauważ, gdzie w ciele odczuwasz tę emocję. Jakie są fizyczne doznania?',
      'Zamiast walczyć z emocją lub jej unikać, pozwól jej być. Powiedz sobie: "To jest [nazwa emocji]. Mogę ją zaakceptować, nawet jeśli jest nieprzyjemna."',
      'Oddychaj spokojnie, kierując oddech do miejsca w ciele, gdzie odczuwasz emocję.',
      'Obserwuj, jak emocja naturalnie zmienia się i ewoluuje.'
    ],
    tips: [
      'Pamiętaj, że akceptacja nie oznacza poddania się lub rezygnacji.',
      'Praktykuj to ćwiczenie regularnie, nawet z mniej intensywnymi emocjami.'
    ],
    benefits: [
      'Zmniejszenie cierpienia związanego z trudnymi emocjami',
      'Rozwój większej odporności emocjonalnej',
      'Redukcja tendencji do unikania lub tłumienia emocji'
    ],
    contraindications: []
  },
  {
    name: 'Technika przeciwdziałania emocjom',
    description: 'Ćwiczenie polegające na celowym wywoływaniu emocji przeciwnych do tych, które powodują cierpienie.',
    category: 'emotional',
    difficulty: 'advanced',
    duration: 15,
    instructions: [
      'Zidentyfikuj trudną emocję, którą chcesz zmienić (np. smutek, złość, lęk).',
      'Określ emocję przeciwną (np. radość, spokój, odwaga).',
      'Wykonaj działania, które mogą wywołać tę przeciwną emocję:',
      '- Obejrzyj zabawny film lub zdjęcia',
      '- Posłuchaj energetycznej lub uspokajającej muzyki',
      '- Przypomnij sobie pozytywne wspomnienia',
      '- Wykonaj aktywność fizyczną',
      '- Skontaktuj się z osobą, która wywołuje pozytywne emocje',
      'Zauważ, jak zmienia się twój stan emocjonalny.'
    ],
    tips: [
      'Przygotuj wcześniej listę działań, które wywołują u ciebie pozytywne emocje.',
      'Pamiętaj, że celem nie jest unikanie trudnych emocji, ale zmniejszenie ich intensywności, gdy są przytłaczające.'
    ],
    benefits: [
      'Szybka zmiana nastroju w trudnych momentach',
      'Rozwój umiejętności samoregulacji emocjonalnej',
      'Zwiększenie repertuaru strategii radzenia sobie'
    ],
    contraindications: [
      'Nie stosuj tej techniki jako stałego sposobu unikania trudnych emocji.'
    ]
  },

  // Techniki behawioralne
  {
    name: 'Planowanie aktywności',
    description: 'Technika behawioralna polegająca na planowaniu przyjemnych i wartościowych aktywności.',
    category: 'behavioral',
    difficulty: 'beginner',
    duration: 20,
    instructions: [
      'Przygotuj listę aktywności, które sprawiają ci przyjemność lub dają poczucie osiągnięcia.',
      'Podziel je na małe (15 min), średnie (30 min) i duże (1h+) aktywności.',
      'Zaplanuj co najmniej jedną przyjemną aktywność na każdy dzień w nadchodzącym tygodniu.',
      'Zapisz te plany w kalendarzu lub dzienniku.',
      'Po wykonaniu aktywności zapisz, jak się czułeś przed, w trakcie i po jej wykonaniu.'
    ],
    tips: [
      'Zacznij od małych, łatwych do wykonania aktywności.',
      'Bądź realistyczny w swoim planowaniu.',
      'Nawet jeśli nie masz na coś ochoty, spróbuj to zrobić i zauważ, jak zmienia się twój nastrój.'
    ],
    benefits: [
      'Zwiększenie poziomu energii i motywacji',
      'Poprawa nastroju',
      'Przerwanie błędnego koła bezczynności i obniżonego nastroju'
    ],
    contraindications: []
  },
  {
    name: 'Ekspozycja stopniowa',
    description: 'Technika behawioralna polegająca na stopniowym wystawianiu się na sytuacje wywołujące lęk.',
    category: 'behavioral',
    difficulty: 'advanced',
    duration: 30,
    instructions: [
      'Zidentyfikuj sytuacje, które wywołują u ciebie lęk lub unikanie.',
      'Uszereguj te sytuacje od najmniej do najbardziej lękotwórczych (stwórz hierarchię lęku).',
      'Zacznij od ekspozycji na sytuację najniżej w hierarchii.',
      'Pozostań w sytuacji, aż lęk znacząco się zmniejszy (przynajmniej o połowę).',
      'Powtarzaj ekspozycję na tę samą sytuację, aż przestanie wywoływać znaczący lęk.',
      'Przejdź do następnej sytuacji w hierarchii.'
    ],
    tips: [
      'Podczas ekspozycji stosuj techniki relaksacyjne, jak głębokie oddychanie.',
      'Nagradzaj się za każdy sukces, nawet mały.',
      'Pamiętaj, że tymczasowy wzrost lęku jest normalny i nie jest niebezpieczny.'
    ],
    benefits: [
      'Zmniejszenie lęku i unikania',
      'Zwiększenie poczucia kontroli',
      'Poszerzenie strefy komfortu'
    ],
    contraindications: [
      'W przypadku poważnych zaburzeń lękowych, stosuj tę technikę pod nadzorem specjalisty.'
    ]
  },
  {
    name: 'Trening asertywności',
    description: 'Ćwiczenie polegające na rozwijaniu umiejętności asertywnego komunikowania swoich potrzeb i granic.',
    category: 'behavioral',
    difficulty: 'intermediate',
    duration: 20,
    instructions: [
      'Zidentyfikuj sytuację, w której chciałbyś być bardziej asertywny.',
      'Określ, co dokładnie chcesz zakomunikować (potrzeba, granica, prośba, odmowa).',
      'Sformułuj asertywną wypowiedź według schematu:',
      '- "Ja" - mów w pierwszej osobie',
      '- Fakty - opisz sytuację obiektywnie',
      '- Uczucia - wyraź swoje emocje',
      '- Potrzeby - powiedz, czego potrzebujesz',
      '- Prośba - jasno sformułuj, o co prosisz',
      'Przećwicz tę wypowiedź na głos lub przed lustrem.',
      'Zastosuj ją w rzeczywistej sytuacji lub podczas odgrywania ról z zaufaną osobą.'
    ],
    tips: [
      'Zwracaj uwagę na mowę ciała: utrzymuj kontakt wzrokowy, stój prosto, mów wyraźnie.',
      'Pamiętaj, że asertywność to umiejętność, którą rozwija się z czasem.'
    ],
    benefits: [
      'Poprawa relacji interpersonalnych',
      'Zwiększenie poczucia własnej wartości',
      'Redukcja stresu związanego z komunikacją'
    ],
    contraindications: []
  }
];

module.exports = defaultExercises;
