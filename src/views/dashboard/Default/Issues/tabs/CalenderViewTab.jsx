import { Paper, Box, useTheme } from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect, useState } from 'react';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const isLightColor = (hex) => {
  if (!hex) return false;

  const c = hex.replace('#', '');
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);

  // perceived brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 150; // light if brightness is high
};

export default function CalendarViewTab({
  calendarEvents,
  setSelectedIssue,
  setTab,
}) {
  const theme = useTheme();
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(
      calendarEvents.map((issue) => ({
        pinColor: issue?.pinColor,
        id: issue.id,
        title: issue.title, // shown on calendar
        start: new Date(issue.createdAt), // start date
        end: new Date(issue.dueDate), // end date
        allDay: true, // full-day event
        desc: issue.description, // description
        type: issue.type, // type/category info
        priority: issue.priority, // priority for color coding
        coordinates: issue.coordinates, // optional for map integration
        status: issue.status, // status for filtering/color
      })),
    );
  }, [calendarEvents]);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        height: 500,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ height: '100%', width: '100%' }}>
        <Calendar
          showMore={true}
          localizer={localizer}
          events={data}
          startAccessor="start"
          endAccessor="end"
          popup={false}
          dayLayoutAlgorithm="no-overlap"
          titleAccessor="title"
          tooltipAccessor={(event) =>
            `📌 ${event.title}\n\n• Priority: ${event.priority}\n• Status: ${event.status}`
          }
          eventPropGetter={(event) => {
            const bg = event?.pinColor || '#3174ad';
            const readableText = isLightColor(bg) ? '#000000' : '#FFFFFF';

            return {
              style: {
                backgroundColor: bg,
                color: readableText,
                padding: 0,
                paddingLeft: 1,
                margin: 0,
              },
            };
          }}
          onSelectEvent={(event) => {
            setTab('map');
            setSelectedIssue(event);
          }}
        />
      </Box>
    </Paper>
  );
}
