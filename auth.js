// ─────────────────────────────────────
// Firebase Auth + Firestore
// ─────────────────────────────────────

import { initializeApp }          from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
                                   from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp, Timestamp }
                                   from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const config = window.FIREBASE_CONFIG || FIREBASE_CONFIG;
const app  = initializeApp(config);
const auth = getAuth(app);
const db   = getFirestore(app);

// ─────────────────────────────────────
// Auth
// ─────────────────────────────────────

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result   = await signInWithPopup(auth, provider);
  await ensureUserDoc(result.user);
  return result.user;
}

export function logout() {
  return signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export function currentUser() {
  return auth.currentUser;
}

// ─────────────────────────────────────
// Firestore: User document
// ─────────────────────────────────────

function userRef(uid) {
  return doc(db, "users", uid);
}

async function ensureUserDoc(user) {
  const ref  = userRef(user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid:         user.uid,
      email:       user.email,
      photoURL:    user.photoURL,
      createdAt:   serverTimestamp(),
      profile:     { name: user.displayName || "", age: "", status: "", goal: "" },
      examDates:   {},
      vocabNotes:  [],
      manualNotes: [],
      customCards: [],
      cardGroups:  [],
      schedule:    [],
    });
  } else {
    // Keep email/photoURL synced in case Google profile changes
    await updateDoc(ref, { photoURL: user.photoURL, email: user.email });
  }
}

// ─────────────────────────────────────
// Firestore: Profile
// ─────────────────────────────────────

export async function loadUserData() {
  const user = currentUser();
  if (!user) return null;
  const snap = await getDoc(userRef(user.uid));
  return snap.exists() ? snap.data() : null;
}

export async function saveUserProfile(profileData, examDates) {
  const user = currentUser();
  if (!user) return;
  await updateDoc(userRef(user.uid), {
    profile:   profileData,
    examDates: examDates,
    updatedAt: serverTimestamp()
  });
}

// ─────────────────────────────────────
// Firestore: Vocab notes
// ─────────────────────────────────────

export async function addVocabNote(certId, term, explanation) {
  const user = currentUser();
  if (!user) return;
  const note = {
    certId,
    term,
    explanation,
    savedAt: new Date().toISOString()
  };
  await updateDoc(userRef(user.uid), {
    vocabNotes: arrayUnion(note)
  });
}

export async function removeVocabNote(certId, term) {
  const user = currentUser();
  if (!user) return;
  const data = await loadUserData();
  const note = data?.vocabNotes?.find(n => n.certId === certId && n.term === term);
  if (!note) return;
  await updateDoc(userRef(user.uid), {
    vocabNotes: arrayRemove(note)
  });
}

export async function clearVocabNotes() {
  const user = currentUser();
  if (!user) return;
  await updateDoc(userRef(user.uid), { vocabNotes: [] });
}

// ─────────────────────────────────────
// Firestore: Manual Notes (free-form user notes)
// ─────────────────────────────────────

export async function addManualNote(noteData) {
  const user = currentUser();
  if (!user) return;
  await updateDoc(userRef(user.uid), {
    manualNotes: arrayUnion(noteData)
  });
}

export async function removeManualNote(noteId) {
  const user = currentUser();
  if (!user) return;
  const data = await loadUserData();
  const updated = (data?.manualNotes || []).filter(n => n.id !== noteId);
  await updateDoc(userRef(user.uid), { manualNotes: updated });
}

// ─────────────────────────────────────
// Firestore: Global Vocab Cache
// Shared across ALL users — saves Gemini API cost
// Collection: globalVocab / doc: "{certId}:{term}"
// ─────────────────────────────────────

function globalVocabRef(certId, term) {
  // Normalize: lowercase, trim — so "API" and "api" hit the same doc
  const key = `${certId}:${term.trim().toLowerCase()}`;
  return doc(db, 'globalVocab', key);
}

export async function getGlobalVocab(certId, term) {
  try {
    const snap = await getDoc(globalVocabRef(certId, term));
    return snap.exists() ? snap.data() : null;
  } catch {
    return null; // Fail silently — just fall back to AI
  }
}

// ─────────────────────────────────────
// Firestore: Custom Flashcards & Groups
// ─────────────────────────────────────

export async function saveCustomCards(cards) {
  const user = currentUser();
  if (!user) return;
  await updateDoc(userRef(user.uid), { customCards: cards, updatedAt: serverTimestamp() });
}

export async function saveCardGroups(groups) {
  const user = currentUser();
  if (!user) return;
  await updateDoc(userRef(user.uid), { cardGroups: groups, updatedAt: serverTimestamp() });
}

// ─────────────────────────────────────
// Firestore: Interview Schedule
// ─────────────────────────────────────

export async function saveScheduleEntries(entries) {
  const user = currentUser();
  if (!user) return;
  await updateDoc(userRef(user.uid), { schedule: entries, updatedAt: serverTimestamp() });
}

export async function saveGlobalVocab(certId, term, explanation) {
  try {
    await setDoc(globalVocabRef(certId, term), {
      certId,
      term,
      explanation,
      cachedAt: serverTimestamp(),
    }, { merge: true });
  } catch (e) {
    console.warn('globalVocab save failed:', e);
  }
}
