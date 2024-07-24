import chatBotImg from "../assets/chat-bot.gif";

export default function Result({ handleShowResult }) {
  return (
    <div className="flex flex-col w-full h-full animate__animated animate__fadeInRight">
      <div className="flex gap-5 h-[80%]">
        <img
          src={chatBotImg}
          alt="chat bot icon"
          className="w-[100px] h-[100px]"
        />
        <div className="relative top-16 border-4 border-secondary p-5 h-[90%] rounded-full">
          <span>
            <h1>Result</h1>
            <p>
              Definition: A result is the outcome of an event or situation,
              especially when it is considered to be the most important aspect.
            </p>
            <p>
              Example: The result of the test was positive, so I am going to the
              hospital for a check-up.
            </p>
          </span>
        </div>
      </div>
      <button
        onClick={() => handleShowResult(false)}
        className="flex justify-center self-end p-3 bg-secondary w-[10%] rounded-full z-10 text-white font-medium"
      >
        Got it
      </button>
    </div>
  );
}
