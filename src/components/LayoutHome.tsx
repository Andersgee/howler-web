import { IconHowler } from "src/icons/Howler";
import { IconWhat } from "src/icons/What";
import { IconWhen } from "src/icons/When";
import { IconWhere } from "src/icons/Where";
import { IconWho } from "src/icons/Who";
import { InputDatetimeLocal, InputDate } from "./InputDatetimeLocal";
import { useState } from "react";

export function LayoutHome() {
  const [pickedDate, setPickedDate] = useState(new Date());
  return (
    <main className="container bg-orange-500">
      <div className="flex h-screen flex-col gap-4 xl:flex-row">
        <div className="bg-purple-500 xl:flex-1">
          <h2 className="text-center text-2xl ">What do?</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-1">
              <IconWhat />
              <input
                type="text"
                placeholder="What?"
                className="w-64 px-2 py-1"
              />
            </div>
            <div className="flex items-center gap-1">
              <IconWhere />{" "}
              <input
                type="text"
                placeholder="Where?"
                className="w-64 px-2 py-1"
              />
            </div>
            <div className="flex items-center gap-1">
              <IconWhen />
              <InputDate date={pickedDate} onChange={(d) => setPickedDate(d)} />
            </div>
            <div className="flex items-center gap-1">
              <IconWho />
              <input
                type="text"
                placeholder="Who?"
                className="w-64 px-2 py-1"
              />
            </div>
          </div>
          <div>
            create new event?
            <button className="flex items-center bg-blue-500 px-2 py-2 hover:bg-blue-300">
              <span className="mr-2">Howl</span>
              <IconHowler />
            </button>
          </div>
        </div>
        <div className="flex-grow bg-green-500 xl:flex-1">
          <h2 className="text-center text-2xl">Whats happening?</h2>
          <ul>
            <li>a</li>
            <li>b</li>
            <li>c</li>
            <li>d</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
