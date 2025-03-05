import express from "express";
const app = express();
app.use(express.json()); // JSONボディパーサー追加
const status = [];
// expressリクエスト処理時の日本語ログを追加
app.post("*", (req, res) => {
    console.log("リクエストを受信しました。:", req.body);
    try {
        const request = req.body;
        // 部屋ID、ユーザー名、タイトル、本文が渡された場合：小説更新処理
        if (request.roomID && request.userName && request.title && request.novel) {
            console.log("ルーム", request.roomID, "における小説更新処理を開始。");
            const room = status.find((s) => s.roomID === request.roomID);
            if (room) {
                const novelEntry = room.statusJSON.novel.find((n) => n.title === request.title && n.userName === request.userName);
                if (novelEntry && novelEntry.page === room.statusJSON.page) {
                    novelEntry.novel = request.novel;
                    console.log("ユーザー", request.userName, "の既存小説エントリを更新しました。");
                }
                else {
                    room.statusJSON.novel.push({
                        userName: request.userName,
                        title: request.title,
                        novel: request.novel,
                        page: room.statusJSON.page,
                    });
                    console.log("ユーザー", request.userName, "の新規小説エントリを追加しました。");
                }
                room.lastOperationTime = Date.now();
                res.status(200);
                res.end();
            }
            else {
                console.log("小説更新のためのルームが見つかりませんでした。:", request.roomID);
                res.status(404);
                res.send("Not Found");
            }
        }
        // 部屋ID、ユーザー名、タイトルが渡された場合：タイトル作成マーク処理
        else if (request.roomID && request.userName && request.title) {
            console.log("ルーム", request.roomID, "におけるタイトル作成マーク処理を開始。");
            const room = status.find((s) => s.roomID === request.roomID);
            if (room) {
                room.statusJSON.titleInfo.push({
                    title: request.title,
                    userName: request.userName,
                });
                room.lastOperationTime = Date.now();
                console.log("ユーザー", request.userName, "のタイトル作成をマークしました。");
                res.status(200);
                res.end();
            }
            else {
                console.log("タイトルマークのためのルームが見つかりませんでした。:", request.roomID);
                res.status(404);
                res.send("Not Found");
            }
        }
        // 部屋IDとstatusJSONが渡された場合：ステータス更新処理
        else if (request.roomID && request.statusJSON) {
            console.log("ルーム", request.roomID, "におけるステータス更新処理を開始。");
            try {
                const room = status.find((s) => s.roomID === request.roomID);
                if (room) {
                    room.statusJSON = JSON.parse(request.statusJSON);
                    room.lastOperationTime = Date.now();
                    console.log("ルーム", request.roomID, "のステータスを更新しました。");
                    res.status(200);
                    res.end();
                }
                else {
                    console.log("ステータス更新のためのルームが見つかりませんでした。:", request.roomID);
                    res.status(404);
                    res.send("Not Found");
                }
            }
            catch (e) {
                console.error("statusJSONの解析エラー。:", e);
                res.status(400);
                res.send("Bad Request");
            }
        }
        // 部屋IDのみ渡された場合：ルーム情報取得処理
        else if (request.roomID) {
            console.log("ルーム", request.roomID, "の取得処理を開始。");
            const room = status.find((s) => s.roomID === request.roomID);
            if (room) {
                // ユーザー名が渡された場合：ルーム参加処理
                if (request.userName) {
                    if (room.users.some((u) => u.name === request.userName)) {
                        const user = room.users.find((u) => u.name === request.userName);
                        if (user) {
                            user.lastOperationTime = Date.now();
                            console.log("ユーザー", request.userName, "の最終操作時間を更新しました。");
                        }
                    }
                    else {
                        room.users.push({
                            name: request.userName,
                            lastOperationTime: Date.now(),
                        });
                        console.log("ルーム", request.roomID, "にユーザー", request.userName, "を追加しました。");
                    }
                }
                room.lastOperationTime = Date.now();
                res.status(200);
                console.log("ルーム", request.roomID, "のstatusJSONを返却します。");
                res.send(JSON.stringify(room.statusJSON));
            }
            else {
                console.log("ルーム取得のためのルームが見つかりませんでした。:", request.roomID);
                res.status(404);
                res.send("Not Found");
            }
        }
        // 部屋名が渡された場合：ルーム作成処理
        else if (request.roomName) {
            console.log("ルーム名", request.roomName, "によりルーム作成処理を開始。");
            let roomID;
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
                finished: false,
                statusJSON: {
                    page: 0,
                    maxPage: 0,
                    timeLimit: 0,
                    finishedShowUserName: false,
                    novel: [],
                    titleInfo: []
                },
            });
            console.log("新しいルームを作成しました。ID。:", roomID);
            res.status(200);
            res.send(roomID);
        }
        else {
            console.log("不正なリクエストを受信しました。");
            res.status(400);
            res.send("Bad Request");
        }
    }
    catch (e) {
        console.error("内部サーバーエラー。:", e);
        res.status(500);
        res.send("Internal Server Error");
    }
});
app.listen(3000, () => {
    console.log("ポート3000でサーバーが起動中です。");
});
// 5秒ごとにチェックする処理
setInterval(() => {
    const now = Date.now();
    // status配列をチェック
    for (let i = status.length - 1; i >= 0; i--) {
        const room = status[i];
        // ルームの最終操作時間が10分以上経過している場合、ルームを削除
        if (now - room.lastOperationTime > 10 * 60 * 1000) {
            console.log("非アクティブのためルームを削除します。:", room.roomID);
            status.splice(i, 1);
        }
        else {
            // 各ルーム内のユーザーの最終操作時間が5秒以上経過している場合、ユーザーを削除
            for (let j = room.users.length - 1; j >= 0; j--) {
                if (now - room.users[j].lastOperationTime > 5 * 1000) {
                    console.log("非アクティブのためユーザーを削除します。:", room.users[j].name, "（ルーム。:", room.roomID, "）");
                    room.users.splice(j, 1);
                }
            }
        }
    }
}, 5000);
