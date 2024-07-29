interface IProps {}

export function Legends({}: IProps) {
  return (
    <div className={`flex justify-center items-center w-3/4`}>
      <div className="inline-flex items-center justify-center mx-4">
        <div className="mr-4">
          <svg
            width="15"
            height="8"
            viewBox="0 0 15 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 7.5C4.44118 -6 9.79412 10 14 0.5" stroke="#454954" />
          </svg>
        </div>
        <span className="text-sm text-gray-500">{"Actual"}</span>
      </div>
      <div className="inline-flex items-center justify-center mx-4">
        <div className="mr-4">
          <svg
            width="15"
            height="8"
            viewBox="0 0 15 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 7.5C4.44118 -6 9.79412 10 14 0.5"
              stroke="#454954"
              stroke-dasharray="1.5 1.5"
            />
          </svg>
        </div>

        <span className="text-sm text-gray-500">{"Forecast"}</span>
      </div>
      <div className="inline-flex items-center justify-center mx-4">
        <div className={`rounded-full w-2 h-2 bg-opacity-50 bg-red-600 mr-2`} />
        <span className="text-sm text-gray-500">{"No. of Ships"}</span>
      </div>
      <div className="inline-flex items-center justify-center mx-2 ">
        <div
          className={"w-2 h-2 mx-2 bg-opacity-100 bg-[#006666]  rotate-45 mr-2"}
        ></div>

        <span className="text-sm text-gray-[500] px-2">{"Port Usage"}</span>
      </div>
    </div>
  );
}
