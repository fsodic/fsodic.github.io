//This function will ad the stickyBanner UI
function addStickyBanner() {
    var stickyBannerDiv = `<div id="bannerOverlay">
                            <div id="banner-ad">
            
                            </div>
                        </div>`;

    $("body").append($(stickyBannerDiv));
    console.log("stickyBannerDiv added...");
}

function refreshStickyBannerAd() {
    console.log("refreshStickyBannerAd");
    addStickyBanner();
    showStickyBannerAd();
    setTimeout(() => {
        displayStickyBannerAds();
    }, 2500);

    var timesRun = 30000;
    const runInterval = setInterval(() => {
        displayStickyBannerAds();
    }, timesRun);
}

function displayStickyBannerAds() {
    if (LBBannerInstance) return;
    if (StickyBannerInstance) {
        console.log(StickyBannerInstance, "if in interval");
        StickyBannerInstance.destroyAd();
    }
    StickyBannerInstance = window.GlanceGamingAdInterface.showStickyBannerAd(
        StickyObj,
        bannerCallbacks
    );
}

function showStickyBannerAd() {
    $("#bannerOverlay").css("display", "flex");
}
