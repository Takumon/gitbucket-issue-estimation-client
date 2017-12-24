import { Constant } from './constant';
import { storateUtil } from './storage-util';

$(() => {
  const $serverUrl = <JQuery<HTMLElement>> $('#serverUrl');
  const $tokenKey = <JQuery<HTMLElement>> $('#tokenKey');
  const $status = <JQuery<HTMLElement>> $('#status');
  const $save = <JQuery<HTMLElement>> $('#save');

  $status.hide();
  restoreOptions();
  $save.on('click', saveOptions);

  function saveOptions() {

    storateUtil.setServiceInfo($serverUrl.val() as string, $tokenKey.val() as string)
    .then(() => {
      $status.text('設定を保存しました');
      $status.show();
      setTimeout(() => {
        $status.hide();
        $status.text('');
      }, 1000);
    });
  }


  function restoreOptions() {
    storateUtil.getServiceInfo()
    .then( ({serverUrl, tokenKey}) => {
      $serverUrl.val(serverUrl);
      $tokenKey.val(tokenKey);
    });
  }

});
