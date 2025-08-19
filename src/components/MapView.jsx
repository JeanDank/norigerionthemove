import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTripStore } from '../store';
import { addRoutePoint as addRoutePointDb, addMarker as addMarkerDb, subscribeMarkers, subscribeRoutePoints, addMediaToMarker, updateMarker } from '../services/tripService';
import MediaUploader from './MediaUploader';

// Fix default marker icons in Leaflet when using bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function ClickHandlers({ onAddPoint, onAddMarker }) {
  useMapEvents({
    click: (e) => {
      if (e.originalEvent.shiftKey) {
        onAddMarker({ lat: e.latlng.lat, lng: e.latlng.lng });
      } else {
        onAddPoint({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
}

export default function MapView() {
  const { routePoints, markers, setRoute, setMarkers } = useTripStore();
  const [center] = useState([47.4979, 19.0402]); // Budapest default

  const polylinePositions = useMemo(
    () => routePoints.map((p) => [p.lat, p.lng]),
    [routePoints]
  );

  useEffect(() => {
    const unsubRoute = subscribeRoutePoints((points) => setRoute(points));
    const unsubMarkers = subscribeMarkers((items) => setMarkers(items));
    return () => {
      unsubRoute();
      unsubMarkers();
    };
  }, [setRoute, setMarkers]);

  const handleAddPoint = async ({ lat, lng }) => {
    await addRoutePointDb({ lat, lng });
  };

  const handleAddMarker = async ({ lat, lng }) => {
    await addMarkerDb({ lat, lng });
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {polylinePositions.length > 1 && (
          <Polyline positions={polylinePositions} color="#2f80ed" />
        )}

        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]}>
            <Popup>
              <div style={{ maxWidth: 220 }}>
                <input
                  defaultValue={m.title || 'Untitled'}
                  onBlur={(e) => updateMarker(m.id, { title: e.target.value })}
                  style={{ width: '100%', fontWeight: 600 }}
                />
                <textarea
                  defaultValue={m.description || ''}
                  placeholder="Description..."
                  onBlur={(e) => updateMarker(m.id, { description: e.target.value })}
                  style={{ width: '100%', marginTop: 8 }}
                  rows={3}
                />
                <div style={{ marginTop: 8 }}>
                  <MediaUploader
                    markerId={m.id}
                    onUploaded={async (item) => {
                      await addMediaToMarker(m.id, item);
                    }}
                  />
                </div>
                {!!m.media?.length && (
                  <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    {m.media.map((media, idx) => (
                      <div key={idx}>
                        {media.type === 'video' ? (
                          <video src={media.url} controls style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                        ) : (
                          <img src={media.url} alt="" style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        <ClickHandlers onAddPoint={handleAddPoint} onAddMarker={handleAddMarker} />
      </MapContainer>
      <div style={{ position: 'absolute', top: 12, left: 12, background: 'white', padding: 8, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <div>Click to add route point. Shift+Click to add a marker.</div>
      </div>
    </div>
  );
}


