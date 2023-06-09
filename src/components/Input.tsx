type Precision = "m" | "s";

type Props = {
  className?: string;
  date: Date;
  onChange: (date: Date) => void;
  /** "m" or "s" for minute or second picker. default "m" */
  precision?: Precision;
}; //& React.InputHTMLAttributes<HTMLInputElement>;

export function InputDatetimeLocal({
  precision = "m",
  className,
  date,
  onChange,
}: //...rest
Props) {
  return (
    <input
      //type="datetime-local"
      type="date"
      value={datetimelocalString(date, precision)}
      onChange={(e) => {
        if (e.target.value) {
          onChange(new Date(e.target.value));
        }
      }}
      //{...rest}
      className={className}
    />
  );
}

export function InputWhen({
  className,
  date,
  onChange,
}: //...rest
Props) {
  return (
    <div className="relative flex w-64 justify-between bg-white dark:bg-black">
      <span className="absolute left-2 top-1 pr-1 text-neutral-400">When?</span>
      <input
        className="w-full bg-white py-1 pl-16 pr-1 dark:bg-black"
        //type="datetime-local"
        type="datetime-local"
        value={datetimelocalString(date)}
        onChange={(e) => {
          if (e.target.value) {
            onChange(new Date(e.target.value));
          }
        }}
        //{...rest}
      />
    </div>
  );
}
/**
 * `<input type="datetime-local">` wants a particular string format in local time such as
 *
 * "2021-12-15T20:15"
 *
 * or
 *
 * "2021-12-15T20:15:34"
 *
 * which is almost just date.toISOString() but not quite.
 */
function datetimelocalString(date: Date, p: Precision = "m") {
  //const n = p === "s" ? 19 : 16;
  const n = p === "s" ? 19 : 16;
  return localIsoString(date).slice(0, n);
}

function dateString(date: Date) {
  const n = 10;
  return localIsoString(date).slice(0, n);
}

function localIsoString(d: Date) {
  const date = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return date.toISOString();
}
