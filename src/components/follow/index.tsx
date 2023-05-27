import { Button, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import * as userAPI from "../../net/userAPI";
import { useAccount } from "../header/userInfo";
import { isLogin } from "../../net/token";
import { openDialog } from "../../view/dialogs/dialog";

export interface FollowProps {
  account: string;
}

interface FollowInfo {
  followed: boolean;
  reverseFollowed: boolean;
}

export function Follow(props: FollowProps) {
  const [info, setInfo] = useState<FollowInfo | null>(null);

  const load = useCallback(() => {
    if (isLogin()) {
      userAPI.getFollowInfo(props.account).then((r) => {
        setInfo({
          ...r,
        });
      });
    } else {
      setInfo({
        followed: false,
        reverseFollowed: false,
      });
    }
  }, [props.account, setInfo]);

  const changeFollow = useCallback(
    (follow: boolean) => {
      if (info === null) {
        return;
      }
      if (!isLogin()) {
        message.info("请先登录");
        openDialog("login");
        return;
      }
      if (follow) {
        setInfo({
          ...info,
          followed: true,
        });
        userAPI.follow(props.account).then((flag) => {
          if (!flag) {
            message.error("关注失败");
            setInfo({
              ...info,
              followed: false,
            });
          }
        });
      } else {
        setInfo({
          ...info,
          followed: false,
        });
        userAPI.cancelfollow(props.account).then((flag) => {
          if (!flag) {
            message.error("取关失败");
            setInfo({
              ...info,
              followed: true,
            });
          }
        });
      }
    },
    [info, setInfo, props.account]
  );

  useEffect(load, [load]);

  if (info === null) {
    return null;
  }

  if (info.followed && info.reverseFollowed) {
    return (
      <Button
        onClick={(e) => {
          e.stopPropagation();
          changeFollow(false);
        }}
      >
        已互关
      </Button>
    );
  } else if (info.followed) {
    return (
      <Button
        onClick={(e) => {
          e.stopPropagation();
          changeFollow(false);
        }}
      >
        已关注
      </Button>
    );
  } else {
    return (
      <Button
        onClick={(e) => {
          e.stopPropagation();
          changeFollow(true);
        }}
        type="primary"
      >
        关注
      </Button>
    );
  }
}
