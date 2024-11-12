import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Html } from '@react-three/drei'

function Character({ position, onClick, brightness }) {
  const { scene } = useGLTF('/models/character.glb')
  const [hovered, setHovered] = useState(false)
  
  return (
    <group
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
      scale={hovered ? 1.1 : 1}
    >
      <primitive object={scene} />
      {hovered && (
        <Html position={[0, 2, 0]}>
          <div className="npc-tooltip">
            点击与AI对话
          </div>
        </Html>
      )}
    </group>
  )
}

export default function NPC() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  
  const sendMessage = async () => {
    if (!userInput.trim()) return;
    
    // 添加用户消息
    setMessages([...messages, {
      role: 'user',
      content: userInput
    }])
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userInput
        })
      })
      
      const data = await response.json()
      setMessages(msgs => [...msgs, {
        role: 'assistant',
        content: data.reply
      }])
    } catch (error) {
      console.error('Error:', error)
    }
    
    setUserInput('')
  }
  
  return (
    <div className="npc-container">
      <Canvas 
        camera={{ position: [0, 1, 3], fov: 50 }}
        shadows
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Character 
          position={[0, 0, 0]}
          onClick={() => setDialogOpen(true)}
        />
        <OrbitControls />
      </Canvas>
      
      {dialogOpen && (
        <div className="dialog-modal">
          <div className="dialog-header">
            <h3>AI 助手</h3>
            <button onClick={() => setDialogOpen(false)}>×</button>
          </div>
          
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
          </div>
          
          <div className="input-area">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="输入消息..."
            />
            <button onClick={sendMessage}>发送</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .npc-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 200px;
          height: 200px;
          z-index: 1000;
        }
        
        .dialog-modal {
          position: fixed;
          bottom: 20px;
          right: 180px;
          width: 400px;
          height: 400px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
        }
        
        .dialog-header {
          padding: 10px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
        }
        
        .message {
          margin: 5px;
          padding: 8px;
          border-radius: 4px;
        }
        
        .message.user {
          background: #e3f2fd;
          margin-left: 20px;
        }
        
        .message.assistant {
          background: #f5f5f5;
          margin-right: 20px;
        }
        
        .input-area {
          padding: 10px;
          border-top: 1px solid #eee;
          display: flex;
        }
        
        input {
          flex: 1;
          padding: 8px;
          margin-right: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        button {
          padding: 8px 15px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

useGLTF.preload('/models/character.glb')