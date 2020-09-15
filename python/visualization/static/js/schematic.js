/******************************************************************************/
/** @class Schematic */

function Schematic(){
    this.rect_array_1 = [];
    this.rect_array_2 = [];
    this.agents_array = [];

    var temp = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75];
    this.angles = temp.map(d => { return d*180 });

    this.showAgents = true;
}

/******************************************************************************/
/** @class Schematic @func setup */

Schematic.prototype.setup = function(params){
    this.columns = params.columns;
    this.rows = params.rows;

    var div_width = parseFloat(d3.select('#'+params.div).style('width'));
    // this.box_size = 0.95*div_width/this.columns;
    this.box_size = 18;

    this.svg_width = this.box_size*this.columns;
    this.svg_height = this.box_size*this.rows;

    this.background = d3.select('#'+params.background);
    this.background.selectAll('rect').remove();
    this.background.attrs({ width: this.svg_width, height: this.svg_height }).styles({ 'background': 'black' });

    this.foreground = d3.select('#'+params.foreground);
    this.foreground.selectAll('rect').remove();
    this.foreground.selectAll('g').remove();
    this.foreground.attrs({ width: this.svg_width, height: this.svg_height });

    var box_size = this.box_size;
    for(var y = 0; y < this.rows; y++){
        this.rect_array_1[y] = [];
        this.rect_array_2[y] = [];
        for(var x = 0; x < this.columns; x++){
            this.rect_array_1[y][x] = this.background.append('rect').attrs({ x: x*box_size, y: y*box_size, width: box_size, height: box_size });
            this.rect_array_2[y][x] = this.foreground.append('rect').attrs({ x: x*box_size, y: y*box_size, width: box_size, height: box_size });
        }
    }

    for(var i = 0; i < params.antCount; i++){
        this.agents_array[i] = this.foreground.append('g');
        this.agents_array[i].append('path').attrs({ d: 'M ' +(-0.35*box_size)+ ' ' +(0.5*box_size)+ ' L ' +(0*box_size)+ ' ' +(-0.5*box_size)+ ' L ' +(0.35*box_size)+ ' ' +(0.5*box_size)+ ' z' }).styles({ fill: 'black', stroke: 'black' });
    }

    this.reset();
}

/******************************************************************************/
/** @class Schematic @func reset */

Schematic.prototype.reset = function(){
    for(var y = 0; y < this.rows; y++){
        for(var x = 0; x < this.columns; x++){
            this.rect_array_1[y][x].styles({ fill: 'black', stroke: 'none', 'opacity': 1 });
            this.rect_array_2[y][x].styles({ fill: 'none', stroke: 'none' });
        }
    }
}

/******************************************************************************/
/** @class Schematic @func update */

Schematic.prototype.update = function(world){

    // Displaying cell pheromone levels
    for(var y = 0; y < this.rows; y++){
        for(var x = 0; x < this.columns; x++){
            var cell = world.grid[y][x];
            var colour = d3.rgb(255*cell.homePher, 0, 255*cell.foodPher);
            this.rect_array_1[y][x].styles({ fill: colour });
        }
    }

    // Clearing off Layer 2
    for(var y = 0; y < this.rows; y++){
        for(var x = 0; x < this.columns; x++){
            this.rect_array_2[y][x].styles({ 'fill': 'none', 'stroke': 'none' });
        }
    }

    // Dispalying agents
    if(this.showAgents){
        for(var i = 0; i < world.agents.length; i++){
            var agent = world.agents[i];
            this.agents_array[i].attrs({ 'transform': 'translate(' +((agent.x+0.5)*this.box_size)+ ',' +((agent.y+0.5)*this.box_size)+ ') rotate(' +this.angles[agent.dir]+ ')' });
            this.agents_array[i].select('path').styles({ 'fill': agent.hasFood ? '#0000FF' : '#FF0000' });
        }
    }

    // Dispalying home and food
    for(var y = 0; y < this.rows; y++){
        for(var x = 0; x < this.columns; x++){
            var cell = world.grid[y][x];
            if(cell.isHome){ this.rect_array_2[y][x].styles({ fill: '#FF0000', stroke: '#FF0000' }); }
            if(cell.isFood){ this.rect_array_2[y][x].styles({ fill: '#0000FF', stroke: '#0000FF' }); }
        }
    }

}