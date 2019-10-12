import DataBus from './js/databus'
import Draw from './js/draw'


const { windowWidth, windowHeight } = wx.getSystemInfoSync()

var new_ctxs = [];




// 定义六边形的半径
const container_r = 20;
const min_y = 100;

const min_x = [100, 80, 60, 40, 60, 80, 100];
const column = [4, 5, 6, 7, 6, 5, 4];

var ctxs = [];
var c = 0;
var datas = [];
// false 現在沒有正在绘制 true 正在绘制
var draw_status = false;

const canvas = wx.createCanvas();
const ctx = canvas.getContext('2d');




//给底层增加触摸事件
wx.onTouchMove(function (res) {
  //console.log(e);
  let NewTouchX = res.changedTouches[0].clientX // 重新判断当前触摸点x坐标
  let NewTouchY = res.changedTouches[0].clientY // 重新判断当前触摸点x坐标
  for (var key in datas) {
    if(datas[key].lock == 0){
      if (datas[key]['min_y'] <= NewTouchY && datas[key]['max_y'] >= NewTouchY && datas[key]['min_x'] <= NewTouchX && datas[key]['max_x'] >= NewTouchX) {
        
        datas[key]['select_status'] = 1;
        datas[key]['color'] = move_div.color;
        
      } else {
        
        datas[key]['select_status'] = 0;
        datas[key]['color'] = 'rgba(45,95,0,1)';
        
      }
    }
  }
})


var move_div;

load_draw()

//开始触摸的事件
wx.onTouchStart(function (res) {
  let NewTouchX = res.changedTouches[0].clientX // 重新判断当前触摸点x坐标
  let NewTouchY = res.changedTouches[0].clientY // 重新判断当前触摸点x坐标


  if (move_div.y - container_r / 2 <= NewTouchY && move_div.y + container_r / 2 >= NewTouchY && move_div.x - container_r / 2 <= NewTouchX && move_div.x + container_r / 2 >= NewTouchX) {
    move_div.select_status = 1;
  }else{
    move_div.select_status = 0;
  }
})

//触摸结束的时间
wx.onTouchEnd(function (result) {
  move_div.select_status = 0;
  for(var key in datas){
    //判断哪个被选中
    if(datas[key].select_status == 1 && datas[key].lock == 0){
      //将选中的这个元素锁定起来
      datas[key].lock = 1;
      //将当前这个被选中的元素的颜色更新成当前移动的这个元素的颜色
      datas[key].color = move_div.color;
      //添加数值属性
      datas[key].int = move_div.int;
      //重新随机生成可移动元素的颜色
      move_div.color = random_generate_new_color();
      //將這個元素移動到最開始的位置上
      move_div.x = move_div.original_x;
      move_div.y = move_div.original_y;
      move_div.int = getRandomInt(1, 9);
    }
  }
  draw_status = true;
  get_complete_datas();
  //重新繪製
  draw();
  draw_status = false;

})


//生成随机数
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
//随机生成一个新的颜色
function random_generate_new_color()
{
  //rgba(0,0,0,0)
  return 'rgba(' + getRandomInt(10, 240) + ', ' + getRandomInt(10, 240) + ', ' + getRandomInt(10, 240) + ', ' + getRandomInt(10, 240) + ')';
}

//触摸移动事件
wx.onTouchMove(function (result) {
  if(draw_status == true){
    return false;
  }
  if (move_div.select_status == 1) {
    let NewTouchX = result.changedTouches[0].clientX // 重新判断当前触摸点x坐标
    let NewTouchY = result.changedTouches[0].clientY // 重新判断当前触摸点x坐标
    

    

    
    move_div.x = NewTouchX;
    move_div.y = NewTouchY;
    //重新绘制 以实现拖动效果
    draw();
  }
})

//游戏加载后进行第一次绘制
function load_draw()
{
  //绘制底层
  for (var line_i = 0; line_i < 7; line_i++) {
    for (var column_i = 0; column_i < column[line_i]; column_i++) {

      let _Draw = new Draw(ctx, c);
      _Draw.draw((min_x[line_i] + (column_i * container_r * 2)), (min_y + (line_i * container_r * 2)), 6, container_r, 'rgba(45,95,0,1)');

      c++;
      const data = {
        lock: 0,
        min_x: (min_x[line_i] + (column_i * container_r * 2)) - container_r / 2,
        max_x: (min_x[line_i] + (column_i * container_r * 2)) + container_r / 2,
        min_y: (min_y + (line_i * container_r * 2)) - container_r / 2,
        max_y: (min_y + (line_i * container_r * 2)) + container_r / 2,
        select_status: 0,
        color: 'rgba(45,95,0,1)',
        line_i: line_i,
        column_i: column_i
      };

      datas.push(data);
    }
  }
  
  // 绘制一个可移动的六角形
  let _Draw = new Draw(ctx, c);
  move_div = {
    x: windowWidth / 2,
    y: windowHeight - container_r * 2,
    original_x: windowWidth / 2,
    original_y: windowHeight - container_r * 2,
    color: 'rgba(45,95,255,1)',
    select_status: 0,
    int: getRandomInt(1, 9)
  };
  _Draw.draw_new(move_div.x, move_div.y, 6, container_r, move_div.color, move_div.int);
}

//重新绘制
function draw()
{
  //清除整个画布
  ctx.clearRect(0, 0, windowWidth, windowHeight);
  for(var key in datas){
    var _Draw = new Draw(ctx, 0);
    if(datas[key].lock == 1){
      _Draw.draw_new(datas[key].min_x + container_r / 2, datas[key].min_y + container_r / 2, 6, container_r, datas[key].color, datas[key].int);
    }else{
      _Draw.draw(datas[key].min_x + container_r / 2, datas[key].min_y + container_r / 2, 6, container_r, datas[key].color);
    }
  }
 
  var _Draw = new Draw(ctx, 0);
  _Draw.draw_new(move_div.x, move_div.y, 6, container_r, move_div.color, move_div.int);
}

//判断是否完成拼接
function get_complete_datas()
{
  var remove_hexagons = [];
  for(var key in datas){
    //对已经放置了的多边形进行下一步判断
    if(datas[key].lock == 1){
      let current_adjacent_hexagon = datas[key];
      
      var adjacent_hexagons = new Array();
      adjacent_hexagons.push(current_adjacent_hexagon);
      for(var son_key in datas){
        
        //将当前元素排除
        if (current_adjacent_hexagon.line_i == datas[son_key].line_i && current_adjacent_hexagon.column_i == datas[son_key].column_i){
          continue;
        }

        //找出相邻的六边形
        if (datas[son_key].lock == 1 && Math.abs(datas[son_key].line_i - current_adjacent_hexagon.line_i) <= 1 && Math.abs(datas[son_key].column_i - current_adjacent_hexagon.column_i) <= 1){
          adjacent_hexagons.push(datas[son_key]);
        }
      } 
      if (adjacent_hexagons.length >= 3){
        remove_hexagons.push(adjacent_hexagons);
      }
      
    }
  }
  console.log(remove_hexagons);
  for(var r_key in remove_hexagons){
    for (var r_son_key in remove_hexagons[r_key]) {
      for (var r_son_son_key in datas) {
        if (remove_hexagons[r_key][r_son_key].line_i == datas[r_son_son_key].line_i && remove_hexagons[r_key][r_son_key].column_i == datas[r_son_son_key].column_i) {
          console.log(r_son_son_key);
          datas[r_son_son_key].lock = 0;
          datas[r_son_son_key].color = 'rgba(45,95,0,1)';
        }
      }
    }
  }
  console.log(datas);
}

