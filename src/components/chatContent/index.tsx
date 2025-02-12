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
import { getAccount,getToken } from "../../net/token";
import "./index.css";
const { TextArea } = Input;


export interface Message{
    id: number;
    role: string;
    content: string;
}

export interface Chat{
    id:string;
    title:string;
    time:string;
}


export interface Props{
    currentChat: Chat|null;
    messages: Message[];
    isSending: boolean;
    onSend:(content: string) => void;
    stopGet: () => void;
}

export default function ChatContent(props: Props){
    const [value, setValue] = useState("");
    const account = getAccount();
    const token = getToken();
    //isSending的逻辑在父组件中实现    
    return(
        <div className="chatContent">
            <div className="contentBox">
                {props.messages.map((message)=>{
                    return (
                        <div key={message.id} className={`message_${message.role}`}>
                            {message.content}
                        </div>
                    )
                })}
            </div>
            <div style={{ margin: '24px 0' }} />
            <div className="contentInput">
                <TextArea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="赶快来和我对话吧！"
                autoSize={{ minRows: 3, maxRows: 5 }}
                />
                <div className="sendButton">
                <Button icon={props.isSending?
                    <LoadingOutlined onClick={()=>{props.stopGet()}}/>:
                    <SendOutlined onClick={(currentChat)=> {if(token === null || account === null){
                        message.error("你还没登录呢");
                        return;
                    }if(currentChat){props.onSend(value)}else{message.error("请先选择对话")}}} />}
                
                ></Button>
                </div>
            </div>
        </div>
    )
}
