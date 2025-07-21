import Button from "@/components/atoms/Button"

const FilterTabs = ({ tabs, activeTab, onTabChange, className = "" }) => {
  return (
    <div className={`flex space-x-1 bg-gray-100 p-1 rounded-lg ${className}`}>
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          variant={activeTab === tab.value ? "primary" : "ghost"}
          size="sm"
          onClick={() => onTabChange(tab.value)}
          className={`flex-1 ${
            activeTab === tab.value 
              ? "bg-white shadow-sm" 
              : "bg-transparent hover:bg-white/50"
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-1 text-xs ${
              activeTab === tab.value ? "text-white" : "text-gray-500"
            }`}>
              ({tab.count})
            </span>
          )}
        </Button>
      ))}
    </div>
  )
}

export default FilterTabs