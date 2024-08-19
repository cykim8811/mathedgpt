
import React, { useEffect } from 'react';
import { filenameState } from './recoil/atoms';
import { useRecoilState } from 'recoil';
import { InlineMath } from 'react-katex';
import MarkdownRender from './MarkdownRender';


function ChatScreen() {
    const [filename, setFilename] = useRecoilState(filenameState);
    const [chatData, setChatData] = React.useState([]);

    // When filename changes, update the chat
    // Get it from current_website:7001/filename
    useEffect(() => {
        fetch(`https://test1.cykim.site/chats/${filename}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.messages);
                if (data.messages) setChatData(data.messages);
            });
    }, [filename]);

    function sendChat() {
        const newChat = document.getElementById('chatInput').value;
        document.getElementById('chatInput').value = '';
        setChatData([...chatData, { id: chatData.length, role: 'user', content: newChat }, { id: chatData.length + 1, role: 'assistant', content: '' }]);

        // Send /chat/filename by POST and newChat in body,
        // then when response is received, update chatData
        fetch(`https://test1.cykim.site/chat/${filename}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: newChat,
        })
            .then((response) => {
                // Get stream from response
                const reader = response.body.getReader();
                let decoder = new TextDecoder();
                let buffer = '';
                // Read the stream
                reader.read().then(function processText({ done, value }) {
                    if (done) {
                        return;
                    }
                    buffer += decoder.decode(value, { stream: true });
                    console.log(buffer);
                    setChatData((cData)=>[...cData.slice(0, cData.length-1), { id: cData.length, role: 'assistant', content: buffer }]);
                    return reader.read().then(processText);
                });
            });
    }

    return (
        <div style={{
            width: 'calc(100% - 300px)',
            height: '100%',
            backgroundColor: 'white',
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100%)',
                justifyContent: 'flex-end',
            }}>
            <h1 style={{marginLeft: "48px"}}>{filename}</h1>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'calc(100% - 70px)',
                    overflowY: 'scroll',
                    width: '100%',
                }}>
                    {chatData.map((chat) => (
                        chat.role === 'system' ? "" :
                        <div
                            key={chat.id}
                            style={{
                                position: 'relative',
                                fontSize: '24px',
                                // padding: '5px',
                                paddingTop: '-25px',
                                paddingBottom: '-25px',
                                paddingLeft: '16px',
                                paddingRight: '16px',
                                margin: '15px',
                                borderRadius: '10px',
                                backgroundColor: chat.role === 'assistant' ? '' : '#e0e0e0',
                                alignSelf: chat.role === 'assistant' ? 'center' : 'flex-end',
                                maxWidth: chat.role === 'assistant' ? '90%' : '60%',
                                width: chat.role === 'assistant' ? '90%' : 'fit-content',
                            }}
                        >
                            {
                                chat.role === 'assistant' ? <i className='fas fa-user-tie' style={{position: 'absolute', left: '-28px'}}></i> : ''
                            }
                            <MarkdownRender>{chat.content}</MarkdownRender>
                        </div>
                    ))}
                    <div style={{ float:"left", clear: "both" }}></div>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '70px',
                    backgroundColor: '#f0f0f0',
                }}>
                    <input
                        style={{
                            width: 'calc(100% - 20px)',
                            padding: '10px',
                            margin: '10px',
                            borderRadius: '10px',
                            border: 'none',
                            fontSize: '24px',
                        }}
                        id="chatInput"
                        type="text"
                        placeholder="Type a message..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                sendChat();
                            }
                        }}
                    />
                    <button
                        style={{
                            padding: '10px',
                            margin: '10px',
                            borderRadius: '10px',
                            border: 'none',
                            backgroundColor: '#e0e0e0',
                            cursor: 'pointer',
                        }}
                        onClick={sendChat}
                    >
                        <i className='fas fa-paper-plane' style={{fontSize: '24px'}}></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatScreen;
