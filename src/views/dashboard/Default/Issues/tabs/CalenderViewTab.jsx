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
      <Box sx={{ height: '100%' }}>
        <Calendar
          localizer={localizer}
          events={data}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          tooltipAccessor={(event) =>
            `${event.title}\nPriority: ${event.priority}\nStatus: ${event.status}`
          }
          eventPropGetter={(event) => {
            let backgroundColor = '#3174ad'; // default blue
            if (event.priority === 'high') backgroundColor = '#d32f2f';
            else if (event.priority === 'medium') backgroundColor = '#fbc02d';
            else if (event.priority === 'low') backgroundColor = '#388e3c';
            return { style: { backgroundColor, color: '#fff' } };
          }}
          onSelectEvent={(event) => {
            setTab('map');
            setSelectedIssue(event); // store clicked event in state
          }}
        />
      </Box>
    </Paper>
  );
}
