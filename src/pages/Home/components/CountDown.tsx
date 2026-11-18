import { Heading, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { RaceWeek } from "@/api/types/race";
import { getNextScheduledSession } from "./homeUtils";

interface ICountDownProps {
  nextRace: RaceWeek;
}

export const CountDown = ({ nextRace }: ICountDownProps) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const nextSession = getNextScheduledSession(nextRace, now);
  if (!nextSession) return null;

  const remaining = Math.max(0, Date.parse(nextSession.startTime) - now);
  const seconds = Math.floor((remaining / 1000) % 60);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));

  return (
    <Stack alignItems="end" minW="100px">
      <Stack alignItems="start" direction={{ base: "column", md: "row" }}>
        <Heading size="4xl" color="fg.success">
          {String(days).padStart(2, "0")}d
        </Heading>
        <Heading size="4xl" color="fg.success">
          {String(hours).padStart(2, "0")}h
        </Heading>
        <Heading size="4xl" color="fg.success">
          {String(minutes).padStart(2, "0")}m
        </Heading>
        <Heading size="4xl" color="fg.success">
          {String(seconds).padStart(2, "0")}s
        </Heading>
      </Stack>
      <Text color="fg.muted" textAlign="end">
        ate a proxima sessao: {nextSession.name}
      </Text>
    </Stack>
  );
};
