import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  useTheme,
  MenuItem,
  FormControl,
  Select,
} from '@mui/material';
import { ReactCompareSlider } from 'react-compare-slider';
import mapboxgl from 'mapbox-gl';
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

const MapBoxInstance = ({ workDay }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !workDay?.tileBaseUrl) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9', // base style
      center: [
        (workDay.tileBounds.west + workDay.tileBounds.east) / 2,
        (workDay.tileBounds.south + workDay.tileBounds.north) / 2,
      ],
      zoom: workDay.tileZoomMin ?? 15,
    });

    map.on('load', () => {
      map.addSource('ortho-source', {
        type: 'raster',
        tiles: [`${workDay.tileBaseUrl}/{z}/{x}/{y}.png`],
        tileSize: 256,
      });

      map.addLayer({
        id: 'ortho-layer',
        type: 'raster',
        source: 'ortho-source',
        paint: {},
      });
    });

    return () => map.remove();
  }, [workDay]);

  return <Box ref={containerRef} sx={{ width: '100%', height: '100%' }} />;
};

export default function CompareProject() {
  const [workDays, setWorkDays] = useState([]);
  const [firstWorkDay, setFirstWorkDay] = useState(null);
  const [secondWorkDay, setSecondWorkDay] = useState(null);
  const projectId = useSelector((state) => state.project.selectedProjectId);

  useEffect(() => {
    const fetchWorkDays = async () => {
      try {
        const res = await axios.get(
          `/work-day?projectId=${projectId}&limit=1000`,
        );
        const filtered = res.data.data.results.filter((w) => w.tileBaseUrl); // only those with tiles
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
      <Box sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h1" gutterBottom>
          Compare View
        </Typography>
      </Box>
      <Box justifyContent={'left'}>
        <Breadcrumbs
          links={pageLinks}
          card={true}
          custom={true}
          rightAlign={false}
        />
      </Box>

      {/* Dropdowns */}
      <Box display="flex" gap={2} mb={3}>
        <FormControl fullWidth>
          <Select
            value={firstWorkDay?.id || ''}
            onChange={(e) => {
              const selected = workDays.find((w) => w.id === e.target.value);
              setFirstWorkDay(selected);
            }}
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
            onChange={(e) => {
              const selected = workDays.find((w) => w.id === e.target.value);
              setSecondWorkDay(selected);
            }}
          >
            {workDays.map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Compare Slider */}
      <Box mb={5} borderRadius={2} overflow="hidden" sx={{ height: 500 }}>
        {firstWorkDay && secondWorkDay && (
          <ReactCompareSlider
            itemOne={
              <Box sx={{ width: '100%', height: '100%' }}>
                <MapBoxInstance workDay={firstWorkDay} />
              </Box>
            }
            itemTwo={
              <Box sx={{ width: '100%', height: '100%' }}>
                <MapBoxInstance workDay={secondWorkDay} />
              </Box>
            }
            style={{ height: '100%' }}
          />
        )}
      </Box>
    </MainCard>
  );
}
