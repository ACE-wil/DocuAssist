import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 9999,
    transition: 'opacity 0.3s ease-out'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%) scale(0.8)',
    width: '90%',
    maxWidth: '700px',
    padding: '1.5rem',
    borderRadius: '12px',
    backgroundColor: 'white',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    opacity: 0,
    zIndex: 10000,
    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
  }
};

Modal.setAppElement('#__next');

const UpgradeModal = ({ isOpen, onRequestClose }) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);

  useEffect(() => {
    setModalIsOpen(isOpen);
  }, [isOpen]);

  const closeModal = () => {
    setModalIsOpen(false);
    setTimeout(onRequestClose, 300); // 等待动画结束后再关闭
  };

  const plans = [
    { name: '专业版', price: '¥99/月', features: ['无限机器人', '高级分析', '优先支持'] },
    { name: '企业版', price: '¥299/月', features: ['定制化解决方案', '专属客户经理', '24/7支持'] },
  ];

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="升级计划"
      onAfterOpen={() => {
        setTimeout(() => {
          const content = document.querySelector('.ReactModal__Content');
          if (content) {
            content.style.opacity = 1;
            content.style.transform = 'translate(-50%, -50%) scale(1)';
          }
        }, 0);
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>升级您的账户</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {plans.map((plan, index) => (
          <div key={index} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '20px', 
            width: '45%',
            textAlign: 'center'
          }}>
            <h3>{plan.name}</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '20px 0' }}>{plan.price}</p>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {plan.features.map((feature, i) => (
                <li key={i} style={{ margin: '10px 0' }}>✅ {feature}</li>
              ))}
            </ul>
            <button style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}>
              选择{plan.name}
            </button>
          </div>
        ))}
      </div>
      <button onClick={closeModal} style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer'
      }}>
        ×
      </button>
    </Modal>
  );
};

export default UpgradeModal;
