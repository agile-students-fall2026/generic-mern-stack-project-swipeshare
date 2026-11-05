import { displayTime } from "@/lib/utils";
import DiningHallFilter from "./DiningHallFilter";
import TimeFilter from "./TimeFilter";

const ListFilters = ({ filters, onFilter }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <TimeFilter
        from={filters?.from}
        time={filters?.from ? displayTime(new Date(filters.from)) : "ASAP"}
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
