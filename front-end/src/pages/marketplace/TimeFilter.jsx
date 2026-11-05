import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ClockIcon } from "lucide-react";

const toInputValue = (iso) =>
  iso ? format(new Date(iso), "yyyy-MM-dd'T'HH:mm") : "";

const TimeFilter = ({ from, time = "ASAP", onChange }) => {
  function handleChange(e) {
    const value = e.target.value;
    const ISO = value ? new Date(value).toISOString() : null;
    onChange(ISO);
  }

  return (
    <div className="relative">
      <Button className="w-full h-10 text-sm px-2">
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

export default TimeFilter;
