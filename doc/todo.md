## P0
- 功能完整性
  - 删除作品弹框确认

## P1
- API 扩展
  - 增加画布大小设置
  - 增加开始录制节点
- Widget 扩展
  - 新增 树节点 Widget 
- 功能补全
  - 拖拽创建 Widget

## P2
- 多人协同
  - 服务端协同会报错
  - snapshot 增加版本控制
- Web 编辑器 API 代码提示
- 信息通知栏
- add widget action 增加回放动画
- bugfix
  - markdown 编辑器工具栏图标加载失败 (一个字体 css 文件加载失败，暂时通过隐藏工具栏回避问题)
- 重构
  - 动画 next 时，先执行 commit 后执行动画，不在 stop 中 commit