type TrendDownIconProps = {
  size?: number;
};

const TrendDownIcon = ({ size = 24 }: TrendDownIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="inline"
  >
    <path d="M21.3759 17.0338C21.4713 17.5111 21.0505 17.9319 20.5732 17.8365L14.7876 16.6793C14.2534 16.5725 14.0538 15.9134 14.439 15.5282L16.1532 13.814L12.4498 10.1106L9.51083 13.0496C9.34205 13.2184 9.11313 13.3132 8.87443 13.3132C8.63574 13.3132 8.40682 13.2184 8.23804 13.0496L2.87493 7.68649C2.52346 7.33502 2.52346 6.76517 2.87493 6.4137C3.2264 6.06223 3.79625 6.06223 4.14772 6.4137L8.87443 11.1404L11.8134 8.2014C12.1649 7.84993 12.7348 7.84993 13.0862 8.2014L17.426 12.5412L19.0675 10.8997C19.4528 10.5144 20.1119 10.714 20.2187 11.2482L21.3759 17.0338Z" />
  </svg>
);

export default TrendDownIcon;