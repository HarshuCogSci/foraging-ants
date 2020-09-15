let directions = [[0,-1], [1,-1], [1,0], [1,1], [0,1], [-1, 1], [-1, 0], [-1,-1]];
let width = 30, height = 30;

let schematic = null;
let data = null;
let index = 0;

/*****************************************************************/ 

function setup(){
    schematic = new Schematic();
    schematic.setup({ div: 'size-div', background: 'background_layer', foreground: 'foreground_layer', columns: width, rows: height, antCount: params_flask.antCount });

    render();
}

/*****************************************************************/ 

function render(){
    schematic.reset();
    d3.select('#index').html(index+1);
    schematic.update(create_render_data(index));
}

/*****************************************************************/ 

function next(){
    if(index == (params_flask.stepsCount - 1)){ return }
    index++; render();
}

function prev(){
    if(index == 0){ return }
    index--;  render();
}

/*****************************************************************/ 

function create_render_data(index){
    let temp = {};

    temp.grid = d3.range(height).map(row => {
        return d3.range(width).map(column => {
            let homePher_data = world_homePher_flask.data[index];
            let foodPher_data = world_foodPher_flask.data[index];
            return {
                homePher: homePher_data[row*width + column],
                foodPher: foodPher_data[row*width + column],
            }
        })
    })

    temp.agents = d3.range(params_flask.antCount).map(i => {
        let agent_data = agents_flask[i].data[index];
        return {
            x: agent_data[1],
            y: agent_data[0],
            dir: agent_data[2],
            hasFood: agent_data[5],
        }
    })

    return(temp);
}