const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/taverna');

const ScoreSchema = new mongoose.Schema({
  playerName: String,
  score: Number
});

const GameHistorySchema = new mongoose.Schema({
  date: Date,
  gameName: String,
  teams: Array,
  scores: Object,
  winner: String,
  positions: Object,
  judge: String
});

const Score = mongoose.model('Score', ScoreSchema);
const GameHistory = mongoose.model('GameHistory', GameHistorySchema);

app.get('/api/scores', async (req, res) => {
  const scores = await Score.find();
  const scoreMap = {};
  scores.forEach(s => scoreMap[s.playerName] = s.score);
  res.json(scoreMap);
});

app.post('/api/scores', async (req, res) => {
  const { playerName, score } = req.body;
  await Score.findOneAndUpdate(
    { playerName }, 
    { $inc: { score } }, 
    { upsert: true }
  );
  res.json({ success: true });
});

app.get('/api/history', async (req, res) => {
  const history = await GameHistory.find().sort('-date');
  res.json(history);
});

app.post('/api/history', async (req, res) => {
  const gameHistory = new GameHistory(req.body);
  await gameHistory.save();
  res.json({ success: true });
});

app.listen(3001, () => console.log('Server running on port 3001'));