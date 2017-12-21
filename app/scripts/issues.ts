const tokenKey = 'b7f696143f1fdf9d546607ca537a9c0deba4ba5d';



$(() => {
  function upsertEstimation(event: any, issueId: any) {
    alert(issueId);
  }

  const $issueLinks = $('.issue-title');

  const issueIds = Array.from($issueLinks,  issueLink => {
    const $issueLink = $(issueLink);
    const link = $issueLink.attr('href') as string;
    const issueId = link.substring(link.lastIndexOf('/') + 1);

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

  $('.table-issues').on('change', '.estimation', function() {
    const issueId = $(this).data('issue-number');
    const estimation = $(this).val();

    $.ajax(`http://localhost:3000/api/v3/repos${location.pathname}/${issueId}`, {
      data: {
        issueId,
        estimation
      },
      dataType: 'json',
      method: 'PUT'
     }).then(function(data) {
     }).fail(function(err) {
     });

  });


  $.ajax(`http://localhost:3000/api/v3/repos${location.pathname}`, {
   headers: {
    Authorization: 'token ' + tokenKey,
   },
   data: JSON.stringify({
     'issueId': issueIds,
   }),
   dataType: 'json',
   method: 'GET'
  }).then(function(issues) {
    Array.from(issues,  (issue: any) => {
      $(`#issue-${issue.issueId}`).val(issue.estimation || 0);
    });
  }).fail(function(err) {
  });




  // $.ajax(`api/v3/repos${location.pathname}${location.search}`, {
  //  headers: {
  //   Authorization: 'token ' + tokenKey,
  //  },
  //  dataType: 'json',
  //  method: 'GET'
  // }).then(function(data) {
  //   alert(data);
  // }).fail(function(err) {
  //   alert(err);
  // });



});


