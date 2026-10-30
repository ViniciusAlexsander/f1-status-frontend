import { DRIVERS_DATA } from "@/api/driverConstants";
import {
  timingToArray,
  type DriverTimingItem,
  type TimingUpdate,
} from "@/api/types/livetiming";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCurrentTyresLiveTimingData } from "./useCurrentTyresLiveTimingData";
import { useTyreStintSeriesLiveTimingData } from "./useTyreStintSeriesLiveTimingData";

export function useDriversLiveTimingData() {
  const [drivers, setDrivers] = useState<DriverTimingItem[]>([]);
  const { currentTyres } = useCurrentTyresLiveTimingData();
  const { stints } = useTyreStintSeriesLiveTimingData();
  const currentTyresRef = useRef(currentTyres);
  const stintsRef = useRef(stints);
  const latestTimingRef = useRef<TimingUpdate | undefined>(undefined);
  const startingPositionsRef = useRef<Map<string, number>>(new Map());
  const positionChangesRef = useRef<Map<string, number>>(new Map());

  const attachPositionChanges = useCallback((items: DriverTimingItem[]) =>
    items.map((driver) => ({
      ...driver,
      positionChange: driver.RacingNumber
        ? positionChangesRef.current.get(driver.RacingNumber)
        : undefined,
    })), []);

  const updatePositionChanges = useCallback((items: DriverTimingItem[]) => {
    const currentPositions = new Map<string, number>();
    for (const driver of items) {
      if (!driver.RacingNumber) continue;
      const position = Number(driver.Position);
      if (Number.isFinite(position)) {
        currentPositions.set(driver.RacingNumber, position);
      }
    }

    if (startingPositionsRef.current.size === 0) {
      startingPositionsRef.current = currentPositions;
      positionChangesRef.current = new Map();
      return;
    }

    const changes = new Map<string, number>();
    for (const [racingNumber, position] of currentPositions) {
      const startingPosition = startingPositionsRef.current.get(racingNumber);
      if (startingPosition == null) continue;
      const change = startingPosition - position;
      if (change !== 0) changes.set(racingNumber, change);
    }
    positionChangesRef.current = changes;
  }, []);

  const updateFromTiming = useCallback((timing: TimingUpdate) => {
    const updated = timingToArray(
      timing,
      DRIVERS_DATA,
      currentTyresRef.current?.Tyres,
      stintsRef.current,
    );
    updatePositionChanges(updated);
    setDrivers(attachPositionChanges(updated));
  }, [attachPositionChanges, updatePositionChanges]);

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

    eventSource.addEventListener("timing_update", handleTimingUpdate as EventListener);
    return () => {
      eventSource.removeEventListener("timing_update", handleTimingUpdate as EventListener);
      eventSource.close();
    };
  }, [attachPositionChanges, updateFromTiming]);

  return { drivers };
}
