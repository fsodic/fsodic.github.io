const gameInput = {
    gameName: "2248Puzzle",
    publisherName: "BazookaStudios"
};

window.setupLibrary = function (callback) {
    window.GlanceGamingAdInterface.setupLibrary(gameInput, successCb, failCb);
};

function successCb() {
    console.log("set up lib success");
    
    showBumperAd();
    
    
    loadProgressFake();

    window["phase"] = "glance_init";
    setTimeout(() => {
        _preloadRewardAds();
    }, 1000);
    setTimeout(() => {
      _preloadReplayAds();
    }, 3000);
}

function loadProgressFake(){
    window.__progressFake = 0;
    window.__progressFaketimer = setInterval(function() {
        if (window.__progressFake < 95) window.__progressFake += 1;
        progressBar(window.__progressFake);
        if (window.__progressFake >= 95) {
            clearInterval(window.__progressFaketimer);
            // progressBar(100);
        }
    }, 30);
}

window.loadProgress_Finished = function(){
    _loadProgress_Finished();
}

function _loadProgress_Finished(){
    if(window.__progressFaketimer){
        clearInterval(window.__progressFaketimer);
    }
    progressBar(100);
}
function failCb(reason) {
    console.log(reason);
}



window.preloadReplayAds = function () {
    _preloadReplayAds();
};

window.isReplayReady = function () {
    return is_replay_loaded;
};

window.showReplayAds = function () {
    replayEvent();
};

window.preloadRewardAds = function () {
    _preloadRewardAds();
};

window.isRewardReady = function () {
    return is_rewarded_loaded;
};

window.showRewardAds = function () {
    rewardEvent();
};

window.preloadInterstitialAds = function () {
    _preloadRewardAds();
};

window.isInterstitialReady = function () {
    return is_interstitial_loaded;
};

window.showInterstitialAds = function () {
    window.GlanceGamingAdInterface.showInterstitialAd(rewardInstance);
};

var LPBannerInstance,
    LBBannerInstance,
    StickyBannerInstance,
    replayInstance,
    GlanceGamingAdInstance,
    rewardInstance,
    _triggerReason;
var is_replay_loaded = false;
var is_rewarded_loaded = false;
var is_interstitial_loaded = false;
var isRewardGranted = false;
var isRewardedAdClosedByUser = false;
const LPMercObj = {
    adUnitName: "BazookaStudios_2248Puzzle_Gameload_Bottom",
    pageName: "BazookaStudios_2248Puzzle",
    categoryName: "BazookaStudios",
    placementName: "Gameload",
    containerID: "div-gpt-ad-2",
    height: 250,
    width: 300,
    xc: "12.0",
    yc: "3.0",
    gpid: gpID,
};
const StickyObj = {
    adUnitName: "BazookaStudios_2248Puzzle_Ingame_Bottom",
    pageName: "BazookaStudios_2248Puzzle", //Game Name
    categoryName: "BazookaStudios",
    placementName: "Ingame",
    containerID: "banner-ad", //Div Id for banner
    height: 50,
    width: 320,
    xc: "12.0",
    yc: "3.0",
    gpid: gpID,
};

const LBBannerObj = {
    adUnitName: "BazookaStudios_2248Puzzle_Leaderboard_Top",
    pageName: "BazookaStudios_2248Puzzle", //Game Name
    categoryName: "BazookaStudios", //Publisher Name
    placementName: "Leaderboard",
    containerID: "div-gpt-ad-1", //Div Id for banner
    height: 250,
    width: 300,
    xc: "12.0",
    yc: "3.0",
    gpid: gpID,
};

const replayObj = {
    adUnitName: "BazookaStudios_2248Puzzle_FsReplay_Replay",
    placementName: "FsReplay",
    pageName: "BazookaStudios_2248Puzzle",
    categoryName: "BazookaStudios",
    containerID: "",
    height: "",
    width: "",
    xc: "",
    yc: "",
    gpid: gpID,
};
const rewardObj = {
    adUnitName: "BazookaStudios_2248Puzzle_FsRewarded_Reward",
    placementName: "FsRewarded",
    pageName: "BazookaStudios_2248Puzzle",
    categoryName: "BazookaStudios",
    containerID: "",
    height: "",
    width: "",
    xc: "",
    yc: "",
    gpid: gpID,
};

const interstitialObj = {
    adUnitName: "reward2222",
    placementName: "Test_Rewarded",
    pageName: "",
    categoryName: "google",
    containerID: "",
    height: "",
    width: "",
    xc: "",
    yc: "",
    gpid: gpID,
};

//banner ads callbacks
function bannerCallbacks(obj) {
    obj.adInstance?.registerCallback("onAdLoadSucceed", (data) => {
        console.log("onAdLoadSucceeded Banner : ", obj.adUnitName);

        if (obj.adUnitName === LBBannerObj.adUnitName) {
            console.log("LBBannerObj");
            $("#div-gpt-ad-1").css("display", "flex");
            $(".gameOverDiv").css("margin-top", "0px");
        } else if (obj.adUnitName === LPMercObj.adUnitName) {
            console.log("LPMercObj");
            $("#div-gpt-ad-2").css("display", "flex");
        } else if (obj.adUnitName === StickyObj.adUnitName) {
            console.log("StickyObj");
            showStickyBannerAd();
        }
    });

    obj.adInstance?.registerCallback("onAdLoadFailed", (data) => {
        console.log("onAdLoadFailed  CALLBACK", data);

        if (obj.adUnitName === LBBannerObj.adUnitName) {
            $("#div-gpt-ad-1").css("display", "none");
            $(".gameOverDiv").css("margin-top", "100px");
        }
    });

    obj.adInstance?.registerCallback("onAdDisplayed", (data) => {
        console.log("onAdDisplayed  CALLBACK", data);
    });
}
// rewarded ad callbacks
function rewardedCallbacks(obj) {
    obj.adInstance?.registerCallback("onAdLoadSucceed", (data) => {
        console.log("onAdLoadSucceeded ", obj.adUnitName);
        if (obj.adUnitName === replayObj.adUnitName) {
            is_replay_loaded = true;
        }
        if (obj.adUnitName === rewardObj.adUnitName) {
            is_rewarded_loaded = true;
        }
    });

    obj.adInstance?.registerCallback("onAdLoadFailed", (data) => {
        console.log("onAdLoadFailed Rewarded CALLBACK", data);
        if (obj.adUnitName === replayObj.adUnitName) {
            is_replay_loaded = false;
        }
        if (obj.adUnitName === rewardObj.adUnitName) {
            is_rewarded_loaded = false;
        }
    });

    obj.adInstance?.registerCallback("onAdDisplayed", (data) => {
        console.log("onAdDisplayed Rewarded CALLBACK", data);
    });

    obj.adInstance?.registerCallback("onAdClosed", (data) => {
        console.log("onAdClosed Rewarded CALLBACK", data);
        if (obj.adUnitName == rewardObj.adUnitName) {
            isRewardedAdClosedByUser = true;
        } else if (obj.adUnitName === replayObj.adUnitName) {
            isRewardedAdClosedByUser = true;
        }

        runOnAdClosed();
        isRewardGranted = false;
        isRewardedAdClosedByUser = false;
    });

    obj.adInstance?.registerCallback("onAdClicked", (data) => {
        console.log("onAdClicked Rewarded CALLBACK", data);
    });

    obj.adInstance?.registerCallback("onRewardsUnlocked", (data) => {
        console.log("onRewardsUnlocked Rewarded CALLBACK", data);

        if (obj.adUnitName === replayObj.adUnitName) {
            isRewardGranted = true;
        } else if (obj.adUnitName === rewardObj.adUnitName) {
            isRewardGranted = true;
        }
    });
}
// function to be called after ad closes
function runOnAdClosed() {
    if (isRewardGranted) {
        if (_triggerReason === "replay") {
            // window.emitEventFromeHtml("onReplayAdsCompleted", {});
            window.RewardVideoReplay_CallBack();
        } else {
            window.RewardVideo_CallBack(true);
        }
    } else {
        if (_triggerReason === "replay") {
            window.RewardVideoReplay_CallBack();
        } else {
            window.RewardVideo_CallBack(false);
        }
    }

    if (_triggerReason === "replay") {
        // call game function for replay
        _triggerReason = "";
        showGame();
        _preloadReplayAds();
    } else if (_triggerReason === "reward") {
        // If user close ad before reward
        if (!isRewardGranted && isRewardedAdClosedByUser) {
            // call game function for not earning reward (failure case)
        } else {
            // call game function for earned reward  (success case)
        }
        _triggerReason = "";
        _preloadRewardAds();
    }
}

function _preloadReplayAds() {
    replayInstance = window.GlanceGamingAdInterface.loadRewardedAd(
        replayObj,
        rewardedCallbacks
    );
    console.log("xxxxx replayInstance : ", replayInstance);
}

function _preloadRewardAds() {
    rewardInstance = window.GlanceGamingAdInterface.loadRewardedAd(
        rewardObj,
        rewardedCallbacks
    );
    console.log("xxxxx rewardInstance : ", rewardInstance);
}

function _preloadIntertitialAds() {
    rewardInstance = window.GlanceGamingAdInterface.loadInterstitialAd(
        interstitialObj,
        rewardedCallbacks
    );
    console.log("xxxxx rewardInstance : ", rewardInstance);
}

// function called on replay button (leaderboard) clicked
function replayEvent() {
    _triggerReason = "replay";
    LBBannerInstance = null;
    if (is_replay_loaded) {
        window.GlanceGamingAdInterface.showRewarededAd(replayInstance);
    } else {
        runOnAdClosed();
    }
}

function rewardEvent() {
    _triggerReason = "reward";
    if (is_rewarded_loaded) {
        window.GlanceGamingAdInterface.showRewarededAd(rewardInstance);
    } else {
        runOnAdClosed();
    }
}

function homeEvent() {
    showGame();
    window.emitEventFromeHtml("homeEvent", {});
}

function showGame() {
    if (recUI === "true") {
        window.PwaGameCenterInterface.hideRecommendedSection();
        showcanvas();
    } else {
        $("#playMore").css("display", "none");
        $("#div-gpt-ad-1").html("");
    }
}
