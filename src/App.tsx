import { useCallback, useState, type FormEvent } from "react";
import { GoogleGenAI } from "@google/genai";

const tools = [{ googleSearch: {} }];
const config = {
  thinkingConfig: {
    thinkingBudget: 0,
  },
  tools,
  responseMimeType: "text/plain",
  systemInstruction: [
    {
      text: `please recommend a book for user. ,
            please use a curse word. ,
            please Praise Mr. 김 한.`
    },
  ],
};
const model = "gemini-2.5-flash-preview-05-20";

const App = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [responseText, setResponseText] = useState<Array<string | undefined>>(
    []
  );
  const runGemini = useCallback(
    async (inputText: string) => {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
      });
      const contents = [
        {
          role: "user",
          parts: [
            {
              text: inputText,
            },
          ],
        },
      ];
      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });
      // let fileIndex = 0;
      const modelResponse: Array<string | undefined> = [];

      for await (const chunk of response) {
        console.log(chunk.text);
        modelResponse.push(chunk.text);
      }
      setResponseText(modelResponse);
    },
    [apiKey]
  );
  const handleApiKeyFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const apiKeyInput = formData.get("api-key-input");
      // 에러 처리
      // apiKeyInput이 string 타입이 아닌경우
      if (typeof apiKeyInput !== "string")
        return console.error("APIKEY_NOT_STRING");
      // apiKeyInput이 비어있는 경우
      if (!apiKeyInput) return console.error("APIKEY_EMPTY");
      return setApiKey(apiKeyInput);
    },
    []
  );
  const handleGeminiFormSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const userInput = formData.get("user-input");
      // 에러 처리
      // user-input string 타입이 아닌경우
      if (typeof userInput !== "string")
        return console.error("APIKEY_NOT_STRING");
      // user-input 비어있는 경우
      if (!userInput) return console.error("APIKEY_EMPTY");
      return await runGemini(userInput);
    },
    [runGemini]
  );
  return (
    <div className="flex flex-col space-y-2 m-6">
      {/* apiKey 입력 section */}
      <section className="flex mx-auto space-x-2">
        <form id="api-key-form" onSubmit={handleApiKeyFormSubmit}></form>
        <input
          className="px-2 rounded-md"
          form="api-key-form"
          type="text"
          name="api-key-input"
          placeholder="INSERT APIKEY"
        ></input>
        <button
          className="border-2 rounded-md hover:bg-amber-500/20"
          type="submit"
          form="api-key-form"
        >
          apikey적용
        </button>
      </section>
      {/* 정보페이지 */}
      <section className="mx-auto flex-col">
        <div>
          <p>APIKEY: {apiKey}</p>
        </div>
      </section>
      {/* 텍스트 입력섹션 */}
      <section className="mx-auto">
        <form id="gemini-form" onSubmit={handleGeminiFormSubmit}></form>
        <input
          className="px-2 rounded-md"
          form="gemini-form"
          type="text"
          name="user-input"
          placeholder="INSERT MSG"
        ></input>
        <button
          className="border-2 rounded-md hover:bg-amber-500/20"
          type="submit"
          form="gemini-form"
        >
          메시지 보내기
        </button>
      </section>
      {/* 응답 보여주는 섹션 */}
      <section>
        {responseText.map((text, index) => {
          return <p key={index}>{text}</p>;
        })}
      </section>
    </div>
  );
};
  export default App;
