import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "@/components/ui/toast";
import { CheckIcon, MapPinIcon } from "lucide-react";
import { useEffect, useState } from "react";

const DiningHallFilter = ({ value, onChange }) => {
  const [halls, setHalls] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchHalls() {
      try {
        const res = await fetch("/api/dining-halls");
        if (!res.ok) throw new Error((await res.json())?.message);
        setHalls(await res.json());
      } catch (e) {
        toast.add({ type: "error", description: e.message });
      }
    }
    fetchHalls();
  }, []);

  function select(name) {
    onChange(name);
    setOpen(false);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
      <DrawerTrigger
        render={<Button className="w-full min-w-0 h-10 text-sm px-2" />}
      >
        <MapPinIcon />
        <span className="min-w-0 truncate">{value ?? "Any Dining Hall"}</span>
      </DrawerTrigger>
      <DrawerContent className="mx-auto max-w-md">
        <DrawerHeader className="pb-3">
          <DrawerTitle className="text-lg">Dining Hall</DrawerTitle>
        </DrawerHeader>
        <div className="min-h-0 flex-1 overflow-y-auto border-t pb-[env(safe-area-inset-bottom)]">
          <HallOption
            name="Any Dining Hall"
            address="Show all"
            selected={!value}
            onSelect={() => select("")}
          />
          {halls.map((hall) => (
            <HallOption
              key={hall.id}
              name={hall.name}
              address={[hall.street, hall.detail].filter(Boolean).join(" · ")}
              image={hall.image}
              selected={value === hall.name}
              onSelect={() => select(hall.name)}
            />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const HallOption = ({ name, address, image, selected, onSelect }) => (
  <button
    type="button"
    data-selected={selected || undefined}
    onClick={onSelect}
    className="flex min-h-16 w-full items-center gap-3 px-4 py-2.5 text-left transition-colors active:bg-muted data-selected:bg-primary/5"
  >
    {image ? (
      <img
        src={image}
        loading="lazy"
        className="size-12 shrink-0 rounded-lg bg-muted object-cover"
      />
    ) : (
      <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <MapPinIcon className="size-5" />
      </span>
    )}
    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span className="truncate text-base font-medium">{name}</span>
      <span className="truncate text-xs text-muted-foreground">{address}</span>
    </span>
    {selected && <CheckIcon className="size-5 shrink-0 text-primary" />}
  </button>
);

export default DiningHallFilter;
