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