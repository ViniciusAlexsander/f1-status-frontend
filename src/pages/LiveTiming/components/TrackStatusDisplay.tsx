import { Flex, Text } from "@chakra-ui/react";
import { RiFlagLine } from "react-icons/ri";

type TrackStatusDisplayProps = {
  status: string;
};

type TrackStatus = {
  label: string;
  color: string;
};

const TRACK_STATUSES: Record<string, TrackStatus> = {
  AllClear: { label: "Pista liberada", color: "#22C55E" },
  Yellow: { label: "Bandeira amarela", color: "#FACC15" },
  Red: { label: "Bandeira vermelha", color: "#EF4444" },
  SCDeployed: { label: "Safety car", color: "#FACC15" },
  VSC: { label: "Virtual safety car", color: "#A855F7" },
  VSCEnding: { label: "Virtual safety car terminando", color: "#A855F7" },
};

export function TrackStatusDisplay({ status }: TrackStatusDisplayProps) {
  const trackStatus = TRACK_STATUSES[status] ?? {
    label: status,
    color: "#9CA3AF",
  };

  return (
    <Flex align="center" gap="1.5" color={trackStatus.color}>
      <RiFlagLine aria-hidden="true" />
      <Text>{trackStatus.label}</Text>
    </Flex>
  );
}
