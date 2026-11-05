import { Button } from "@/components/ui/button";
import { format, isToday, isTomorrow } from "date-fns";
import { ClockIcon } from "lucide-react";

const toInputValue = (iso) =>
  iso ? format(new Date(iso), "yyyy-MM-dd'T'HH:mm") : "";

const formatFilterTime = (iso) => {
  const d = new Date(iso);
  if (isToday(d)) return `Today, ${format(d, "h:mm a")}`;
  if (isTomorrow(d)) return `Tmr, ${format(d, "h:mm a")}`;
  return format(d, "MMM d, h:mm a");
};

const ListFilters = ({ filters, onFilter }) => {
  return (
    <div>
      <TimeFilter
        from={filters?.from}
        time={filters?.from ? formatFilterTime(filters.from) : "ASAP"}
        onChange={(iso) => onFilter("from", iso)}
      />
    </div>
  );
};

export default ListFilters;

const TimeFilter = ({ from, time = "ASAP", onChange }) => {
  function handleChange(e) {
    const value = e.target.value;
    const ISO = value ? new Date(value).toISOString() : null;
    onChange(ISO);
  }

  return (
    <div className="relative">
      <Button className="w-40 h-10 text-sm px-2">
        <ClockIcon /> {time}
      </Button>
      <input
        type="datetime-local"
        className="absolute inset-0 opacity-0"
        value={toInputValue(from)}
        onClick={(e) => e.currentTarget.showPicker?.()}
        onChange={handleChange}
      />
    </div>
  );
};
