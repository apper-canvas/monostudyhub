import Label from "@/components/atoms/Label"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"

const FormField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  options = [], 
  placeholder,
  required = false,
  error,
  ...props 
}) => {
  const renderInput = () => {
    if (type === "select") {
      return (
        <Select value={value} onChange={onChange} {...props}>
          <option value="">{placeholder || "Select an option"}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      )
    }
    
    if (type === "textarea") {
      return (
        <textarea
          className="input-field resize-none"
          rows={3}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
        />
      )
    }
    
    return (
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
    )
  }
  
  return (
    <div className="space-y-1">
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {renderInput()}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
}

export default FormField