## 用户操作
* 用户操作
* 操作处创建对应操作的 Action
* Action 中存储操作相关的信息
* Action 内部生成 CS
* 操作处 commit 生成好的 Action
* commit 内部执行 Action 中 cs ，并向服务端发送这个 Action，服务端向其它协作者推送这个 Action
* 执行 cs 时，改变 model，并记录在 history 中，用于 undo、redo 操作
* 改变 model 时，触发 modelChange
* UI 层监听 modelChange 并进行重新渲染

## 录制回放
* 录像可通过用户录制生成，还可以通过开放 API 生成
* 录像由多个 step 组成
* 每个 step 中有多个 action
* 如果通过用户操作生成录像，流程如下
  * 用户点击开始录制后，录像机开始监听 commitAction 事件
  * 当用户操作 commit Action 时，触发 commiteAction 事件
  * 录像机监听到 commitAction 之后，组装成一个仅包含一个 Action 的 step
  * 用户点击结束录制时，录像机输出一个 Video(steps: Step[])
* 如果通过 API 生成录像，流程如下
  * TODO
* 录像播放流程如下
  * 开始播放录像时，更新 snapshot 为录像中 snapshot
  * 每次执行 next 时，一次执行 video.steps 中每一个 step
  * 每执行一个 step，执行其中所有 action.play，并在 play 结束之后执行 action.commit
  * 每次执行 next 时，将上一个 step 中的 action 全部执行 action.stop，执行新的动画时，停止之前的动画
  * action.play 和 action.stop 由 action 内部配合其 UI 层自己实现

## Open API
* 用户输入代码
* 用户代码中调用系统提供的 API 操作画布
* 执行用户代码生成录像
* 切换到录像播放模式