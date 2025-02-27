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
import {getChatList,renamechat,deletechat,getMessage,MessageService,addchat} from"../../net"
import { isLogin } from "../../net/token";

//toDo：判断是否登录，如果没有登录，提示登录

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
    console.log("删除对话",res);
    if (res) {
      const newChatList = chatList.filter((chat) => chat.id !== id);
      if(currentChat?.id === id){
        setCurrentChat(currentChat);
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
  
  // 使用示例
  const sendMessage = async (content: string) => {
  if (!currentChat) return;
  
  // 1. 创建并添加用户消息
  const userMessage: Message = {
    id: messages.length,
    role: "user",
    content
  };
  
  // 2. 创建空的助手消息占位
  const assistantMessage: Message = {
    id: messages.length + 1,
    role: "assistant",
    content: ""  // 初始为空
  };
  
  // 3. 将两条消息添加到数组
  setMessages([...messages, userMessage, assistantMessage]);
  
  // 4. 开始发送请求
  setIsSending(true);
  
  await MessageService.sendMessage({
    content,
    slug: currentChat.id,
    onMessage: (text) => {
      // 5. 收到消息时更新助手消息内容
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === assistantMessage.id
            ? { ...msg, content: msg.content + text }
            : msg
        )
      );
    },
    onComplete: () => {
      setIsSending(false);
      console.log('会话完成');
    },onError: (err) => {
      setIsSending(false);
      console.log('会话失败', err);
    }
  });
};



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
              onSelectChat={setCurrentChat}
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
              stopGet={() => {}}
            />
          </>
        )}
      </div>
    </div>
  );


}

