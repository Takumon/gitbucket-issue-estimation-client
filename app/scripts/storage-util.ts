class StorateUtil {
    /** ストレージキー名(gitbucket-issue-estimation-serverのURL) */
    private KEY_OF_SERVER_URL = 'serverUrl';

    /** ストレージキー名(GitBucketAPIの認証トークン) */
    private KEY_OF_GITBUCKET_TOKEN = 'tokenKey';

    /** ストレージのデフォルト値(gitbucket-issue-estimation-serverのURL) */
    private DEFAULT_VALUE_OF_SERVER_URL: string = 'You must set Server Url. For Exsample, http://127.0.0.1:3000';

    /** ストレージのデフォルト値(GitBucketAPIの認証トークン) */
    private DEFAULT_VALUE_OF_GITBUCKET_TOCKEN: string = 'You must set GitBucket TokenKey';
    // public static DEFAULT_VALUE_OF_GITBUCKET_TOCKEN_KEY: string = 'b7f696143f1fdf9d546607ca537a9c0deba4ba5d';


  setServiceInfo(serverUrl: string, tokenKey: string): Promise<any> {
    return new Promise(function(resolve, reject) {
      chrome.storage.sync.set({
        serverUrl, tokenKey
      }, () => {
        resolve();
      });
    });
  }

  getServiceInfo(): Promise<{serverUrl: string, tokenKey: string}> {
    return new Promise(function(resolve, reject) {

      chrome.storage.sync.get({
        serverUrl: this.DEFAULT_VALUE_OF_SERVER_URL,
        tokenKey: this.DEFAULT_VALUE_OF_GITBUCKET_TOCKEN
      }, (items) => {
        resolve({
          serverUrl: items.serverUrl,
          tokenKey: items.tokenKey
        });
      });
    });
  }
}

export const storateUtil = new StorateUtil();