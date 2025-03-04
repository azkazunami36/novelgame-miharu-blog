import express from "express";

const app = express();
app.use(express.json()); // JSONボディパーサー追加

const status: {
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
    statusJSON: {
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
            novel: string;
            page: number;
        }[];
        titleInfo: {
            title: string;
            userName: string;
        }[];
    }
}[] = [];

app.post("*", (req, res) => {
    try {
        const request: {
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
        } = req.body;

        // 部屋IDとユーザー名とタイトルと文書を渡されたら文書を記録、同じタイトル、ページ、ユーザー名のものがあればnovel文書を上書き
        if (request.roomID && request.userName && request.title && request.novel) {
            const room = status.find((s) => s.roomID === request.roomID);
            if (room) {
                const novelEntry = room.statusJSON.novel.find((n) => n.title === request.title && n.userName === request.userName);
                if (novelEntry && novelEntry.page === room.statusJSON.page) {
                    novelEntry.novel = request.novel;
                } else {
                    room.statusJSON.novel.push({
                        userName: request.userName,
                        title: request.title,
                        novel: request.novel,
                        page: room.statusJSON.page,
                    });
                }
                room.lastOperationTime = Date.now();
                res.status(200);
                res.end();
            } else {
                res.status(404);
                res.send("Not Found");
            }
        }
        // 部屋IDとユーザー名とタイトルを渡されたらその人がそのタイトルを作ったとマーク。同じタイトルでも無視
        else if (request.roomID && request.userName && request.title) {
            const room = status.find((s) => s.roomID === request.roomID);
            if (room) {
                room.statusJSON.titleInfo.push({
                    title: request.title,
                    userName: request.userName,
                });
                room.lastOperationTime = Date.now();
                res.status(200);
                res.end();
            } else {
                res.status(404);
                res.send("Not Found");
            }
        }
        // 部屋IDとステータスJSONを渡されたらステータスを更新
        else if (request.roomID && request.statusJSON) {
            try {
                const room = status.find((s) => s.roomID === request.roomID);
                if (room) {
                    room.statusJSON = JSON.parse(request.statusJSON);
                    room.lastOperationTime = Date.now();
                    res.status(200);
                    res.end();
                } else {
                    res.status(404);
                    res.send("Not Found");
                }
            } catch (e) {
                console.error(e); // エラーログ出力追加
                res.status(400);
                res.send("Bad Request");
            }
        }
        // 部屋IDを渡されたら部屋のJSONを返す
        else if (request.roomID) {
            const room = status.find((s) => s.roomID === request.roomID);
            if (room) {
                // ユーザー名が渡されたら部屋に参加させる。すでに参加していたら最終操作時間を更新
                if (request.userName) {
                    if (room.users.some((u) => u.name === request.userName)) {
                        const user = room.users.find((u) => u.name === request.userName);
                        if (user) user.lastOperationTime = Date.now();
                    } else room.users.push({
                        name: request.userName,
                        lastOperationTime: Date.now(),
                    });
                }
                room.lastOperationTime = Date.now();
                res.status(200);
                res.send(JSON.stringify(room.statusJSON));
            } else {
                res.status(404);
                res.send("Not Found");
            }
        }
        // 部屋名を渡されたら部屋IDを返す(部屋を作る)
        else if (request.roomName) {
            // 0000-0000-0000の形式で、数字のみでランダムな部屋IDを生成(かぶらないようにする。かぶったら再生成)
            let roomID: string;
            do {
                roomID = Math.floor(Math.random() * 10000).toString().padStart(4, "0")
                    + "-" + Math.floor(Math.random() * 10000).toString().padStart(4, "0")
                    + "-" + Math.floor(Math.random() * 10000).toString().padStart(4, "0");
            } while (status.some((s) => s.roomID === roomID));
            status.push({
                roomName: request.roomName,
                roomID,
                users: [],
                roomCreateTime: Date.now(),
                lastOperationTime: Date.now(),
                statusJSON: {
                    page: 0,
                    timeLimit: 0,
                    finished: false,
                    finishedShowUserName: false,
                    novel: [],
                    titleInfo: []
                },
            });
            res.status(200);
            res.send(roomID);
        } else {
            res.status(400);
            res.send("Bad Request");
        }
    } catch (e) {
        console.error(e); // エラーログ出力追加
        res.status(500);
        res.send("Internal Server Error");
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
