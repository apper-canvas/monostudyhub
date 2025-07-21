import { useState } from "react"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"

const SearchBar = ({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  className = "" 
}) => {
  const [focused, setFocused] = useState(false)
  
  return (
    <div className={`relative ${className}`}>
      <ApperIcon
        name="Search"
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
          focused ? "text-primary" : "text-gray-400"
        }`}
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="pl-10"
      />
    </div>
  )
}

export default SearchBar