import { Constant } from './constant';
import { storateUtil } from './storage-util';

$(() => {
  const $titles = $('.milestone-title');
  if (!$titles || $titles.length === 0) return;

  // Gitbucketサーバからマイルストーンにひもづくissueを全県取得
  Array.from($titles,  title => {
    const milestoneName = $(title).text();
    const $progressArea = $(title).parent().next();
    $progressArea.prepend('<h6 class="progress-title_count">Count</h6>');

    Promise.resolve()
    .then(() => {

      return Promise.all([
        findIssuesBy(milestoneName, 'open').then(addEstimation),
        findIssuesBy(milestoneName, 'closed').then(addEstimation),
      ]);
    })
    .then(issues => {
      const openEstimation = sumEstimation(issues[0]);
      const closedEstimation = sumEstimation(issues[1]);

      $progressArea.prepend(createIssueEstimationProgress(openEstimation, closedEstimation));
    });
  });
});


function createIssueEstimationProgress(openIssueEstimation: number, closedIssueEstimation: number): string {

  const closedIssueRate = openIssueEstimation + closedIssueEstimation === 0
                            ? 0
                            : Math.round(closedIssueEstimation / (openIssueEstimation + closedIssueEstimation) * 100);

  return `
    <h6 class="progress-title_estimation">Estimation</h6>
    <div class="progress" style="height: 12px; margin-bottom: 8px;">
      <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="${closedIssueRate}" aria-valuemin="0" aria-valuemax="100" style="width: 6%">
      </div>
    </div>

    <div class="progress-detial_estimation">
      <div>
        ${closedIssueRate}%<span class="muted">complete</span> &nbsp;&nbsp;
        ${openIssueEstimation}<span class="muted">open</span> &nbsp;&nbsp;
        ${closedIssueEstimation} <span class="muted">closed</span>
      </div>
    </div>`;
}


/**
 * 指定した数値配列の合計値を取得する
 *
 * @param numberArray 数値配列
 */
function sumEstimation(issues: Array<any>): number {
  return issues
    .map(i => i.estimation)
    .reduce((a, b) => a + b, 0);
}

/**
 * 指定したissueに対して作業量をプロパティとして追加する
 *
 * @param issues
 */
function addEstimation(issues: Array<any>): Promise<Array<any>> {
  const issueIds: Array<number> = Array.from(issues,  (issue: any ) => {
    return issue.number;
  });

  return findEstimationsBy(issueIds)
  .then((estimations: Array<any>) => {
    // issueのリストに取得した作業量を設定する
    Array.from(issues, issue => {
      issue.estimation = findEstimation(estimations, issue.number);
    });

    return issues;
  });
}


function calcProgressive(issues: Array<any>) {
  console.log(issues);
}

/**
 * 指定したissueIdのリストにひもづく作業量を取得する
 *
 * @param issueIds issueIdのリスト
 */
function findEstimationsBy(issueIds: Array<number>): Promise<Array<any>> {
  return storateUtil.getServiceInfo().then(({serverUrl, tokenKey}) => {

    const condition = JSON.stringify({
      'issueId': issueIds,
    });

    return $.ajax(`${serverUrl}/api/v3/repos/${owner()}/${repository()}/issues`, {
      data: { condition },
      dataType: 'json',
      method: 'GET'
    });
  });
}




/**
 * 指定したマイルストーンに紐付く全てのissueを取得する
 *
 * @param milestoneName マイルストーン名
 * @param state 検索するissueのstate
 */
function findIssuesBy(milestoneName: string, state: 'open' | 'closed'): Promise<Array<any>> {
  return _findIssuesBy(milestoneName, state, 1);

}
/**
 * 指定したマイルストーンに紐付くissueを、指定したページ(1ページあたり25件)分取得する
 *
 * @param milestoneName マイルストーン名
 * @param state 検索するissueのstate
 * @param pageIndex ページ番号(1始まり)
 */
function _findIssuesBy(milestoneName: string, state: 'open' | 'closed', pageIndex: number ): Promise<Array<any>> {
  return storateUtil.getServiceInfo().then(({serverUrl, tokenKey}) => {

    return $.ajax(`${location.origin}/api/v3/repos/${owner()}/${repository()}/issues?state=${state}&page=${pageIndex}&milestone=${milestoneName}`, {
      headers: {
        Authorization: 'token ' + tokenKey,
      },
      dataType: 'json',
      method: 'GET'
    })
    .then(function(issuesPerPage) {
      // 1ページあたりの件数を超えない場合はこのページで全件取得したことになるので
      // 再起処理終了
      if (issuesPerPage.length < Constant.PER_PAGE_COUNT) {
        return issuesPerPage;
      }

      // 1ページあたりの件数いっぱいの場合は次ページも存在するかもしれないので
      // 再帰的に次ページのissueを取得する
      return _findIssuesBy(milestoneName, state, pageIndex + 1).then(_issuesPerPage => issuesPerPage.concat(_issuesPerPage));
    });

  });

}

/**
 * URLからリポジトリ所有者を取得する
 */
function owner(): string {
  return location.pathname.replace('/milestones', '').split('/')[1];
}

/**
 * URLからリポジトリを取得する
 */
function repository(): string {
  return location.pathname.replace('/milestones', '').split('/')[2];
}



/**
 * 指定した作業量リストから指定したissueIdの作業量を見つけて返す.
 *
 * @param estimations 作業量リスト
 * @param issueId issueのId
 * @return 指定したissueIdの作業量.見つからない場合は{@link Config.DEFAULT_VALUE_OF_NO_ESTIOMATION_ISSUE}を返す
 */
function findEstimation(estimations: Array<any>, issueId: number ): number {
  for (let i = 0, len = estimations.length; i < len; i++) {
    const estimation = estimations[i];
    if (issueId === estimation.issueId) {
      return estimation.estimation;
    }
  }

  return Constant.DEFAULT_VALUE_OF_NO_ESTIOMATION_ISSUE;
}