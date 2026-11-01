import { DRIVERS_DATA } from "@/api/driverConstants";
import {
  timingToArray,
  type DriverTimingItem,
  type TimingUpdate,
} from "@/api/types/livetiming";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCurrentTyresLiveTimingData } from "./useCurrentTyresLiveTimingData";
import { useTyreStintSeriesLiveTimingData } from "./useTyreStintSeriesLiveTimingData";

const EMPTY_STARTING_POSITIONS = new Map<string, number>();

export function useDriversLiveTimingData(
  startingPositions: ReadonlyMap<string, number> = EMPTY_STARTING_POSITIONS,
) {
  const [drivers, setDrivers] = useState<DriverTimingItem[]>([]);
  const { currentTyres } = useCurrentTyresLiveTimingData();
  const { stints } = useTyreStintSeriesLiveTimingData();
  const currentTyresRef = useRef(currentTyres);
  const stintsRef = useRef(stints);
  const latestTimingRef = useRef<TimingUpdate | undefined>(undefined);
  const startingPositionsRef = useRef(startingPositions);
  const positionChangesRef = useRef<Map<string, number>>(new Map());

  const attachPositionChanges = useCallback(
    (items: DriverTimingItem[]) =>
      items.map((driver) => ({
        ...driver,
        positionChange: driver.RacingNumber
          ? positionChangesRef.current.get(driver.RacingNumber)
          : undefined,
      })),
    [],
  );

  const updatePositionChanges = useCallback((items: DriverTimingItem[]) => {
    const changes = new Map<string, number>();
    for (const driver of items) {
      if (!driver.RacingNumber) continue;
      const position = Number(driver.Position);
      const startingPosition = startingPositionsRef.current.get(
        driver.RacingNumber,
      );
      if (
        startingPosition == null ||
        !Number.isInteger(position) ||
        position < 1
      ) {
        continue;
      }
      changes.set(driver.RacingNumber, startingPosition - position);
    }
    positionChangesRef.current = changes;
  }, []);

  const updateFromTiming = useCallback(
    (timing: TimingUpdate) => {
      const updated = timingToArray(
        timing,
        DRIVERS_DATA,
        currentTyresRef.current?.Tyres,
        stintsRef.current,
      );
      updatePositionChanges(updated);
      setDrivers(attachPositionChanges(updated));
    },
    [attachPositionChanges, updatePositionChanges],
  );

  useEffect(() => {
    startingPositionsRef.current = startingPositions;
    if (latestTimingRef.current) {
      updateFromTiming(latestTimingRef.current);
    }
  }, [startingPositions, updateFromTiming]);

  useEffect(() => {
    currentTyresRef.current = currentTyres;
    if (latestTimingRef.current && currentTyres) {
      setDrivers(
        attachPositionChanges(
          timingToArray(
            latestTimingRef.current,
            DRIVERS_DATA,
            currentTyres.Tyres,
            stintsRef.current,
          ),
        ),
      );
    }
  }, [currentTyres, attachPositionChanges]);

  useEffect(() => {
    stintsRef.current = stints;
    if (latestTimingRef.current) {
      setDrivers(
        attachPositionChanges(
          timingToArray(
            latestTimingRef.current,
            DRIVERS_DATA,
            currentTyresRef.current?.Tyres,
            stints,
          ),
        ),
      );
    }
  }, [stints, attachPositionChanges]);

  useEffect(() => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/v1/live-timing/timing`,
    );
    const handleTimingUpdate = (event: MessageEvent<string>) => {
      const timing: TimingUpdate = JSON.parse(event.data);
      latestTimingRef.current = timing;
      updateFromTiming(timing);
    };

    eventSource.addEventListener(
      "timing_update",
      handleTimingUpdate as EventListener,
    );
    return () => {
      eventSource.removeEventListener(
        "timing_update",
        handleTimingUpdate as EventListener,
      );
      eventSource.close();
    };
  }, [attachPositionChanges, updateFromTiming]);

  return { drivers };
}
