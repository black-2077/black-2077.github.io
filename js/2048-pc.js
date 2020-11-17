window.onload = function() {
	loadMaxScore();
	loadSounds();
	create();
	create();
	refreshBgcolor();
	end = true;
	cheatcode = '';
}

function refreshBgcolor() {
	var td_list = $('.main td');
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
//键盘按下的响应事件
$(document).keydown(function(event) {
	window.setTimeout(removeAnimate(), 10);
	var key = false;
	switch (event.keyCode) {
		//左
		case 37:
			key = left();
			break;
			//上
		case 38:
			key = up();
			break;
			//右
		case 39:
			key = right();
			break;
			//下
		case 40:
			key = down();
			break;
			//A
		case 65:
			key = left();
			break;
			//W
		case 87:
			key = up();
			break;
			//D
		case 68:
			key = right();
			break;
			//S
		case 83:
			key = down();
			break;
	}
	if (key) {
		create();
	} else if (check()) {
		if (end) {
			fail();
			end = false;
		} else {
			cheat(event.keyCode.toString());
		}
	}
	refreshBgcolor();
});
//x--,y不动
function left() {
	//如果有任何块产生变动，将key设置为true
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
		// 合并时产生的特效
		$(old_coord).addClass("animate__zoomInDown");
		$(coord).text('');
		$(coord).addClass("empty");
		// 合并块消失的特效
		$(coord).addClass("animate__rotateOut");
		soundManager.play("combine_audio");
		refreshMark(val);
		//改动搜索
		if(val==1024){
			victory(event);
		}
		return true;
	} else {
		//合并失败的特效
		$(coord).addClass("animate__headShake")
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
		onready: function(status) {
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
				id: 'button_audio',
				autoLoad: true,
				autoPlay: false,
				url: 'sound/button_audio.mp3'
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
			soundManager.createSound({
				id: 'firework_audio',
				autoLoad: true,
				autoPlay: false,
				url: 'sound/firework_audio.mp3'
			});
			soundManager.createSound({
				id: 'boom_audio',
				autoLoad: true,
				autoPlay: false,
				url: 'sound/boom_audio.mp3'
			});
		}
	});
	
}
//重新载入的方法
$(document).ready(function() {
	$(".restart").click(function() {
		location.reload();
	});
	$(".restart").mousedown(function(){
		$(".restart").css("margin-top","5px");
	});
	$(".restart").mouseup(function(){
		$(".restart").css("margin-top","0px");
	});
});
//胜利调用的方法
function victory(e){
	soundManager.play("victory_music_audio");
	soundManager.play("victory_audio");
	$('.modal-body').html('<p>GAME CLEAR!</p>');
	$('.modal-title').html('<p>Congratulations!</p>');
	window.setTimeout("	$('#myModal').modal('show')", 100);
	var time = 0;
	for(var i=0;i<80;i++){
		time += Math.round(Math.random()*350);
		window.setTimeout("firework()",time);
	}
};
//失败调用的方法
function fail(){
	soundManager.play('fail_audio');
	$('.modal-body').html('<p>GAME FAILED!</p>');
	$('.modal-title').html('<p>Sorry!</p>');
	window.setTimeout("$('#myModal').modal('show')", 100);
}

			//生成一个随机颜色
			function randomColor(){
				var color = "rgb("
				var r = parseInt(Math.random()*256);  
				var g = parseInt(Math.random()*256);  
				var b = parseInt(Math.random()*256);  
				color = color+r+","+g+","+b+")";  
				return color;
			}
			//生成烟花中心
			function firework(){
				var y = $(window).height()*random(5,2)*0.1;
				var x = $(window).width()*random(8,2)*0.1;
				var div = $("<div><div/>");
				var color = randomColor();
				// alert(x+'  '+y+'  '+'  '+color);
				div.addClass("big-fire animate__animated animate__backInUp");
				div.css({"position": "absolute","background-color":color,"top":y,"left":x});
				soundManager.play("firework_audio");
				$('body').append(div);
				setTimeout(function(){
					smallFirework(div);
					soundManager.play("boom_audio");
					div.remove();
				},1100);
			}
			//生成小烟花
			function smallFirework(div){
				//随机烟花数量
				 var num = random(10,20);
				 //随机半径
				 var r = random(80,180);
				 for(var i=0;i<num;i++){
					 let small = $("<div><div/>");
					 let small_x = div.position().left;
					 let small_y = div.position().top;
					 let color = randomColor();
					 small.addClass("small-fire");
					 small.css({"position": "absolute","background-color":color,"top":small_y,"left":small_x});
					 small.attr("i",i);
					 $('body').append(small);
					 
					 // 2.利用三角函数，计算出一个圆上面平均分布的点的坐标
					 // 注意三角函数的方法接收的是弧度：别忘记角度转弧度
					 var l = parseInt(Math.cos( Math.PI/180 * (360/num * i)) * r+div.position().left);
					 var t = parseInt(Math.sin( Math.PI/180 * (360/num * i)) * r+div.position().top);
					 move(small,l,t);
				 }
			}
			function move(small,l,t){
				var x = small.position().left;
				var y = small.position().top;
				small.css("top",t);
				small.css("left",l);
				small.addClass("animate__animated animate__fadeOutDown animate__slow");
				// small.addClass("animate__animated animate__flash");
				setTimeout(function(){
					small.remove();
				},2200);
				// small.animate({
				// 	left:l,
				// 	top:t 
				//   });
			}
			
			// 范围随机数
			function random(max,min){
			    return Math.round(Math.random()*(max-min)+min);
			}
function cheat(code) {
	cheatcode += code;
	// 上上下下左左右右BABA
	if (cheatcode == '383840403737393966656665') {
		var max = 0;
		for (var x = 0; x < 4; x++) {
			for (var y = 0; y < 4; y++) {
				var coord = '.x' + x + 'y' + y;
				var val = parseInt($(coord).text());
				max = (max > val ? max : val);
			}
		}
		for (var x = 0; x < 4; x++) {
			for (var y = 0; y < 4; y++) {
				var coord = '.x' + x + 'y' + y;
				var val = parseInt($(coord).text());
				if (val != max) {
					$(coord).text('2');
				}
			}
		}
		cheatcode = '';
		end = true;
	}
	//按回车重置
	if (code == 13) {
		cheatcode = '';
	}
}
