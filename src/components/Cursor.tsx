type Props = {
  color: string;
  x: number;
  y: number;
};

export default function Cursor({ color, x, y }: Props) {
  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translateX(${x}px) translateY(${y}px)`,
        transition: "transform 0.5s cubic-bezier(.17,.93,.38,1)",
      }}
      // width="24"
      // height="36"
      // viewBox="0 0 24 36"
      width="18"
      height="20"
      viewBox="0 0 38 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* <path
        d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
        fill={color}
      /> */}
      <path
        d="M0.235165 4.1836C0.235165 3.48718 0.429095 2.80451 0.795224 2.2121C1.16135 1.61969 1.68522 1.14094 2.30811 0.829494C2.93101 0.518045 3.62833 0.386206 4.32194 0.448748C5.01554 0.51129 5.67803 0.765744 6.23517 1.1836L36.2277 23.6911C39.1077 25.8511 37.5777 30.4411 33.9777 30.4411H19.1764C18.6018 30.4408 18.0348 30.5725 17.5192 30.826C17.0036 31.0796 16.5532 31.4483 16.2027 31.9036L6.95517 43.9598C4.77642 46.8023 0.231415 45.2611 0.231415 41.6761L0.235165 4.1836Z"
        fill={color}
      />
    </svg>
  );
}
