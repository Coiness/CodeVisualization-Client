import { get, post } from "./request";

// 定义消息类型
export interface MessageInfo {
  id: number;
  content: string;
  role: "user" | "assistant";
}

interface Chat {
  id: string;
  name: string;
  time: string;
}

// 定义接收消息的响应结构
export interface GetMessageResponseData {
  messages: MessageInfo[];
}

// 获取消息，返回的消息按照id排序，role排序
export async function getMessage(currentChat: Chat): Promise<GetMessageResponseData> {
  let res = await get("message/get", { currentChat });
  return res.data.sort((a: MessageInfo, b: MessageInfo) => {
    if (a.id !== b.id) {
      return a.id - b.id;
    } else {
      if (a.role === b.role) {
        return 0;
      } else if (a.role === "user") {
        return -1;
      } else {
        return 1;
      }
    }
  });
}

// 发送消息
//todo: 实现流式传输
export async function sendmessage(content: string, id: string) {
  let res = await post("message/send", { content });
  return res.flag;
}

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
  try {
    const response = await fetch("http://localhost:12345/message/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
