import React ,{useState}from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button,message } from 'antd';
import { CopyOutlined,CheckOutlined } from '@ant-design/icons';
import './index.css';



interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {

    //用于追踪哪个代码块被复制了
    const [copiedCode,setCopiedCode] = useState<string | null>(null);

    const copyToClipboard = (text:string) =>{
        navigator.clipboard.writeText(text).then(()=>{
            setCopiedCode(text);
            setTimeout(()=>{
                setCopiedCode(null);
            },2000);
        })
        .catch(err => {
            console.error('复制失败',err);
            message.error('复制失败');
        })
    }


  return (
    <div className={`markdown-content ${className || ''}`}>
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            return match ? (
                <div className='code-block-wrapper'>
                    <Button 
                    className={`cop-button ${copiedCode === codeString ? 'copied' : ''}`}
                    size='small' 
                    icon={copiedCode === codeString ?<CheckOutlined />:<CopyOutlined />} 
                    style={{position:'absolute',right:'10px',top:'10px',zIndex:10,opacity:0.8,}}
                    onClick={()=>copyToClipboard(codeString)}
                    >
                    {copiedCode === codeString ? '已复制' : '复制'}
                    </Button>
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;