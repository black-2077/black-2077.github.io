window.onload = function() {
	loadMaxScore();
	loadSounds();
	create();
	create();
	refreshBgcolor();
}

function refreshBgcolor() {
	var td_list = document.getElementsByTagName("td");
	for (var i = 0; i < td_list.length; i++) {
		td_list[i].style.backgroundColor = "white"
		switch (td_list[i].innerText) {
			case '2':
				td_list[i].style.backgroundColor = "chartreuse";
				td_list[i].style.color = "#C75F3E";
				break;
			case '4':
				td_list[i].style.backgroundColor = "crimson";
				td_list[i].style.color = "#c79b2b";
				break;
			case '8':
				td_list[i].style.backgroundColor = "#FF8C00";
				td_list[i].style.color = "#99462c";
				break;
			case '16':
				td_list[i].style.backgroundColor = "#ba69e8";
				td_list[i].style.color = "#69c3c7";
				break;
			case '32':
				td_list[i].style.backgroundColor = "palegoldenrod";
				td_list[i].style.color = "#c7125b";
				break;
			case '64':
				td_list[i].style.backgroundColor = "lightpink";
				td_list[i].style.color = "#c7648c";
				break;
			case '128':
				td_list[i].style.backgroundColor = "cornflowerblue";
				td_list[i].style.color = "#26c777";
				break;
			case '256':
				td_list[i].style.backgroundColor = "mediumseagreen";
				td_list[i].style.color = "#C75F3E";
				break;
			case '512':
				td_list[i].style.backgroundColor = "forestgreen";
				td_list[i].style.color = "#759d30";
				break;
			case '1024':
				td_list[i].style.backgroundColor = "midnightblue";
				td_list[i].style.color = "#09d9c8";
				break;
			case '2048':
				td_list[i].style.backgroundColor = "sienna";
				td_list[i].style.color = "#c7c170";
				break;
			case '4096':
				td_list[i].style.backgroundColor = "black";
				td_list[i].style.color = "white";
				break;
		}
	}
}
//  定义初始游戏功能方法，要求在两个随机的空白位置生成2个数字块，数字只能为2或4，2和4出现的概率为3:1；提示：[2,2,2,4]
// 只有合并成功,或者移动成功的前提下,才执行create操作
function create() {
	var arr = [2, 2, 2, 4];
	var m = parseInt(Math.random() * 4);
	var val = arr[m];
	var emplist = $(".empty");
	var l = parseInt(Math.random() * emplist.length);
	emplist.eq(l).text(val);
	emplist.eq(l).removeClass("empty");
	emplist.eq(l).addClass("animate__animated animate__rubberBand");
	soundManager.play("create_audio");
}


//x--,y不动
function left() {
	var key = false;
	for (var y = 0; y < 4; y++) {
		// flag 为true时前面有空块,反之没有
		var flag = false;
		for (var x = 0; x < 4; x++) {
			var coord = '.x' + x + 'y' + y;
			//如果此块是空
			if ($(coord).hasClass("empty")) {
				// 如果这是第一个空块,记录下此块坐标
				if (!flag) {
					var new_x = x;
					flag = true;
				}
				// 如果此块非空
			} else {
				//如果这是第一个块，记录下此块坐标
				if (x == 0) {
					var old_x = x;
					// 如果不是
					// 如果前面有空块，执行移动操作
				} else if (flag) {
					var new_coord = '.x' + new_x + 'y' + y;
					var val = $(coord).text();
					$(coord).empty();
					$(coord).addClass("empty");
					$(new_coord).text(val);
					$(new_coord).removeClass("empty");
					x = new_x - 1;
					flag = false;
					key = true;
					// 如果前面有非空块，执行合并操作
				} else {
					// 如果合并成功，flag = false
					var old_coord = '.x' + old_x + 'y' + y;
					if (combine(coord, old_coord)) {
						flag = false;
						key = true;
					} else {
						// 如果合并失败，old_coord变为此块的坐标；	
						old_x = x;
					}
				}
			}
		}
	}
	return key;
}
//x++,y不动
function right() {
	var key = false;
	for (var y = 0; y < 4; y++) {
		var flag = false;
		for (var x = 3; x >= 0; x--) {
			var coord = '.x' + x + 'y' + y;
			if ($(coord).hasClass("empty")) {
				if (!flag) {
					var new_x = x;
					flag = true;
				}
			} else {
				if (x == 3) {
					var old_x = x;
				} else if (flag) {
					var new_coord = '.x' + new_x + 'y' + y;
					var val = $(coord).text();
					$(coord).empty();
					$(coord).addClass("empty");
					$(new_coord).text(val);
					$(new_coord).removeClass("empty");
					x = new_x + 1;
					flag = false;
					key = true;
				} else {
					var old_coord = '.x' + old_x + 'y' + y;
					if (combine(coord, old_coord)) {
						flag = false;
						key = true;
					} else {
						old_x = x;
					}
				}
			}
		}
	}
	return key;
}
//y++,x不动
function up() {
	var key = false;
	for (var x = 0; x < 4; x++) {
		var flag = false;
		for (var y = 0; y < 4; y++) {
			var coord = '.x' + x + 'y' + y;
			if ($(coord).hasClass("empty")) {
				if (!flag) {
					var new_y = y;
					flag = true;
				}
			} else {
				if (y == 0) {
					var old_y = y;
				} else if (flag) {
					var new_coord = '.x' + x + 'y' + new_y;
					var val = $(coord).text();
					$(coord).empty();
					$(coord).addClass("empty");
					$(new_coord).text(val);
					$(new_coord).removeClass("empty");
					y = new_y - 1;
					flag = false;
					key = true;
				} else {
					var old_coord = '.x' + x + 'y' + old_y;
					if (combine(coord, old_coord)) {
						flag = false;
						key = true;
					} else {
						old_y = y;
					}
				}
			}
		}
	}
	return key;
}
//y--,x不动
function down() {
	var key = false;
	for (var x = 0; x < 4; x++) {
		var flag = false;
		for (var y = 3; y >= 0; y--) {
			var coord = '.x' + x + 'y' + y;
			if ($(coord).hasClass("empty")) {
				if (!flag) {
					var new_y = y;
					flag = true;
				}
			} else {
				if (y == 3) {
					var old_y = y;
				} else if (flag) {
					var new_coord = '.x' + x + 'y' + new_y;
					var val = $(coord).text();
					$(coord).empty();
					$(coord).addClass("empty");
					$(new_coord).text(val);
					$(new_coord).removeClass("empty");
					y = new_y + 1;
					flag = false;
					key = true;
				} else {
					var old_coord = '.x' + x + 'y' + old_y;
					if (combine(coord, old_coord)) {
						flag = false;
						key = true;
					} else {
						old_y = y;
					}
				}
			}
		}
	}
	return key;
}
//合并的方法
function combine(coord, old_coord) {
	var val = $(coord).text();
	var old_val = $(old_coord).text();
	if (val == old_val) {
		$(old_coord).text(val * 2);
		$(old_coord).addClass("animate__zoomInDown");
		$(coord).text('');
		$(coord).addClass("empty");
		$(coord).addClass("animate__rotateOut");
		soundManager.play("combine_audio");
		refreshMark(val);
		return true;
	} else {
		$(coord).addClass("animate__headShake")
		return false;
	}
}
//检查游戏结束的方法
function check() {
	var result = true;
	if ($(".empty").length == 0) {
		for (var x = 0; x < 4; x++) {
			for (var y = 0; y < 4; y++) {
				var coord = '.x' + x + 'y' + y;
				var coord_right = '.x' + (x + 1) + 'y' + y;
				var coord_under = '.x' + x + 'y' + (y + 1);
				if ($(coord).text() == $(coord_right).text() || $(coord).text() == $(coord_under).text()) {
					result = false;
				}
			}
		}
	}
	return result;
}
// 记录当前分数的方法
function refreshMark(number) {
	var mark = parseInt($('#mymark').html());
	mark += parseInt(number) * 2;
	$('#mymark').html(mark);
	maxScore = maxScore > mark ? maxScore : mark;
	$("#max-score").text(maxScore);
	localStorage.setItem("max-score", maxScore);
}
//初始化动画效果的方法
function removeAnimate() {
	var l = $(".animate__animated").length;
	for (var i = 0; i < l; i++) {
		$(".animate__animated").eq(i).removeClass("animate__rubberBand");
		$(".animate__animated").eq(i).removeClass("animate__rotateOut");
		$(".animate__animated").eq(i).removeClass("animate__zoomInDown");
		$(".animate__animated").eq(i).removeClass("animate__headShake");
	}
}
//初始化maxScore的方法
function loadMaxScore() {
	maxScore = localStorage.getItem("max-score");
	if (maxScore == null) {
		maxScore = 0;
	} else {
		maxScore = parseInt(maxScore);
	}
	$("#max-score").text(maxScore);
}
//载入声音文件的方法
function loadSounds() {
	soundManager.setup({
		url: 'swf/', //swf文件夹的位置
		onready: function() {
			soundManager.createSound({
				id: 'create_audio',
				autoLoad: true,
				autoPlay: false,
				url: 'sound/create_audio.mp3'
			});
			soundManager.createSound({
				id: 'fail_audio',
				autoLoad: true,
				autoPlay: false,
				url: 'sound/fail_audio.mp3'
			});
			soundManager.createSound({
				id: 'combine_audio',
				autoLoad: true,
				autoPlay: false,
				url: 'sound/combine_audio.mp3'
			});
		}
	});
}
//重新载入的方法
$(document).ready(function() {
	$("button").click(function() {
		location.reload();
	});
});
//通过触摸控制移动的方法
$(document).on("pagecreate", "body", function() {
	var startX, startY, endX, endY;

	document.getElementsByTagName("body")[0].addEventListener("touchstart", touchStart, false);
	document.getElementsByTagName("body")[0].addEventListener("touchmove", touchMove, false);
	document.getElementsByTagName("body")[0].addEventListener("touchend", touchEnd, false);

	function touchStart(event) {
		var touch = event.touches[0];
		startY = touch.pageY;
		startX = touch.pageX;
	}

	function touchMove(event) {
		var touch = event.touches[0];
		endY = startY - touch.pageY;
		endX = startX - touch.pageX;
	}

	function touchEnd(event) {
		//100是给定触上下方向摸起始的坐标差
		if (endY > 100) {
			if (up()) {
				create();
			}
				

			refreshBgcolor();
		} else if (endY < 100) {
			var key = down();
			if (key) {
				create();
			}
			if ($(".empty").length == 0) {
				if (check()) {
					soundManager.play('fail_audio');
					window.setTimeout("alert('GAME OVER')", 10);
				}
			}
			refreshBgcolor();
		}
		//如果不重置，会出现问题
		endY = 0;
	}
	$("body").on("swipeleft", function() {
		if (left()) {
			create();
			if (check()) {
				soundManager.play('fail_audio');
				window.setTimeout("alert('GAME OVER')", 10);
			}
		}
		refreshBgcolor();
	});
	$("body").on("swiperight", function() {
		if (right()) {
			create();
			if (check()) {
				soundManager.play('fail_audio');
				window.setTimeout("alert('GAME OVER')", 10);
			}
		}
		refreshBgcolor();
	});
});
