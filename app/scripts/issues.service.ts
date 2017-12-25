import { Constant } from './constant';
import { storageUtil } from './storage-util';


/**
 * Issue画面初期化時の処理で
 * DOM操作以外をまとめたサービスクラス.
 */
class IssueService {

  /**
   * 指定したissueの作業量を取得する.
   *
   * @param issueIds issue番号の配列
   */
  fetchIssueEstimations(issueIds: Array<number>): Promise<Array<any>> {
    return storageUtil
          .getOptions()
          .then(({serverUrl}) => {
            return $.ajax(`${serverUrl}/api/v3/repos/${this.owner()}/${this.repository()}/issues`, {
              data: JSON.stringify({
                'issueId': issueIds,
              }),
              dataType: 'json',
              method: 'GET'
            });
          });
  }

  /**
   * URLからリポジトリ所有者を取得する.
   */
  private owner(): string {
    return location.pathname.replace('/issues', '').split('/')[1];
  }

  /**
   * URLからリポジトリを取得する.
   */
  private repository(): string {
    return location.pathname.replace('/issues', '').split('/')[2];
  }
}

const issueService = new IssueService();
export { issueService };

