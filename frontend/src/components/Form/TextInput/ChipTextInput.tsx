import React from "react"

type ChipTextInputProps = {
  /** Array of chips in textfield */
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
    <div className="flex bg-gray-100 rounded-lg focus:border focus:border-blue-500">
      <div className="flex flex-wrap pr-4 border-solid focus:border focus:border-blue-500 pl-4">
        <ul className="flex flex-wrap mt-2">
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
          className="flex-1 focus:border-none h-12 pr-2 text-base text-gray-500 bg-gray-100"
          type=""
          onKeyUp={addTags}
          placeholder="Press enter to add tags"
        />
      </div>
    </div>


  )
}