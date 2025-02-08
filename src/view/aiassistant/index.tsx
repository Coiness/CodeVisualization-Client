/*设计组件aiAssistant
1.组件本身需要可折叠
2.作为父组件，需要管理子组件chatList和chatContent
3.传送的props：chatList，currentChat，Messages，isSending,onEdit，onDelete，onAdd，onSend，stopGet
*/

import { useEffect, useState } from "react";
import { message } from "antd";
import ChatList from "../../components/chatList";
import ChatContent from "../../components/chatContent";
import { Button } from "antd";
import {getChatList,renamechat,deletechat,getMessage,sendMessageStream,addchat} from"../../net"


//toDo：完成函数的编写、状态管理、完成按钮的CSS

export interface Message{
    id: number;
    role: string;
    content: string;
}

export interface Chat{
    id:string;
    name:string;
    time:string;
}

export interface ChatListProps{
    chatList: Chat[];
    currentChat: Chat|null;
    onEdit: (id: number, newName: string) => void;
    onDelete: (id: number) => void;
    onAdd:()=>void;
}

export interface ChatContentProps{
    currentChat: Chat|null;
    messages: Message[];
    isSending: boolean;
    onSend:(content: string) => void;
    stopGet: () => void;
}
/* 
export function renameChat(id: string, name: string,chatList:Chat[],setChatList:(chatList:Chat[])=>void){
    renamechat(id, name).then((res)=>{
        if(res){
            let newChatList = chatList.map((chat)=>{
                if(chat.id === id){
                    chat.name = name;
                }
                return chat;
            });
            setChatList(newChatList);
            message.success("修改成功");
        }
        else{
            message.error("修改失败");
        }
    });

}
export function deleteChat(id: string,chatList:Chat[],setChatList:(chatList:Chat[])=>void){
    deletechat(id).then((res)=>{
        if(res){
            let newChatList = chatList.filter((chat)=>chat.id!==id);
            setChatList(newChatList);
            message.success("删除成功");
        }
        else{
            message.error("删除失败");
        }
    });

}

export function addChat(chatList:Chat[],setChatList:(chatList:Chat[])=>void,setCurrentChat:(currentChat:Chat|null)=>void){
    addchat().then((res:Chat)=>{
      if(!res){
        setChatList([res,...chatList]);
        setCurrentChat(res);
        message.success("成功创建新对话");}
      else{
        message.error("新对话创建失败");
      }
    });
}*/




export default function AiAssistant(){
  //首先是状态管理
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat |null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [fold, setFold] = useState(false);

  //函数编写
  const addChat = async () => {
    const res = await addchat();
    if (res) {
      setChatList([res, ...chatList]);
      setCurrentChat(res);
      message.success("成功创建新对话");
    } else {
      message.error("新对话创建失败");
    }
  };

  const deleteChat = async (id: string) => {
    const res = await deletechat(id);
    if (res) {
      const newChatList = chatList.filter((chat) => chat.id !== id);
      setChatList(newChatList);
      message.success("删除成功");
    } else {
      message.error("删除失败");
    }
  }

  const renameChat = async (id: string, name: string) => {
    const res = await renamechat(id, name);
    if (res) {
      const newChatList = chatList.map((chat) => {
        if (chat.id === id) {
          chat.name = name;
        }
        return chat;
      });
      setChatList(newChatList);
      message.success("修改成功");
    } else {
      message.error("修改失败");
    }
  }
  
  // 发送消息的处理函数
  const SendMessage = async (content: string) => {
    if (!currentChat) return;
    
    // 1. 添加用户消息
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: content
    };
    setMessages(prev => [...prev, userMessage]);
    
    // 2. 创建空的助手消息
    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: ""
    };
    setMessages(prev => [...prev, assistantMessage]);
    
    // 3. 设置发送状态
    setIsSending(true);
    
    try {
      await sendMessageStream(
        content,
        // 处理每个数据块
        (chunk: string) => {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, content: msg.content + chunk }
              : msg
          ));
        },
        // 完成回调
        () => {
          setIsSending(false);
        },
        // 错误处理
        (error: string) => {
          setIsSending(false);
          message.error(error);
        }
      );
    } catch (err) {
      setIsSending(false);
      message.error("发送失败");
    }
  };

  useEffect(()=>{
    getChatList().then((res)=>{
      setChatList(res.chats.sort((a,b)=>a.time>b.time?-1:1));
    });
  },[]);

  useEffect(()=>{
    if(currentChat){
      getMessage(currentChat).then((res)=>{
        setMessages(res.messages);
      });
    }
  },[currentChat]);

  return(
    <div className={`sidebar_${fold?`folded`:`unfolded`}`}>
      <Button className={`sidebarbutton_${fold?`folded`:`unfolded`}`} onClick={()=>{setFold(!fold)}}></Button>
      <ChatList chatList={chatList}  currentChat={currentChat} onAdd={addChat} onDelete={deleteChat} onEdit={renameChat}></ChatList>
      <ChatContent currentChat={currentChat} messages={messages} isSending={isSending} onSend={SendMessage} stopGet={()=>{}}></ChatContent>
    </div>
  )


}

