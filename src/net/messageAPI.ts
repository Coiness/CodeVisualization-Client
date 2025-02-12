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
  let res = await get("message/get", { currentChat });
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

interface StreamChunk {
  uuid: string;
  type: string;
  textResponse?: string;
  close: boolean;
  error: boolean;
}

export async function sendMessageStream(
  content: string,
  onChunk: (text: string) => void,
  onFinish: () => void,
  onError: (err: string) => void,
) {
  const token = getToken();
  const account = getAccount();

  if (token === null || account === null) {
    onError("未登录");
    return;
  }

  try {
    document.cookie = "account=" + account;
    const response = await fetch("http://localhost:12345/message/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
        account: account,
      },
      body: JSON.stringify({ content }),
    });

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
}
