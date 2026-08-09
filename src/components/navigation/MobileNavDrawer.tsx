import { NavLinks } from "@/components/navigation/NavLinks";
import {
  Drawer,
  IconButton,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { RiMenuLine } from "react-icons/ri";

export function MobileNavDrawer() {
  const { open, onClose, setOpen } = useDisclosure();

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
      placement="end"
    >
      <Drawer.Trigger asChild>
        <IconButton
          aria-label="Abrir menu de navegação"
          display={{ base: "inline-flex", md: "none" }}
          variant="ghost"
        >
          <RiMenuLine />
        </IconButton>
      </Drawer.Trigger>

      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Menu</Drawer.Title>
              <Drawer.CloseTrigger aria-label="Fechar menu" />
            </Drawer.Header>
            <Drawer.Body>
              <NavLinks variant="mobile" onNavigate={onClose} />
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
