import React, { useState, useEffect, useRef } from 'react';

const LETTER_TO_NUMBER = {
  "A": 1, "B": 2, "C": 3, "D": 4, "E": 5,
  "F": 6, "G": 7, "H": 8, "I": 9, "Z": 0
};

const FILMS_DATA = [
  // LA (39.93041)
  { coord: "LA", cifra: 3, lettera: "C", titolo: "Jurassic Park", hint: "Blockbuster del 1993 su un parco con dinosauri clonati.", length: 12, highlightPos: 8 },
  { coord: "LA", cifra: 9, lettera: "I", titolo: "Il padrino", hint: "Capolavoro di Francis Ford Coppola (1972).", length: 9, highlightPos: 7 },
  { coord: "LA", cifra: 9, lettera: "I", titolo: "I soliti ignoti", hint: "Commedia di Mario Monicelli (1958).", length: 13, highlightPos: 8 },
  { coord: "LA", cifra: 3, lettera: "C", titolo: "Il ciclone", hint: "Film di Leonardo Pieraccioni (1996).", length: 9, highlightPos: 5 },
  { coord: "LA", cifra: 0, lettera: "Z", titolo: "Il mago di oz", hint: "Classico fantastico del 1939 con Judy Garland.", length: 10, highlightPos: 10 },
  { coord: "LA", cifra: 4, lettera: "D", titolo: "La dolce vita", hint: "Capolavoro di Federico Fellini (1960).", length: 11, highlightPos: 3 },
  { coord: "LA", cifra: 1, lettera: "A", titolo: "Malena", hint: "Film di Giuseppe Tornatore (2000) con Monica Bellucci.", length: 6, highlightPos: 6 },
  // LO (18.35620)
  { coord: "LO", cifra: 1, lettera: "A", titolo: "Amarcord", hint: "Film di Federico Fellini (1973), ritratto nostalgico.", length: 8, highlightPos: 3 },
  { coord: "LO", cifra: 8, lettera: "H", titolo: "Hachiko", hint: "Storia vera di un cane fedele con Richard Gere (2009).", length: 7, highlightPos: 4 },
  { coord: "LO", cifra: 3, lettera: "C", titolo: "La citta incantata", hint: "Film d'animazione di Hayao Miyazaki (2001).", length: 16, highlightPos: 10 },
  { coord: "LO", cifra: 5, lettera: "E", titolo: "La ricerca della felicita", hint: "Film di Gabriele Muccino (2006) con Will Smith.", length: 22, highlightPos: 16 },
  { coord: "LO", cifra: 6, lettera: "F", titolo: "Il fuggitivo", hint: "Thriller del 1993 con Harrison Ford e Tommy Lee Jones.", length: 11, highlightPos: 3 },
  { coord: "LO", cifra: 2, lettera: "B", titolo: "La bella e la bestia", hint: "Favola Disney del 1991, storia d'amore tra una ragazza e un mostro.", length: 16, highlightPos: 11 },
  { coord: "LO", cifra: 0, lettera: "Z", titolo: "World war z", hint: "Thriller apocalittico del 2013 con un'epidemia di zombie.", length: 9, highlightPos: 9 }
];

const CrosswordPuzzle = () => {
  const copyToClipboard = () => {
    const laNumbers = highlightedLetters.LA.map(l => LETTER_TO_NUMBER[l] || '_').join('');
    const loNumbers = highlightedLetters.LO.map(l => LETTER_TO_NUMBER[l] || '_').join('');
    
    if (laNumbers.includes('_') || loNumbers.includes('_')) {
      alert('Completa prima tutte le coordinate');
      return;
    }

    const coords = `${laNumbers.slice(0,2)}.${laNumbers.slice(2)},${loNumbers.slice(0,2)}.${loNumbers.slice(2)}`;
    navigator.clipboard.writeText(coords);
  };
  const [gridValues, setGridValues] = useState({});
  const [highlightedLetters, setHighlightedLetters] = useState({ LA: [], LO: [] });
  const [showNumbers, setShowNumbers] = useState(false);
  const inputRefs = useRef({});

  useEffect(() => {
    FILMS_DATA.forEach((film, filmIndex) => {
      for (let pos = 1; pos <= film.length; pos++) {
        inputRefs.current[`${filmIndex}-${pos}`] = React.createRef();
      }
    });
  }, []);

  const handleCellChange = (filmIndex, position, value) => {
    const newValue = value.toUpperCase();
    if (newValue.match(/^[A-Z]$/) || newValue === '') {
      const newGridValues = {
        ...gridValues,
        [`${filmIndex}-${position}`]: newValue
      };
      setGridValues(newGridValues);
      updateHighlightedLetters(newGridValues);

      if (newValue !== '' && position < FILMS_DATA[filmIndex].length) {
        const nextRef = inputRefs.current[`${filmIndex}-${position + 1}`];
        if (nextRef?.current) {
          nextRef.current.focus();
        }
      }
    }
  };

  const handleKeyDown = (filmIndex, position, event) => {
    if (event.key === 'Backspace' && !gridValues[`${filmIndex}-${position}`]) {
      if (position > 1) {
        const prevRef = inputRefs.current[`${filmIndex}-${position - 1}`];
        if (prevRef?.current) {
          prevRef.current.focus();
        }
      }
    }
  };

  const handleReset = (filmIndex) => {
    const newGridValues = { ...gridValues };
    for (let pos = 1; pos <= FILMS_DATA[filmIndex].length; pos++) {
      delete newGridValues[`${filmIndex}-${pos}`];
    }
    setGridValues(newGridValues);
    updateHighlightedLetters(newGridValues);
    if (inputRefs.current[`${filmIndex}-1`]?.current) {
      inputRefs.current[`${filmIndex}-1`].current.focus();
    }
  };

  const updateHighlightedLetters = (newValues, forceLetters = false) => {
    const la = [];
    const lo = [];

    FILMS_DATA.forEach((film, index) => {
      const letter = newValues[`${index}-${film.highlightPos}`];
      if (letter) {
        if (film.coord === 'LA') {
          la.push(letter);
        } else {
          lo.push(letter);
        }
      }
    });

    setHighlightedLetters({ 
      LA: la, 
      LO: lo 
    });
  };

  const formatCoordinate = (items) => {
    if (items.length === 0) return '_ _._ _ _ _ _';
    const displayItems = showNumbers 
      ? items.map(letter => letter === 'Z' ? '0' : LETTER_TO_NUMBER[letter] !== undefined ? LETTER_TO_NUMBER[letter] : '_')
      : items;
    return `${displayItems[0] || '_'}${displayItems[1] || '_'}.${displayItems[2] || '_'}${displayItems[3] || '_'}${displayItems[4] || '_'}${displayItems[5] || '_'}${displayItems[6] || '_'}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md border">
          <div className="flex justify-center text-xl mb-4">
            <span className="text-gray-700">
              LA,LO = {formatCoordinate(highlightedLetters.LA)}, {formatCoordinate(highlightedLetters.LO)}
            </span>
          </div>
          <div className="text-center">
            <button 
              onClick={() => {
                setShowNumbers(!showNumbers);
                updateHighlightedLetters(gridValues);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {showNumbers ? "Nascondi l'aiuto" : "Aiuto per i meno nobili"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {FILMS_DATA.map((film, filmIndex) => (
          <div key={filmIndex} className="bg-white p-4 rounded-lg shadow-md border">
            <div className="flex items-start space-x-4">
              <span className="w-8 text-gray-700 mt-2">{filmIndex + 1}.</span>
              <div className="space-y-3 flex-grow">
                <p className="text-gray-600 text-sm">{film.hint}</p>
                <div className="flex items-center gap-4">
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: film.length }).map((_, pos) => {
                      const value = gridValues[`${filmIndex}-${pos + 1}`];
                      const displayValue = showNumbers && value && LETTER_TO_NUMBER[value] !== undefined 
                        ? LETTER_TO_NUMBER[value] 
                        : value;
                      
                      return (
                        <input
                          key={pos}
                          ref={inputRefs.current[`${filmIndex}-${pos + 1}`]}
                          type="text"
                          maxLength="1"
                          className={`w-8 h-8 text-center font-bold rounded-md ${
                            pos + 1 === film.highlightPos
                              ? film.coord === 'LA'
                                ? 'bg-blue-50 text-blue-600 border-2 border-blue-400'
                                : 'bg-red-50 text-red-600 border-2 border-red-400'
                              : 'bg-white text-black border border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-blue-300`}
                          value={displayValue || ''}
                          onChange={(e) => handleCellChange(filmIndex, pos + 1, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(filmIndex, pos + 1, e)}
                        />
                      );
                    })}
                  </div>
                  <button
                    onClick={() => handleReset(filmIndex)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    title="Cancella tutte le lettere"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrosswordPuzzle;