export default function MyBots() {
  const categories = {
    recent: {
      title: "最近使用",
      models: [
        {
          name: 'GPT-4 Turbo',
          image: '/gpt4_Turbo.png',
          description: '最新的GPT-4模型',
          features: ['128k上下文']
        },
        {
          name: 'Claude 3',
          image: '/claude3.png',
          description: '强大的理解能力',
          features: ['200k上下文']
        },
        {
          name: '文心一言',
          image: '/wenxin.png',
          description: '百度AI助手',
          features: ['中文优化']
        },
        {
          name: '通义千问',
          image: '/tongyi.png',
          description: '阿里AI助手',
          features: ['开源可商用']
        }
      ]
    },
    language: {
      title: "语言模型",
      models: [
        {
          name: 'GPT-4 Turbo',
          image: '/gpt4_Turbo.png',
          description: '最强大语言模型',
          features: ['128k上下文']
        },
        {
          name: 'Claude 3',
          image: '/claude3.png',
          description: '精确推理能力',
          features: ['200k上下文']
        },
        {
          name: 'GPT-3.5',
          image: '/GPT-3.5.png',
          description: '性价比之选',
          features: ['16k上下文']
        },
        {
          name: 'BERT',
          image: '/Google-BERT.png',
          description: '自然语言处理',
          features: ['文本分析']
        },
        {
          name: 'LLaMA 2',
          image: '/LLaMa2.png',
          description: '开源大模型',
          features: ['本地部署']
        }
      ]
    },
    chinese: {
      title: "中文模型",
      models: [
        {
          name: '通义千问',
          image: '/tongyi.png',
          description: 'Qwen2-72B开源',
          features: ['开源可商用']
        },
        {
          name: '文心一言',
          image: '/wenxin.png',
          description: '百度AI助手',
          features: ['中文优化']
        },
        {
          name: '智谱清言',
          image: '/智谱清言.jpg',
          description: '智谱AI助手',
          features: ['学术研究']
        },
        {
          name: 'SenseChat',
          image: '/shangtang.png',
          description: '商汤AI助手',
          features: ['企业服务']
        }
      ]
    },
    multimodal: {
      title: "多模态模型",
      models: [
        {
          name: 'CLIP',
          image: '/CLIP.png',
          description: '图文理解模型',
          features: ['多模态']
        },
        {
          name: 'GPT-4V',
          image: '/GPT4V.png',
          description: '视觉语言模型',
          features: ['图像理解']
        },
        {
          name: 'Claude 3',
          image: '/claude3.png',
          description: '多模态理解',
          features: ['文档分析']
        }
      ]
    },
    image: {
      title: "图像生成",
      models: [
        {
          name: 'DALL-E 3',
          image: '/dall-e-3.jpg',
          description: 'OpenAI绘画',
          features: ['图像生成']
        },
        {
          name: 'Midjourney',
          image: '/Midjourne.png',
          description: '艺术创作',
          features: ['高清图像']
        },
        {
          name: 'Stable XL',
          image: '/stablediffusion.png',
          description: '开源生成',
          features: ['本地部署']
        }
      ]
    }
  };

  return (
    <div className="my-bots-container">
      <div className="content-area">
        {Object.entries(categories).map(([key, category]) => (
          <div key={key} id={key} className="category-section">
            <h2 className="category-title">{category.title}</h2>
            <div className="models-grid">
              {category.models.map((model, index) => (
                <div key={index} className="model-card">
                  <div className="model-image">
                    <img src={model.image} alt={model.name} />
                  </div>
                  <div className="model-content">
                    <h3>{model.name}</h3>
                    <p>{model.description}</p>
                    <div className="features">
                      {model.features.map((feature, i) => (
                        <span key={i} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="anchor-nav">
        {Object.entries(categories).map(([key, category]) => (
          <a key={key} href={`#${key}`} className="anchor-link">
            {category.title}
          </a>
        ))}
      </div>

      <style jsx>{`
        .my-bots-container {
          padding: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: 2rem;
        }

        .content-area {
          flex: 1;
          max-width: 900px;
        }

        .anchor-nav {
          position: sticky;
          top: 2rem;
          width: 120px;
          height: fit-content;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-left: auto;
        }

        .anchor-link {
          color: #666;
          text-decoration: none;
          padding: 0.5rem;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .anchor-link:hover {
          background: #f0f7ff;
          color: #007bff;
        }

        .models-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .model-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
          cursor: pointer;
        }

        .model-card:hover {
          transform: translateY(-2px);
        }

        .model-image {
          height: 120px;
        }

        .model-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .model-content {
          padding: 0.75rem;
        }

        .model-content h3 {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          color: #333;
        }

        .model-content p {
          color: #666;
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
        }

        .features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .feature-tag {
          background: #f0f7ff;
          color: #007bff;
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
          font-size: 0.7rem;
        }
      `}</style>
    </div>
  );
}
