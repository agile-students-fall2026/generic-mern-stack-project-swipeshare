import { displayWindow, fromNow } from "@/lib/utils";

const TimeSlots = ({ listing }) => {
  const now = new Date();

  const windows = listing.windows
    .map((w) => ({ start: new Date(w.start), end: new Date(w.end) }))
    .filter((w) => w.end > now)
    .sort((a, b) => a.start - b.start);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <p className="font-medium">Available Times</p>
        {listing.fulfillment === "online" && (
          <p className="text-sm text-muted-foreground">
            {listing.quantity} left
          </p>
        )}
      </div>
      {windows.length === 0 ? (
        <p className="text-muted-foreground">No upcoming times</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {windows.map((w) => {
            const open = w.start <= now;
            return (
              <li
                key={w.start.getTime()}
                data-open={open || undefined}
                className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 ring-1 ring-foreground/10 data-open:bg-primary/5 data-open:ring-primary/30"
              >
                <span>{displayWindow(w)}</span>
                <span
                  className={
                    open
                      ? "shrink-0 text-sm font-medium text-primary"
                      : "shrink-0 text-sm text-muted-foreground"
                  }
                >
                  {open ? "Available now" : fromNow(w.start, now)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TimeSlots;
