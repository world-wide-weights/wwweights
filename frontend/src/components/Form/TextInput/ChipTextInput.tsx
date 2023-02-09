import React from "react"

type ChipTextInputProps = {
  /** Gives the input a unique name */
  chips: string[]
}

export const ChipTextInput: React.FC<ChipTextInputProps> = ({ chips }) => {
  const [tags, setTags] = React.useState(chips)
  const removeTags = (indexToRemove: number) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)])
  }
  const addTags = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const value = (event.target as HTMLInputElement).value
      if (value !== "") {
        setTags([...tags, value]);
        (event.target as HTMLInputElement).value = ""
      }
    }
  }
  return (
    <div className=" h-12 flex items-center justify-center bg-gray-100">
      <div className="flex items-center flex-wrap min-h-3 w-96 pr-2 border-solid rounded-md">
        <ul className="flex flex-wrap p-0 mt-2 ">
          {tags.map((tag, index) => (
            <li key={index} className=" w-auto h-8 flex items-center content-center text-blue-600 pl-2 pr-2 text-sm list-none rounded-full mr-2 mb-2 bg-blue-500 bg-opacity-20">
              <span className="mt-0.5">{tag}</span>
              <span
                className=" block w-4 h-4 leading-4 text-center text-white text-sm ml-2 rounded-full cursor-pointer bg-blue-500"
                onClick={() => removeTags(index)}
              >
                x
              </span>
            </li>
          ))}
        </ul>
        <input
          className="flex-1 border-none h-12 text-sm pt-1 text-gray-500 bg-gray-100"
          type="text"
          onKeyUp={addTags}
          placeholder="Press enter to add tags"
        />
      </div>
    </div>


  )
}