import React from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    maxWidth: '600px',
    padding: '30px',
    borderRadius: '10px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
};

Modal.setAppElement('#__next');

const UpgradeModal = ({ isOpen, onRequestClose }) => {
  const plans = [
    { name: '专业版', price: '¥99/月', features: ['无限机器人', '高级分析', '优先支持'] },
    { name: '企业版', price: '¥299/月', features: ['定制化解决方案', '专属客户经理', '24/7支持'] },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="升级计划"
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
      <button onClick={onRequestClose} style={{
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