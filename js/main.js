if (typeof APP == "undefined")
    APP = {};
APP.currently_playing = null;

APP.play_random_video = function(key) {
    var array = CONF.get_videos(key);
    if (array.length > 0) {
        APP.play_video(array[Math.floor(Math.random() * array.length)]);
    }
};

APP.show_source = function() {
    $("#edit-conf-dialog textarea").val(CONF.get_json());
    $("#edit-conf-dialog").modal();
}

APP.play_video = function(video) {
    if (APP.currently_playing != null) {
	APP.currently_playing.destroy();
	APP.currently_playing = null;
    }
    APP.currently_playing = Popcorn.youtube(
        '#video',
	video.url
    );
    APP.currently_playing.play();
}

APP.configure = function() {
    $("#choose-key-dialog").modal();
};

APP.configure_key = function (key) {
    $("#add-video-form").off("submit").submit(
	function() {
	    var video_url = $("#add-video-url").val();
	    var video = Video(video_url);
	    if (!CONF.conf.hasOwnProperty(key)) {
		CONF.conf[key] = [];
	    }
	    CONF.conf[key].push(video.url);
	    _add_video(key, video);
	    CONF.save();
	    $(this).find("input[type=text]").val("");
	    return false;
	}
    );
    $(".video-list").empty();
    for (var vid in CONF.conf[key]) {
	vid_url = CONF.conf[key][vid];
	_add_video(key, Video(vid_url));
    }
}

$(function() {
    $("body").keyup(function(e) {
	switch (e.which) {
	case 77: //'m'
	    APP.show_source();
	    break;
	case 87: //'w'
	    APP.configure();
	    break;
	case 27:
	    $(".modal").modal("hide");
	    break;
	}
    });
    $(".comfykey").click(function () {
	VIDEOS.choose_videos_for_key($(this).data("id"));
    });
    $("#youtube-search-box").keyup(function() {
	VIDEOS.search_youtube($(this).val());
    });
    $("#choose-videos-dialog").on("hide", function() {
	$("#choose-key-dialog").modal();
    });
    $("body").comfy(function(evt) {
	if (!$(".modal").is(":visible")) {
	    APP.play_random_video(evt.comfy_key);
	}
    });
    $("#edit-conf-dialog .btn-primary").click(function() {
	var new_json = $("#edit-conf-dialog textarea").val();
	CONF.set_json(new_json);
    });
});
