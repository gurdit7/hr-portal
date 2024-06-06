export const formatDate = (dateString) => {
  const monthName = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(dateString);
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  return `${day}, ${monthName[month]} ${year}`;
};

export const formatMonth = (dateString) => {
  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date(dateString);
  const month = date.getMonth();
  const day = date.getDate();
  return `${day} ${monthName[month]}`;
};

export const formatDay = (dateString) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date(dateString);
  const day = days[date.getDay()];
  return `${day}`;
};

export const formatYear = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  return `${year}`;
};


export const formatMonthName = (dateString) => {
  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date(dateString);
  const month = date.getMonth();
  const day = date.getDate();
  return `${monthName[month]}`;
};


export function getMondaysAndFridays(startDate, endDate) {
  const result = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start > end) {
    return result;
  }

  let currentDate = new Date(start);

  while (currentDate <= end) {
    const day = currentDate.getDay();
    if (day === 1 || day === 5) { 
      result.push(new Date(currentDate)); 
    }
    currentDate.setDate(currentDate.getDate() + 1); 
  }

  return result;
}
