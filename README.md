# Software Studio 2024 Spring Midterm Project

### Scoring

| **Basic components**                             | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |

| Membership Mechanism                             | 15%   | Y         |

| Firebase page                                    | 5%        | Y         |

| Database read/write                              | 15%       | Y         |

| RWD                                              | 15%       | Y         |

| Chatroom                                         | 20%       | Y         |


| **Advanced tools**                               | **Score** | **Check** |

| :----------------------------------------------- | :-------: | :-------: |
| Using React                                      | 10%       | Y         |

| Third-Party Sign In                              | 1%        | Y         |

| Notification                                     | 5%        | Y         |

| CSS Animation                                    | 2%        | Y         |

| Security                                         | 2%        | Y         |


| **Other useful functions**                         | **Score** | **Check** |

| :----------------------------------------------- | :-------: | :-------: |

| Name of functions                                | 1~5%     | Y         |
| In-page Notification when Create new chatRoom/Success and Failed for Register,Log-in and Log-out

| Website Detection in messages

| Latest message for each Chatroom

| Sort the Chatrooms based on updated time

---

### How to setup your project

-  Describe STEP by STEP (i.e. `cd Midterm`, `npm install` ...)
-  Create a new folder and paste files in it
-  (Start using Command line)
-  npm install 
-  (if necessary) npm install notyf
-  npm run                        // Start compiling the codes
------------If necessary (failed when compiling )-----------------------------
-  npm install -g create-react-app
-  npx create-react-app my-app 
-  cd my-app
-  npm install react
-  npm install react-router-dom   // For navigating between JSX component
-  npm install -g sass            // For using scss
-  npm install --save-dev sass
-  npm install firebase           // For using firebase Library
-  npm install -g firebase-tools  // For firebase CLI 
-  npm install uuid               // For generating unique keys for ChatRooms
-  npm install  notyf             // For in-page toastify-like notification, but is lighter than toastify

### How to use 

- Describe how to use your web and maybe insert images or gifs to help you explain.

    抱歉，這邊用中文說好了QQ，怕沒講清楚。
    首先在主頁點擊下方的Register的連結，轉往註冊頁面註冊。註冊時必填暱稱、電子信箱和密碼，圖片是選擇性上傳的。但是沒有上傳圖片的話你會得到一個"SUS"的預設頭像。
    註冊成功後就會自動跳轉進入主頁面。(之後也可以從Log in 畫面再次登入)
    進入主頁面後有幾個功能可供使用，在左邊sidebar上方 有個人profile(displayName & avatar)，旁邊有logout的按鈕可以登出。
    往下一點有搜尋列，可以輸入其他使用者的暱稱(displayName)來做使用者的搜尋，搜尋結果會顯現出該使用者的displayName、uid和頭像。
    點擊搜尋結果一下，可以複製該用戶的uid，點擊兩下則是創建一個只有兩人的聊天室並且收起搜尋結果。
    如果只想收起搜尋結果欄，可以把輸入搜尋的用戶名刪除後按下enter，它就會收起來。
    點擊左方聊天室列表可以進入聊天室。

    右方為聊天室內容，可以在底下input區域輸入文字並點擊送出鍵送出訊息。
    可以點擊相機圖案附加圖片傳送。
    附件圖案沒有用處 QQ
    聊天室上緣有一個輸入區域和三顆按鈕。
    可以在輸入區域輸入想要加入的使用者uid(從搜尋結果可以複製到)，輸入後按下加人的圖案，稍等一下，就會跳出成功加入使用者或是加入失敗的通知。在成功加入新的使用者後，群組的名稱也會追加上新的使用者的displayName。
    上排另外兩顆按鈕也沒有用處抱歉QQ


### Function description

- Describe your bonus function and how to use it.

1. Website Detection: A funtion in Message.jsx : isValidUrl(String), could detect whether the string is a website link or not. If it is, change <p>tag in component into <a> with href={the link}, while setting target='_blank' rel="noopener noreferrer", which would open a new tab onclick.
2. Latest message for each Chatroom. TBH I use a really stupid way to implement it. I create an document called 'userChats', the data stored under each {uid} is  serveral Object like this:

ChatroomId:
{
    groupInfo{
        chatRoomId:""
        displayName:""
        photoURL:""
        uid:""
    }
    lastMessage{
        displayName:""
        text:""
    }
    date:Timestamp
}

So when I send a message to a ChatRoom I make update to every user's userChats' lastMessage and date.
Hence could realize this message preview function.

3. In a similar way, sort the user's chats based on updated date. By Object.entries(chats)?.sort((a,b)=>b[1].date-a[1].date).map().

### Firebase page link

- Your web page `URL`
- https://ss-cr-2.web.app/login

### Others (Optional)

- Anything you want to say to TAs.
- Based on reference https://www.youtube.com/watch?v=k4mjF4sPITE&t=1s
- But totally Hand-written

<style>
table th{
    width: 100%;
}
</style>
