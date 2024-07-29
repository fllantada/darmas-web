const CalendarIcon = ({ ...props }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M3 6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44772 21 6V12H3V6Z" />
    <path
      d="M17.5 2V6M6.5 2V6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V7Z"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export default CalendarIcon;
