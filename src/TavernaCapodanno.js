import React, { useState, useRef } from 'react';

import CrosswordPuzzle from './CrosswordPuzzle';
import PasswordChecker from './PasswordChecker';
import GameStart from './GameStart';
import GlobalRankings from './GlobalRankings';
import AdminReset from './AdminReset';

// In TavernaCapodanno.js, dopo gli import

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


const TavernaCapodanno = () => {
  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [activeGame, setActiveGame] = useState(null);
  const [activeTab, setActiveTab] = useState('proclama');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [numTeams, setNumTeams] = useState(2);
  const [teams, setTeams] = useState([]);
  const [judge, setJudge] = useState(null);
  const [gameScores, setGameScores] = useState({});



  const tabs = ['proclama', 'convitati', 'Ingresso al Convivio', 'vivande', 'giochi', 'Danze di Stelle e Fuochi', 'dispaccio'];

  const allParticipants = [
    "Madonna Alessandra", "Madonna Cristiana", "Madonna Fabiola",
    "Madonna Romina", "Madonna Gloria", "Madonna Sara",
    "Madonna Valentina", "Ser Vito", "Ser Mars", "Ser Mino",
    "Ser Pier Paolo", "Ser Francesco", "Ser Matteo H",
    "Ser Matteo M", "Madonna Federica", "Madonna Elisa", "Sir Antonello",
  ];

  const generateTeams = () => {
    // Definizione dei partecipanti
    const allParticipants = [
      { id: 1, name: "Madonna Alessandra" },
      { id: 2, name: "Madonna Cristiana" },
      { id: 3, name: "Madonna Fabiola" },
      { id: 4, name: "Madonna Romina" },
      { id: 5, name: "Madonna Gloria" },
      { id: 6, name: "Madonna Sara" },
      { id: 7, name: "Madonna Valentina" },
      { id: 8, name: "Ser Vito" },
      { id: 9, name: "Ser Mars" },
      { id: 10, name: "Ser Mino" },
      { id: 11, name: "Ser Pier Paolo" },
      { id: 12, name: "Ser Francesco" },
      { id: 13, name: "Ser Matteo H" },
      { id: 14, name: "Ser Matteo M" },
      { id: 15, name: "Madonna Federica" },
      { id: 16, name: "Madonna Elisa" },
      { id: 17, name: "Sir Antonello" }
    ];

    // Crea una copia e mischia l'array dei partecipanti
    const shuffledParticipants = [...allParticipants].sort(() => Math.random() - 0.5);

    // Seleziona un giudice
    const judgeSelected = shuffledParticipants.pop();
    setJudge(judgeSelected.name);

    // Calcola quanti membri per squadra
    const membersPerTeam = Math.floor(shuffledParticipants.length / numTeams);

    // Crea le squadre
    const newTeams = [];
    for (let i = 0; i < numTeams; i++) {
      const startIndex = i * membersPerTeam;
      const endIndex = i === numTeams - 1
        ? shuffledParticipants.length
        : startIndex + membersPerTeam;

      // Assegna un nome alla squadra dalla lista TEAM_NAMES
      const teamName = TEAM_NAMES[i % TEAM_NAMES.length];

      newTeams.push({
        id: i + 1,
        name: teamName,
        members: shuffledParticipants.slice(startIndex, endIndex)
      });
    }

    setTeams(newTeams);

    // Inizializza i punteggi globali se non esistono
    const savedScores = localStorage.getItem('tavernaGlobalScores');
    if (!savedScores) {
      const initialScores = {};
      allParticipants.forEach(p => {
        initialScores[p.name] = 0;
      });
      localStorage.setItem('tavernaGlobalScores', JSON.stringify(initialScores));
    }
  };

  const handleTabChange = (tab) => {
    setIsTransitioning(true);
    setActiveTab(tab);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const marqueeRef = useRef(null);

  const startDragging = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - marqueeRef.current.offsetLeft);
    setScrollLeft(marqueeRef.current.scrollLeft);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - marqueeRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    marqueeRef.current.scrollLeft = scrollLeft - walk;
  };



  const giochi = [
    {
      id: 1,
      nome: "Il Sussurro oltre l'Elmo Magico",
      dettagli: "Un partecipante per ogni schieramento indosserà un elmo magico che isola i suoni circostanti. Gli altri membri dello schieramento dovranno comunicare una frase scelta casualmente senza utilizzare gesti o mimica. Il partecipante con l'elmo dovrà interpretare correttamente il labbiale entro un tempo limite di 2 minuti. La squadra che interpreta più frasi correttamente vince.",
      partecipanti: "Un valoroso per schieramento",
      punteggi: [
        "5 punti per ogni frase corretta interpretata.",
        "Bonus di 10 punti per l'interpretazione più veloce.",
      ],
    },
    {
      id: 2,
      nome: "La Catena dei Prodigi",
      dettagli: "Ogni squadra si dispone in fila indiana. Il primo giocatore di ogni squadra crea una mossa originale e la mostra al compagno dietro di lui. Questo la riproduce per il compagno successivo, e così via, fino all'ultimo della fila. L'ultimo giocatore deve ripetere la mossa originale. La squadra che mantiene più accuratezza nella sequenza vince.",
      partecipanti: "Due squadre in fila indiana",
      punteggi: [
        "10 punti per ogni mossa ripetuta correttamente.",
        "Penalty di -5 punti per ogni errore nella sequenza.",
      ],
    },
    {
      id: 3,
      nome: "La Danza del Quadrato Magico",
      dettagli: "Un quadrato incantato viene tracciato a terra. I partecipanti di ogni schieramento devono danzare restando all'interno del quadrato per tutta la durata di una melodia di 3 minuti. Se un partecipante esce dal quadrato, è eliminato. Alla fine della melodia, il giudice premierà chi ha mantenuto la posizione più a lungo.",
      partecipanti: "Tre valorosi per schieramento",
      punteggi: [
        "10 punti per ogni partecipante rimasto nel quadrato fino alla fine.",
        "Bonus di 15 punti per il miglior ballerino, scelto dal giudice.",
      ],
    },
    {
      id: 4,
      nome: "La Sfida del Rotolo e del Sigillo",
      dettagli: "Ogni squadra riceve un rotolo di carta e un contenitore peino di acqua fino all orlo. I partecipanti devono avvolgere il rotolo avvicinando fino a se il contenitore senza frammentare la carta . Il rotolo deve rimanere intatto per essere valido. Vince il primo che completa la sfida con un rotolo integro.",
      partecipanti: "Due campioni per schieramento",
      punteggi: [
        "20 punti per il primo partecipante a completare la sfida.",
        "10 punti per ogni sigillo recuperato senza rompere il rotolo.",
      ],
    },
    {
      id: 5,
      nome: "La Raccolta dei Calici Sacri",
      dettagli: "Dieci calici vengono disposti su ciascun lato di una tavola. I partecipanti devono raccogliere i calici utilizzando due bacchette magiche, senza mai toccarli con le mani. Una volta raccolti, devono essere depositati in una postazione designata. La velocità e l'abilità nel maneggiare le bacchette determineranno il vincitore.",
      partecipanti: "Un prode per schieramento",
      punteggi: [
        "5 punti per ogni calice raccolto correttamente.",
        "Bonus di 20 punti per chi completa per primo la raccolta.",
      ],
    },
  ];

  const [giocoSelezionato, setGiocoSelezionato] = useState(null);



  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-purple-900 to-blue-950 text-gold-100 p-4">
      <div className="relative max-w-6xl mx-auto py-8">
        {/* Header con Logo */}
        <div className="text-center mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-gold-300/10 via-transparent to-transparent"></div>
          <img
            src="/images/Taverna.png"
            alt="Logo Taverna"
            className="w-96 h-96 mx-auto mb-6 opacity-90 relative z-10 transition-transform hover:scale-105"
          />
          <h1 className="text-5xl font-medieval mb-4 text-gold-300 relative z-10 animate-fadeIn">Taverna MMXXV</h1>
          <h2 className="text-2xl font-medieval text-gold-200 relative z-10">IV Incarnazione</h2>

          {/* Testo Scorrevole con handlers per il drag */}
          <div
            ref={marqueeRef}
            className="marquee-container mt-6 relative overflow-hidden w-full bg-blue-950/50 backdrop-blur-sm border border-gold-200/20 py-4"
            onMouseDown={startDragging}
            onMouseLeave={stopDragging}
            onMouseUp={stopDragging}
            onMouseMove={onDrag}
          >
            <div className="marquee-content">
              <p className="marquee-item text-gold-300 font-medieval text-lg px-4">
                📯 La Gran Corte ha deliberato: i festeggiamenti si svolgeranno interamente nella Taverna, tra giochi e spettacoli pirotecnici. La scelta di non spostarsi preserverà l'unità della compagnia e garantirà maggior sicurezza ai nobili convitati. I festeggiamenti proseguiranno ininterrotti fino all'alba. 📯
              </p>

            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-2 rounded-full font-medieval text-lg transition-all transform hover:scale-105 ${activeTab === tab
                ? 'bg-gradient-to-r from-gold-300 via-party-100 to-gold-300 text-blue-950'
                : 'bg-blue-800/50 text-gold-200 hover:bg-blue-700/50 backdrop-blur-sm'
                }`}
            >
              {tab === 'vivande' ? 'Incarichi' :
                tab === 'dispaccio' ? 'Dispaccio Ufficiale' :
                  tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={`bg-blue-950/50 backdrop-blur-sm rounded-lg p-8 border border-gold-200/20 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}>
          {activeTab === 'proclama' && (
            <div className="space-y-6 animate-fadeIn">

              <h3 className="text-3xl font-medieval text-gold-300 mb-6 text-center">Proclama di Fine Anno</h3>

              {/* Introduzione */}
              <div className="bg-blue-900/20 p-6 rounded-lg">
                <p className="text-lg leading-relaxed text-gold-200 mb-4">
                  📯 <span className="font-medieval text-gold-300">O NOBILI CONVITATI DELLA QUARTA INCARNAZIONE!</span>
                </p>
                <p className="text-lg leading-relaxed text-gold-200 mb-4">
                  Le stelle hanno ormai concluso la loro danza nel firmamento, e la Taverna ha accolto nelle sue sacre sale un altro memorabile convivio. Come nelle più nobili tradizioni della nostra dimora, i festeggiamenti hanno seguito il loro corso naturale, poiché i programmi prestabiliti sono meri suggerimenti per il destino, che poi tesse la sua trama secondo il proprio disegno.
                </p>
                <p className="text-lg leading-relaxed text-gold-200">
                  Le libagioni sono state degne delle più raffinate corti del Regno, mentre i giochi hanno creato nuove alleanze e immortali momenti di ilarità. Lo spettacolo pirotecnico, seppur contrastato da una guerra incrociata con il reame confinante, ha visto i nostri prodi <span className="text-party-100">Ser Pier Paolo, Ser Vito e Ser Matteo M</span> difendere valorosamente l'onore della Taverna nonostante il ridotto armamentario.
                </p>
              </div>

              {/* Proclamazione Vincitori */}
              <div className="bg-blue-900/20 p-6 rounded-lg">
                <h4 className="text-xl font-medieval text-gold-300 mb-6">Ed ora, proclamiamo i vincitori dei Nobili Passatempi, la cui gloria risuonerà nei secoli:</h4>

                {/* Il Sussurro oltre l'Elmo Magico */}
                <div className="mb-8">
                  <h5 className="text-lg font-medieval text-party-100 mb-4">🎭 Il Sussurro oltre l'Elmo Magico (gioco con le cuffie)</h5>
                  <p className="text-gold-200 italic mb-4">
                    In questo nobile cimento, ove i partecipanti, forse intimoriti dalle generose libagioni dell'aperitivo e da tempistiche non proprio degne degli orologi reali, hanno comunque mostrato mirabile maestria nel leggere le labbra nelle condizioni più impervie:
                  </p>
                  <ul className="space-y-2 text-gold-200">
                    <li><span className="text-party-100">Madonna Valentina</span> - "L'Elmo del Dialetto Salentino DOC" per aver dimostrato che la lingua natia si legge anche nelle tenebre più fitte e con l'udito celato</li>
                    <li><span className="text-party-100">Ser Matteo M</span> - "L'Orecchio Dorato del Silenzioso" per aver trionfato proprio quando le melodie tacevano</li>
                    <li><span className="text-party-100">Madonna Romina</span> - "Il Sacro Diadema dell'Interpretazione" per l'immortale lettura di "Mino Aperto"</li>
                    <li><span className="text-party-100">Madonna Elisa</span> - "Lo Scettro dell'Integrità" per aver fermato i giochi quando la musica sussurrava troppo piano</li>
                  </ul>
                </div>

                {/* La Danza del Quadrato Magico */}
                <div className="mb-8">
                  <h5 className="text-lg font-medieval text-party-100 mb-4">🎪 La Danza del Quadrato Magico</h5>
                  <ul className="space-y-2 text-gold-200">
                    <li><span className="text-party-100">Madonna Cristiana e Madonna Valentina</span> - "La Corona dei Passi Eterei" per la prestazione più aggraziata nel quadrato incantato</li>
                    <li><span className="text-party-100">Ser Matteo H</span> - "La Bussola dello Sconfinato" per aver esplorato ogni angolo del reame, fermato solo dalle mura ancestrali della Taverna</li>
                    <li><span className="text-party-100">Ser Pier</span> - "Lo Specchio del Furbetto Smascherato" per il tentativo di aprire gli occhi furtivamente, immortalato dalle arti magiche della registrazione</li>
                  </ul>
                </div>

                {/* La Catena dei Prodigi */}
                <div className="mb-8">
                  <h5 className="text-lg font-medieval text-party-100 mb-4">⚔️ La Catena dei Prodigi(gioco del mimo)</h5>
                  <ul className="space-y-2 text-gold-200">
                    <li><span className="text-party-100">Ser Matteo M e Madonna Fabiola</span> - "L'Amuleto della Trasformazione" per aver mutato la danza prestabilita in una nuova forma d'arte nel mezzo dell'esibizione</li>
                  </ul>
                </div>

                {/* La Raccolta dei Calici Sacri */}
                <div className="mb-8">
                  <h5 className="text-lg font-medieval text-party-100 mb-4">🏆 La Raccolta dei Calici Sacri (bicchieri e palline)</h5>
                  <ul className="space-y-2 text-gold-200">
                    <li><span className="text-party-100">Madonna Romina</span> - "Il Fischietto Storto ma Vittorioso" per aver conquistato la gloria nonostante uno strumento magico non proprio allineato con le stelle</li>
                    <li><span className="text-party-100">Ser Pier</span> - "Il Flauto dell'Intrattenitore Notturno" per aver trasformato il fischietto da strumento di gara a delizia per le orecchie dei convitati</li>
                    <li><span className="text-party-100">Ser Francesco</span> - "Il Calice dell'Esultanza Prematura" per la più ardita proclamazione di vittoria mai vista, con ancora metà della missione da compiere</li>
                  </ul>
                </div>
              </div>

              {/* Conclusione */}
              <div className="bg-blue-900/20 p-6 rounded-lg">
                <p className="text-lg leading-relaxed text-gold-200 mb-4">
                  Che questo nuovo anno porti a tutti voi la stessa gioia che illumina le nostre riunioni, la stessa allegria che risuona nelle nostre risate, e la capacità di trovare la magia anche nell'imperfezione dei nostri piani.
                </p>
                <p className="text-lg font-medieval text-gold-300">
                  Ad Majora, nobili anime della Taverna! 📯
                </p>
              </div>

              <h3 className="text-3xl font-medieval text-gold-300 mb-6">Amuleto Sacro!</h3>
              <p className="text-lg leading-relaxed text-gold-200">
                A partire dalle <span className="text-party-100">15:30 del 31 dicembre</span>, i nobili convitati potranno recuperare l’Amuleto Sacro, essenziale per accedere alla Taverna.
                Vi invitiamo a  consultare la sezione <button onClick={() => setActiveTab('Ingresso al Convivio')} className="text-party-100 hover:text-party-200 underline">'Ingresso al Convivio'</button>, dove troverete l’enigma necessario per svelare il luogo magico e ottenere la parola d’ordine.
                Presentate tale reliquia al momento del vostro ingresso per varcare la soglia del convivio.
              </p>
              <h3 className="text-3xl font-medieval text-gold-300 mb-6">Programma della Serata</h3>

              <p className="text-lg leading-relaxed text-gold-200">
                O nobilissimi convitati, siamo lieti di presentarvi il programma della serata:
              </p>
              <ul className="list-disc list-inside text-gold-200">
                <li><span className="text-party-100">Dalle Ore 19:30/20:00:</span> Ritrovo nella magica Taverna per un aperitivo conviviale e la sistemazione delle vivande.</li>
                <li><span className="text-party-100">Ore 21:00:</span> Inizio della sontuosa cena, arricchita dalle prelibatezze preparate dai nobili ospiti. Per il menu completo, consultare la sezione <button onClick={() => setActiveTab('vivande')} className="text-party-100 hover:text-party-200 underline">Incarichi</button></li>
                <li><span className="text-party-100">Ore 22:00:</span> Avvio dei Giochi di Corte, per momenti di intrattenimento memorabili. La lista completa in <button onClick={() => setActiveTab('giochi')} className="text-party-100 hover:text-party-200 underline">giochi</button>. Schieramenti e Giudici saranno selezionati tramite artifizi demoniaci.</li>
                <li><span className="text-party-100">Ore 23:00:</span> Servizio di lenticchie e cotechino, accompagnato da intrattenimenti per attendere il nuovo anno.</li>
                <li><span className="text-party-100">Mezzanotte:</span> Brindisi al nuovo anno, seguito da un grandioso spettacolo pirotecnico.</li>
                <li><span className="text-party-100">Fine serata:</span> Sfida finale dei giochi per decretare i vincitori, concludendo in grande stile.</li>
              </ul>
              <p className="text-lg leading-relaxed text-gold-200 mt-4">
                **Nota Bene:** Il programma è una guida e non un vincolo. La Taverna celebra l’arte dell’improvvisazione: seguite il flusso della serata e lasciate che la spontaneità sia il vostro alleato, per rendere ogni momento unico e memorabile.
              </p>
              <h3 className="text-3xl font-medieval text-gold-300 mb-6">Disamina del 29 dicembre</h3>
              <p className="text-lg leading-relaxed">
                Le fasi del convivio sono ormai giunte al loro culmine: le adesioni sono state raccolte, gli incarichi culinari assegnati sotto la sapiente guida di Madonna Cristiana, e i giochi e gli spettacoli che allieteranno la serata sono stati scelti. La Gran Corte ha inoltre deliberato che le celebrazioni del dopo-convivio si terranno interamente nella magica dimora della Taverna, tra nobili passatempi e spettacolari danze di luci nel firmamento. Tale saggia decisione, oltre a preservare l'unità della compagnia, ci proteggerà dalle severe sanzioni che le guardie del Regno infliggono a chi, dopo aver libato, si avventura con il proprio destriero meccanico per le strade del reame.
              </p>
              <h3 className="text-3xl font-medieval text-gold-300 mb-6">Proclama Ufficiale</h3>
              <p className="text-lg leading-relaxed">
                O nobilissimi convitati!

                Con somma gioia vi annuncio che si avvicina il solenne capodanno MMXXV, e quale più sublime modo di celebrarlo se non nella magnifica Taverna, giunta ormai alla sua quarta gloriosa incarnazione? Per tale occasione, questo luogo incantato si appresta a celebrare quello che sarà, con ogni probabilità, il suo secondo ed ultimo capodanno in questa sua splendida veste.

                Dalle prime luci della sera fino all'alba del nuovo anno, la Taverna diverrà teatro di festeggiamenti memorabili. Già XVII anime elette hanno accordato la loro presenza, e il numero potrebbe crescere ulteriormente nelle settimane a venire, segno celestiale di un convivio destinato a rimanere nelle cronache.

                Sotto la sapiente guida di Madonna Cristiana, le vivande e libagioni saranno degne delle più raffinate corti del Regno.
              </p>
              <p className="text-lg leading-relaxed">
                Ogni convitato avrà il proprio ruolo nell'orchestrazione di questa serata, contribuendo alla sua magnificenza con le proprie arti e il proprio ingegno.

                La Taverna, nel suo ultimo anno in questa forma, si prepara a stupirvi con spettacoli di luci e magie, giochi e intrattenimenti che allieteranno la serata fino al sorgere del sole. Un'occasione imperdibile per imprimere nella memoria un ulteriore capitolo di questa nobile tradizione.

                Vi invito caldamente a consultare il pergameno digitale, appositamente forgiato, ove troverete ogni dettaglio dell'evento costantemente aggiornato. Tale strumento magico, accessibile a tutti i convitati, custodisce le informazioni più recenti su vivande, preparativi e disposizioni varie del convivio.

              </p>

              <p className="text-lg leading-relaxed">
                Vi esorto dunque a mantenere questo invito e il suddetto pergameno digitale tra i vostri pensieri più cari, poiché ogni aggiornamento potrebbe rivelarsi di cruciale importanza per la perfetta riuscita dell'evento.

                Nel nome della Taverna e delle sue quattro incarnazioni, vi attendo per brindare insieme all'anno che verrà.
              </p>

            </div>
          )}

          {activeTab === 'giochi' && (
            <div className="space-y-8 animate-fadeIn">
              <h3 className="text-3xl font-medieval text-gold-300 mb-6">Nobili Intrattenimenti della Serata</h3>

              {!activeGame ? (
                <>
                  {/* Selezione del gioco */}
                  <div className="bg-blue-900/20 p-6 rounded-lg">
                    <h4 className="text-xl text-party-100 mb-4 font-medieval border-b border-gold-200/20 pb-2">
                      Seleziona un gioco
                    </h4>
                    <select
                      onChange={(e) => {
                        const id = parseInt(e.target.value);
                        const selectedGame = giochi.find((gioco) => gioco.id === id);
                        setGiocoSelezionato(selectedGame);
                      }}
                      className="bg-blue-950 text-gold-200 border border-gold-300 rounded p-2 w-full"
                      defaultValue=""
                    >
                      <option value="" disabled>Seleziona un gioco...</option>
                      {giochi.map((gioco) => (
                        <option key={gioco.id} value={gioco.id}>{gioco.nome}</option>
                      ))}
                    </select>

                    {giocoSelezionato && (
                      <div className="mt-6 bg-blue-900/30 p-4 rounded-lg border border-gold-200/20">
                        <h5 className="text-party-100 mb-3 font-medieval">{giocoSelezionato.nome}</h5>
                        <p className="text-gold-200">{giocoSelezionato.dettagli}</p>
                        <p className="text-gold-200 mt-4">
                          <span className="text-party-200">Partecipanti:</span> {giocoSelezionato.partecipanti}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Generatore di schieramenti */}
                  <div className="min-h-screen bg-gradient-to-b from-blue-950 via-purple-900 to-blue-950 text-gold-100 p-4">
                    <div className="relative max-w-6xl mx-auto py-8">
                      <h1 className="text-3xl font-medieval text-center text-gold-300 mb-6">
                        Generatore di Schieramenti
                      </h1>

                      <div className="mb-6">
                        <label className="block text-gold-200 mb-2 font-medieval">
                          Numero di Schieramenti Desiderati
                        </label>
                        <select
                          className="bg-blue-950 text-gold-200 border border-gold-300 rounded p-2 w-full md:w-auto"
                          onChange={(e) => setNumTeams(parseInt(e.target.value))}
                          value={numTeams}
                        >
                          <option value="2">Due Schieramenti</option>
                          <option value="3">Tre Schieramenti</option>
                          <option value="4">Quattro Schieramenti</option>
                        </select>
                      </div>

                      <button
                        onClick={generateTeams}
                        className="bg-gold-300 text-blue-950 px-6 py-3 rounded-full font-medieval hover:bg-gold-200 transition-colors"
                      >
                        Genera Schieramenti
                      </button>



                      {teams.length > 0 && (
                        <div className="mt-8">
                          {/* Prima mostriamo gli schieramenti */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {teams.map((team, idx) => (
                              <div key={idx} className="bg-blue-900/30 p-4 rounded-lg border border-gold-200/20">
                                <h5 className="text-party-100 mb-4 font-medieval text-lg">
                                  {`${idx + 1}° Schieramento`}
                                </h5>
                                <ul className="space-y-2">
                                  {team.members.map((member, memberIdx) => (
                                    <li key={memberIdx} className="text-gold-200 flex items-center space-x-2">
                                      <span className="text-party-100">✦</span>
                                      <span>{member.name}</span>  {/* Qui era il problema */}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {/* Poi mostriamo il giudice */}
                          {judge && (
                            <div className="text-center text-gold-200 font-medieval mb-8">
                              <p className="text-lg">Il Giudicante Designato:</p>
                              <p className="text-xl font-bold text-party-100">{judge}</p>
                            </div>
                          )}

                          {/* Infine, se abbiamo anche un gioco selezionato, mostriamo il pulsante */}
                          {giocoSelezionato && (
                            <div className="text-center mt-8">
                              <button
                                onClick={() => setActiveGame(giocoSelezionato)}
                                className="bg-party-100 text-blue-950 px-8 py-4 rounded-full font-medieval hover:bg-party-200 transition-colors text-lg animate-fadeIn"
                              >
                                Inizia {giocoSelezionato.nome}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Classifica Globale Pubblica */}
                  <GlobalRankings />
                  <AdminReset />


                </>
              ) : (
                <GameStart
                  existingTeams={teams}
                  judge={judge}
                  selectedGame={activeGame}
                  onGameEnd={(finalScores, globalScores) => {
                    // Gestiamo la fine del gioco in modo più semplice
                    const gameDate = new Date().toISOString();
                    setGameScores(prevScores => ({
                      ...prevScores,
                      [gameDate]: {
                        finalScores,
                        globalScores,
                        game: activeGame.nome,
                        date: gameDate
                      }
                    }));
                    setActiveGame(null);
                    setGiocoSelezionato(null);
                  }}
                  onBackToSelection={() => {
                    setActiveGame(null);
                    setGiocoSelezionato(null);
                  }}
                />
              )}
            </div>
          )}

          {activeTab === 'convitati' && (
            <div className="animate-fadeIn">
              <h3 className="text-3xl font-medieval text-gold-300 mb-8 text-center">Nobili Convitati</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Dame */}
                <div className="bg-blue-900/20 p-6 rounded-lg hover:bg-blue-900/30 transition-colors">
                  <h4 className="text-xl text-party-100 mb-4 font-medieval border-b border-gold-200/20 pb-2">Nobili Dame</h4>
                  <ul className="space-y-3">
                    {shuffleArray([
                      "Madonna Alessandra",
                      "Madonna Cristiana",
                      "Madonna Fabiola",
                      "Madonna Romina",
                      "Madonna Gloria",
                      "Madonna Federica con fanciulla Beatrice",
                      "Madonna Elisa",
                      "Madonna Sara",
                      "Madonna Valentina"
                    ]).map((dame, idx) => (
                      <li key={dame} className="flex items-center space-x-2">
                        <span className={`text-party-${(idx % 3) + 1}00`}>✦</span>
                        <span>{dame}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cavalieri */}
                <div className="bg-blue-900/20 p-6 rounded-lg hover:bg-blue-900/30 transition-colors">
                  <h4 className="text-xl text-party-200 mb-4 font-medieval border-b border-gold-200/20 pb-2">Nobili Cavalieri</h4>
                  <ul className="space-y-3">
                    {shuffleArray([
                      "Ser Vito",
                      "Ser Mars",
                      "Ser Mino",
                      "Ser Pier Paolo",
                      "Ser Francesco",
                      "Ser Matteo H",
                      "Ser Matteo M"
                    ]).map((cavaliere, idx) => (
                      <li key={cavaliere} className="flex items-center space-x-2">
                        <span className={`text-party-${(idx % 3) + 1}00`}>✦</span>
                        <span>{cavaliere}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Altri Ospiti */}
                <div className="bg-blue-900/20 p-6 rounded-lg hover:bg-blue-900/30 transition-colors">
                  <h4 className="text-xl text-party-300 mb-4 font-medieval border-b border-gold-200/20 pb-2">Post Convivio</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-2">
                      <span className="text-party-100 mt-1">✦</span>
                      <span>Ser Antonello<br />
                      </span>
                    </li>


                  </ul>
                </div>

                {/* Counter */}
                <div className="md:col-span-3 text-center mt-8 bg-blue-900/10 p-4 rounded-lg border border-gold-200/10">
                  <p className="text-gold-200 italic">
                    XVII anime al momento

                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vivande' && (
            <div className="space-y-8 animate-fadeIn">
              <h3 className="text-3xl font-medieval text-gold-300 mb-6 text-center">Responsabilità e Incarichi del Convivio</h3>

              {/* Nota sulle contribuzioni */}
              <div className="text-center italic mb-8">
                <p>Per informazioni sulle contribuzioni, consultare il <button onClick={() => setActiveTab('dispaccio')} className="text-party-100 hover:text-party-200 underline">Dispaccio Ufficiale</button></p>
              </div>

              {/* Sezione Menu */}
              <div className="space-y-8">
                <h4 className="text-2xl text-gold-200 font-medieval text-center">Vivande e Libagioni</h4>

                {/* Tabella comune per tutte le sezioni */}
                <div className="space-y-8">
                  {[
                    {
                      title: "Antipasti della Casa",
                      items: [
                        { dish: "Crostini con crema di Filadelfia leggera e nobile salmone, con guarnizioni varie", noble: "Madonna Cristiana", status: "Confermato" },
                        { dish: "Quiche alla maniera di Lorena", noble: "Ser Mino & Madonna Fabiola", status: "Confermato" },
                        { dish: "Olive selezionate del Regno", noble: "Madonna Sara", status: "Confermato" }
                      ]
                    },
                    {
                      title: "Prima Portata",
                      items: [
                        { dish: "Lasagna Reale al forno in ampio vassoio", noble: "Madonna Romina", status: "Confermato" }
                      ]
                    },
                    {
                      title: "Secondi Nobili",
                      items: [
                        { dish: "Polpettone di carne, ammorbidito con zucchine gratinate, scamorza e prosciutto delle corti", noble: "Madonna Gloria & Sir Matteo H", status: "Confermato" },
                        { dish: "Pitta di patate con mozzarella e prosciutto delle terre del Nord", noble: "Madonna Alessandra", status: "Confermato" }
                      ]
                    },
                    {
                      title: "Contorni e Accompagnamenti",
                      items: [
                        { dish: "Grande insalata con pomodori, fugacce e perle di mozzarella", noble: "Madonna Sara", status: "Confermato" },
                        { dish: "Lenticchie portafortuna con cotechino della tradizione", noble: "Ser Pier Paolo", status: "Confermato" }
                      ]
                    },
                    {
                      title: "Dulcis in Fundo",
                      items: [
                        { dish: "Torta al cioccolato e crema su pan di Spagna (due libbre)", noble: "Ser Matteo", status: "Confermato" }
                      ]
                    },
                    {
                      title: "Libagioni e Bevande",
                      items: [
                        { dish: "Due bottiglie di Prosecco per gli antipasti\nQuattro bottiglie di vino pregiato\nAcque pure, elisir di cola senza zucchero, essenza di limone", noble: "Ser Francesco e Ser Vito", status: "Confermato" }
                      ]
                    },
                    {
                      title: "Frutta e Stuzzicherie",
                      items: [
                        { dish: "Finocchi tagliati a spicchi per la digestione", noble: "Madonna Sara", status: "Confermato" },
                        { dish: "Pistacchi e noccioline del Regno\nMandarini dorati", noble: "Madonna Elisa", status: "Confermato" }
                      ]
                    }
                  ].map((section) => (
                    <div key={section.title} className="space-y-4">
                      <h5 className="text-xl text-party-100 font-medieval border-b border-gold-300/50 pb-2">{section.title}</h5>
                      <table className="w-full border-collapse">
                        <tbody>
                          {section.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-gold-200/20">
                              <td className="p-3 w-1/2 italic font-light" style={{ verticalAlign: 'top' }}>{item.dish}</td>
                              <td className="p-3 w-1/4" style={{ verticalAlign: 'top' }}>{item.noble}</td>
                              <td className="p-3 w-1/4" style={{ verticalAlign: 'top' }}>
                                <span className={item.status === "Confermato" ? "text-party-100" : "text-gold-200/50"}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sezione Altri Incarichi */}
              <div className="mt-12 space-y-4">
                <h4 className="text-2xl text-gold-200 font-medieval text-center">Altri Incarichi del Convivio</h4>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-gold-200/20">
                      <td className="p-3 w-1/2 italic font-light">Spettacolo pirotecnico di mezzanotte</td>
                      <td className="p-3 w-1/4"> Ser Vito, Ser Pier Paolo, Ser Matteo H, Ser Matteo M, Ser Mars</td>
                    </tr>
                  </tbody>
                  <tbody>
                    <tr className="border-b border-gold-200/20">
                      <td className="p-3 w-1/2 italic font-light">Decorazioni ed Accessori per i convitati</td>
                      <td className="p-3 w-1/4"> Madonna Cristiana</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Ingresso al Convivio' && (

            <div className="space-y-8 animate-fadeIn">
              <h3 className="text-3xl font-medieval text-gold-300 mb-6">Disposizioni Regali</h3>
              <div className="mb-8">
                <p className="text-lg leading-relaxed italic text-gold-200 border-l-4 border-gold-300 pl-4">
                  Per accedere al nobile convivio, ogni invitato dovrà indossare un elemento dorato, di qualsivoglia dimensione, e recare con sé l'Amuleto Sacro, che potrà essere recuperato solo risolvendo l'enigma che segue...
                </p>
              </div>
              <h3 className="text-3xl font-medieval text-gold-300 mb-6">L'Enigma</h3>
              <div className="mb-8">
                <p className="text-lg leading-relaxed italic text-gold-200 border-l-4 border-gold-300 pl-4">
                  I nobili dovranno prima decifrare questo antico enigma cinematografico,
                  che li condurrà al luogo magico ove potranno recuperare l'Amuleto Sacro della Taverna. Solo presentando tale reliquia
                  sarà possibile varcare la soglia dell'evento...
                </p>
                <p className="text-lg leading-relaxed italic text-gold-200 border-l-4 border-gold-300 pl-4">

                  L'arcano può essere svelato fin d'ora, ma il suo potere potrà essere invocato solo dopo le ore 15:00 del 31 dicembre.
                </p>
              </div>

              <CrosswordPuzzle />
              <PasswordChecker />
            </div>
          )}

          {activeTab === 'Danze di Stelle e Fuochi' && (
            <div className="space-y-8 animate-fadeIn">
              <h3 className="text-3xl font-medieval text-gold-300 mb-6">Spettacolo Pirotecnico</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-gold-300 pl-4 hover:border-party-100 transition-colors">
                  <h4 className="text-xl text-gold-200 mb-4">La Grande Illuminazione di Mezzanotte</h4>
                  <p className="text-lg leading-relaxed mb-4">
                    Quando le campane annunceranno la mezzanotte, il cielo sopra la Taverna si illuminerà di mille luci e colori, in uno spettacolo che lascerà i convitati a bocca aperta. Le stelle artificiali danzeranno nel firmamento, creando cascate di luce dorata e argentata.
                  </p>
                  <p className="text-lg leading-relaxed">
                    I mastri pirotecnici della Taverna - Ser Mars, Ser Vito, Ser Pier Paolo, Ser Matteo H e Ser Matteo M - hanno preparato uno spettacolo che promette di essere memorabile, con effetti mai visti prima in queste terre.
                  </p>
                </div>

                <div className="border-l-4 border-gold-300 pl-4 hover:border-party-200 transition-colors">
                  <h4 className="text-xl text-gold-200 mb-4">Disposizioni per lo Spettacolo</h4>
                  <p className="text-lg leading-relaxed mb-4">
                    I nobili convitati saranno guidati nel giardino della Taverna, dove potranno godere della vista migliore dello spettacolo pirotecnico. Un brindisi collettivo accompagnerà l'inizio delle danze luminose nel cielo.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Si consiglia ai convitati di portare con sé mantelli caldi, poiché lo spettacolo si terrà all'aperto nelle fresche temperature della notte di capodanno.
                  </p>
                </div>

                <div className="bg-blue-900/30 p-6 rounded-lg border border-gold-200/20">
                  <p className="text-gold-200 italic text-center">
                    "Che le luci nel cielo siano il primo spettacolo che i nostri occhi vedranno nel nuovo anno,
                    e che possano essere di buon auspicio per tutti i giorni a venire."
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dispaccio' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-3xl font-medieval text-gold-300 mb-6">Dispaccio Ufficiale</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-blue-900/20 p-6 rounded-lg backdrop-blur-sm">
                  <h4 className="text-xl text-gold-200 mb-4">Tempistiche del Convivio</h4>
                  <ul className="space-y-2">
                    <li>📅 Data: XXXI Giorno del XII Mese dell'Anno MMXXIV</li>
                    <li>⏰ Ora: XXI dopo il mezzogiorno (21 ora locale)</li>
                  </ul>
                </div>

                <div className="bg-blue-900/20 p-6 rounded-lg backdrop-blur-sm">
                  <h4 className="text-xl text-gold-200 mb-4">Ubicazione della Taverna</h4>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <p>Nel Feudo di Corsano, Contea di Lecce<br />
                        Strada della Taranta, X<br />
                        Nel Regno delle Due Sicilie, Provincia di Terra d'Otranto</p>
                    </div>
                    <div className="flex-1 h-[160px]">
                      <iframe
                        width="100%"
                        height="70%"
                        frameBorder="0"
                        scrolling="no"
                        src="https://www.openstreetmap.org/export/embed.html?bbox=18.35,39.87,18.39,39.89&layer=mapnik&marker=39.88,18.37"
                        style={{ border: '2px solid #ffd700', borderRadius: '8px' }}
                      ></iframe>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 p-6 rounded-lg backdrop-blur-sm md:col-span-2">
                  <h4 className="text-xl text-gold-200 mb-4">Registrazione delle Contribuzioni</h4>
                  <p className="text-lg leading-relaxed mb-4">Per registrare le vostre contribuzioni al convivio, vi preghiamo di accedere al registro digitale tramite questo collegamento magico.</p>
                  <a
                    href="https://forms.gle/wDGRd4uWDvtY2FfD8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gold-300 text-blue-950 px-6 py-3 rounded-full font-medieval hover:bg-gold-200 transition-colors"
                  >
                    Accedi al Registro delle Contribuzioni
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-gold-200/20 pt-8">
          <div className="text-center text-gold-200 font-medieval">
            <p className="text-sm animate-pulse">Anno Domini MMXXIV</p>
            <div className="mt-4 flex flex-col items-center">
              <p>Forgiato nelle fucine digitali di</p>
              <a
                href="https://marsduell.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-gold-300 hover:text-party-100 transition-colors"
              >
                Ser Marsduell
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TavernaCapodanno;