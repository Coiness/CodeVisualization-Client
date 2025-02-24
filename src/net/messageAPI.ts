import { get, post } from "./request";
import { getAccount, getToken } from "./token";

// 定义消息类型
export interface MessageInfo {
  id: number;
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
  let res = await get("message/get", { slug });
  const sortedMessages = res.data.messages.sort((a: MessageInfo, b: MessageInfo) => {
    if (a.id !== b.id) {
      return a.id - b.id;
    } else {
      return a.role === b.role ? 0 : a.role === "user" ? -1 : 1;
    }
  });
  return { messages: sortedMessages };
}

// 发送消息

// messageAPI.ts

/*
export async function sendMessageStream(
  content: string,
  slug: string,
  onChunk: (text: string) => void,
  onFinish: () => void,
  onError: (err: string) => void,
) {
  console.log("发起请求");
  const token = getToken();
  const account = getAccount();

  if (token === null || account === null) {
    onError("未登录");
    return;
  }

  try {
    console.log("发起请求try");
    document.cookie = "account=" + account;
    const response = await fetch("http://localhost:12345/message/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, slug, account }),
    });
    console.log("send的response", response);

    if (!response.ok) {
      throw new Error("请求失败");
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim() || !line.startsWith("data: ")) continue;

        try {
          const json = JSON.parse(line.slice(5)) as StreamChunk;

          if (json.error) {
            onError("服务器返回错误");
            return;
          }

          if (json.type === "textResponseChunk") {
            if (json.textResponse) {
              onChunk(json.textResponse);
            }
            if (json.close) {
              onFinish();
              return;
            }
          }
        } catch (err) {
          console.error("JSON解析失败:", err);
        }
      }
    }
  } catch (err) {
    onError(String(err));
  }
}*/

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
        body: JSON.stringify({ content, slug }),
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
