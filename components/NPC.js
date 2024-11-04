import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Html } from '@react-three/drei'

function Character({ position, onClick, brightness }) {
  const { scene } = useGLTF('/models/character.glb')
  const [hovered, setHovered] = useState(false)
  
  // 调整材质亮度
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.emissiveIntensity = brightness
      child.material.emissive.set(0xffffff)
    }
  })
  
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
            点击与我对话
          </div>
        </Html>
      )}
    </group>
  )
}

export default function NPC() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [brightness, setBrightness] = useState(0.5)
  
  return (
    <div style={{ 
      width: '100%', 
      height: '400px', 
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 10
    }}>
      <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Character 
          position={[0, -1, 0]}
          onClick={() => setDialogOpen(true)}
          brightness={brightness}
        />
        <OrbitControls />
      </Canvas>
      
      <div className="controls">
        <label>亮度调节:</label>
        <input 
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={brightness}
          onChange={(e) => setBrightness(parseFloat(e.target.value))}
        />
      </div>
      
      {dialogOpen && (
        <div className="dialog-box">
          <h3>NPC 对话</h3>
          <p>你好，冒险者！</p>
          <button onClick={() => setDialogOpen(false)}>关闭</button>
        </div>
      )}

      <style jsx>{`
        .controls {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.7);
          padding: 10px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
        }
        
        input[type="range"] {
          width: 100px;
        }
      `}</style>
    </div>
  )
}

useGLTF.preload('/models/character.glb')