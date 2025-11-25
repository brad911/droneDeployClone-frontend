import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { enqueueSnackbar } from 'notistack';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapViewTab({
  issues = [],
  setSelectedIssue,
  selectedWorkDay,
}) {
  const mapContainerRef = useRef(null);
  const mapIsReadyRef = useRef(false);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const loadOrtho = () => {
    const map = mapRef.current;
    const wd = selectedWorkDay;

    if (!wd || !wd.tileBounds) return;

    const bounds = [
      [wd.tileBounds.west, wd.tileBounds.south],
      [wd.tileBounds.east, wd.tileBounds.north],
    ];

    // Remove previous layer/source
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

  // Initialize map
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

  // Add orthomosaic raster tiles
  useEffect(() => {
    if (!selectedWorkDay) return;

    if (!selectedWorkDay.tileBounds) {
      enqueueSnackbar('Selected workday does not have tile bounds.', {
        variant: 'warning',
      });
      return;
    }

    // Wait until the map is fully ready
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

  // Add markers for issues
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Only add markers if there are issues
    issues.forEach((issue) => {
      if (!issue.coordinates) return;

      const marker = new mapboxgl.Marker({ color: issue.pinColor || '#ff0000' })
        .setLngLat([issue.coordinates.lng, issue.coordinates.lat])
        .addTo(map);

      // Click handler for marker
      marker.getElement().addEventListener('click', (e) => {
        e.stopPropagation(); // Important: prevent map click
        console.log(issue, '<==== wow');
        setSelectedIssue(issue);
      });

      markersRef.current.push(marker);
    });
  }, [issues, selectedWorkDay, setSelectedIssue]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: '560px',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    />
  );
}
