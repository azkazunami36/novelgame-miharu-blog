interface RequestData {
    /** 部屋名 */
    roomName?: string;
    /** 部屋ID */
    roomID?: string;
    /** ユーザー名 */
    userName?: string;
    /** ステータスJSON */
    statusJSON?: string;
    /** 小説のタイトル */
    title?: string;
    /** 小説の本文 */
    novel?: string;
};

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

export class NovelGameAPI {
    static serverUrl = "https://clear-sideways-climb.glitch.me/";
    /**
     * ユーザー名を入力してください。
     */
    userName: string = "";
    /**
     * 部屋を作成すると自動で入力されます。
     * 参加する場合は、ここに入力してください。
     */
    roomId: string = "";
    /**
     * 部屋を作成します。
     * @param roomName 部屋の名前
     * @returns 
     */
    async createRoom(roomName: string): Promise<string> {
        // 部屋を作成
        const roomId = await fetch(NovelGameAPI.serverUrl + "createRoom", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ roomName: roomName }),
        }).then(response => response.text());
        this.roomId = roomId;
        return roomId;
    }
    async joinRoom(): Promise<void> {
        // ユーザーとして参加
        await fetch(NovelGameAPI.serverUrl + "joinRoom", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ roomID: this.roomId, userName: this.userName }),
        });
    }
    async roomStatus(): Promise<statusData> {
        // 部屋のステータスを取得
        const status = await fetch(NovelGameAPI.serverUrl + "roomStatus", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ roomID: this.roomId }),
        }).then(response => response.json());
        return status;
    }
    async titleCreate(title: string): Promise<void> {
        // タイトルを作成
        await fetch(NovelGameAPI.serverUrl + "titleCreate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ roomID: this.roomId, userName: this.userName, title: title }),
        });
    }
    async novelWrite(novel: string, title: string): Promise<void> {
        // 小説を書く
        await fetch(NovelGameAPI.serverUrl + "novelWrite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ roomID: this.roomId, userName: this.userName, title: title, novel: novel }),
        });
    }
}
