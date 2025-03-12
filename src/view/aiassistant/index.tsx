/*设计组件aiAssistant
1.组件本身需要可折叠
2.作为父组件，需要管理子组件chatList和chatContent
3.传送的props：chatList，currentChat，Messages，isSending,onEdit，onDelete，onAdd，onSend，stopGet
*/

import { useEffect, useState } from "react";
import { message } from "antd";
import "./index.css";
import ChatList from "../../components/chatList";
import ChatContent from "../../components/chatContent";
import { Button } from "antd";
import {getChatList,renamechat,deletechat,getMessage,MessageService,addchat,terminatemessage} from"../../net"
import { isLogin } from "../../net/token";
import { set } from "lodash";


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

export interface ChatListProps{
  chatList: Chat[]|null;
  currentChat: Chat|null;
  isLogin:boolean;
  onSelectChat:(chat:Chat)=>void;
  onEdit: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onAdd:()=>void;
}

export interface ChatContentProps{
  currentChat: Chat|null;
  messages: Message[];
  isSending: boolean;
  isLogin:boolean;
  onSend:(content: string) => void;
  stopGet: () => void;
}

export default function AiAssistant(){
  //首先是状态管理
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat |null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [fold, setFold] = useState(true);

  //函数编写
  const onSelectChat = (chat: Chat | null) => {
    terminateMessage();
    setCurrentChat(chat);
  }

  const addChat = async () => {
    const res = await addchat();
    if (res) {
      setChatList([res, ...chatList]);
      terminateMessage();
      setCurrentChat(res);
      message.success("成功创建新对话");
    } else {
      message.error("新对话创建失败");
    }
  };

  const deleteChat = async (id: string) => {
    const res = await deletechat(id);
    console.log("删除对话",res);
    if (res) {
      const newChatList = chatList.filter((chat) => chat.id !== id);
      if(currentChat?.id === id){
        setCurrentChat(null);
        console.log("currentChat在删除后被设定为",currentChat);
      }
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
          chat.title = name;
        }
        return chat;
      });
      setChatList(newChatList);
      message.success("修改成功");
    } else {
      message.error("修改失败");
    }
  }
  
const sendMessage = async (content: string) => {
  if (!currentChat) return;
  
  // 创建消息对象
  const userMessage: Message = {
    chatId: messages.length,
    role: "user",
    content
  };
  
  const assistantMessage: Message = {
    chatId: messages.length + 1,
    role: "assistant",
    content: ""
  };
  
  setMessages([...messages, userMessage, assistantMessage]);
  setIsSending(true);
  
  // 重试机制
  let retries = 0;
  const maxRetries = 3;
  
  const attemptSend = async () => {
    try {
      await MessageService.sendMessage({
        content,
        slug: currentChat.id,
        onMessage: (text) => {
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.chatId === assistantMessage.chatId
                ? { ...msg, content: msg.content + text }
                : msg
            )
          );
        },
        onComplete: () => {
          setIsSending(false);
          console.log('会话完成');
          moveCurrentChatToTop();
        },
        onError: (err) => {
          console.log('会话出错:', err);
          if (retries < maxRetries) {
            retries++;
            console.log(`尝试第 ${retries} 次重连...`);
            attemptSend();
          } else {
            setIsSending(false);
            message.error(`会话失败，已重试 ${maxRetries} 次`);
          }
        }
      });
    } catch (error) {
      console.error("发送消息异常:", error);
      setIsSending(false);
      message.error("发送消息时发生异常");
    }
  };
  
  await attemptSend();
};

  const terminateMessage = async () =>{
    console.log("stopGet");
    if(isSending){
    if(currentChat === null){
      message.error("你还没选择对话呢");
      return;
    }
    const res = await terminatemessage(currentChat.id);
    if(res){
      console.log("终止成功");
      setIsSending(false);
    }else{
      message.error("终止失败");
      setIsSending(false);
    }}
    
  }

const moveCurrentChatToTop = ()=>{
  if(!currentChat) return;
  const newTime = new Date().toISOString();

  const updatedChat = {
    ...currentChat,
    time:newTime
  }

  const newChatList = chatList.filter(chat => chat.id !== currentChat.id);
  setChatList([updatedChat, ...newChatList]);

  setCurrentChat(updatedChat);
}

  useEffect(()=>{
    if(!isLogin()){
      console.log("认证失败");return;}else{
    getChatList().then((res)=>{
      if(!res){
        message.error("获取对话列表失败");
        return;
      }
      setChatList(res.chats.sort((a,b)=>a.time>b.time?-1:1));
    });}
  },[]);

  useEffect(()=>{
    console.log("currentChat在useEffect中的值",currentChat);
    setMessages([]);
    if(currentChat){
      getMessage(currentChat).then((res)=>{
        setMessages(res.messages);
      });
    }
  },[currentChat]);

  


    return (
    <div>
      <div className={`sidebar ${fold ? "sidebar--folded" : "sidebar--unfolded"}`}>
        <div className={`sidebar-toggle ${fold ? "sidebar-toggle--folded" : "sidebar-toggle--unfolded"}`}>
          <Button onClick={() => setFold(!fold)}></Button>
        </div>
        {!fold && (
          <>
            <ChatList
              chatList={chatList}
              currentChat={currentChat}
              isLogin={isLogin()}
              onSelectChat={onSelectChat}
              onAdd={addChat}
              onDelete={deleteChat}
              onEdit={renameChat}
            />
            <ChatContent
              currentChat={currentChat}
              isLogin={isLogin()}
              messages={messages}
              isSending={isSending}
              onSend={sendMessage}
              stopGet={terminateMessage}
            />
          </>
        )}
      </div>
    </div>
  );


}

