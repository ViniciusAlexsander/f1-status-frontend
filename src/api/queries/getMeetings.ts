import { gql } from "@apollo/client";

export const GET_MEETINGS = gql`
  query {
    currentYearNextMeeting {
      meetingKey
      meetingName
      meetingOfficialName
      location
      countryName
      countryFlag
      circuitShortName
      circuitType
      circuitImage
      gmtOffset
      dateStart
      dateEnd
      year
    }
    currentYearMeetings {
      meetingKey
      meetingName
      meetingOfficialName
      location
      countryName
      countryFlag
      circuitShortName
      circuitType
      circuitImage
      gmtOffset
      dateStart
      dateEnd
      year
    }
  }
`;
