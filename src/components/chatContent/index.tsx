/*
设计chatContent组件
首先是props，接受一个currentChat对象，和一个Messages【】
第一步是定义接口
第二步是渲染Messages【】（根据不同的role进行渲染）
第三步是发送消息，以及流式接收消息
*/

import { Input ,Button,message} from "antd";
import { LoadingOutlined,SendOutlined } from "@ant-design/icons"; 
import { useState,useRef, useEffect } from "react";
import React from "react";
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
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    //处理键盘事件
    const handleKeyDown : React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
        if(event.key === 'Enter' && !event.shiftKey  ){
            event.preventDefault();
            handleSend();
        }
    }

    //处理发送事件
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
            scrollToBottom();
            setValue("");
        }

        
    }

    //判断是否在底部附近的函数
    const isNearBottom = () =>{
        if(!messagesContainerRef.current) return false;
        const container = messagesContainerRef.current;
        return container.scrollHeight - container.scrollTop - container.clientHeight < 60;
    }

    //滚动到底部的函数
    const scrollToBottom = () =>{
        messagesEndRef.current?.scrollIntoView({behavior:"smooth"});
    }

    //点击问题发送
    const sendExampleQuestion = (question: string) => {
        // 直接发送问题，不经过 value 状态
        if (props.currentChat && props.isLogin && !props.isSending) {
            props.onSend(question);
            setValue("");
            scrollToBottom();
        } else {
            // 仅用于显示在输入框
            setValue(question);
            
            // 如果有错误条件，用户可以看到问题并手动发送
            if (!props.isLogin) {
                message.error("你还没登录呢");
            } else if (props.isSending) {
                message.error("现在还有消息正在发送中，等会再试试吧");
            } else if (!props.currentChat) {
                message.error("你还没选择对话呢");
            }
        }
    };

    //问题列表
    const exampleQuestions = useRef([
        "这个网站是做什么的？",
        "怎么样将我的代码转换为动画？",
        "你可以帮我分析一下我的代码吗？"
    ])

    useEffect(()=>{
        if(isNearBottom() && props.isSending){
            setTimeout(scrollToBottom,100);
        }

        if(!props.isSending && props.messages.length > 0){
            setTimeout(scrollToBottom,300);
        }

    },[props.messages,props.isSending]);

    const MessageItem = React.memo(({message}:{message:Message})=>{
        return(
            <div key={message.chatId} className={`message_${message.role}`}>
                {message.role === "user"?
                (message.content)
                :( <MarkdownRenderer content={message.content}/>)}
            </div>
        )
    })

  

    //isSending的逻辑在父组件中实现    
    return(
        <div className="chatContent">
            <div className="contentBox" ref={messagesContainerRef}>
            {props.messages.length > 0 
            ? 
            props.messages.map((message)=>{
                return(
                    <MessageItem key={message.chatId} message={message}></MessageItem>
                )
            })
            :
            <div className="empty-chat-container">
                <h2>我是AI助手，很高兴见到你！</h2>
                <p>你可以问我任何问题，例如：</p>
                {exampleQuestions.current.map((question,index)=>(
                    <div key={index} className="example-question" 
                    onClick={()=>sendExampleQuestion(question)}>
                        {question}
                    </div>
                ))}
            </div>
            }
            <div ref={messagesEndRef} style={{height:"0px",margin:"0"}}></div>
                
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
