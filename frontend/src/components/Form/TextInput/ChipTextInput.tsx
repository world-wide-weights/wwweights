import React from "react";

type ChipTextInputProps = {
  /** Array of chips in textfield */
  chips: string[],
  /** Callback function to get selected chips */
  selectedChips: (chips: string[]) => void;
}

export const ChipTextInput: React.FC<ChipTextInputProps> = (props) => {
  const [chips, setChips] = React.useState(props.chips)
  const [isInputSelected, setIsInputSelected] = React.useState(false)
  const removeTags = (indexToRemove: number) => {
    setChips([...chips.filter((_, index) => index !== indexToRemove)])
  }
  const addChips = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const value = (event.target as HTMLInputElement).value
      if (value !== "") {
        setChips([...chips, value])
        props.selectedChips([...chips, value]);
        (event.target as HTMLInputElement).value = ""
      }
    }
  }
  return (
    <div className={`flex bg-gray-100 rounded-lg ${isInputSelected ? "outline outline-2 outline-blue-500" : ""}`}>
      <div className="flex flex-wrap pr-4 border-solid pl-4">
        <ul className="flex flex-wrap mt-2">
          {chips.map((tag, index) => (
            <li key={index} className=" w-auto h-8 flex items-center content-center text-blue-600 pl-2 pr-2 text-sm list-none rounded-full mr-2 mb-2 bg-blue-500 bg-opacity-20">
              <span className="mt-0.5">{tag}</span>
              <span
                className=" block w-4 leading-4 text-center text-white text-sm ml-2 rounded-full cursor-pointer bg-blue-500"
                onClick={() => removeTags(index)}
              >
                x
              </span>
            </li>
          ))}
        </ul>
        <input
          className="flex-1 h-12 pr-2 text-base text-gray-500 bg-gray-100 focus-visible:outline-none"
          type=""
          onKeyUp={addChips}
          onFocus={() => setIsInputSelected(true)}
          onBlur={() => setIsInputSelected(false)}
          placeholder="Press enter to add tags"
        />
      </div>
    </div>
  )
}