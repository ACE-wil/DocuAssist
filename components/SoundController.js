import React from 'react';
import { Howl } from 'howler';

export default function SoundController({ sounds, onVolumeChange }) {
  return (
    <div className="sound-controls">
      <div className="sound-item">
        <label>背景音乐:</label>
        <input 
          type="range"
          min="0"
          max="1"
          step="0.1"
          defaultValue={sounds.background.volume()}
          onChange={(e) => {
            sounds.background.volume(parseFloat(e.target.value));
            onVolumeChange('background', e.target.value);
          }}
        />
      </div>
      
      <div className="sound-item">
        <label>效果音:</label>
        <input 
          type="range"
          min="0"
          max="1"
          step="0.1"
          defaultValue={sounds.click.volume()}
          onChange={(e) => {
            const volume = parseFloat(e.target.value);
            sounds.click.volume(volume);
            sounds.hover.volume(volume);
            sounds.success.volume(volume);
            onVolumeChange('effects', volume);
          }}
        />
      </div>

      <style jsx>{`
        .sound-controls {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.7);
          padding: 15px;
          border-radius: 8px;
          color: white;
        }

        .sound-item {
          margin: 10px 0;
        }

        .sound-item label {
          display: block;
          margin-bottom: 5px;
        }

        input[type="range"] {
          width: 150px;
        }
      `}</style>
    </div>
  );
} 