import ChatScreen from "./ChatScreen";
import Sidebar from "./Sidebar";
import { useState } from "react";


function App() {
  const [expand, setExpand] = useState(true);
  return (
    <div style={{
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 0,
    }}>
      <div style={{
        display: 'flex',
        height: '100vh',
        width: expand ? '100vw' : 'calc(100vw + 300px)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'width 0.3s',
      }}
      >
        <Sidebar />
        <ChatScreen />
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '300px',
          padding: '10px',
          color: 'gray',
          fontSize: '24px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
          onClick={() => setExpand(!expand)}
        >
          {expand ? '<' : '>'}
        </div>
      </div>
    </div>
  )
}

export default App;

