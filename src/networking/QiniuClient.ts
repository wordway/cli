import * as qiniu from 'qiniu'

class QiniuClient {
  public upload(
    uploadToken: string,
    filekey: string,
    filepath: string,
  ): Promise<any> {
    var uploaderConfig = new qiniu.conf.Config()

    var uploader = new qiniu.form_up.FormUploader(uploaderConfig)
    var putExtra = new qiniu.form_up.PutExtra()

    return new Promise((resolve, reject) => {
      const callback = (respErr, respBody, respInfo) => {
        if (respErr) {
          reject(respErr);
        }
        if (respInfo.statusCode == 200) {
          resolve(respBody);
        } else {
          let error: any = new Error('Unknown error.');
          error.respInfo = respInfo;
          error.respBody = respBody;
          reject(error)
        }
      }

      uploader.putFile(
        uploadToken,
        filekey,
        filepath,
        putExtra,
        callback
      );
    });
  }
}

export default QiniuClient;
