if (typeof CONF == 'undefined') {
    CONF = {};
}

CONF.load = function() {
    data = localStorage.getItem("configuration");
    if (data == null || data === undefined) {
	data = "{}";
    }
    this.set_json(data);
}

CONF.get_json = function() {
    return JSON.stringify(this._data);
}

CONF.set_json = function(json_string) {
    this._data = JSON.parse(json_string);
    this.update_keys();
}

CONF.update_keys = function() {
    $(".comfykey").each(function(i, e) {
	e = $(e);
	var key_name = e.data("id");
	e.toggleClass("assigned", (CONF.get_videos(key_name).length > 0));
    });
}

CONF.get_videos = function(key) {
    if (!this._data.hasOwnProperty(key)) {
	return [];
    }

    return this._data[key];
}

CONF.append_video = function(key, vid) {
    if (!this._data.hasOwnProperty(key)) {
	this._data[key] = [];
    }
    this._data[key].push(vid);

    this.save();
}

CONF.remove_video = function(key, vid) {
    if (!this._data.hasOwnProperty(key)) {
	return;
    }

    this._remove_list_item(this._data[key], vid);
    this.save();
}

CONF._remove_list_item = function (list, item) {
    var index = list.indexOf(item);
    if (-1 != index) {
	list.splice(index, 1);
    }
}

CONF.save = function() {
    localStorage.setItem("configuration", this.get_json());
    CONF.update_keys();
};


CONF.load();
