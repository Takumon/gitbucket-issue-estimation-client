import { Constant } from './constant';
import { storageUtil } from './storage-util';


/** イシュー詳細画面のURLパターン */
const ISSUE_DETAIL_URL_PATTERN = /^\/(.*?)\/(.*?)\/issues\/(\d+)$/;

/**
 * イシュー詳細画面初期化時の処理で
 * DOM操作以外をまとめたサービスクラス.
 */
class IssueService {

  /**
   * 現在開いている画面がマイルストーン画面か判定する.
   */
  isTargetUrl(): boolean {
    return ISSUE_DETAIL_URL_PATTERN.test(location.pathname);
  }


  /**
   * issueの作業量を取得する.
   *
   * @param issueId issue番号
   */
  fetchIssueEstimation(): Promise<any> {
    return storageUtil
          .getOptions()
          .then(({serverUrl}) => {
            return $.ajax(`${serverUrl}/api/v3/repos/${this.owner()}/${this.repository()}/issues/${this.issueId()}`, {
              dataType: 'json',
              method: 'GET'
            });
          });
  }


  /**
   * issueの作業量を登録または更新する.
   *
   * @param estimation 作業量
   */
  upsertEstimation(estimation: number): Promise<any> {
    return $.ajax(`http://localhost:3000/api/v3/repos/${this.owner()}/${this.repository()}/issues/${this.issueId()}`, {
      data: {
        issueId: this.issueId(),
        estimation
      },
      dataType: 'json',
      method: 'PUT'
    });
  }

  /**
   * issueの作業量を削除する.
   *
   */
  deleteEstimation(): Promise<any> {
    return $.ajax(`http://localhost:3000/api/v3/repos/${this.owner()}/${this.repository()}/issues/${this.issueId()}`, {
      dataType: 'json',
      method: 'DELETE'
    });
  }


  /**
   * URLからリポジトリ所有者を取得する.
   */
  private owner(): string {
    const matchResult = location.pathname.match(ISSUE_DETAIL_URL_PATTERN);
    return matchResult ? matchResult[1] : '';
  }

  /**
   * URLからリポジトリを取得する.
   */
  private repository(): string {
    const matchResult = location.pathname.match(ISSUE_DETAIL_URL_PATTERN);
    return matchResult ? matchResult[2] : '';
  }

  /**
   * URLからイシュー番号を取得する.
   */
  public issueId(): string {
    const matchResult = location.pathname.match(ISSUE_DETAIL_URL_PATTERN);
    return matchResult ? matchResult[3] : '';
  }


}

const issueService = new IssueService();
export { issueService };
