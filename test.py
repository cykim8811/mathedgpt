
from chat import Chat

chat = Chat()

stream = chat.chat_stream("What is the first 1000 digits of pi?")

import asyncio

async def main():
    async for response in stream:
        print(response, end="")

asyncio.run(main())
