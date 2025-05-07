/*设计组件aiAssistant
1.组件本身需要可折叠
2.作为父组件，需要管理子组件chatList和chatContent
3.传送的props：chatList，currentChat，Messages，isSending,onEdit，onDelete，onAdd，onSend，stopGet
*/

import { useEffect, useState ,useCallback,useRef} from "react";
import {  throttle } from "lodash";
import { message } from "antd";
import "./index.css";
import ChatList from "../../components/chatList";
import ChatContent from "../../components/chatContent";
import { Button } from "antd";
import {getChatList,renamechat,deletechat,getMessage,MessageService,addchat,terminatemessage} from"../../net"
import { isLogin } from "../../net/token";


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
  const messageBufferRef = useRef("");
  const bufferTimerRef = useRef<NodeJS.Timeout | null>(null);


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
  
  //创建节流更新函数
  //useCallback用于创建一个记忆化的函数，避免在每次渲染时都创建新的函数实例
  const updateMessageWithThrottle = useCallback((assistantId:number,text:string) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.chatId === assistantId
          ? { ...msg, content: msg.content + text }
          : msg
      )
    )
  },[]);

  //使用useRef来存储节流函数的引用
  const throttledUpdate = useRef(
    throttle((assistantId:number,text:string) => {
      updateMessageWithThrottle(assistantId,text);
    },100)
  ).current;

  const sendMessage = async (content: string) => {
    if (!currentChat) return;
    
    // 重置状态和清空缓冲区
    messageBufferRef.current = "";
    if (bufferTimerRef.current) {
      clearInterval(bufferTimerRef.current);
      bufferTimerRef.current = null;
    }
    
    // 创建消息对象
    const userMessage: Message = {
      chatId: messages.length,
      role: "user",
      content
    };
    
    const assistantMessage: Message = {
      chatId: messages.length + 1,
      role: "assistant",
      content: "正在生成内容，请稍后..." // 添加等待提示
    };
    
    setMessages([...messages, userMessage, assistantMessage]);
    setIsSending(true);
    
    // 重试机制
    let retries = 0;
    const maxRetries = 3;
    let isFirstChunk = true; // 标记是否是第一块内容
    
    const attemptSend = async () => {
      try {
        await MessageService.sendMessage({
          content,
          slug: currentChat.id,
          onMessage: (text) => {
            // 如果是首次收到消息，清除等待提示
            if (isFirstChunk) {
              setMessages(prevMessages =>
                prevMessages.map(msg =>
                  msg.chatId === assistantMessage.chatId
                    ? { ...msg, content: "" } // 清除等待提示
                    : msg
                )
              );
              isFirstChunk = false;
            }
            
            // 积累文本到缓冲区
            messageBufferRef.current += text;
  
            // 如果没有活跃的计时器，创建一个
            if(!bufferTimerRef.current){
              bufferTimerRef.current = setInterval(() => {
                // 如果有缓冲内容
                if(messageBufferRef.current){
                  const bufferedText = messageBufferRef.current;
                  throttledUpdate(assistantMessage.chatId, bufferedText);
                  messageBufferRef.current = ""; // 确保每次处理后清空
                }
              }, 100);
            }
          },
          onComplete: () => {
            if(bufferTimerRef.current){
              clearInterval(bufferTimerRef.current);
              bufferTimerRef.current = null;
            }
  
            // 确保处理最后的缓冲内容
            if(messageBufferRef.current){
              setMessages(prev => prev.map(msg =>
                msg.chatId === assistantMessage.chatId
                  ? { ...msg, content: isFirstChunk 
                      ? "服务器无响应" // 如果完全没有收到内容
                      : msg.content + messageBufferRef.current } 
                  : msg
              ));
              messageBufferRef.current = ""; // 清空缓冲区
            }
            moveCurrentChatToTop();
            setIsSending(false);
            console.log('会话完成');
          },
          onError: (err) => {
            console.log('会话出错:', err);
            // 错误时也要清空缓冲区
            messageBufferRef.current = "";
            
            if (retries < maxRetries) {
              retries++;
              console.log(`尝试第 ${retries} 次重连...`);
              attemptSend();
            } else {
              // 在多次重试失败后，显示错误信息
              setMessages(prev => prev.map(msg =>
                msg.chatId === assistantMessage.chatId
                  ? { ...msg, content: "生成失败，请重试。" } 
                  : msg
              ));
              setIsSending(false);
              message.error(`会话失败，已重试 ${maxRetries} 次`);
            }
          }
        });
      } catch (error) {
        console.error("发送消息异常:", error);
        // 异常时也要清空缓冲区
        messageBufferRef.current = "";
        
        // 更新最后一条消息为错误提示
        setMessages(prev => prev.map(msg =>
          msg.chatId === assistantMessage.chatId
            ? { ...msg, content: "发送消息失败，请重试。" } 
            : msg
        ));
        
        setIsSending(false);
        message.error("发送消息时发生异常");
      }
    };
    
    await attemptSend();
  };
  
 const terminateMessage = async () => {
  console.log("stopGet");
  
  // 首先清理前端状态和定时器
  if (bufferTimerRef.current) {
    clearInterval(bufferTimerRef.current);
    bufferTimerRef.current = null;
  }
  
  // 处理缓冲区剩余内容
  if (messageBufferRef.current && isSending) {
    const lastMessage = messages.find(msg => msg.role === "assistant");
    if (lastMessage) {
      setMessages(prev => prev.map(msg => 
        msg.chatId === lastMessage.chatId 
          ? { ...msg, content: msg.content + messageBufferRef.current + "\n\n[消息已终止]" } 
          : msg
      ));
    }
    messageBufferRef.current = "";
  }
  
  // 然后再通知后端
  if (isSending && currentChat) {
    try {
      const res = await terminatemessage(currentChat.id);
      if (res) {
        console.log("终止成功");
      } else {
        console.log("终止请求返回失败");
      }
    } catch (error) {
      console.error("终止请求出错:", error);
    } finally {
      setIsSending(false);
    }
  }
};

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

  // 添加到组件中，确保在卸载时清理资源
  useEffect(() => {
    return () => {
      if (bufferTimerRef.current) {
        clearInterval(bufferTimerRef.current);
        bufferTimerRef.current = null;
      }
      
      // 清理节流函数
      if (throttledUpdate.cancel) {
        throttledUpdate.cancel();
      }
    };
  },[]);
  


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

