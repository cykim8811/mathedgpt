
import os
import json

from chat import Chat

from fastapi import FastAPI
from fastapi.responses import FileResponse, StreamingResponse

from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request


app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Serve filename.json from chats/
@app.get("/chats/{filename}")
async def read_json(filename: str):
    return FileResponse(f"chats/{filename}.json")


# Serve list of json files in chats/
@app.get("/chats/")
async def read_chats():
    return sorted(os.listdir("chats"))


# Get chat request and return response
@app.post("/chat/{filename}")
async def chat(filename: str, request: Request):
    chat = Chat()
    with open(f"chats/{filename}.json", "r") as f:
        v = json.load(f)["messages"]
        v = [{"role": i["role"], "content": str(i["content"])} for i in v]
        chat.chat_log = v
    
    # Get user prompt from request
    user_prompt = await request.body()
    user_prompt = user_prompt.decode("utf-8")
    stream = chat.chat_stream(user_prompt)

    async def stream_wrapper():
        async for i in stream:
            yield i
            print(i)

        # Save chat log
        with open(f"chats/{filename}.json", "w") as f:
            json.dump({"messages": [{"id": i, **v} for i, v in enumerate(chat.chat_log)]}, f)

    return StreamingResponse(stream_wrapper(), media_type="text/plain")

