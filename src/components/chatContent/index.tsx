/*
设计chatContent组件
首先是props，接受一个currentChat对象，和一个Messages【】
第一步是定义接口
第二步是渲染Messages【】（根据不同的role进行渲染）
第三步是发送消息，以及流式接收消息
*/

import { Input ,Button,message} from "antd";
import { LoadingOutlined,SendOutlined } from "@ant-design/icons"; 
import { useState } from "react";
import markdownRender from "../markdownRenderer";
import "./index.css";
import MarkdownRenderer from "../markdownRenderer";
const { TextArea } = Input;


export interface Message{
    chatId: number;
    role: string;
    content: string;
}

export interface Chat{
    id:string;
    title:string;
    time:string;
}


export interface ChatContentProps{
    currentChat: Chat|null;
    messages: Message[];
    isSending: boolean;
    isLogin:boolean;
    onSend:(content: string) => void;
    stopGet: () => void;
}

export default function ChatContent(props: ChatContentProps){
    const [value, setValue] = useState("");

    //处理键盘事件
    const handleKeyDown : React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
        if(event.key === 'Enter' && !event.shiftKey  ){
            event.preventDefault();
            handleSend();
        }
    }

    const handleSend = () =>{
        console.log("isLogin:",props.isLogin);
        if(!props.isLogin){
            message.error("你还没登录呢");
            return;
        }

        if(props.isSending){
            message.error("现在还有消息正在发送中，等会再试试吧");
            return;
        }

        if(props.currentChat === null){
            message.error("你还没选择对话呢");
            return;
        }

        
        if(value.trim() === ""){
            message.error("请输入内容");
            return
        }
        else{
            props.onSend(value);
            setValue("");
        }

        
    }

    //isSending的逻辑在父组件中实现    
    return(
        <div className="chatContent">
            <div className="contentBox">
                {props.messages.map((message)=>{
                    return (
                        <div key={message.chatId} className={`message_${message.role}`}>
                            {message.role === "user"?(message.content):(<MarkdownRenderer content={message.content}/>)}
                        </div>
                    )
                })}
            </div>
            <div className="contentInput">
                <TextArea
                value={value}
                placeholder="赶快来和我对话吧！"
                autoSize={{ minRows: 3, maxRows: 5 }}
                onChange = {(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                />
                <div className="sendButton">
                <Button icon={props.isSending?
                    <LoadingOutlined />:
                    <SendOutlined/>}
                    onClick={props.isSending?props.stopGet:handleSend}
                ></Button>
                </div>
            </div>
        </div>
    )
}
