import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, MenuItem, FormControl, Select } from '@mui/material';
import { ReactCompareSlider } from 'react-compare-slider';
import mapboxgl from 'mapbox-gl';
import syncMove from 'mapbox-gl-sync-move'; // ✅ Import the sync plugin
import axios from 'utils/axios.config';
import MainCard from 'ui-component/cards/MainCard';
import Breadcrumbs from '../../../../ui-component/extended/Breadcrumbs';
import {
  IconBuildingCog,
  IconDroneOff,
  IconGitCompare,
} from '@tabler/icons-react';
import { useSelector } from 'react-redux';

mapboxgl.accessToken =
  'pk.eyJ1IjoiaGlyYWtyYWoiLCJhIjoiY21icXd5eHRnMDNtaTJxczcxd2RmbTZwOCJ9.P6kpsuLMDdeK2DIMJZMrmw';

// 🔹 Map component that exposes map instance to parent
const MapBoxInstance = ({ workDay, onMapReady }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !workDay?.tileBaseUrl) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [
        (workDay.tileBounds.west + workDay.tileBounds.east) / 2,
        (workDay.tileBounds.south + workDay.tileBounds.north) / 2,
      ],
      zoom: workDay.tileZoomMin ?? 15,
    });

    map.on('load', () => {
      // Add raster source/layer for orthomosaic tiles
      map.addSource('ortho-source', {
        type: 'raster',
        tiles: [`${workDay.tileBaseUrl}/{z}/{x}/{y}.png`],
        tileSize: 256,
      });

      map.addLayer({
        id: 'ortho-layer',
        type: 'raster',
        source: 'ortho-source',
      });

      // ✅ Ensure zoom/drag interactions are enabled
      map.scrollZoom.enable();
      map.dragPan.enable();
      map.dragRotate.enable();
      map.keyboard.enable();

      // ✅ Notify parent that this map is ready
      if (onMapReady) onMapReady(map);
    });

    return () => map.remove();
  }, [workDay, onMapReady]);

  return <Box ref={containerRef} sx={{ width: '100%', height: '100%' }} />;
};

export default function CompareProject() {
  const [workDays, setWorkDays] = useState([]);
  const [firstWorkDay, setFirstWorkDay] = useState(null);
  const [secondWorkDay, setSecondWorkDay] = useState(null);

  // ✅ Use state instead of refs so useEffect runs when both maps are ready
  const [mapA, setMapA] = useState(null);
  const [mapB, setMapB] = useState(null);

  const projectId = useSelector((state) => state.project.selectedProjectId);

  useEffect(() => {
    const fetchWorkDays = async () => {
      try {
        const res = await axios.get(
          `/work-day?projectId=${projectId}&limit=1000`,
        );
        const filtered = res.data.data.results.filter((w) => w.tileBaseUrl);
        setWorkDays(filtered);
        if (filtered.length >= 2) {
          setFirstWorkDay(filtered[0]);
          setSecondWorkDay(filtered[1]);
        }
      } catch (err) {
        console.error('Failed to fetch workdays', err);
      }
    };
    fetchWorkDays();
  }, [projectId]);

  // ✅ Sync maps when both are ready
  useEffect(() => {
    if (mapA && mapB) {
      const unsync = syncMove(mapA, mapB);
      return () => unsync && unsync();
    }
  }, [mapA, mapB]);

  const pageLinks = [
    { title: 'Projects', to: '/project', icon: IconDroneOff },
    {
      title: 'Project Name',
      to: `/project/${projectId}/View`,
      icon: IconBuildingCog,
    },
    { title: 'Compare View', icon: IconGitCompare },
  ];

  return (
    <MainCard>
      {/* Header */}
      <Box sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h1" gutterBottom>
          Compare View
        </Typography>
      </Box>

      {/* Breadcrumbs */}
      <Box justifyContent="left">
        <Breadcrumbs links={pageLinks} card custom rightAlign={false} />
      </Box>

      {/* Dropdowns */}
      <Box display="flex" gap={2} mb={3}>
        <FormControl fullWidth>
          <Select
            value={firstWorkDay?.id || ''}
            onChange={(e) =>
              setFirstWorkDay(workDays.find((w) => w.id === e.target.value))
            }
          >
            {workDays.map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <Select
            value={secondWorkDay?.id || ''}
            onChange={(e) =>
              setSecondWorkDay(workDays.find((w) => w.id === e.target.value))
            }
          >
            {workDays.map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Compare Slider with Two Maps */}
      <Box mb={5} borderRadius={2} overflow="hidden" sx={{ height: 500 }}>
        {firstWorkDay && secondWorkDay && (
          <ReactCompareSlider
            onlyHandleDraggable // ✅ Prevents slider from jumping on map click
            itemOne={
              <MapBoxInstance workDay={firstWorkDay} onMapReady={setMapA} />
            }
            itemTwo={
              <MapBoxInstance workDay={secondWorkDay} onMapReady={setMapB} />
            }
            style={{ height: '100%' }}
          />
        )}
      </Box>
    </MainCard>
  );
}
