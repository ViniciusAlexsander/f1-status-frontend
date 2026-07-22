import { Heading, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { RaceWeek } from "@/api/types/race";

const COUNTDOWN_TIME = 1000;

interface ICountDownProps {
  nextRace: RaceWeek;
}

export const CountDown = ({ nextRace }: ICountDownProps) => {
  const [countDown, setCountdown] = useState<number>(
    Math.abs(
      new Date(nextRace.dateStart + "T00:00:00").getTime() -
        new Date().getTime(),
    ),
  );

  useEffect(() => {
    if (countDown === null) return;
    const intervalId = setInterval(() => {
      setCountdown((prevCountDown) => prevCountDown - COUNTDOWN_TIME);
    }, COUNTDOWN_TIME);

    return () => clearInterval(intervalId);
  }, [countDown]);

  const seconds = Math.floor((countDown / 1000) % 60);
  const minutes = Math.floor((countDown / (1000 * 60)) % 60);
  const hours = Math.floor((countDown / (1000 * 60 * 60)) % 24);
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));

  return (
    <Stack alignItems="end" minW="100px">
      <Stack alignItems="start" direction={{ base: "column", md: "row" }}>
        <Heading size="4xl" color="fg.success">
          {days}d
        </Heading>
        <Heading size="4xl" color="fg.success">
          {hours}h
        </Heading>
        <Heading size="4xl" color="fg.success">
          {minutes}m
        </Heading>
        <Heading size="4xl" color="fg.success">
          {seconds}s
        </Heading>
      </Stack>
      <Text color="fg.muted" textAlign="end">
        até a próxima corrida
      </Text>
    </Stack>
  );
};
