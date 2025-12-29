import * as React from "react";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Paper, Typography } from "@mui/material";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";

import api from "../../api";
import LeaveEventDialog from "./LeaveEventDialog";

const LeaveCalendarPage = () => {
  const [leaves, setLeaves] = React.useState<any[]>([]);
  const [selectedLeave, setSelectedLeave] = React.useState<any | null>(null);

  const locales = {
    "en-US": enUS,
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  React.useEffect(() => {
    // Fetch leave records
    const fetchLeaves = async () => {
      try {
        const response = await api.get(`leaves?role=manager`);
        setLeaves(response.data || []);
      } catch (error) {
        console.error(`Error fetching leaves or remaining hours:`, error);
      }
    };

    fetchLeaves();
  }, []);

  // Map leave records to calendar events
  const leaveEvents: Event[] = leaves
    .filter(({ status }) => !["Rejected", "Cancelled"].includes(status))
    .map(
      ({
        created_by: createdBy,
        start_date: startDate,
        end_date: endDate,
        status,
      }) => {
        return {
          title: `${createdBy.first_name} ${createdBy.last_name}`,
          // Ensure the leave record is inclusive of the end date and all day events
          start: new Date(startDate + "T00:00:00"),
          end: new Date(endDate + "T23:59:59"),
          allDay: true,
          status,
        };
      }
    );

  /**
   * Get event style based on status
   * @param event
   * @returns
   */
  const getEventStyle = (event: Event) => {
    let backgroundColor = "blue"; // default color
    if (event.status === "Approved") {
      backgroundColor = "green";
    } else if (event.status === "Pending") {
      backgroundColor = "orange";
    }

    return {
      backgroundColor,
      color: "white",
      borderRadius: "8px",
      border: "none",
    };
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Employee PTO Calendar
      </Typography>
      <Calendar
        localizer={localizer}
        events={leaveEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800, width: "80%", margin: "0 auto" }}
        views={["month", "week", "day"]}
        eventPropGetter={(event) => ({
          style: getEventStyle(event),
        })}
        onSelectEvent={({ title, start, end, status }) =>
          setSelectedLeave({
            title,
            start,
            end,
            status,
          })
        }
      />
      {selectedLeave && (
        <LeaveEventDialog
          selectedLeave={selectedLeave}
          setSelectedLeave={setSelectedLeave}
        />
      )}
    </Paper>
  );
};

export default LeaveCalendarPage;
