import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useTheme } from '../contexts/ThemeContext';

const UpgradeModal = ({ isOpen, onRequestClose }) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const { theme } = useTheme();

  useEffect(() => {
    setModalIsOpen(isOpen);
  }, [isOpen]);

  const closeModal = () => {
    setModalIsOpen(false);
    setTimeout(onRequestClose, 300);
  };

  const plans = [
    { name: '专业版', price: '¥99/月', features: ['无限机器人', '高级分析', '优先支持'] },
    { name: '企业版', price: '¥299/月', features: ['定制化解决方案', '专属客户经理', '24/7支持'] },
  ];

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 900
        },
        content: {
          position: 'relative',
          top: 'auto',
          left: 'auto',
          right: 'auto',
          bottom: 'auto',
          width: '80%',
          maxWidth: '800px',
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '20px',
          color: theme.text.primary,
          zIndex: 901
        }
      }}
      contentLabel="升级计划"
    >
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        color: theme.text.primary 
      }}>升级您的账户</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {plans.map((plan, index) => (
          <div key={index} style={{ 
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            padding: '20px',
            width: '45%',
            textAlign: 'center',
            backgroundColor: theme.surface,
          }}>
            <h3 style={{ color: theme.text.primary }}>{plan.name}</h3>
            <p style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              margin: '20px 0',
              color: theme.text.primary 
            }}>{plan.price}</p>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {plan.features.map((feature, i) => (
                <li key={i} style={{ 
                  margin: '10px 0',
                  color: theme.text.secondary 
                }}>✅ {feature}</li>
              ))}
            </ul>
            <button style={{
              backgroundColor: theme.button.primary,
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px',
              transition: 'background-color 0.2s',
              ':hover': {
                backgroundColor: theme.button.hover
              }
            }}>
              选择{plan.name}
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default UpgradeModal;
