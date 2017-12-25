import { Constant } from './constant';
import { storageUtil } from './storage-util';

/**
 * 初期ロード時の処理
 */
$(() => {
  // domをキャッシュ
  const $serverUrl = <JQuery<HTMLElement>> $('#serverUrl');
  const $tokenKey = <JQuery<HTMLElement>> $('#tokenKey');
  const $status = <JQuery<HTMLElement>> $('#status');
  const $save = <JQuery<HTMLElement>> $('#save');

  init();


  /**
   * 初期化処理
   */
  function init() {
    $status.hide();
    restoreOptions();
    $save.on('click', saveOptions);
  }

  /**
   * 画面入力項目の値を設定として保存する.
   */
  function saveOptions() {

    storageUtil
    .setOptions($serverUrl.val() as string, $tokenKey.val() as string)
    .then(() => {
      $status.text('設定を保存しました');
      $status.show();
      setTimeout(() => {
        $status.hide();
        $status.text('');
      }, 1000);
    });
  }

  /**
   * 設定を取得し画面の入力項目に反映する.
   */
  function restoreOptions() {
    storageUtil
    .getOptions()
    .then(({serverUrl, tokenKey}) => {
      $serverUrl.val(serverUrl);
      $tokenKey.val(tokenKey);
    });
  }

});
