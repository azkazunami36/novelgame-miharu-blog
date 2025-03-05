;
export class NovelGameAPI {
    static serverUrl = "https://clear-sideways-climb.glitch.me/";
    /**
     * ユーザー名を入力してください。
     */
    userName = "";
    /**
     * 部屋を作成すると自動で入力されます。
     * 参加する場合は、ここに入力してください。
     */
    roomId = "";
    /**
     * 部屋を作成します。
     * @param roomName 部屋の名前
     * @returns
     */
    async createRoom(roomName) {
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
    async joinRoom() {
        // ユーザーとして参加
        await fetch(NovelGameAPI.serverUrl + "joinRoom", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ roomID: this.roomId, userName: this.userName }),
        });
    }
    async roomStatus() {
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
    async titleCreate(title) {
        // タイトルを作成
        await fetch(NovelGameAPI.serverUrl + "titleCreate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ roomID: this.roomId, userName: this.userName, title: title }),
        });
    }
    async novelWrite(novel, title) {
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
