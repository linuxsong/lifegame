function LifeGame(row, col) {
    this.row = row;
    this.col = col;
    this.grid = [];
    this.remainLifes = 0;
    this.nextRemainLifes = 0;
    this.period = 1;
}

//随机初始化生命，按百分比随机生成生命数量
LifeGame.prototype.initRandom = function(percent) {
    this.remainLifes = 0;
    this.period = 1;
    for(var i=0;i<this.row;i++) {
        this.grid[i] = [];
        for(var j=0;j<this.col;j++) {
            if (Math.random() * 100 <= percent) {
                this.grid[i][j] = {'state':1, 'nextState':1};
                this.remainLifes++;
                this.nextRemainLifes = this.remainLifes;
            } else {
                this.grid[i][j] = {'state':0, 'nextState':0};
            }
        }
    }
};

//计算某个生命的邻居生存个数
LifeGame.prototype.aliveCountAround = function(x,y) {
    return this.grid[this.mapX(x-1)][this.mapY(y-1)].state + 
            this.grid[this.mapX(x-1)][y].state + 
            this.grid[this.mapX(x-1)][this.mapY(y+1)].state + 
            this.grid[x][this.mapY(y-1)].state + 
            this.grid[x][this.mapY(y+1)].state + 
            this.grid[this.mapX(x+1)][this.mapY(y-1)].state + 
            this.grid[this.mapX(x+1)][y].state + 
            this.grid[this.mapX(x+1)][this.mapY(y+1)].state;
};

//左右边界的映射，超出左边界则认为是右边界关联，如-1会映射为是最右侧,这样会让游戏的宽度是无限延展的
LifeGame.prototype.mapX = function(x) {
    return (x >= this.row || x < 0 ) ? (x%this.row + this.row) % this.row : x;
};

//上下边界的映射，参见mapX
LifeGame.prototype.mapY = function(y) {
    return (y >= this.col || y < 0 ) ? (y%this.col + this.col) % this.col: y;
};

//计算某个生命的下一回合的生存状态
LifeGame.prototype.nextState = function(x,y) {
    var aliveCountAround = this.aliveCountAround(x,y);
    if (aliveCountAround >= 4) {
        return 0;
    } else if(aliveCountAround === 3) {
        return 1;
    } else if(aliveCountAround >= 2) {
        return this.grid[x][y].nextState;
    } else {
        return 0;
    }
};

//计算所有生命的下一回合的生存状态
LifeGame.prototype.calcNextState = function() {
    this.nextRemainLifes = 0;
    for(var i=0;i<this.row;i++) {
        for(var j=0;j<this.col;j++) {
            this.grid[i][j].nextState = this.nextState(i, j);
            if (this.grid[i][j].nextState === 1) {
                this.nextRemainLifes++;
            }
                
        }
    }
};

//转换到下一回合的生存状态
LifeGame.prototype.changeNextState = function() {
  for(var i=0;i<this.row;i++) {
      for(var j=0;j<this.col;j++) {
          this.grid[i][j].state = this.grid[i][j].nextState;
      }
  }
  this.remainLifes = this.nextRemainLifes;
  this.period++;
};

//下一回合
LifeGame.prototype.nextAround = function() {
    this.calcNextState();
    this.changeNextState();
};

//某个生命是否存活
LifeGame.prototype.isAlive = function(x,y) {
    return this.grid[x][y].state === 1;
};
