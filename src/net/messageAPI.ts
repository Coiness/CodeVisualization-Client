import { post } from "./request";
import { getAccount, getToken } from "./token";

// 定义消息类型
export interface MessageInfo {
  chatId: number;
  content: string;
  role: "user" | "assistant";
}

interface Chat {
  id: string;
  title: string;
  time: string;
}

// 定义接收消息的响应结构
export interface GetMessageResponseData {
  messages: MessageInfo[];
}

// 获取消息，返回的消息按照id排序，role排序
export async function getMessage(currentChat: Chat): Promise<GetMessageResponseData> {
  const slug = currentChat.id;
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
        slug: slug,
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
      if (a.chatId === b.chatId) {
        return a.role === "user" ? -1 : 1;
      }
      return a.chatId - b.chatId;
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
  slug: string;
  onMessage: (text: string) => void;
  onComplete: () => void;
  onError: (error: string) => void;
}

export class MessageService {
  private static readonly API_URL = "http://localhost:12345/message/send";

  static async sendMessage({ content, slug, onMessage, onComplete, onError }: SendMessageParams): Promise<void> {
    try {
      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, slug, account: getAccount() }),
      });

      if (!response.ok) {
        throw new Error("请求失败");
      }

      await this.handleSSEResponse(response, onMessage, onComplete, onError);
    } catch (error) {
      onError(error instanceof Error ? error.message : "未知错误");
    }
  }

  private static async handleSSEResponse(
    response: Response,
    onMessage: (text: string) => void,
    onComplete: () => void,
    onError: (error: string) => void,
  ): Promise<void> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("无法读取响应流");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          try {
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

export async function terminatemessage(slug: string): Promise<boolean> {
  let res = await post("/message/terminate", { slug });
  return res.flag;
}
