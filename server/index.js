const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
const port = 3000;

app.get('/', (req, res) => {
  const cookie = req.cookies.id;
  if (cookie === undefined) {
    let randomNumber = Math.random().toString();
    randomNumber = randomNumber.substring(2, randomNumber.length);
    res.cookie('id', randomNumber, { maxAge: 900000 * 12, httpOnly: true });
  }
  return res.sendFile(path.resolve('../public/index/index.html'));
});

app.get('/ready', (req, res) => {
  const name = req.query.name;
  const cookie = req.cookies.id;
  console.log(name, cookie);
  fs.readFile('players.json', 'utf-8', function (err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    data[cookie] = name;
    data = JSON.stringify(data);
    console.log(data);
    fs.writeFile('players.json', data, function (err) {
      console.log(data);
      if (err) throw err;
    });
  });

  //let player_data = fs.readFileSync('players.json');
  //player_data = JSON.parse(player_data);
  //player_data[cookie] = name;
  //player_data = JSON.stringify(player_data);
  //fs.writeFileSync('players.json', player_data);
});

app.get('/ready/list', (req, res) => {
  //let player_data = fs.readFileSync('players.json');
  //player_data = JSON.parse(player_data);

  fs.readFile('players.json', 'utf-8', function (err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    res.send({
      data: player_data,
    });
  });

  //res.send({
  //data: player_data,
  //});
});

app.get('/game', (req, res) => {
  return res.sendFile(path.resolve('../public/game/game.html'));
});

app.get('/game/votetostart', (req, res) => {
  const name = req.query.name;

  fs.readFile('ready.json', 'utf-8', function (err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let ready_player = {
    name: name,
    }
    data[Object.keys(data).length] = ready_player;
    data = JSON.stringify(data);
    fs.writeFile('players.json', data, function (err) {
      if (err) throw err;
    });



  //let ready_players = fs.readFileSync('ready.json');
  //ready_players = JSON.parse(ready_players);
  //let ready_player = {
   // name: name,
  //};
  //ready_players[Object.keys(ready_players).length] = ready_player;
  //fs.writeFileSync('ready.json', ready_players);
});

app.get('/game/start', (req, res) => {
  let player_data = fs.readFileSync('players.json');
  let ready_players = fs.readFileSync('ready.json');
  player_data = JSON.parse(player_data);
  ready_players = JSON.parse(ready_players);
  let match_count = 0;
  for (let i; 0 <= i < Object.keys(player_data).length; i++) {
    for (let j; 0 <= i < Object.keys(ready_players).length; j++) {
      if (player_data[i] == ready_players[j]) {
        match_count++;
      }
    }
  }
  if (match_count == Object.keys(player_data).length) {
    return res.redirect('/game');
  }
});

app.get('/game/end', (req, res) => {
  fs.copyFileSync('dids.json', '/database/dids.json');
  fs.copyFileSync('didnts.json', '/database/didnts.json');
  fs.copyFileSync('players.json', '/database/players.json');
  fs.copyFileSync('ready.json', '/database/ready.json');
  let players_data = fs.readFileSync('players.json');
  let ready_players = fs.readFileSync('ready.json');
  let dids = fs.readFileSync('dids.json');
  let didnts = fs.readFileSync('didnts.json');
  players_data = JSON.parse(players_data);
  ready_players = JSON.parse(ready_players);
  dids = JSON.parse(dids);
  didnts = JSON.parse(didnts);
  players_data = {};
  ready_players = {};
  dids = {};
  didnts = {};
  fs.writeFileSync('ready.json', ready_players);
  fs.writeFileSync('players.json', players_data);
  fs.writeFileSync('dids.json', dids);
  fs.writeFileSync('didnts.json', didnts);
  return res.reditect('/');
});

app.get('/game/whoami', (req, res) => {
  const cookie = req.cookies.id;
  let player_data = fs.readFileSync('players.json');
  player_data = JSON.parse(player_data);
  const player_name = player_data[cookie];
  res.send({
    name: player_name,
    player_list: player_data,
  });
});

app.get('/game/question', (req, res) => {
  let questions = fs.readFileSync('questions.json');
  let asked_questions = fs.readFileSync('asked_questions.json');
  questions = JSON.parse(questions);
  asked_questions = JSON.parse(asked_questions);
  let question_list = [];
  questions.map((item) => {
    question_list.push(item.question);
  });
  const selected_question = question_list[Object.keys(asked_questions).length];
  asked_questions[Object.keys(asked_questions).length] = selected_question;
  fs.writeFileSync('asked_questions.json', asked_questions);
});

app.get('/game/did', (req, res) => {
  const name = req.query.name;
  const question = req.query.question;
  const round = req.query.round;
  let dids = fs.readFileSync('dids.json');
  dids = JSON.parse(dids);
  let did = {
    round: round,
    name: name,
    question: question,
    did: true,
  };
  dids[Object.keys(dids).length] = did;
  fs.writeFileSync('dids.json', dids);
});

app.get('/game/didnt', (req, res) => {
  const name = req.query.name;
  const question = req.query.question;
  const round = req.query.round;
  let didnts = fs.readFileSync('didnts.json');
  didnts = JSON.parse(didnts);
  let didnt = {
    round: round,
    name: name,
    question: question,
    did: false,
  };
  didnts[Object.keys(didnts).length] = didnt;
  fs.writeFileSync('didnts.json', didnts);
});

app.get('/game/round', (req, res) => {
  const round = req.query.round;
  let player_data = fs.readFileSync('players.json');
  let dids = fs.readFileSync('dids.json');
  let didnts = fs.readFileSync('didnts.json');
  player_data = JSON.parse(player_data);
  dids = JSON.parse(dids);
  didnts = JSON.parse(didnts);
  const player_count = Object.keys(player_data).length;
  let didscount = 0;
  let didntscount = 0;
  let results = [];
  for (let i; 0 <= i < Object.keys(dids).length; i++) {
    if (dids[i].round === round) {
      results.push({
        name: dids[i].name,
        question: dids[i].question,
        answer: dids[i].did,
      });
      didscount = didscount + 1;
    }
  }
  for (let i; 0 <= i < Object.keys(didnts).length; i++) {
    if (didnts[i].round === round) {
      results.push({
        name: didnts[i].name,
        question: dids[i].question,
        answer: didnts[i].did,
      });
      didntscount = didntscount + 1;
    }
  }
  if (didscount + didntscount === player_count) {
    res.send({
      round_done: true,
      results: results,
    });
  } else {
    res.send({
      round_done: false,
    });
  }
});

app.use(express.static('../public/index'));
app.use(express.static('../public/game'));

app.listen(port, () => console.log(`Server connected to ${port}`));
