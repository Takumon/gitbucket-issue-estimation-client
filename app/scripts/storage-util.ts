/** ストレージのデフォルト値(gitbucket-issue-estimation-serverのURL) */
const DEFAULT_VALUE_OF_SERVER_URL: string = 'You must set Server Url. For Exsample, http://127.0.0.1:3000';

/** ストレージのデフォルト値(GitBucketAPIの認証トークン) */
const DEFAULT_VALUE_OF_GITBUCKET_TOCKEN: string = 'You must set GitBucket TokenKey';

/**
 * ストレージ操作をまとめたユーティル.
 */
class StorageUtil {

  /**
   * ストレージにオプションを設定.
   *
   * @param serverUrl gitbucket-issue-estimation-serverのURL
   * @param tokenKey GitBucketのトークンキー
   */
  setOptions(serverUrl: string, tokenKey: string): Promise<any> {
    return new Promise(function(resolve, reject) {
      chrome.storage.sync.set({
        serverUrl, tokenKey
      }, () => {
        resolve();
      });
    });
  }

  /**
   * ストレージからオプションを取得.
   */
  getOptions(): Promise<{serverUrl: string, tokenKey: string}> {
    return new Promise(function(resolve, reject) {

      chrome.storage.sync.get({
        serverUrl: DEFAULT_VALUE_OF_SERVER_URL,
        tokenKey: DEFAULT_VALUE_OF_GITBUCKET_TOCKEN
      }, (items) => {
        resolve({
          serverUrl: items.serverUrl,
          tokenKey: items.tokenKey
        });
      });
    });
  }
}

export const storageUtil = new StorageUtil();