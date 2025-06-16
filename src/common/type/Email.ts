export type Email = {
  email: string;
  name: string;
  start_date: string;
  start_time: string;
  end_date: string;
  description_text: string;
  meeting_url: string;
  explanatory_text?: string;
  time_until_start?: string;
  estimated_duration?: number;
  new_start_date?: string;
  new_start_time?: string;
};
