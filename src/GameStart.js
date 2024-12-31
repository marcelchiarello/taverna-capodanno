import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './components/ui/alert-dialog';
import { Alert, AlertTitle, AlertDescription } from './components/ui/alert';

const ADMIN_PASSWORD = "Excalibur2025";

const TEAM_NAMES = [
  "Cavalieri dell'Alba Dorata",
  "Guardiani del Crepuscolo",
  "Ordine del Drago Scarlatto",
  "Compagnia del Grifone",
  "Sentinelle della Luna d'Argento",
  "Legione del Sole Nascente",
  "Custodi della Corona",
  "Paladini del Vento del Nord",
  "Difensori della Rosa Nera",
  "Campioni della Fenice",
  "Lame dell'Aurora",
  "Vessilli del Leone",
  "Eredi del Fulmine",
  "Guardiani dell'Aquila",
  "Portatori della Fiamma Eterna",
  "Custodi del Calice Sacro",
  "Cavalieri della Stella Cadente",
  "Ordine del Lupo Argentato",
  "Compagnia della Luna Crescente",
  "Eroi del Destino"
];

const GAMES = [
  {
    id: 1,
    name: "Il Sussurro oltre l'Elmo Magico",
    basePoints: {
      "Risposta Corretta": 5,
      "Bonus Velocità": 10,
      "Errore": -5
    }
  },
  {
    id: 2,
    name: "La Catena dei Prodigi",
    basePoints: {
      "Sequenza Corretta": 10,
      "Errore Sequenza": -5,
    }
  },
  {
    id: 3,
    name: "La Danza del Quadrato Magico",
    basePoints: {
      "Nel Quadrato": 10,
      "Miglior Ballerino": 15,
      "Fuori Quadrato": -5
    }
  },
  {
    id: 4,
    name: "La Sfida del Rotolo e del Sigillo",
    basePoints: {
      "Completamento": 20,
      "Sigillo Recuperato": 10,
      "Rotolo Rotto": -5
    }
  },
  {
    id: 5,
    name: "La Raccolta dei Calici Sacri",
    basePoints: {
      "Calice Raccolto": 5,
      "Primo a Completare": 20,
      "Calice Caduto": -5
    }
  }
];

const GameStart = ({ existingTeams, judge, onGameEnd, selectedGame, onBackToSelection }) => {
  // Stati base
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Stati di gioco
  const [gameState, setGameState] = useState('setup');
  const [currentGame, setCurrentGame] = useState(null);
  const [teams, setTeams] = useState([]);
  const [gameScores, setGameScores] = useState({});
  const [globalPlayerScores, setGlobalPlayerScores] = useState({});

  useEffect(() => {
    if (selectedGame) {
      const game = GAMES.find(g => g.id === selectedGame.id);
      setCurrentGame(game);
    }
  }, [selectedGame]);

  useEffect(() => {
    if (existingTeams && existingTeams.length > 0) {
      const shuffledTeamNames = [...TEAM_NAMES].sort(() => Math.random() - 0.5);
      const teamsWithNames = existingTeams.map((team, index) => ({
        ...team,
        name: shuffledTeamNames[index]
      }));
      setTeams(teamsWithNames);
    }
  }, [existingTeams]);

  useEffect(() => {
    const savedGlobalScores = localStorage.getItem('tavernaGlobalScores');
    if (savedGlobalScores) {
      setGlobalPlayerScores(JSON.parse(savedGlobalScores));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(globalPlayerScores).length > 0) {
      localStorage.setItem('tavernaGlobalScores', JSON.stringify(globalPlayerScores));
    }
  }, [globalPlayerScores]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setAlertMessage('Password non corretta!');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const startGame = () => {
    setGameState('playing');
    setGameScores({});
    setAlertMessage(`${currentGame.name} iniziato!`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const endGame = () => {
    const finalScores = {};
    const positions = {};
    const teamTotals = {};
    
    // Calcola i punteggi per giocatori e team
    teams.forEach(team => {
      teamTotals[team.id] = 0;
      team.members.forEach(member => {
        const playerScore = gameScores[`${team.id}-${member.id}`] || 0;
        finalScores[member.name] = playerScore;
        teamTotals[team.id] += playerScore;
        
        setGlobalPlayerScores(prev => ({
          ...prev,
          [member.name]: (prev[member.name] || 0) + playerScore
        }));
      });
    });

    // Determina le posizioni dei giocatori
    const sortedPlayers = Object.entries(finalScores)
      .sort(([,a], [,b]) => b - a);
    
    sortedPlayers.forEach(([player], index) => {
      positions[player] = index + 1;
    });

    const winner = sortedPlayers[0][0];

    // Trova i team vincitori (può essere più di uno in caso di pareggio)
    const sortedTeams = Object.entries(teamTotals)
      .sort(([,a], [,b]) => b - a);
    
    const highestScore = sortedTeams[0][1];
    const winningTeams = teams.filter(team => teamTotals[team.id] === highestScore);

    // Prepara il messaggio del risultato
    let resultMessage = '';
    if (winningTeams.length > 1) {
      resultMessage = `🏅 Pareggio tra ${winningTeams.map(t => t.name).join(' e ')}!\n\n` +
                     `Punteggio: ${highestScore} punti\n`;
    } else {
      resultMessage = `🏆 ${winningTeams[0].name} trionfa nella sfida!\n\n` +
                     `Punteggio squadra: ${highestScore} punti\n`;
    }
    resultMessage += `Miglior giocatore: ${winner} (${finalScores[winner]} punti)`;

    // Salva la storia del gioco
    const gameHistory = JSON.parse(localStorage.getItem('tavernaGameHistory') || '[]');
    gameHistory.push({
      date: new Date().toISOString(),
      gameName: currentGame.name,
      teams: teams.map(t => ({
        name: t.name,
        members: t.members.map(m => m.name),
        score: teamTotals[t.id]
      })),
      scores: finalScores,
      positions,
      winner,
      winningTeams: winningTeams.map(t => t.name),
      isDraw: winningTeams.length > 1,
      judge
    });
    localStorage.setItem('tavernaGameHistory', JSON.stringify(gameHistory));
    localStorage.setItem('tavernaGlobalScores', JSON.stringify(globalPlayerScores));

    setAlertMessage(resultMessage);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
      setGameState('ended');
      if (onGameEnd) {
        onGameEnd(finalScores, globalPlayerScores);
      }
    }, 5000);
};

  const awardPoints = (teamId, memberId, memberName, points) => {
    const key = `${teamId}-${memberId}`;
    setGameScores(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + points
    }));

    setAlertMessage(`${points > 0 ? '+' : ''}${points} punti a ${memberName}`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  const getTeamTotal = (teamId) => {
    return Object.entries(gameScores)
      .filter(([key]) => key.startsWith(`${teamId}-`))
      .reduce((sum, [, score]) => sum + score, 0);
  };

  const resetAllScores = () => {
    setGameScores({});
    setTeams(teams.map(team => ({ ...team, score: 0 })));
    setShowResetDialog(false);
    setAlertMessage('Punteggi della partita resettati con successo!');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const resetGlobalScores = () => {
    setGlobalPlayerScores({});
    localStorage.removeItem('tavernaGlobalScores');
    setAlertMessage('Punteggi globali resettati con successo!');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-blue-950/50 backdrop-blur-sm rounded-lg p-8 border border-gold-200/20">
        <h3 className="text-3xl font-medieval text-gold-300 mb-6 text-center">
          Registro dei Punteggi della Taverna
        </h3>
        <div className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Inserisci la parola segreta..."
            className="w-full bg-blue-900/20 text-gold-200 border border-gold-200/20 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gold-300/50"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleLogin();
              }
            }}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-gold-300 text-blue-950 px-6 py-3 rounded-lg font-medieval hover:bg-gold-200 transition-colors"
          >
            Accedi al Registro
          </button>
        </div>
        {showAlert && (
          <Alert className="mt-4 bg-red-900/20 border-red-500/50">
            <AlertTitle className="text-red-400">Errore</AlertTitle>
            <AlertDescription className="text-red-300">
              {alertMessage}
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-blue-900/20 p-6 rounded-lg">
        <h3 className="text-2xl font-medieval text-gold-300 mb-4 text-center">
          {currentGame?.name || 'Seleziona un Gioco'}
        </h3>

        {gameState === 'setup' && currentGame && (
          <div className="text-center">
            <p className="text-gold-200 mb-4">
              Giudice: {judge}
            </p>
            <button
              onClick={startGame}
              className="bg-party-100 text-blue-950 px-6 py-3 rounded-full font-medieval hover:bg-party-200 transition-colors"
            >
              Inizia la Sfida
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="text-center">
            <button
              onClick={endGame}
              className="bg-party-100 text-blue-950 px-6 py-3 rounded-full font-medieval hover:bg-party-200 transition-colors"
            >
              Termina Sfida
            </button>
          </div>
        )}

        {gameState === 'ended' && (
          <div className="text-center">
            <button
              onClick={onBackToSelection}
              className="bg-blue-700 text-white px-6 py-3 rounded-full font-medieval hover:bg-blue-600 transition-colors"
            >
              Torna alla Selezione
            </button>
          </div>
        )}
      </div>

      {gameState === 'playing' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map(team => (
            <div key={team.id} className="bg-blue-900/30 p-6 rounded-lg border border-gold-200/20">
              <h4 className="text-xl font-medieval text-party-100 mb-4">
                {team.name}
              </h4>

              <div className="mb-4">
                <p className="text-gold-200">
                  Punteggio Totale: {getTeamTotal(team.id)}
                </p>
              </div>

              <div className="space-y-2">
                {team.members.map((member) => (
                  <div key={member.id} className="flex justify-between items-center p-2 rounded bg-blue-900/40">
                    <span className="text-gold-200">{member.name}</span>
                    <div className="flex gap-2">
                      {Object.entries(currentGame.basePoints).map(([type, points]) => (
                        <button
                          key={type}
                          onClick={() => awardPoints(team.id, member.id, member.name, points)}
                          className={`px-3 py-1 rounded text-sm ${points > 0 ? 'bg-green-700 hover:bg-green-600' : 'bg-red-700 hover:bg-red-600'
                            } text-white font-medieval`}
                          title={type}
                        >
                          {points > 0 ? `+${points}` : points}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {gameState !== 'playing' && Object.keys(globalPlayerScores).length > 0 && (
        <div className="bg-blue-900/20 p-6 rounded-lg">
          <h4 className="text-xl font-medieval text-gold-300 mb-4">
            Classifica Globale dei Valorosi
          </h4>
          <div className="space-y-2">
            {Object.entries(globalPlayerScores)
              .sort(([, a], [, b]) => b - a)
              .map(([player, score], idx) => (
                <div key={player} className="flex justify-between items-center p-2 rounded bg-blue-900/30">
                  <span className={`text-gold-200 ${idx === 0 ? 'text-party-100 font-bold' : ''}`}>
                    {idx + 1}. {player}
                  </span>
                  <span className="text-gold-300">{score} punti</span>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-end">
        <button
          onClick={() => setShowResetDialog(true)}
          className="bg-red-700 text-white px-4 py-2 rounded font-medieval hover:bg-red-600 transition-colors"
        >
          Reset Punteggi Serata
        </button>
        <button
          onClick={resetGlobalScores}
          className="bg-red-900 text-white px-4 py-2 rounded font-medieval hover:bg-red-800 transition-colors"
        >
          Reset Punteggi Globali
        </button>
      </div>

      <AlertDialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
        <AlertDialogContent className="bg-blue-950 border border-gold-200/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gold-300 font-medieval">
              Conferma Reset Punteggi
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gold-200">
              Sei sicuro di voler resettare tutti i punteggi della serata?
              Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowResetDialog(false)}
              className="bg-blue-700 text-white hover:bg-blue-600"
            >
              Annulla
            </AlertDialogAction>
            <AlertDialogAction
              onClick={resetAllScores}
              className="bg-red-700 text-white hover:bg-red-600"
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showAlert && (
        <Alert className="fixed bottom-4 right-4 max-w-md bg-blue-900/90 border-gold-200/20">
          <AlertTitle className="text-gold-300">Annunzio</AlertTitle>
          <AlertDescription className="text-gold-200 whitespace-pre-line">
            {alertMessage}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default GameStart;