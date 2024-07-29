type VesselMarkerProps = {
  size: number;
  rotation: number;
  className?: string;
  style?: object;
};

const VesselMarker = ({
  size,
  rotation,
  className,
  style = {},
  ...props
}: VesselMarkerProps) => (
  <svg
    width={size}
    className={className}
    viewBox="0 0 25 14"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: `rotate(${rotation}deg)`, ...style }}
    {...props}
  >
    <path d="M1.19121 10.1183C1.33217 11.1034 2.17592 11.835 3.17104 11.835L13.3891 11.835C13.9802 11.835 14.541 11.5735 14.921 11.1207L18.0429 7.401C18.2206 7.18929 18.2206 6.88055 18.0429 6.66884L14.921 2.94914C14.541 2.49636 13.9802 2.23488 13.3891 2.23488L3.17104 2.23488C2.17592 2.23488 1.33217 2.96649 1.19121 3.95158L0.790539 6.75162C0.76365 6.93953 0.76365 7.13031 0.790539 7.31822L1.19121 10.1183Z" />
    <path d="M17.8072 1.06365C18.075 0.795844 18.5092 0.795858 18.777 1.06368L24.7479 7.03491L18.7771 13.0061C18.5092 13.274 18.075 13.274 17.8072 13.0062C17.5394 12.7384 17.5394 12.3041 17.8072 12.0363L22.8083 7.03491L17.8072 2.03351C17.5394 1.76568 17.5394 1.33146 17.8072 1.06365Z" />
  </svg>
);

export default VesselMarker;
