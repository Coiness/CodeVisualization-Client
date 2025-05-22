import { post } from "./request";
import { getAccount, getToken } from "./token";

// 定义消息类型
export interface MessageInfo {
  chat_id: string;
  role: string; // 'system' | 'user' | 'assistant'
  content: string;
  sequence_number: number;
  timestamp: number;
}

interface Chat {
  chat_id: string;
  title: string;
  time: string;
}

// 定义接收消息的响应结构
export interface GetMessageResponseData {
  messages: MessageInfo[];
}

// 获取消息，返回的消息按照id排序，role排序
export async function getMessage(currentChat: Chat): Promise<GetMessageResponseData> {
  const chat_id = currentChat.chat_id;
  const token = getToken();
  const account = getAccount();
  const url = `http://localhost:12345/message/get`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token!,
        account: account!,
        chat_id: chat_id,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("请求失败");
    }

    const responseData = await response.json();

    //添加防御性检查
    if (!responseData || !responseData.data || !Array.isArray(responseData.data)) {
      console.log("接口返回格式不符:", responseData);
      return { messages: [] };
    }

    const data = responseData.data;

    const sortedMessages = data.sort((a: MessageInfo, b: MessageInfo) => {
      if (a.sequence_number === b.sequence_number) {
        return a.role === "user" ? -1 : 1;
      }
      return a.sequence_number - b.sequence_number;
    });

    return { messages: sortedMessages };
  } catch (err) {
    console.error(err);
    return { messages: [] };
  }
}

export interface MessageResponse {
  uuid: string;
  sources: any[];
  type: "textResponseChunk";
  textResponse: string;
  close: boolean;
  error: boolean;
}

export interface SendMessageParams {
  content: string;
  chat_id: string;
  onMessage: (text: string) => void;
  onComplete: () => void;
  onError: (error: string) => void;
}

export class MessageService {
  private static readonly API_URL = "http://localhost:12345/message/send";

    static async sendMessage({ content, chat_id, onMessage, onComplete, onError }: SendMessageParams): Promise<void> {
    // 创建 AbortController 用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 设置 60 秒超时
      
    try {
      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connection": "keep-alive", // 明确指定保持连接
          "token": getToken() || "", // 添加令牌
        },
        body: JSON.stringify({ content, chat_id, account: getAccount() }),
        credentials: "include", // 启用凭据
        signal: controller.signal, // 添加 AbortController 信号
        keepalive: true, // 保持连接活跃
      });
  
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }
  
      await this.handleSSEResponse(response, onMessage, onComplete, onError);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        onError("请求超时，请重试");
      } else {
        onError(error instanceof Error ? error.message : "未知错误");
      }
    } finally {
      clearTimeout(timeoutId); // 清理超时计时器
    }
  }

  private static async handleSSEResponse(
    response: Response,
    onMessage: (text: string) => void,
    onComplete: () => void,
    onError: (error: string) => void,
  ): Promise<void> {

    // 获得响应流
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("无法读取响应流");
    }

    // 设置解码器与缓冲区
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      // 循环读取数据流
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 解码和缓冲处理
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        // 解析和处理SSE数据
        for (const line of lines) {
          // js的trim方法会去掉字符串两端的空格
          const trimmed = line.trim();
          // 过滤掉空行和非数据行
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          try {
            /**
             * 原始SSE数据流
             * data:{"type":"textResponseChunk","textResponse":"你好","close":false,"error":false}
             * slice(5)去掉前缀"data: "
             * {type: "textResponseChunk", textResponse: "你好", close: false, error: false}
             * 解析JSON为JS对象
             * {
             * type: "textResponseChunk",
             * textResponse: "你好",
             * close: false,
             * error: false}
             */
            const data: MessageResponse = JSON.parse(trimmed.slice(5).trim());

            if (data.error) {
              onError("服务器返回错误");
              return;
            }

            if (data.type === "textResponseChunk") {
              if (data.textResponse) {
                onMessage(data.textResponse);
              }
              if (data.close) {
                onComplete();
                return;
              }
            }
          } catch (error) {
            console.error("解析响应数据失败:", error);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

export async function terminatemessage(chat_id: string): Promise<boolean> {
  let res = await post("/message/terminate", { chat_id });
  return res.flag;
}
