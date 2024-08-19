
from openai import OpenAI
import asyncio

price_info = {
    "gpt-4o": (5, 15),
    "gpt-4o-mini": (0.15, 0.60),
}

class Chat:
    def __init__(self, api_key: str|None = None, model: str = "gpt-4o"):
        self.api_key = api_key
        self.client = OpenAI(api_key=api_key)
        self.chat_log = []
        self.model = model
    
    def __call__(self, user_prompt: str) -> str|None:
        self.chat_log.append({"role": "user", "content": user_prompt})
        print(self.chat_log)
        response = self.client.chat.completions.create(
            model=self.model,
            messages=self.chat_log
        )
        if response.choices[0].message.content is None:
            self.chat_log.pop()
            raise Exception("An Error Occured while processing the request.")
        self.chat_log.append({"role": "assistant", "content": response.choices[0].message.content})
        if self.model in price_info:
            cost = (price_info[self.model][0] * response.usage.prompt_tokens + price_info[self.model][1] * response.usage.completion_tokens) / 1000000
            print(f"Cost: ${cost:.5f}")
        return response.choices[0].message.content

    async def chat_stream(self, user_prompt: str) -> str|None:
        self.chat_log.append({"role": "user", "content": user_prompt})
        print(self.chat_log)
        stream = self.client.chat.completions.create(
            model=self.model,
            messages=self.chat_log,
            stream=True
        )
        
        content = ""
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                yield chunk.choices[0].delta.content
                await asyncio.sleep(0.1)
                content += chunk.choices[0].delta.content
            # else:
            #     self.chat_log.pop()
            #     raise Exception("An Error Occured while processing the request.")
        self.chat_log.append({"role": "assistant", "content": content})
        # if self.model in price_info:
        #     cost = (price_info[self.model][0] * stream.usage.prompt_tokens + price_info[self.model][1] * stream.usage.completion_tokens) / 1000000
        #     print(f"Cost: ${cost:.5f}")
        return
        
        

# 실제 사용시에는 다음과 같이 입력합니다
#
# from chat import Chat
#
# chat = Chat(api_key="API 키 입력. 환경변수 설정시 생략", model="gpt-4o")
# result1 = chat("3 + 3은?")            # "3 + 3의 값은 6입니다."
# result2 = chat("거기에 5를 더하면?")   # "3 + 3의 값인 6에 5를 더하면 11입니다."
#
# another_chat = Chat(api_key="API 키 입력", model="gpt-4o")
# result3 = another_chat("거기에 2를 더하면?")   # "어떤 수에 2를 더하면 그 수는 원래 값보다 2만큼 커집니다. 
#                                               # 수를 말씀해 주시면 더 정확한 답변을 드릴 수 있을 것 같습니다."
