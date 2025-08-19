import { create } from 'zustand';
import { produce } from 'immer';

// Types
// RoutePoint: { id, lat, lng, createdAt }
// Marker: { id, lat, lng, title, description, media: [{id, url, type}], createdAt }

export const useTripStore = create((set, get) => ({
  user: null,
  routePoints: [],
  markers: [],
  isLoading: false,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setRoute: (points) => set({ routePoints: points }),
  addRoutePoint: (point) =>
    set(
      produce((state) => {
        state.routePoints.push(point);
      })
    ),
  setMarkers: (markers) => set({ markers }),
  addMarker: (marker) =>
    set(
      produce((state) => {
        state.markers.push(marker);
      })
    ),
  updateMarker: (id, partial) =>
    set(
      produce((state) => {
        const idx = state.markers.findIndex((m) => m.id === id);
        if (idx !== -1) state.markers[idx] = { ...state.markers[idx], ...partial };
      })
    ),
}));


