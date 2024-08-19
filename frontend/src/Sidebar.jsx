
import React, { useState } from 'react';
import { filenameState } from './recoil/atoms';
import { useRecoilState } from 'recoil';

function Sidebar() {
    const [chatList, setChatList] = useState([]);
    const [filename, setFilename] = useRecoilState(filenameState);

    React.useEffect(() => {
        fetch('http://test1.cykim.site/chats')
            .then((response) => response.json())
            .then((data) => {
                setChatList(data.map((chat) => chat.replace('.json', '')));
            });
    }, []);

    return (
        <div style={{
            width: '300px',
            height: '100%',
            backgroundColor: '#f0f0f0',
        }}>
            <h1 style={{
                padding: '10px',
                borderBottom: '1px solid #e0e0e0',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#333',
            }}>
                Chats
            </h1>
            <ul>
                {chatList.map((chat) => (
                    <li
                        key={chat}
                        onClick={() => setFilename(chat)}
                        style={{
                            cursor: 'pointer',
                            padding: '10px',
                            borderBottom: '1px solid #e0e0e0',
                        }}
                    >
                        {chat}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;
