import React, { useState, useEffect } from 'react';
import { RotateCw, Check, X, ArrowRight } from 'lucide-react';

const FlashcardGame = () => {
  // El vocabulario se inyecta desde el archivo HTML
  // const vocabulary = []; // Se reemplaza dinámicamente

  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [mode, setMode] = useState('engToSpa');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableMonths, setAvailableMonths] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    shuffleCards();
  }, [mode, selectedMonth, selectedCategory, selectedDate]);

  const initializeData = () => {
    // Lista completa de meses del curso académico (octubre a junio)
    const allMonths = ['Octubre', 'Noviembre', 'Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
    setAvailableMonths(allMonths);

    // Usar window.vocabulary si está disponible, sino usar la variable local
    const currentVocabulary = window.vocabulary || vocabulary;

    // Filtrar datos inválidos antes de extraer categorías
    const validVocabulary = currentVocabulary.filter(item => 
      item.english !== 'n/a' && 
      item.spanish !== 'n/a' && 
      item.category !== 'n/a' &&
      item.english.trim() !== '' &&
      item.spanish.trim() !== '' &&
      item.category.trim() !== ''
    );

    // Extraer categorías únicas del vocabulario válido
    const categories = [...new Set(validVocabulary.map(item => {
      const match = item.category.match(/(\w+) - \d+ (\w+)/);
      return match ? match[1] : item.category;
    }))];
    setAvailableCategories(categories);

    // Extraer fechas únicas del vocabulario válido
    const dates = [...new Set(validVocabulary.map(item => item.date).filter(Boolean))].sort();
    setAvailableDates(dates);

    // Establecer mes inicial desde URL si existe
    if (initialMonth && allMonths.includes(initialMonth)) {
      setSelectedMonth(initialMonth);
    } else if (initialMonth) {
      // Convertir de minúsculas a capitalización correcta
      const capitalizedMonth = initialMonth.charAt(0).toUpperCase() + initialMonth.slice(1).toLowerCase();
      if (allMonths.includes(capitalizedMonth)) {
        setSelectedMonth(capitalizedMonth);
      }
    }
  };

  const updateCategoriesOnly = () => {
    // Usar window.vocabulary si está disponible, sino usar la variable local
    const currentVocabulary = window.vocabulary || vocabulary;

    // Filtrar datos inválidos antes de extraer categorías
    const validVocabulary = currentVocabulary.filter(item => 
      item.english !== 'n/a' && 
      item.spanish !== 'n/a' && 
      item.category !== 'n/a' &&
      item.english.trim() !== '' &&
      item.spanish.trim() !== '' &&
      item.category.trim() !== ''
    );

    // Extraer categorías únicas del vocabulario válido
    const categories = [...new Set(validVocabulary.map(item => {
      const match = item.category.match(/(\w+) - \d+ (\w+)/);
      return match ? match[1] : item.category;
    }))];
    setAvailableCategories(categories);

    // Extraer fechas únicas del vocabulario válido
    const dates = [...new Set(validVocabulary.map(item => item.date).filter(Boolean))].sort();
    setAvailableDates(dates);
  };

  const shuffleCards = () => {
    // Usar window.vocabulary si está disponible, sino usar la variable local
    const currentVocabulary = window.vocabulary || vocabulary;
    let filteredVocabulary = [...currentVocabulary];

    // Filtrar datos inválidos (n/a)
    filteredVocabulary = filteredVocabulary.filter(item => 
      item.english !== 'n/a' && 
      item.spanish !== 'n/a' && 
      item.category !== 'n/a' &&
      item.english.trim() !== '' &&
      item.spanish.trim() !== '' &&
      item.category.trim() !== ''
    );

    // Solo filtrar por mes si no se cargó desde URL específica
    // Si se cargó desde URL específica, los datos ya están filtrados por mes
    if (selectedMonth && !initialMonth) {
      filteredVocabulary = filteredVocabulary.filter(item => {
        const match = item.category.match(/(\w+) - \d+ (\w+)/);
        return match && match[2].toLowerCase() === selectedMonth.toLowerCase();
      });
    }

    // Filtrar por categoría si está seleccionada
    if (selectedCategory) {
      filteredVocabulary = filteredVocabulary.filter(item => {
        const match = item.category.match(/(\w+) - \d+ (\w+)/);
        const categoryName = match ? match[1] : item.category;
        return categoryName === selectedCategory;
      });
    }

    // Filtrar por fecha si está seleccionada
    if (selectedDate) {
      filteredVocabulary = filteredVocabulary.filter(item => item.date === selectedDate);
    }

    const shuffled = filteredVocabulary.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setCorrect(0);
    setIncorrect(0);
    setShowResult(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }

    if (currentIndex + 1 < cards.length) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      }, 500);
    } else {
      setShowResult(true);
    }
  };

  const restart = () => {
    shuffleCards();
  };

  const handleMonthChange = async (month) => {
    setSelectedMonth(month);
    setSelectedCategory(''); // Resetear categoría cuando cambia el mes
    setSelectedDate(''); // Resetear fecha cuando cambia el mes
    
    // Actualizar la URL con el mes en minúsculas
    const url = new URL(window.location);
    if (month) {
      url.searchParams.set('month', month.toLowerCase());
    } else {
      url.searchParams.delete('month');
    }
    window.history.pushState({}, '', url);

    // Recargar los datos del mes seleccionado
    try {
      if (month) {
        const monthUrl = `https://opensheet.elk.sh/1mvPzno2fQuo9E37Pbwfq0bhrd6s5iLm85EO2zCgqnoc/${month.toLowerCase()}`;
        const response = await fetch(monthUrl);
        if (response.ok) {
          const newVocabulary = await response.json();
          // Actualizar el vocabulario global
          window.vocabulary = newVocabulary;
          // Actualizar solo las categorías sin resetear el mes
          updateCategoriesOnly();
          // Reorganizar las cartas
          shuffleCards();
        } else {
          console.warn(`No se pudo cargar datos para ${month}`);
        }
      } else {
        // Si se selecciona "Todos los meses", recargar todos los datos
        const months = ['Octubre', 'Noviembre', 'Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
        const allVocabulary = [];
        
        for (const monthName of months) {
          try {
            const monthUrl = `https://opensheet.elk.sh/1mvPzno2fQuo9E37Pbwfq0bhrd6s5iLm85EO2zCgqnoc/${monthName.toLowerCase()}`;
            const response = await fetch(monthUrl);
            if (response.ok) {
              const data = await response.json();
              allVocabulary.push(...data);
            }
          } catch (err) {
            console.warn(`No se pudo cargar ${monthName}:`, err);
          }
        }
        
        window.vocabulary = allVocabulary;
        updateCategoriesOnly();
        shuffleCards();
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getFilteredCategories = () => {
    if (!selectedMonth) {
      return availableCategories;
    }
    
    // Si se cargó desde URL específica, mostrar todas las categorías disponibles
    if (initialMonth) {
      return availableCategories;
    }
    
    // Usar window.vocabulary si está disponible, sino usar la variable local
    const currentVocabulary = window.vocabulary || vocabulary;
    
    // Filtrar categorías por el mes seleccionado, excluyendo datos inválidos
    const monthCategories = currentVocabulary
      .filter(item => 
        item.english !== 'n/a' && 
        item.spanish !== 'n/a' && 
        item.category !== 'n/a' &&
        item.english.trim() !== '' &&
        item.spanish.trim() !== '' &&
        item.category.trim() !== ''
      )
      .filter(item => {
        const match = item.category.match(/(\w+) - \d+ (\w+)/);
        return match && match[2].toLowerCase() === selectedMonth.toLowerCase();
      })
      .map(item => {
        const match = item.category.match(/(\w+) - \d+ (\w+)/);
        return match ? match[1] : item.category;
      });
    
    return [...new Set(monthCategories)];
  };

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No hay vocabulario disponible</h2>
          <p className="text-gray-600 mb-6">
            {selectedMonth 
              ? `No se encontró vocabulario para el mes de ${selectedMonth}.`
              : 'No se encontró vocabulario con los filtros seleccionados.'
            }
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Prueba con:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedMonth('')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Todos los meses
              </button>
              <button
                onClick={() => setSelectedCategory('')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Todas las categorías
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const total = correct + incorrect;
    const percentage = Math.round((correct / total) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">¡Completado!</h2>
          <div className="mb-6">
            <div className="text-6xl font-bold text-purple-600 mb-2">{percentage}%</div>
            <div className="text-gray-600">Precisión</div>
          </div>
          <div className="flex justify-around mb-8">
            <div>
              <div className="text-3xl font-bold text-green-600">{correct}</div>
              <div className="text-sm text-gray-600">Correctas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">{incorrect}</div>
              <div className="text-sm text-gray-600">Incorrectas</div>
            </div>
          </div>
          <button
            onClick={restart}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <RotateCw size={20} />
            Jugar de nuevo
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const frontText = mode === 'engToSpa' ? currentCard.english : currentCard.spanish;
  const backText = mode === 'engToSpa' ? currentCard.spanish : currentCard.english;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-4">Flashcards de Vocabulario</h1>
          
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            {/* Selector de Mes */}
            <div className="flex flex-col items-center">
              <label className="text-white text-sm mb-2">Mes:</label>
              <select
                value={selectedMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white text-gray-800 border-0 focus:ring-2 focus:ring-purple-500 min-w-[120px]"
              >
                <option value="">Todos los meses</option>
                {availableMonths.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            {/* Selector de Categoría */}
            <div className="flex flex-col items-center">
              <label className="text-white text-sm mb-2">Categoría:</label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white text-gray-800 border-0 focus:ring-2 focus:ring-purple-500 min-w-[120px]"
              >
                <option value="">Todas las categorías</option>
                {getFilteredCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Selector de Fecha */}
            <div className="flex flex-col items-center">
              <label className="text-white text-sm mb-2">Fecha:</label>
              <select
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white text-gray-800 border-0 focus:ring-2 focus:ring-purple-500 min-w-[120px]"
              >
                <option value="">Todas las fechas</option>
                {availableDates.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => setMode('engToSpa')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                mode === 'engToSpa' 
                  ? 'bg-white text-purple-600' 
                  : 'bg-purple-700 text-white hover:bg-purple-800'
              }`}
            >
              Inglés → Español
            </button>
            <button
              onClick={() => setMode('spaToEng')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                mode === 'spaToEng' 
                  ? 'bg-white text-purple-600' 
                  : 'bg-purple-700 text-white hover:bg-purple-800'
              }`}
            >
              Español → Inglés
            </button>
          </div>
          <div className="text-white text-lg">
            Tarjeta {currentIndex + 1} de {cards.length}
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="text-white">
              <span className="font-semibold">✓ {correct}</span>
            </div>
            <div className="text-white">
              <span className="font-semibold">✗ {incorrect}</span>
            </div>
          </div>
        </div>

        {/* Flashcard */}
        <div 
          className="relative h-80 cursor-pointer mb-6"
          onClick={flipCard}
          style={{ perspective: '1000px' }}
        >
          <div
            className={`absolute w-full h-full transition-transform duration-500 transform-gpu`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Front */}
            <div
              className="absolute w-full h-full bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-sm font-semibold text-purple-600 mb-4 uppercase">
                {currentCard.category}
              </div>
              <div className="text-4xl font-bold text-gray-800 text-center">
                {frontText}
              </div>
              <div className="text-gray-400 mt-6">Haz clic para voltear</div>
            </div>

            {/* Back */}
            <div
              className="absolute w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="text-4xl font-bold text-white text-center">
                {backText}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        {isFlipped && (
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleAnswer(false)}
              className="bg-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-600 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
            >
              <X size={24} />
              No sabía
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="bg-green-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-600 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
            >
              <Check size={24} />
              Sabía
            </button>
          </div>
        )}

        {/* Reset button */}
        <div className="text-center mt-6">
          <button
            onClick={restart}
            className="text-white hover:text-gray-200 underline flex items-center gap-2 mx-auto"
          >
            <RotateCw size={16} />
            Reiniciar juego
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardGame;