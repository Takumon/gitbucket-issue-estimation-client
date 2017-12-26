import { Constant } from './constant';
import { storageUtil } from './storage-util';
import { issuesService } from './issues.service';


/**
 * イシュー一覧画面の初期化処理
 */
$(() => {

  if (!issuesService.isTargetUrl()) return;

  const $tableIssues = $('.table-issues');
  const $issueLinks = $('.issue-title');

  // 表示しているissueのidの配列を作成
  const issueIds = Array.from($issueLinks,  issueLink => {
    const $issueLink = $(issueLink);
    const link = $issueLink.attr('href') as string;
    const issueId = Number(link.substring(link.lastIndexOf('/') + 1));

    // 作成ついでに作業量用selectタグを画面に埋め込み
    $issueLink.after(createEstimationSelect(issueId));

    return issueId;
  });

  // issueの作業量を取得してUIに反映
  issuesService
  .fetchIssueEstimations(issueIds)
  .then(issueEstimations => {
    Array.from(issueEstimations,  issueEstimation => {
      $(`#issue-${issueEstimation.issueId}`).val(issueEstimation.estimation || Constant.DEFAULT_VALUE_OF_NO_ESTIOMATION_ISSUE);
    });
  });

  // 作業量のセレクトを変更したら、作業量をサーバー側に保存する
  $tableIssues.on('change', '.estimation', () => {
    const issueId = $(this).data('issue-number');
    const estimation = Number($(this).val());

    issuesService.upsertEstimation(issueId, estimation);
 });


  /**
   * Issueの作業量設定用のセレクトのDOM要素を返す.
   *
   * @param issueId Issue番号
   */
  function createEstimationSelect(issueId: number): string {
    return `
    <select class="estimation" id="issue-${issueId}" data-issue-number="${issueId}")">
      <option value="">0</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select>`;
  }
});
