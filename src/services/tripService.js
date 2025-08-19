import { db } from '../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';

const tripId = 'default';

const routePointsCol = collection(db, 'trips', tripId, 'routePoints');
const markersCol = collection(db, 'trips', tripId, 'markers');

export function subscribeRoutePoints(callback) {
  const q = query(routePointsCol, orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snap) => {
    const points = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(points);
  });
}

export async function addRoutePoint({ lat, lng }) {
  await addDoc(routePointsCol, { lat, lng, createdAt: serverTimestamp() });
}

export function subscribeMarkers(callback) {
  const q = query(markersCol, orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, media: [], ...d.data() }));
    callback(items);
  });
}

export async function addMarker({ lat, lng, title = 'New spot', description = '' }) {
  await addDoc(markersCol, {
    lat,
    lng,
    title,
    description,
    media: [],
    createdAt: serverTimestamp(),
  });
}

export async function updateMarker(markerId, partial) {
  const ref = doc(db, 'trips', tripId, 'markers', markerId);
  await updateDoc(ref, partial);
}

export async function addMediaToMarker(markerId, mediaItem) {
  const ref = doc(db, 'trips', tripId, 'markers', markerId);
  await updateDoc(ref, { media: arrayUnion(mediaItem) });
}


