# feature

## P0
## P1
- 增加画布大小设置
- 增加开始录制节点
- 新增 树节点 Widget 
- 拖拽创建 Widget
- snapshot 增加版本控制
## P2
- Web 编辑器 API 代码提示
- 信息通知栏
- add widget action 增加回放动画
# bugfix

## P0
- 作品重命名未发送请求
## P1
## P2
- 多人协同，服务端协同会报错
- markdown 编辑器工具栏图标加载失败 (一个字体 css 文件加载失败，暂时通过隐藏工具栏回避问题)
- 逆波兰快速拖动进度条导致 snapshot 乱掉（难以复现）
- 偶现算法点击运行自定义输入弹窗打不开
- 选择排序拖动进度条导致 snapshot 乱掉
- move widget 候如果距离过远可能会导致最终位置偏移（归并排序终小概率复现）
- 代码执行失败报错后，代码执行过程中数据不会被清空，导致下次执行还会存在上次的数据
# refactor

## P0
## P1
## P2
- 动画 next 时，先执行 commit 后执行动画，不在 stop 中 commit