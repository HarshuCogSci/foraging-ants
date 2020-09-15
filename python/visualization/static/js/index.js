let directions = [[0,-1], [1,-1], [1,0], [1,1], [0,1], [-1, 1], [-1, 0], [-1,-1]];
let width = null, height = null;
let antCount = null;
let stepsCount = null;

let schematic = null;
let data = null;
let index = 0;

let render_object = null;

/*****************************************************************/ 

function setup(){
    height = params_flask.height;
    width = params_flask.width;
    antCount = params_flask.antCount;
    stepsCount = params_flask.stepsCount;

    create_render_object();

    d3.select('#time-slider').attrs({ min: 1, max: stepsCount, value: (index+1) });

    schematic = new Schematic();
    schematic.setup({ 
        div: 'size-div', 
        background: 'background_layer', 
        foreground: 'foreground_layer', 
        columns: width, 
        rows: height, 
        antCount: antCount 
    });

    render();
}

/*****************************************************************/ 

function render(){
    schematic.reset();
    d3.select('#index').html(index+1);
    update_render_object(index);
    d3.select('#time-slider').attrs({ value: (index+1) });
    schematic.update(render_object);
}

/*****************************************************************/ 

function next(){
    if(index == (stepsCount - 1)){ return }
    index++; render();
}

function prev(){
    if(index == 0){ return }
    index--;  render();
}

function reset(){
    index = 0; render();
}

/*****************************************************************/ 

function create_render_object(){
    render_object = {};

    render_object.grid = d3.range(height).map(row => {
        return d3.range(width).map(column => {
            return {
                isHome: params_flask.isHome[row*width + column],
                isFood: params_flask.isFood[row*width + column],
                homePher: null,
                foodPher: null
            }
        })
    })

    render_object.agents = d3.range(antCount).map(i => {
        return { x: null, y: null, dir: null, hasFood: null }
    })
}

/*****************************************************************/ 

function update_render_object(index){

    for(let row = 0; row < height; row++){
        for(let column = 0; column < width; column++){
            render_object.grid[row][column].homePher = world_homePher_flask.data[index][row*width + column];
            render_object.grid[row][column].foodPher = world_foodPher_flask.data[index][row*width + column];
        }
    }

    for(let i = 0; i < antCount; i++){
        render_object.agents[i].x = agents_flask[i].data[index][1];
        render_object.agents[i].y = agents_flask[i].data[index][0];
        render_object.agents[i].dir = agents_flask[i].data[index][2];
        render_object.agents[i].hasFood = agents_flask[i].data[index][5];
    }
}