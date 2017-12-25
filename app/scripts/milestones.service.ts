import { Constant } from './constant';
import { storageUtil } from './storage-util';

/**
 * マイルストーン画面初期化時の処理で
 * DOM操作以外をまとめたサービスクラス.
 */
class MilestoneService {


  /**
   * 指定した数値配列の合計値を取得する.
   *
   * @param numberArray 数値配列
   */
  sumEstimation(issues: Array<any>): number {
    return issues
      .map(i => i.estimation)
      .reduce((a, b) => a + b, 0);
  }


  /**
   * 指定したissueに対して作業量をプロパティとして追加する.
   *
   * @param issues
   */
  addEstimation(issues: Array<any>): Promise<Array<any>> {
    const issueIds: Array<number> = Array.from(issues,  (issue: any ) => {
      return issue.number;
    });

    return this.findEstimationsBy(issueIds)
              .then((estimations: Array<any>) => {
                // issueのリストに取得した作業量を設定する
                Array.from(issues, issue => {
                  issue.estimation = this.findEstimation(estimations, issue.number);
                });

                return issues;
              });
  }


  /**
   * 指定したマイルストーンに紐付く全てのissueを取得する.
   *
   * @param milestoneName マイルストーン名
   * @param state 検索するissueのstate
   */
  findIssuesBy(milestoneName: string, state: 'open' | 'closed'): Promise<Array<any>> {
    return this._findIssuesBy(milestoneName, state, 1);
  }


  /**
   * 指定したissueIdのリストにひもづく作業量を取得する.
   *
   * @param issueIds issueIdのリスト
   */
  private findEstimationsBy(issueIds: Array<number>): Promise<Array<any>> {
    return storageUtil.getOptions().then(({serverUrl, tokenKey}) => {

      const condition = JSON.stringify({
        'issueId': issueIds,
      });

      return $.ajax(`${serverUrl}/api/v3/repos/${this.owner()}/${this.repository()}/issues`, {
        data: { condition },
        dataType: 'json',
        method: 'GET'
      });
    });
  }


  /**
   * 指定したマイルストーンに紐付くissueを、指定したページ(1ページあたり25件)分取得する.
   *
   * @param milestoneName マイルストーン名
   * @param state 検索するissueのstate
   * @param pageIndex ページ番号(1始まり)
   */
  private _findIssuesBy(milestoneName: string, state: 'open' | 'closed', pageIndex: number ): Promise<Array<any>> {
    const self = this;
    return storageUtil.getOptions().then(({serverUrl, tokenKey}) => {

      return $.ajax(`${location.origin}/api/v3/repos/${this.owner()}/${this.repository()}/issues?state=${state}&page=${pageIndex}&milestone=${milestoneName}`, {
        headers: {
          Authorization: 'token ' + tokenKey,
        },
        dataType: 'json',
        method: 'GET'
      })
      .then((issuesPerPage) => {
        // 1ページあたりの件数を超えない場合はこのページで全件取得したことになるので
        // 再起処理終了
        if (issuesPerPage.length < Constant.PER_PAGE_COUNT) {
          return issuesPerPage;
        }

        // 1ページあたりの件数いっぱいの場合は次ページも存在するかもしれないので
        // 再帰的に次ページのissueを取得する
        return self._findIssuesBy(milestoneName, state, pageIndex + 1)
                   .then( (_issuesPerPage: Array<any>) => issuesPerPage.concat(_issuesPerPage));
      });
    });
  }


  /**
   * URLからリポジトリ所有者を取得する.
   */
  private owner(): string {
    return location.pathname.replace('/milestones', '').split('/')[1];
  }

  /**
   * URLからリポジトリを取得する.
   */
  private repository(): string {
    return location.pathname.replace('/milestones', '').split('/')[2];
  }


  /**
   * 指定した作業量リストから指定したissueIdの作業量を見つけて返す.
   *
   * @param estimations 作業量リスト
   * @param issueId issueのId
   * @return 指定したissueIdの作業量.見つからない場合は{@link Config.DEFAULT_VALUE_OF_NO_ESTIOMATION_ISSUE}を返す
   */
  private findEstimation(estimations: Array<any>, issueId: number ): number {
    for (let i = 0, len = estimations.length; i < len; i++) {
      const estimation = estimations[i];
      if (issueId === estimation.issueId) {
        return estimation.estimation;
      }
    }

    return Constant.DEFAULT_VALUE_OF_NO_ESTIOMATION_ISSUE;
  }
}

const milestoneService = new MilestoneService();
export { milestoneService };
