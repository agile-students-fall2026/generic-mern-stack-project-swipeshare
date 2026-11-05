import { format, isToday, isTomorrow } from "date-fns";
import DiningHallFilter from "./DiningHallFilter";
import TimeFilter from "./TimeFilter";

const formatFilterTime = (iso) => {
  const d = new Date(iso);
  if (isToday(d)) return `Today, ${format(d, "h:mm a")}`;
  if (isTomorrow(d)) return `Tmr, ${format(d, "h:mm a")}`;
  return format(d, "MMM d, h:mm a");
};

const ListFilters = ({ filters, onFilter }) => {
  return (
    <div className="flex gap-2">
      <TimeFilter
        from={filters?.from}
        time={filters?.from ? formatFilterTime(filters.from) : "ASAP"}
        onChange={(iso) => onFilter("from", iso)}
      />
      <DiningHallFilter
        value={filters?.diningHall}
        onChange={(name) => onFilter("diningHall", name)}
      />
    </div>
  );
};

export default ListFilters;
