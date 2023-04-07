import { IconHowler } from "src/icons/Howler";
import { IconWhat } from "src/icons/What";
import { IconWhen } from "src/icons/When";
import { IconWhere } from "src/icons/Where";
import { IconWho } from "src/icons/Who";
import { InputWhen } from "./Input";
import { useState } from "react";
import { type RouterOutputs, api } from "src/utils/api";
import { hashidFromNumber } from "src/utils/hashids";
import Link from "next/link";
import { useRouter } from "next/router";
import { startOfDay } from "date-fns";
import { IconArrowLink } from "src/icons/ArrowLink";

const OPTIONS_WHO = {
  a: "Who? (anyone)",
  b: "Only my friends",
  c: "My friends and their friends",
};

function useQueriedEvents(when: Date, what: string) {
  const [events, setEvents] = useState<RouterOutputs["event"]["search"]>([]);
  api.event.search.useQuery(
    { when, what },
    {
      onSuccess: (data) => setEvents(data),
    }
  );
  return events;
}

export function LayoutHome() {
  const [dateWhen, setDateWhen] = useState(startOfDay(new Date()));
  const [textWhat, setTextWhat] = useState("");
  const [textWhere, setTextWhere] = useState("");
  const [optionWho, setOptionWho] = useState(OPTIONS_WHO.a);
  const router = useRouter();

  const events = useQueriedEvents(dateWhen, textWhat);
  const { mutateAsync: createEvent } = api.event.create.useMutation();

  const onCreate = async () => {
    const createdEvent = await createEvent({
      what: textWhat,
      when: dateWhen,
      where: textWhere,
      who: optionWho,
    });
    const hashId = hashidFromNumber(createdEvent.id);
    router
      .push(hashId)
      .then(() => {
        //do nothing
      })
      .catch(() => {
        //do nothing
      });
  };

  return (
    <main className="container">
      <div className="flex h-screen flex-col gap-4 xl:flex-row">
        <div className="border-b-2 xl:flex-1 xl:border-b-0 xl:border-r-2">
          <h2 className="text-center text-2xl">What do</h2>
          <div className="mx-4 flex flex-col gap-4">
            <div className="flex items-center gap-1">
              <IconWhat />
              <input
                type="text"
                value={textWhat}
                onChange={(e) => setTextWhat(e.target.value)}
                placeholder="What? (anything)"
                className="w-60 bg-white px-2 py-1 dark:bg-black"
              />
            </div>
            <div className="flex items-center gap-1">
              <IconWhere />
              <input
                type="text"
                value={textWhere}
                onChange={(e) => setTextWhere(e.target.value)}
                placeholder="Where? (anywhere)"
                className="w-60 bg-white px-2 py-1 dark:bg-black"
              />
            </div>
            <div className="flex items-center gap-1">
              <IconWhen />
              <InputWhen date={dateWhen} onChange={(d) => setDateWhen(d)} />
            </div>
            <div className="flex items-center gap-1">
              <IconWho />
              <select
                value={optionWho}
                className="w-60 bg-white px-2 py-2 text-neutral-400 dark:bg-black"
                onChange={(e) => setOptionWho(e.target.value)}
              >
                {Object.entries(OPTIONS_WHO).map(([k, str]) => (
                  <option key={k} value={str}>
                    {str}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="my-6 ml-6 flex w-60 flex-col items-center">
            <p className="mb-1 text-center text-sm">make something happen</p>
            <button
              onClick={() => void onCreate()}
              className="flex w-40 items-center justify-center rounded-full border-2 border-black bg-blue-50 px-2 py-2 transition-colors hover:bg-blue-200"
            >
              <span className="mr-2 text-2xl text-black">Howl</span>
              <IconHowler />
            </button>
          </div>
        </div>
        <div className="flex-grow xl:flex-1">
          <h2 className="text-center text-2xl">Stuff happening</h2>

          <ul>
            {events.map((event) => (
              <li key={event.id}>
                <Link
                  className="block border-b py-4 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  prefetch={false}
                  href={hashidFromNumber(event.id)}
                >
                  <div className="flex justify-between px-4">
                    <h3 className="capitalize-first flex-shrink truncate text-base font-normal">
                      {event.title}
                    </h3>
                    <IconArrowLink className="text-neutral-500 dark:text-neutral-300" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
