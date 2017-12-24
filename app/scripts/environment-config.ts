// TODO 決め打ちなので設定画面から取得するようにする

/**
 * 設定画面から入力する値を保持するクラス
 */
export class Config {
  /** gitbucket-issue-estimation-serverのURL */
  public static SERVER_URL: string = 'http://localhost:3000';

  /** GitBucketのAPI呼び出し時の認証用トークンキー */
  public static GITBUCKET_TOCKEN_KEY: string = 'b7f696143f1fdf9d546607ca537a9c0deba4ba5d';

  /** issue作業量セレクトボックスのデフォルト値 */
  public static DEFAUT_VALUE_OF_ESTIMATION_SELECT: number= 3;

  /** 作業量が未指定のissueの作業量(マイルストーンで使用する) */
  public static DEFAULT_VALUE_OF_NO_ESTIOMATION_ISSUE: number = 1;

  /** GitBucketAPI issueの1ページあたりの件数 */
  public static PER_PAGE_COUNT: number = 25;
}


