interface StatusJSON {
    /** 現在のページ */
    page: number;
    /** 最大ページ */
    maxPage: number;
    /** 制限時間 */
    timeLimit: number;
    /** ゲーム終了時にどのプレイヤーが書いたかを見れるかどうか */
    finishedShowUserName: boolean;
    /** 小説テキスト */
    novel: {
        /** 誰が書いたか */
        userName: string;
        /** タイトル */
        title: string;
        /** 本文 */
        novel: string;
        /** ページ */
        page: number;
    }[];
    /** タイトルの情報 */
    titleInfo: {
        /** タイトル */
        title: string;
        /** 誰が書いたか */
        userName: string;
    }[];
}
interface statusData {
    /** 部屋名 */
    roomName: string;
    /** 部屋ID */
    roomID: string;
    /** 参加しているユーザー */
    users: {
        /** ユーザー名 */
        name: string;
        /** 最終操作時間 */
        lastOperationTime: number;
    }[];
    /** 部屋作成時間 */
    roomCreateTime: number;
    /** 最終操作時間 */
    lastOperationTime: number;
    /** ゲームが終了したかどうか */
    finished: boolean;
    /** ステータスJSON */
    statusJSON: StatusJSON;
}
export declare class NovelGameAPI {
    static serverUrl: string;
    /**
     * ユーザー名を入力してください。
     */
    userName: string;
    /**
     * 部屋を作成すると自動で入力されます。
     * 参加する場合は、ここに入力してください。
     */
    roomId: string;
    /**
     * 部屋を作成します。
     * @param roomName 部屋の名前
     * @returns
     */
    createRoom(roomName: string): Promise<string>;
    joinRoom(): Promise<void>;
    roomStatus(): Promise<statusData>;
    titleCreate(title: string): Promise<void>;
    novelWrite(novel: string, title: string): Promise<void>;
}
export {};
