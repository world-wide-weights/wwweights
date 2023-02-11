import { Field, FieldProps } from "formik"
import React from "react"
import { Icon } from "../../Icon/Icon"

type ChipTextInputProps = {
  /** Gives the input a unique name */
  name: string
  /** Array of chips in textfield */
  chips: string[],
  /** Callback function to get selected chips */
  selectedChips: (chips: string[]) => void;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

/**
 * Chip Text Input, can only be used with Formik
 * Text input with chips
 */
export const ChipTextInput: React.FC<ChipTextInputProps> = ({ name, chips = [], type, selectedChips }) => {
  // All chips which are active in the textfield
  const [tags, setTags] = React.useState(chips)
  // Returns true if the input is selected
  const [isInputSelected, setIsInputSelected] = React.useState(false)
  // Removes a chip from the textfield if the user clicks on the x Icon
  const removeTags = (indexToRemove: number) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)])
  }
  // Adds a chip to the textfield if the user presses enter
  const addChips = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const value = (event.target as HTMLInputElement).value
      if (value !== "") {
        setTags([...tags, value])
        selectedChips([...tags, value]);
        (event.target as HTMLInputElement).value = ""
      }
    }
  }
  return (
    <Field type={type} name={name}>{(props: FieldProps<any>) => (
      <>
        <div datacy="chip-text-input" className={`flex bg-gray-100 rounded-lg ${isInputSelected ? "outline outline-2 outline-blue-500" : ""}`}>
          <div className="flex flex-wrap pr-4 border-solid pl-4">
            <ul datacy="tags-list" className="flex flex-wrap mt-2">
              {tags.map((tag, index) => (
                <li key={index} className=" w-auto h-8 flex items-center content-center text-blue-600 pl-2 pr-2 text-sm list-none rounded-full mr-2 mb-2 bg-blue-500 bg-opacity-20">
                  <span className="mt-0.5">{tag}</span>
                  <span onClick={() => removeTags(index)}>
                    <Icon className="block w-4 leading-4 text-center text-white text-sm ml-2 rounded-full cursor-pointer bg-blue-500" >{"close"}</Icon>
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
      </>

    )}</Field>

  )
}