window.onload = function() {
	loadMaxScore();
	loadSounds();
	create();
	create();
	refreshBgcolor();
	end = true;
}
function refreshBgcolor() {
	var td_list = document.getElementsByTagName("td");
	for (var i = 0; i < td_list.length; i++) {
		td_list[i].style.backgroundColor = "white"
		switch (td_list[i].innerText) {
			case '2':
				td_list[i].style.backgroundColor = "#eae0c2";
				td_list[i].style.color = "black";
				break;
			case '4':
				td_list[i].style.backgroundColor = "#afdd43";
				td_list[i].style.color = "#c15c2a";
				break;
			case '8':
				td_list[i].style.backgroundColor = "#f89b2f";
				td_list[i].style.color = "#99462c";
				break;
			case '16':
				td_list[i].style.backgroundColor = "chartreuse";
				td_list[i].style.color = "#C75F3E";
				break;
			case '32':
				td_list[i].style.backgroundColor = "palegoldenrod";
				td_list[i].style.color = "#f81674";
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
				td_list[i].style.backgroundColor = "#baba13";
				td_list[i].style.color = "#54360f";
				break;
			case '1024':
				td_list[i].style.backgroundColor = "midnightblue";
				td_list[i].style.color = "#09d9c8";
				break;
			case '2048':
				td_list[i].style.backgroundColor = "#3a2a4d";
				td_list[i].style.color = "#ffe0c1";
				break;
			case '4096':
				td_list[i].style.backgroundColor = "black";
				td_list[i].style.color = "white";
				break;
		}
	}
}
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
		$(old_coord).addClass("animate__heartBeat");
		$(coord).text('');
		$(coord).addClass("empty");
		$(coord).addClass("animate__rotateOut");
		refreshMark(val);
		//成功条件
		if(val==1024){
			victory(event);
		}
		return true;
	} else {
		return false;
	}
}
//检查游戏结束的方法
function check() {
	//默认result为false（游戏不结束），如果无空格，且相邻格没有相同数字，则游戏结束
	var result = false;
	if ($(".empty").length == 0) {
		result = true;
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
		$(".animate__animated").eq(i).removeClass("animate__heartBeat");
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
			soundManager.createSound({
				id: 'victory_audio',
				autoLoad: true,
				autoPlay: false,
				url: 'sound/victory_audio.mp3'
			});
			soundManager.createSound({
				id: 'victory_music_audio',
				autoLoad: true,
				autoPlay: false,
				url: 'sound/victory_music_audio.mp3'
			});
		}
	});
}
//重新载入的方法
$(document).ready(function() {
	$("restart").click(function() {
		location.reload();
	});
});
// 通过触摸控制移动的方法

$(document).ready(function() {

	var startX, startY, endX, endY;
	$('body').on('touchstart',function(){
		var touch = event.touches[0];
		startY = touch.pageY;
		startX = touch.pageX;
	});
	$('body').on('touchmove',function(){
	 	var touch = event.touches[0];
	 	endY = startY - touch.pageY;
	 	endX = startX - touch.pageX;
	});
	$('body').on('touchend',function(){
		removeAnimate()
		var key = false;
		if(endY/endX>1){
			if (endY > 0) {
				key = up();
			} else if (endY < 0) {
				key = down();
			}
		}else{
			if (endX > 0) {
				key = left();
			} else if (endX < 0) {
				key = right();
			}
		}
		if(key){
			create();
			refreshBgcolor();
		}else if(check()){
			if(end){
			fail();
			end = false;
			}
		}
		//如果不重置，会出现问题
		endY = 0;
		endX = 0;
	});
});
//失败调用的方法
function fail(){
	soundManager.play('fail_audio');
	$('.modal-body').html('<p>GAME FAILED!</p>');
	$('.modal-title').html('<p>Sorry!</p>');
	window.setTimeout("$('#myModal').modal('show')", 100);
}
//胜利调用的方法
function victory(e){
	soundManager.play("victory_music_audio");
	soundManager.play("victory_audio");
	$('.modal-body').html('<p>GAME CLEAR!</p>');
	$('.modal-title').html('<p>Congratulations!</p>');
	window.setTimeout("	$('#myModal').modal('show')", 100);
};
