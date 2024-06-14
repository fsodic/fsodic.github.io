// get window url
var windowUrl = window.location.href;
var spilttedUrl = windowUrl.split("?");
var allIds = spilttedUrl[1].split("&");

// split all three key values required for calling api

var userIdUnFormateed = allIds[0].split("=");
var apiKeyUnFormateed = allIds[1].split("=");
var impIdUnFormateed = allIds[2].split("=");
var glanceIdUnFormateed = allIds[3].split("=");

var userId = userIdUnFormateed[1];
var impressionId = impIdUnFormateed[1];
var apiKey = apiKeyUnFormateed[1];
var glanceId = glanceIdUnFormateed[1];

// assign gameid of current game to gameName
var gameName = "13af7c40-b739-11ed-a7a3-f1a339600a85"; //GameId of current game

var bannerAdSlot;
var destroyBannerSlot = false;

window.showLeaderBoard = function (score) {
    _showLeaderBoard(score);
};

function sendLeaderBoardData(score, callback) {
    let fakeName = localStorage.getItem("randomUserName");
    if (!fakeName) {
        fakeName = faker.name.findName();
        localStorage.setItem("randomUserName", fakeName);
    }

    getBrowserId(function (browser_id) {
        let payload = {
            browserId: isSdkNew ? userId : browser_id,
            userId: userId,
            impressionId: impressionId,
            glanceId: glanceId,
            timestamp: Date.now(),
            gamename: gameName,
            scores: score,
            username: fakeName,
            apikey: apiKey,
        };

        setBrowserId1("random_browserId", browser_id);

        function callLBPost() {
            $.ajax({
                type: "POST",
                url: "https://leaderboard.api.glance.inmobi.com/leaderboard/",
                crossDomain: true,
                dataType: "json",
                headers: {
                    "content-type": "application/json",
                },
                data: JSON.stringify(payload),
                success: function (response, xhr, ee) {
                    if (ee.status == 200) {
                        console.log("Success called");
                        callback("success");
                        failedLBPost = 0;
                    } else {
                        callback("error");
                    }
                },
                error: function (err) {
                    console.log("callLBPost error : ", err);
                    callback("error");
                },
            });
        }
        callLBPost();
    });
}

function getLeaderBoardData(callback) {
    let b_id = getBrowserId1("random_browserId", "");
    let browser_id_new;

    if (isSdkNew) {
        browser_id_new = userId;
    } else {
        browser_id_new = b_id;
    }

    function callLBGet() {
        $.ajax({
            type: "GET",
            cache: false,
            url: `https://leaderboard.api.glance.inmobi.com/leaderboard/?browserId=${browser_id_new}&gamename=${gameName}`,
            dataType: "json",
            headers: {
                "content-type": "application/json",
            },
            success: function (response) {
                console.log("callLBGet sucess: ", response);
                callback(response);
            },
            error: function (err) {
                console.log("callLBGet error: ", err.responseJSON.message);
                callback([]);
            },
        });
    }
    callLBGet();
}

function getBrowserId(callback) {
    var browser_id = getBrowserId1("random_browserId", "");

    if (browser_id == "") {
        if (window.requestIdleCallback) {
            requestIdleCallback(function () {
                Fingerprint2.get(function (components) {
                    var values = components.map(function (component) {
                        return component.value;
                    });
                    browser_id = Fingerprint2.x64hash128(values.join(""), 31);
                    callback(browser_id);
                });
            });
        } else {
            setTimeout(function () {
                Fingerprint2.get(function (components) {
                    var values = components.map(function (component) {
                        return component.value;
                    });
                    browser_id = Fingerprint2.x64hash128(values.join(""), 31);
                    callback(browser_id);
                });
            }, 500);
        }
    } else {
        callback(browser_id);
    }
}

function setBrowserId1(key, value) {
    if (isSdkNew) {
        try {
            PreferencesStore.putString(key, value);
        } catch (err) {
            localStorage.setItem(key, value);
        }
    } else {
        localStorage.setItem(key, value);
    }
}

function getBrowserId1(key, defaultValue) {
    if (isSdkNew) {
        try {
            return PreferencesStore.getString(key, defaultValue);
        } catch (err) {
            return getLocalData(key, defaultValue);
        }
    } else {
        return getLocalData(key, defaultValue);
    }
}

function getLocalData(key, defaultValue) {
    let bId = localStorage.getItem(key);
    if (bId) {
        return bId;
    }
    return defaultValue;
}

//This function will ad the leaderBoard UI
function addLeaderBoard() {
    var leaderBoardUI = `<div id='playMore'>
	<div class='gameoverPage'>
		<div id="div-gpt-ad-1">
            
		</div>

		<div class = 'gameOverDiv'>
			<p class='gameoverText'>GAME OVER</p>
			<div class="user-score">
				<p id='currentScore' class='currentScore'>Score :</p>
				<p id='bestScore' class='bestScore'>Best :</p>
				<p id="yourRank" class="yourRank">Rank :</p>
			</div>
			<div class='replay__btn' onclick='replayEvent()'>
				Replay
			</div>
            <hr>
		</div>

		<div class="leaderBoard" id="leaderBoard">
			
		</div>
		<div class = "lb-footer">
			<div class = "lb-footer-content">
				<p>Powered by&nbsp;</p><img class="glance_logo" src = "./glance_logo.png">
			</div>
		
		</div>
  
	  </div>
  </div>`;
    if (recUI === "true") {
        addRecUIScript();
    } else {
        $("body").append($(leaderBoardUI));
        console.log("leaderboard added...");
    }
}

//This function can be called to showLeaderBoard at required place
function _showLeaderBoard(score) {
    if (recUI === "true") {
        hidecanvas();
        window.PwaGameCenterInterface.showRecommendedSection(); //Rec UI
    } else {
        // call banner ad via glance mlib
        LBBannerInstance = window.GlanceGamingAdInterface.showBannerAd(
            LBBannerObj,
            bannerCallbacks
        );

        $("#playMore").css("display", "block");
        $("#loader").css("display", "flex");
        $("#leaderBoard").html("");
        $("#currentScore").html(`Score : ${score}`);

        sendLeaderBoardData(score, populateLeaderBoard);
    }
}

//This function is used to populate the leaderBoard
function populateLeaderBoard(msg) {
    console.log("res : ", msg);
    if (msg == "success") {
        getLeaderBoardData(function (res) {
            if (res.current_user_max_score == undefined) {
                res.current_user_max_score = { scores__max: "" };
            }
            console.log("res : ", res);
            $("#leaderBoardData").css("display", "block");
            $("#loader").css("display", "none");
            console.log("success ", res);
            $("#bestScore").html(
                `Best : ${res.current_user_max_score.scores__max}`
            );
            let logoSrc = "user-icon.png";
            let topScorer;
            if (res.score_details && res.score_details.length > 0) {
                res.score_details.map((items, i) => {
                    if (i == 0) {
                        topScorer = items.scores;
                    }

                    let html =
                        `<div class="leaderBoardData">
                                        
                                    <div class="lb-details">
                                    <img src="./` +
                        logoSrc +
                        `" alt="" class="lb-icon">
                                    <p class="lb-dash">Rank #${i + 1}</p>
                                    <p class="lb-gamepoints">${items.scores}</p>
                                    </div>
                                </div>`;

                    $("#leaderBoard").append(html);
                });
                let topScorerChars = topScorer.toString().length;
                let yourScoreChars =
                    res.current_user_max_score.scores__max.toString().length;
                let diff = Math.abs(topScorerChars - yourScoreChars);

                let yourRow =
                    `<div class="leaderBoardData yourRow">
                                        
                                    <div class="lb-details">
                                    <img src="./` +
                    logoSrc +
                    `" alt="" class="lb-icon">
                                    <p class="lb-dash">You</p>
                                    <p class="lb-gamepoints">${res.current_user_max_score.scores__max}</p>
                                    </div>
                                </div>`;

                $("#leaderBoard").append(yourRow);
                $(".yourRow .lb-gamepoints").css(
                    "margin-left",
                    (0.2 + diff * 0.5).toString() + "rem"
                );
            }
            if (res.user_current_rank) {
                $("#yourRank").html(`Rank : ${res.user_current_rank}`);
            }
        });
    } else {
        console.log("Something went wrong");
    }
}

// recommended UI changes
const recUiScript =
    "https://x-stg.glance-cdn.com/public/content/assets/other/dist/recommended.js";
var recUI =
    location.search
        .substring(1)
        ?.split("&")
        .find((a) => {
            return a.startsWith("recUI");
        })
        ?.split("=")[1] || "false";
console.log("recUI = ", recUI);

if (recUI === "true") {
    let deferredPrompt;

    window.addEventListener("beforeinstallprompt", function (event) {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        event.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = event;
    });
}

function addRecUIScript() {
    let script = document.createElement("script");
    script.src = recUiScript;
    document.body.appendChild(script);
}

function showcanvas() {
    document.querySelector("canvas").style.display = "block";
}
function hidecanvas() {
    document.querySelector("canvas").style.display = "none";
}
