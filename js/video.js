if (typeof VIDEOS == 'undefined')
    VIDEOS = {}

var _current_key = null;

VIDEOS.choose_videos_for_key = function(key) {
    _current_key = key;
    $("#choose-key-dialog .close").click();
    $("#youtube-search-box").val("");
    $("#included-videos").empty();
    $.each(CONF.get_videos(key), function(index, video_item) {
	VIDEOS.create_item_div(video_item).appendTo($("#included-videos")).click(VIDEOS.remove_video_item);
    });
    $("#choose-videos-dialog").modal();
    $("#youtube-search-box").focus();
}

var result_box = $("#youtube-search-results");

VIDEOS.add_video_item = function() {
    var item = $(this);
    var video_item = item.data("video_item");
    item.remove();
    VIDEOS.create_item_div(video_item).appendTo($("#included-videos")).click(VIDEOS.remove_video_item);
    CONF.append_video(_current_key, video_item);
}

VIDEOS.remove_video_item = function() {
    var item = $(this);
    var video_item = item.data("video_item");
    item.remove();
    CONF.remove_video(_current_key, video_item);
}

VIDEOS.create_item_div = function(video_item) {
    var returned = $("<div></div>")
	.addClass("video-item row-fluid")
	.append($("<img/>").addClass("span4").attr({"src":video_item.thumbnail_url}))
	.append($('<div class="span8"></div>').text(video_item.title));
    returned.data("video_item", video_item);
    return returned;
}

var _search_index = 0;

VIDEOS.search_youtube = function(term) {
    var keyword= encodeURIComponent(term);
    var yt_url='http://gdata.youtube.com/feeds/api/videos?q='+keyword+'&format=5&max-results=5&v=2&alt=jsonc';
    result_box.empty();
    if (term.length == 0) {
	return;
    }
    _search_index += 1;
    var search_index = _search_index;
    $.ajax({
	type: "GET",
	url: yt_url,
	dataType:"jsonp",
	success: function(response)
	{
	    if (search_index != _search_index) {
		return ; // search too old
	    }
	    var items = response.data.items;
	    for (var i = 0; i < items.length; ++i) {
		var data = items[i];
		var video_id=data.id;
		var video_title=data.title;
		var video_url="http://www.youtube.com/watch?v="+video_id;
		var vid = Video(video_url, video_title);
		VIDEOS.create_item_div(vid).appendTo($("#youtube-search-results")).click(VIDEOS.add_video_item);
	    }
	}
    });
}


function Video(url, title) {
    var vid = {};
    vid.id = _parse_video_id(url);
    vid.title = title
    vid.url = 'http://www.youtube.com/watch?v=' + vid.id + '&autoplay=1&controls=0&disablekb=1&showinfo=0';
    vid.thumbnail_url =  "http://i2.ytimg.com/vi/" + vid.id + "/default.jpg";
    return vid;
}

function _parse_video_id(url) {
    var video_id = url.split('v=')[1];
    var ampersandPosition = video_id.indexOf('&');
    if(ampersandPosition != -1) {
	video_id = video_id.substring(0, ampersandPosition);
    }
    return video_id;
}
