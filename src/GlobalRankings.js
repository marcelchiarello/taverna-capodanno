import React, { useEffect, useState } from 'react';

const GlobalRankings = () => {
  const [globalScores, setGlobalScores] = useState({});
  const [gameHistory, setGameHistory] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const savedScores = localStorage.getItem('tavernaGlobalScores');
    const savedHistory = localStorage.getItem('tavernaGameHistory');
    if (savedScores) setGlobalScores(JSON.parse(savedScores));
    if (savedHistory) setGameHistory(JSON.parse(savedHistory));
  }, []);

  const getPlayerStats = (playerName) => {
    const stats = {
      totalGames: 0,
      victories: 0,
      bestScore: 0,
      recentGames: []
    };

    gameHistory.forEach(game => {
      // Verifica che il gioco abbia le proprietà necessarie
      const gameParticipants = game.teams ? 
        game.teams.flatMap(team => team.members || []) : 
        [];

      if (gameParticipants.includes(playerName)) {
        stats.totalGames++;
        if (game.winner === playerName) stats.victories++;
        stats.bestScore = Math.max(stats.bestScore, game.scores?.[playerName] || 0);
        if (stats.recentGames.length < 5) {
          stats.recentGames.push({
            game: game.gameName || 'Gioco sconosciuto',
            score: game.scores?.[playerName] || 0,
            position: game.positions?.[playerName] || '-'
          });
        }
      }
    });

    return stats;
  };

  if (!Object.keys(globalScores).length) {
    return (
      <div className="bg-blue-900/20 p-6 rounded-lg">
        <h3 className="text-2xl font-medieval text-gold-300 mb-6 text-center">
          Nessun punteggio registrato
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-blue-900/20 p-6 rounded-lg">
        <h3 className="text-2xl font-medieval text-gold-300 mb-6 text-center">
          Classifica Globale dei Valorosi
        </h3>
        <div className="space-y-2">
          {Object.entries(globalScores)
            .sort(([,a], [,b]) => b - a)
            .map(([player, score], idx) => (
              <div 
                key={player} 
                className="flex justify-between items-center p-3 rounded bg-blue-900/30 hover:bg-blue-900/40 cursor-pointer"
                onClick={() => setSelectedPlayer(player)}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-gold-100 font-medieval w-8">
                    {idx + 1}.
                  </span>
                  <span className={`${idx === 0 ? 'text-party-100 font-bold' : 'text-gold-200'}`}>
                    {player}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gold-300">{score} punti</span>
                  <span className="text-gold-200 text-sm">
                    {getPlayerStats(player).victories} vittorie
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {selectedPlayer && (
        <div className="bg-blue-900/20 p-6 rounded-lg animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-medieval text-party-100">
              Storia di {selectedPlayer}
            </h4>
            <button 
              onClick={() => setSelectedPlayer(null)}
              className="text-gold-200 hover:text-gold-300"
            >
              ✕
            </button>
          </div>
          
          {(() => {
            const stats = getPlayerStats(selectedPlayer);
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-900/30 p-4 rounded">
                    <p className="text-gold-200">Partite Giocate</p>
                    <p className="text-2xl text-party-100">{stats.totalGames}</p>
                  </div>
                  <div className="bg-blue-900/30 p-4 rounded">
                    <p className="text-gold-200">Vittorie</p>
                    <p className="text-2xl text-party-100">{stats.victories}</p>
                  </div>
                  <div className="bg-blue-900/30 p-4 rounded">
                    <p className="text-gold-200">Miglior Punteggio</p>
                    <p className="text-2xl text-party-100">{stats.bestScore}</p>
                  </div>
                </div>

                {stats.recentGames.length > 0 && (
                  <div className="mt-6">
                    <h5 className="text-lg font-medieval text-gold-200 mb-3">
                      Ultime Sfide
                    </h5>
                    <div className="space-y-2">
                      {stats.recentGames.map((game, idx) => (
                        <div key={idx} className="bg-blue-900/30 p-3 rounded flex justify-between">
                          <span className="text-gold-200">{game.game}</span>
                          <span className="text-party-100">{game.score} punti - {game.position}° posto</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default GlobalRankings;