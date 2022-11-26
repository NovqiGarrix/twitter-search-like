import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import type { NextPage } from "next";
import Head from "next/head";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Badge from "../components/Badge";
import cleanDuplicate from "../utils/cleanDuplicate";

interface DataList {
  list: string;
  inputType: string;
}

const datalist: Array<DataList> = [
  { list: "from:", inputType: "text" },
  { list: "mention:", inputType: "text" },
  { list: "after:", inputType: "date" },
  { list: "before:", inputType: "date" },
];

interface Badge {
  key: string;
  value: string;
}

const Home: NextPage = () => {
  const [keyword, setKeyword] = useState("");

  // TODO
  // 1. First time focus, show data list, then user can select and search
  // 2. Click one, datalist (one) become a badge, and user can remove it

  // 3. If the datalist already used, it should not be shown in the list
  // 4. After picking one data list, the datalist should hide again

  const [badges, setBadges] = useState<Array<Badge>>([]);
  const allUsedDataList = useMemo(
    () => badges.map((badge) => badge.key),
    [badges]
  );
  const [allBadges, setAllBadges] = useState<Array<string>>([]);

  const [currentList, setCurrentList] = useState<DataList | undefined>(
    undefined
  );
  const [currentListValue, setCurrentListValue] = useState("");

  const filteredDataList = useMemo(
    () =>
      allUsedDataList.length || currentList
        ? datalist
            .filter((item) =>
              !item ? true : !allUsedDataList.includes(item.list)
            )
            .filter((list) =>
              !currentList ? true : !list.list.includes(currentList.list)
            )
        : datalist.filter((list) => list.list.includes(keyword)),
    [keyword, allUsedDataList, currentList]
  );

  const onOptionsClicked = useCallback(
    (value: string, isEnter?: boolean) => {
      const selectedDL = datalist.find((list) => list.list === value);

      if (selectedDL && !isEnter) {
        // That means the user picked one datalist
        setCurrentList(selectedDL);
      } else {
        // That means the user typed something
        setCurrentListValue(value);
      }

      if (currentList && currentListValue) {
        // If list get it's value, then insert them to badges
        setBadges((prev) => [
          ...prev,
          { key: currentList.list, value: currentListValue },
        ]);

        // Clear the current list and value
        setCurrentList(undefined);
        setCurrentListValue("");
      }

      // Set the keyword to empty string
      setKeyword("");
    },
    [currentList, currentListValue]
  );

  useEffect(() => {
    const searchInputEl = document.getElementById(
      "search-input"
    ) as HTMLInputElement;

    if (!searchInputEl) return;

    function onKeyPress(event: KeyboardEvent) {
      if (event.key !== "Enter") return;
      onOptionsClicked(searchInputEl.value, true);
    }

    searchInputEl.addEventListener("keydown", onKeyPress);

    return () => {
      searchInputEl.removeEventListener("keydown", onKeyPress);
    };
  }, [onOptionsClicked]);

  useEffect(() => {
    if (!currentList) return;
    const searchInputEl = document.getElementById(
      "search-input"
    ) as HTMLInputElement;

    // Only run when currentList is available and the value of that list is undefined
    if (currentList && !currentListValue) {
      try {
        if (currentList.inputType === "date") {
          searchInputEl.focus();
          searchInputEl.showPicker();
        } else {
          searchInputEl.focus();
        }
      } catch (error: any) {
        console.log("Error while showing picker: ", error.message);
      }
    }

    setAllBadges((prev) => cleanDuplicate([...prev, currentList.list]));

    if (!currentListValue) return;

    // If list get it's value, then insert them to badges
    setBadges((prev) => [
      ...prev,
      { key: currentList.list, value: currentListValue },
    ]);

    setAllBadges((prev) => cleanDuplicate([...prev, currentListValue]));

    // Clear the current list and value
    setCurrentList(undefined);
    setCurrentListValue("");
  }, [currentList, currentListValue]);

  return (
    <div className="mx-auto my-auto flex items-center justify-center h-screen flex-col space-y-5">
      <Head>
        <title>Twitter Search Like</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen font-poppins">
        <div className="bg-white shadow rounded-xl max-w-2xl w-full mx-auto relative focus-within:ring-2 focus-within:ring-blue-500 py-4 space-y-3">
          <div className="flex items-center justify-between px-5">
            <div className="flex items-start w-full">
              <button type="button" title="Search">
                <MagnifyingGlassIcon className="w-6 h-6 mr-5 text-gray-500 inline-block" />
              </button>
              <div className="flex flex-wrap items-start">
                {allBadges.map((badge) => (
                  <Badge key={badge} badge={badge} />
                ))}
                <input
                  value={keyword}
                  onChange={(ev) => {
                    setKeyword(ev.target.value);
                  }}
                  type={currentList ? currentList.inputType : "text"}
                  id="search-input"
                  autoFocus
                  autoComplete="off"
                  {...(allUsedDataList.length || currentList
                    ? {}
                    : { placeholder: "Search Anything ..." })}
                  className="bg-transparent border-0 outline-none text-gray-600 placeholder:text-gray-400 text-base focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          </div>

          {filteredDataList.length > 0 && !currentList && (
            <div className="overflow-y-auto flex flex-col justify-center text-base max-h-96 scrollbar-hide">
              {filteredDataList.map((item, index) => (
                <button
                  onClick={() => onOptionsClicked(item.list)}
                  key={index}
                  className="cursor-pointer w-full group"
                  type="button"
                >
                  <div className="flex px-5 w-full items-center justify-between group-hover:bg-blue-500 bg-transparent">
                    <h5 className="py-3 font-medium text-base group-hover:text-white text-blue-600">
                      {item.list}
                    </h5>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
