/*设计chatList组件
首先是状态管理，这里使用useState来管理chatList的展开折叠和currentChat
折叠状态下，chatList显示当前对话的名字，点击后展开，显示所有对话（包括当前对话）
展开状态下，点击对话，切换currentChat。点击对话旁边的按钮，修改对话名字或者删除对话
这个按钮应该是点击后弹出选项，包括修改名字和删除对话
组件的props是chatList和currentChat，chatList是一个Chat数组，currentChat是一个Chat
*/

import { MenuFoldOutlined, MenuUnfoldOutlined,DeleteOutlined,EditOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Modal ,Button} from 'antd';
import "./index.css";

export interface Chat{
    id: string;
    name: string;
    time: string;
}

interface Props{
    chatList: Chat[];
    currentChat: Chat|null;
    onEdit: (id: string, newName: string) => void;
    onDelete: (id: string) => void;
    onAdd:()=>void;
}

export default function ChatList(props: Props){
    const [fold, setFold] = useState(true);
    const [currentChat, setCurrentChat] = useState(props.currentChat);

    return(
        <div className={`chatListContainer ${fold?`folder`:``}`}>
            <div className='chatListHeader' onClick={() => setFold(!fold)}>
                {fold ? <MenuFoldOutlined/> : <MenuUnfoldOutlined/>}
                {currentChat?.name||"请选择对话喵"}
            </div>
            <div className='chatListBody'>
                {fold ? null : props.chatList?.map((chat)=>{
                    return (
                        <div className='chatItem' key={chat.id} onClick={() => setCurrentChat(chat)}>{chat.name}-{chat.time}
                        <EditOutlined onClick={(e) => {
                            e.stopPropagation();
                            const newName = prompt("请输入新的名字");
                            if(newName){
                                //调用修改名字的API
                                props.onEdit(chat.id, newName);
                            }
                        }}/>
                        <DeleteOutlined onClick={(e) => {
                            e.stopPropagation();
                            Modal.confirm({
                                title: "删除对话",
                                content: "确定删除对话吗？",
                                okText: "确定",
                                cancelText: "取消",
                                onOk: () => {
                                    //调用删除对话的API
                                    props.onDelete(chat.id);
                                }
                            })
                            }}/>
                    
                        </div>
                    )
                })}
                <div className='addChat' onClick={props.onAdd}>新增对话</div>

            </div>


        </div>
    )
}

/*TODO:
1. 完成EditOutlined和DeleteOutlined的点击事件
2. 完成新增对话的点击事件
3. 完成CSS样式
*/