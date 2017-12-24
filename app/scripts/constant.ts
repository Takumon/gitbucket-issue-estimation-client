/**
 * 設定画面から入力する値を保持するクラス
 */
export class Constant {
  /** issue作業量セレクトボックスのデフォルト値 */
  public static DEFAUT_VALUE_OF_ESTIMATION_SELECT: number= 3;

  /** 作業量が未指定のissueの作業量(マイルストーンで使用する) */
  public static DEFAULT_VALUE_OF_NO_ESTIOMATION_ISSUE: number = 1;

  /** GitBucketAPI issueの1ページあたりの件数 */
  public static PER_PAGE_COUNT: number = 25;
}


