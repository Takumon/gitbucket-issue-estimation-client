import { Config } from './environment-config';


$(() => {
  function upsertEstimation(event: any, issueId: any) {
    alert(issueId);
  }

  const $issueLinks = $('.issue-title');
  if (!$issueLinks || $issueLinks.length === 0) return;

  // 表示しているissueのidの配列を作成
  const issueIds = Array.from($issueLinks,  issueLink => {
    const $issueLink = $(issueLink);
    const link = $issueLink.attr('href') as string;
    const issueId = link.substring(link.lastIndexOf('/') + 1);

    // 作成ついでに作業量用selectタグを画面に埋め込み
    $issueLink.after(`
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
      </select>`);
    return issueId;
  });


  // 表示しているissueの作業量を全てとってくる(最高25件なのでページングは考慮しない)
  $.ajax(`${Config.SERVER_URL}/api/v3/repos${location.pathname}`, {
   data: JSON.stringify({
     'issueId': issueIds,
   }),
   dataType: 'json',
   method: 'GET'
  })
  .then(function(issues) {
    Array.from(issues,  (issue: any) => {
      $(`#issue-${issue.issueId}`).val(issue.estimation || 0);
    });
  });
});


