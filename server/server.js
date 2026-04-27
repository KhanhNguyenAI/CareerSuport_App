require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const { OAuth2Client } = require('google-auth-library');

const app         = express();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─────────────────────────────────────
// MongoDB
// ─────────────────────────────────────

let db;

async function connectDB() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db(process.env.MONGO_DB);
  console.log('✅ MongoDB connected');

  // Indexes
  await db.collection('users').createIndex({ googleId: 1 }, { unique: true });
}

function users() { return db.collection('users'); }

// ─────────────────────────────────────
// Middleware
// ─────────────────────────────────────

app.use(cors({ origin: '*' }));
app.use(express.json());

// Verify Google ID token → attach user to req
async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const ticket  = await googleClient.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    req.googleUser = {
      googleId: payload.sub,
      email:    payload.email,
      name:     payload.name,
      photo:    payload.picture,
    };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ─────────────────────────────────────
// Routes
// ─────────────────────────────────────

// Health check
app.get('/', (_, res) => res.json({ status: 'ok', message: 'IT Learning Coach API' }));

// ── Auth: Google login → create/get user ──
app.post('/api/auth/google', requireAuth, async (req, res) => {
  try {
    const { googleId, email, name, photo } = req.googleUser;

    let user = await users().findOne({ googleId });

    if (!user) {
      const newUser = {
        googleId,
        email,
        photo,
        profile:    { name, age: '', status: '', goal: '' },
        examDates:  {},
        vocabNotes: [],
        createdAt:  new Date(),
        updatedAt:  new Date(),
      };
      await users().insertOne(newUser);
      user = newUser;
    }

    res.json(sanitize(user));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// ── Get current user data ──
app.get('/api/user', requireAuth, async (req, res) => {
  try {
    const user = await users().findOne({ googleId: req.googleUser.googleId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(sanitize(user));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Update profile + examDates ──
app.put('/api/user/profile', requireAuth, async (req, res) => {
  try {
    const { profile, examDates } = req.body;
    await users().updateOne(
      { googleId: req.googleUser.googleId },
      { $set: { profile, examDates, updatedAt: new Date() } }
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Add vocab note ──
app.post('/api/user/vocab', requireAuth, async (req, res) => {
  try {
    const { certId, term, explanation } = req.body;
    if (!certId || !term) return res.status(400).json({ error: 'certId and term required' });

    // Prevent duplicates
    const user = await users().findOne({ googleId: req.googleUser.googleId });
    const exists = user?.vocabNotes?.some(n => n.certId === certId && n.term === term);
    if (exists) return res.json({ ok: true, duplicate: true });

    await users().updateOne(
      { googleId: req.googleUser.googleId },
      {
        $push: {
          vocabNotes: {
            certId,
            term,
            explanation,
            savedAt: new Date().toISOString()
          }
        },
        $set: { updatedAt: new Date() }
      }
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Delete vocab note ──
app.delete('/api/user/vocab', requireAuth, async (req, res) => {
  try {
    const { certId, term } = req.body;
    await users().updateOne(
      { googleId: req.googleUser.googleId },
      { $pull: { vocabNotes: { certId, term } } }
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Clear all vocab notes ──
app.delete('/api/user/vocab/all', requireAuth, async (req, res) => {
  try {
    await users().updateOne(
      { googleId: req.googleUser.googleId },
      { $set: { vocabNotes: [], updatedAt: new Date() } }
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────
// Helpers
// ─────────────────────────────────────

function sanitize(user) {
  const { _id, ...rest } = user;
  return rest;
}

// ─────────────────────────────────────
// Start
// ─────────────────────────────────────

connectDB().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
}).catch(err => {
  console.error('❌ DB connection failed:', err);
  process.exit(1);
});
