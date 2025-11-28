import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { enqueueSnackbar } from 'notistack';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapViewTab({
  setCoordinates,
  issues = [],
  setSelectedIssue,
  selectedWorkDay,
  selectedPinColor, // NEW PROP
  showForm, // NEW PROP
}) {
  const mapContainerRef = useRef(null);
  const mapIsReadyRef = useRef(false);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const formMarkerRef = useRef(null); // Marker for NEW ISSUE

  const loadOrtho = () => {
    const map = mapRef.current;
    const wd = selectedWorkDay;

    if (!wd || !wd.tileBounds) return;

    const bounds = [
      [wd.tileBounds.west, wd.tileBounds.south],
      [wd.tileBounds.east, wd.tileBounds.north],
      [wd.tileBounds.east, wd.tileBounds.north],
    ];

    if (map.getLayer('ortho-layer')) map.removeLayer('ortho-layer');
    if (map.getSource('ortho')) map.removeSource('ortho');

    map.addSource('ortho', {
      type: 'raster',
      tiles: [`${wd.tileBaseUrl}/{z}/{x}/{y}.png`],
      tileSize: 256,
      minzoom: 10,
      maxzoom: 18,
    });

    map.addLayer({
      id: 'ortho-layer',
      type: 'raster',
      source: 'ortho',
    });

    map.fitBounds(bounds, { padding: 20 });
  };

  // ────────────────────────────────
  // Initialize map
  // ────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [69.959, 21.256],
        zoom: 15,
      });

      mapRef.current.addControl(new mapboxgl.NavigationControl());

      mapRef.current.on('load', () => {
        mapIsReadyRef.current = true;
      });
    }
  }, []);

  // ────────────────────────────────
  // Load orthomosaic
  // ────────────────────────────────
  useEffect(() => {
    if (!selectedWorkDay) return;

    if (!mapIsReadyRef.current) {
      const interval = setInterval(() => {
        if (mapIsReadyRef.current) {
          clearInterval(interval);
          loadOrtho();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    loadOrtho();
  }, [selectedWorkDay]);

  // ────────────────────────────────
  // Add issue markers
  // ────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    issues.forEach((issue) => {
      if (!issue.coordinates) return;

      const marker = new mapboxgl.Marker({
        color: issue.pinColor || '#ff0000',
      })
        .setLngLat([issue.coordinates.lng, issue.coordinates.lat])
        .addTo(map);

      marker.getElement().addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedIssue(issue);
      });

      markersRef.current.push(marker);
    });
  }, [issues]);

  // ────────────────────────────────
  // ENABLE MAP CLICK ONLY IF showForm === true
  // ────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const handleClick = (e) => {
      if (!showForm) return;

      const { lng, lat } = e.lngLat;

      if (formMarkerRef.current) {
        formMarkerRef.current.setLngLat([lng, lat]);
      } else {
        formMarkerRef.current = new mapboxgl.Marker({
          color: selectedPinColor || '#00bcd4',
        })
          .setLngLat([lng, lat])
          .addTo(map);
      }

      setCoordinates({ lat, lng });
    };

    // add listener
    map.on('click', handleClick);

    // cleanup (important)
    return () => {
      map.off('click', handleClick);
    };
  }, [showForm, selectedPinColor]);
  // ────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    if (!formMarkerRef.current) return; // no marker yet → nothing to update

    const map = mapRef.current;
    const oldMarker = formMarkerRef.current;

    // Get previous coordinates
    const currentLngLat = oldMarker.getLngLat();

    // Remove old marker
    oldMarker.remove();

    // Create a new marker with the new color
    formMarkerRef.current = new mapboxgl.Marker({
      color: selectedPinColor,
    })
      .setLngLat(currentLngLat)
      .addTo(map);
  }, [selectedPinColor]);

  // ────────────────────────────────
  // Remove marker if form closes
  // ────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;

    if (!showForm && formMarkerRef.current) {
      formMarkerRef.current.remove();
      formMarkerRef.current = null;
      setCoordinates(null); // clear stored coords, optional
    }
  }, [showForm]);
  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: '60vh',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    />
  );
}
