import Text from '../Text/Text'

const Badge = ({status}) => {
  return (
    <Text
    className={`text-xs py-2 px-5 rounded-md !text-white uppercase tracking-normal ${
      status === "pending" ? "bg-dark dark:bg-blue-400" : ""
    } ${
      status === "approved" ? "bg-green-600" : ""
    }
    ${
      status === "uploaded" ? "bg-green-600" : ""
    }
    
    ${
      status === "not-approved" ? "bg-red-600" : ""
    }
    ${
      status === "canceled" ? "bg-red-700" : ""
    }
    ${
      status === "unpaid" ? "bg-red-900" : ""
    }
    ${
      status === "updated" ? "bg-red-400" : ""
    }
    
    `}
  >
    {status.replace('-', " ")}
  </Text>
  )
}

export default Badge
