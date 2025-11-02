const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

function readDB(){
  try{ return JSON.parse(fs.readFileSync(DB_PATH)); }catch(e){ return {users:[],tournaments:[],transactions:[],leaderboard:[]}; }
}

function writeDB(db){
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

const crypto = require('crypto');
const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'demo-admin-token';

app.get('/api/tournaments', (req, res)=>{
  const db = readDB();
  res.json(db.tournaments);
});

app.get('/api/tournaments/:id', (req,res)=>{
  const db = readDB();
  const t = db.tournaments.find(x=>x.id===req.params.id);
  if(!t) return res.status(404).json({error:'Not found'});
  res.json(t);
});

app.post('/api/tournaments/:id/join', (req,res)=>{
  const {userId} = req.body;
  const db = readDB();
  const t = db.tournaments.find(x=>x.id===req.params.id);
  const user = db.users.find(u=>u.id===userId);
  if(!t) return res.status(404).json({error:'Tournament not found'});
  if(!user) return res.status(404).json({error:'User not found'});
  if(user.wallet < t.entryFee) return res.status(400).json({error:'Insufficient balance'});
  if(t.joined >= t.slots) return res.status(400).json({error:'Slots full'});
  // deduct
  user.wallet -= t.entryFee;
  t.joined += 1;
  const tr = {id:'tr'+Date.now(), userId, type:'debit', amount:t.entryFee, note:'Tournament join', date: new Date().toISOString()};
  db.transactions.push(tr);
  writeDB(db);
  res.json({success:true, wallet:user.wallet, transaction:tr});
});

// Auth: signup, login, me
app.post('/api/auth/signup', (req,res)=>{
  const {name,password} = req.body;
  if(!name || !password) return res.status(400).json({error:'name and password required'});
  const db = readDB();
  if(db.users.find(u=>u.name === name)) return res.status(400).json({error:'User already exists'});
  const id = 'u'+Date.now();
  const user = {id, name, password, wallet:0, isAdmin:false};
  db.users.push(user);
  const token = crypto.randomBytes(24).toString('hex');
  db.sessions.push({token, userId:id});
  writeDB(db);
  res.json({token, user:{id,name,wallet:user.wallet,isAdmin:false}});
});

app.post('/api/auth/login', (req,res)=>{
  const {name,password} = req.body;
  if(!name || !password) return res.status(400).json({error:'name and password required'});
  const db = readDB();
  const user = db.users.find(u=>u.name === name && u.password === password);
  if(!user) return res.status(401).json({error:'Invalid credentials'});
  const token = crypto.randomBytes(24).toString('hex');
  db.sessions.push({token, userId:user.id});
  writeDB(db);
  res.json({token, user:{id:user.id,name:user.name,wallet:user.wallet,isAdmin:!!user.isAdmin}});
});

app.get('/api/auth/me', (req,res)=>{
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if(!token) return res.status(401).json({error:'No token'});
  const db = readDB();
  const s = db.sessions.find(x=>x.token === token);
  if(!s) return res.status(401).json({error:'Invalid token'});
  const user = db.users.find(u=>u.id === s.userId);
  if(!user) return res.status(404).json({error:'User not found'});
  res.json({id:user.id,name:user.name,wallet:user.wallet,isAdmin:!!user.isAdmin});
});

app.get('/api/wallet/:userId', (req,res)=>{
  const db = readDB();
  const user = db.users.find(u=>u.id===req.params.userId);
  if(!user) return res.status(404).json({error:'User not found'});
  const txs = db.transactions.filter(t=>t.userId===user.id);
  res.json({user, transactions: txs});
});

app.post('/api/wallet/add', (req,res)=>{
  const {userId, amount, note} = req.body;
  const db = readDB();
  const user = db.users.find(u=>u.id===userId);
  if(!user) return res.status(404).json({error:'User not found'});
  user.wallet += Number(amount||0);
  const tr = {id:'tr'+Date.now(), userId, type:'credit', amount:Number(amount||0), note:note||'Added funds', date: new Date().toISOString()};
  db.transactions.push(tr);
  writeDB(db);
  res.json({success:true, wallet:user.wallet, transaction:tr});
});

app.get('/api/leaderboard', (req,res)=>{
  const db = readDB();
  res.json(db.leaderboard);
});

// Admin: create tournament
app.post('/api/admin/tournaments', (req,res)=>{
  // Accept either the admin header token OR a logged-in admin user via Bearer token
  const hdrToken = req.headers['x-admin-token'];
  const auth = req.headers['authorization'] || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const db = readDB();
  let allowed = false;
  if(hdrToken && hdrToken === ADMIN_TOKEN) allowed = true;
  if(bearer){
    const s = db.sessions.find(x=>x.token === bearer);
    if(s){
      const user = db.users.find(u=>u.id === s.userId);
      if(user && user.isAdmin) allowed = true;
    }
  }
  if(!allowed) return res.status(401).json({error:'Unauthorized'});
  const t = req.body;
  t.id = 't' + Date.now();
  db.tournaments.push(t);
  writeDB(db);
  res.json({success:true,t});
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log('Backend demo running on port', PORT));
