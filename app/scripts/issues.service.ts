import { Constant } from './constant';
import { storageUtil } from './storage-util';


/** イシュー一覧画面のURLパターン */
const ISSUES_URL_PATTERN = /^\/(.*?)\/(.*?)\/issues$/;


/**
 * イシュー一覧画面初期化時の処理で
 * DOM操作以外をまとめたサービスクラス.
 */
class IssuesService {

  /**
   * 現在開いている画面がイシュー一覧画面か判定する.
   */
  isTargetUrl(): boolean {
    return ISSUES_URL_PATTERN.test(location.pathname);
  }

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
   * 指定したイシュー番号の作業量を登録または更新する.
   *
   * @param issueId イシュー番号
   * @param estimation 作業量
   */
  upsertEstimation(issueId: number, estimation: number): Promise<any> {
    return storageUtil
          .getOptions()
          .then(({serverUrl}) => {
            return $.ajax(`${serverUrl}/api/v3/repos/${this.owner()}/${this.repository()}/issues/${issueId}`, {
              data: {
                issueId,
                estimation
              },
              dataType: 'json',
              method: 'PUT'
            });
          });
  }

  /**
   * 指定したイシュー番号の作業量を削除する.
   *
   * @param issueId イシュー番号
   */
  deleteEstimation(issueId: number): Promise<any> {
    return storageUtil
          .getOptions()
          .then(({serverUrl}) => {
            return $.ajax(`${serverUrl}/api/v3/repos/${this.owner()}/${this.repository()}/issues/${issueId}`, {
              dataType: 'json',
              method: 'DELETE'
            });
          });
  }

  /**
   * URLからリポジトリ所有者を取得する.
   */
  private owner(): string {
    const matchResult = location.pathname.match(ISSUES_URL_PATTERN);
    return matchResult ? matchResult[1] : '';
  }

  /**
   * URLからリポジトリを取得する.
   */
  private repository(): string {
    const matchResult = location.pathname.match(ISSUES_URL_PATTERN);
    return matchResult ? matchResult[2] : '';
  }
}

const issuesService = new IssuesService();
export { issuesService };

