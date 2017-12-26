import { Constant } from './constant';
import { storageUtil } from './storage-util';
import { issueService } from './issue.service';


/**
 * イシュー画面の初期化処理
 */
$(() => {

  if (!issueService.isTargetUrl()) return;

  // issueの作業量を取得してUIに反映
  issueService
  .fetchIssueEstimation()
  .then(({estimation}) => appendEstimaitonSelect(issueService.issueId(), estimation))
  .catch(({status, responseJSON}) => {
    if (status !== 404) return;
    appendEstimaitonSelect(issueService.issueId());
  });


  /**
   * 指定したイシュー番号と作業量で作業量設定エリアを画面に追加する.
   *
   * @param issueId イシュー番号
   * @param estimation 作業量
   */
  function appendEstimaitonSelect(issueId: string, estimation: string | null = null): void {
    $('#label-priority').after(createEstimationSelect());

    const $lableEstimation = $('#label-estimation');

    // 作業量の指定があればUIに反映
    if (estimation) {
      $('.estimation-dromdown-option[data-id="${estimation}"] i.octicon-check').addClass('octicon-check');
      $lableEstimation.addClass('selected').text(estimation);
    } else {
      $lableEstimation.text('No estimation');
    }

    $('#estimation-dropdown-memu').on('click', '.estimation-dromdown-option', function() {
      const selectedEstimation = $(this).data('id');
      const $selectedOction = $(this).find('i.octicon');

      // data-idが存在しない場合は値をクリアする
      if (!selectedEstimation) {
        issueService.deleteEstimation();
        const $oldSelectedOption = $('.estimation-dromdown-option i.octicon-check');
        $oldSelectedOption.removeClass('octicon-check');
        $lableEstimation.removeClass('selected').text('No estimation');
        return;
      }

      // 値が変換しない場合はなにもしない
      if ($lableEstimation.text() === selectedEstimation) return;

      // 選択した作業量を更新
      issueService.upsertEstimation(selectedEstimation).then(() => {
        // UIを更新
        const $oldSelectedOption = $('.estimation-dromdown-option i.octicon-check');
        $oldSelectedOption.removeClass('octicon-check');
        $selectedOction.addClass('octicon-check');
        $lableEstimation.addClass('selected').text(selectedEstimation);
      });
    });
  }

  /**
   * Issueの作業量設定用のセレクトのDOM要素を返す.
   *
   * @param issueId Issue番号
   */
  function createEstimationSelect(): JQuery<HTMLElement> {
    return $(`<hr />
      <div style="margin-bottom: 14px;">
        <span class="muted small strong">Estimation</span>
        <div class="pull-right">
          <div class="btn-group">
            <button class="dropdown-toggle btn btn-default btn-sm" data-toggle="dropdown" aria-expanded="false">
              <span class="strong">Edit</span>
              <span class="caret"></span>
            </button>
            <ul id="estimation-dropdown-memu" class="dropdown-menu pull-right">
              <li class="estimation-dromdown-option" data-id ><a href="javascript:void(0);"><i class="octicon octicon-x"></i>  Clear estimation</a></li>
              <li class="estimation-dromdown-option" data-id="1" ><a href="javascript:void(0);"><i class="octicon"></i>1</a></li>
              <li class="estimation-dromdown-option" data-id="2" ><a href="javascript:void(0);"><i class="octicon"></i>2</a></li>
              <li class="estimation-dromdown-option" data-id="3" ><a href="javascript:void(0);"><i class="octicon"></i>3</a></li>
              <li class="estimation-dromdown-option" data-id="4" ><a href="javascript:void(0);"><i class="octicon"></i>4</a></li>
              <li class="estimation-dromdown-option" data-id="5" ><a href="javascript:void(0);"><i class="octicon"></i>5</a></li>
              <li class="estimation-dromdown-option" data-id="6" ><a href="javascript:void(0);"><i class="octicon"></i>6</a></li>
              <li class="estimation-dromdown-option" data-id="7" ><a href="javascript:void(0);"><i class="octicon"></i>7</a></li>
              <li class="estimation-dromdown-option" data-id="8" ><a href="javascript:void(0);"><i class="octicon"></i>8</a></li>
              <li class="estimation-dromdown-option" data-id="9" ><a href="javascript:void(0);"><i class="octicon"></i>9</a></li>
              <li class="estimation-dromdown-option" data-id="10"><a href="javascript:void(0);"><i class="octicon"></i>10</a></li>
            </ul>
          </div>
        </div>
      </div>
      <span id="label-estimation"></span>`);
  }
});
