import { Constant } from './constant';
import { storageUtil } from './storage-util';
import { milestoneService } from './milestones.service';

interface IssuesOfMilestone {
  milestoneName: string;
  issues: Array<any>;
}

/**
 * マイルストーン画面の初期化処理
 */
$(() => {

  if (!milestoneService.isTargetUrl()) return;

  const $milestoneTitles = $('.milestone-title');

  // Gitbucketサーバからマイルストーンにひもづくissueを全件取得して
  // マイルストーンエリアを初期化する
  const promiseList = Array.from($milestoneTitles,  initEstimationArea);
  Promise.all(promiseList);




  /**
   * マイルストーンごとの作業量ベースの進捗率エリアを初期化する
   *
   * @param milestonTitle マイルストーンのタイトルのDOM要素
   */
  function initEstimationArea(milestonTitle: HTMLElement): Promise<IssuesOfMilestone> {
    return new Promise(function (resolve, reject) {
      const milestoneName = $(milestonTitle).text();
      const $progressArea = $(milestonTitle).parent().next();
      $progressArea.prepend('<h6 class="progress-title_count">Count</h6>');

      Promise.resolve()
      .then(() => {

        return Promise.all([
          milestoneService.findIssuesBy(milestoneName, 'open').then(milestoneService.addEstimation.bind(milestoneService)),
          milestoneService.findIssuesBy(milestoneName, 'closed').then(milestoneService.addEstimation.bind(milestoneService)),
        ]);
      })
      .then(issues => {
        const openEstimation = milestoneService.sumEstimation(issues[0]);
        const closedEstimation = milestoneService.sumEstimation(issues[1]);

        $progressArea.prepend(createIssueEstimationProgress(openEstimation, closedEstimation));

        // 処理終了
        resolve({ milestoneName, issues });
      });
    });
  }



  /**
   * Issueの作業量でみた進捗状況のDOM要素を返す.
   *
   * @param openIssueEstimation openなIssueの作業量合計
   * @param closedIssueEstimation closedなIssueの作業量合計
   */
  function createIssueEstimationProgress(openIssueEstimation: number, closedIssueEstimation: number): string {

    const closedIssueRate = openIssueEstimation + closedIssueEstimation === 0
                              ? 0
                              : Math.round(closedIssueEstimation / (openIssueEstimation + closedIssueEstimation) * 100);

    return `
      <h6 class="progress-title_estimation">Estimation</h6>
      <div class="progress" style="height: 12px; margin-bottom: 8px;">
        <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="${closedIssueRate}" aria-valuemin="0" aria-valuemax="100" style="width: ${closedIssueRate}%">
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
});
