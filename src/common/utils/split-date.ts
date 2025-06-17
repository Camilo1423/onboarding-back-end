export interface SplitDateTime {
  date: string;
  time: string;
}

export function splitDateTime(dateTime: string): SplitDateTime {
  // Convert to Bogota timezone
  const bogotaDate = new Date(dateTime).toLocaleString('en-US', {
    timeZone: 'America/Bogota',
  });
  const date = new Date(bogotaDate);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  if (hours > 12) {
    hours = hours - 12;
  } else if (hours === 0) {
    hours = 12;
  }

  const formattedTime = `${hours}:${minutes} ${ampm}`;

  return {
    date: formattedDate,
    time: formattedTime,
  };
}
