/*设计组件aiAssistant
1.组件本身需要可折叠
2.作为父组件，需要管理子组件chatList和chatContent
3.传送的props：chatList，currentChat，Messages，isSending,onEdit，onDelete，onAdd，onSend，stopGet
*/

import { useEffect, useState } from "react";
import ChatList from "../../components/chatList";
import ChatContent from "../../components/chatContent";
import { Button } from "antd";
import {getChatList,renameChat,deleteChat,getMessage,sendMessage} from"../../net"


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

export default function AiAssistant(){
  //首先是状态管理
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat |null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [fold, setFold] = useState(false);

  //函数的编写
  useEffect(()=>{
    getChatList().then((res)=>{
      setChatList(res.chats.sort((a,b)=>a.time>b.time?-1:1));
    });
  });

  return(
    <div className={`sidebar_${fold?`folded`:`unfolded`}`}>
      <Button onClick={()=>{setFold(!fold)}}></Button>
      <ChatList chatList={chatList}  currentChat={currentChat} onAdd={()=>{}} onDelete={()=>{}} onEdit={()=>{}}></ChatList>
      <ChatContent currentChat={currentChat} messages={messages} isSending={isSending} onSend={()=>{}} stopGet={()=>{}}></ChatContent>
    </div>
  )


}

