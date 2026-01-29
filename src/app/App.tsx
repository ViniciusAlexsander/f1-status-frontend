import { useQuery } from "@apollo/client/react";
import { GET_MEETINGS } from "../api/queries/getMeetings";
import "./App.css";

function App() {
  const { data, loading, error } = useQuery(GET_MEETINGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Next Race</h1>
      <p>
        {data.currentYearNextMeeting.meetingName} -{" "}
        {data.currentYearNextMeeting.countryName} -{" "}
        {new Date(data.currentYearNextMeeting.dateStart).toLocaleString(
          "pt-br"
        )}{" "}
        to{" "}
        {new Date(data.currentYearNextMeeting.dateEnd).toLocaleString("pt-br")}
      </p>

      <h2>Season Calendar</h2>
      <ul style={{ textAlign: "justify" }}>
        {data.currentYearMeetings.map((m: any) => (
          <li key={m.meetingName}>
            {m.meetingName} - {m.countryName} -{" "}
            {new Date(m.dateStart).toLocaleString("pt-br")} to{" "}
            {new Date(m.dateEnd).toLocaleString("pt-br")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
