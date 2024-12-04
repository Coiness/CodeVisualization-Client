import { message, Modal } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { readUploadFileContent } from "../../common/utils";
import { createAlgorithm, createProject, createVideo } from "../../net";
import { DownAlgorithmInfo } from "../../view/algorithmEdit";
import { closeDialog } from "../../view/dialogs/dialog";
import { DownloadProjectInfo } from "../../view/project";
import { DownloadVideoInfo } from "../../view/videoPlay";
import { Loading } from "../loading";

export enum FileType {
  Project = "Project",
  Video = "Video",
  Algorithm = "Algorithm",
}

export const FileEndNameMap: Record<FileType, string> = {
  [FileType.Project]: "davp",
  [FileType.Video]: "davv",
  [FileType.Algorithm]: "dava",
};

export function UploadFileDialog(visible: boolean, type: FileType) {
  const [uploading, setUploading] = useState<boolean>(false);
  const navigate = useNavigate();

  const closePanel = useCallback(() => {
    closeDialog("uploadFileDialog");
  }, []);

  const upload = useCallback(
    async (data: string) => {
      let flag = false;
      try {
        let json = JSON.parse(data);
        if (type === FileType.Project) {
          let pData = json as DownloadProjectInfo;
          let id = await createProject(pData.name, JSON.stringify(pData.snapshot), pData.description);
          navigate(`/project?id=${id}`);
          flag = true;
        } else if (type === FileType.Video) {
          let vData = json as DownloadVideoInfo;
          let id = await createVideo(vData.name, JSON.stringify(vData.video), vData.description);
          navigate(`/videoPlay?id=${id}`);
          flag = true;
        } else if (type === FileType.Algorithm) {
          let aData = json as DownAlgorithmInfo;
          let id = await createAlgorithm(aData.name, JSON.stringify(aData.content), aData.description);
          navigate(`/algorithmEdit?id=${id}`);
          flag = true;
        } else {
          throw new Error("upload file: fileType error");
        }
      } catch (e) {
        message.error("文件无效");
      } finally {
        setUploading(false);
        if (flag) {
          closePanel();
        }
      }
    },
    [setUploading, closePanel, type, navigate],
  );

  return (
    <Modal open={visible} maskClosable={true} onCancel={closePanel} footer={null} width={400} closable={false}>
      <div className="upload" style={{ height: "400px" }}>
        {!uploading && (
          <Dragger
            name="file"
            multiple={false}
            beforeUpload={async (file) => {
              setUploading(true);
              let data = await readUploadFileContent(file);
              upload(data);
              return false;
            }}
            showUploadList={false}
          >
            请选择文件或拖拽上传
          </Dragger>
        )}
        {uploading && <Loading></Loading>}
      </div>
    </Modal>
  );
}
