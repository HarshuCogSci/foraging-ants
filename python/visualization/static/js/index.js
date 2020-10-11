let directions = [[0,-1], [1,-1], [1,0], [1,1], [0,1], [-1, 1], [-1, 0], [-1,-1]];
let width = null, height = null;
let antCount = null;
let stepsCount = null;

let schematic = null;
let graph = null;

let data = null;
let index = 0;

let render_object = null;
let timer = null;

let displayPheromones = false;
let displayAgents = true;

let focusAnt = null;
let playing = false;
let bin_size = 200;

let plot_data = {};

/*****************************************************************/ 

function setup(){
    height = params_flask.height;
    width = params_flask.width;
    antCount = params_flask.antCount;
    stepsCount = params_flask.stepsCount;

    create_render_object();

    d3.select('#time-slider').attrs({ 
        min: 1, 
        max: stepsCount, 
        value: (index+1) 
    });

    schematic = new Schematic();
    schematic.setup({ 
        div: 'size-div', 
        background: 'background_layer', 
        foreground: 'foreground_layer', 
        columns: width, 
        rows: height, 
        antCount: antCount,
        displayPheromones: displayPheromones,
        displayAgents: displayAgents,
    });

    graph = new Graph();
    graph.setup({
        'div': 'canvas',
    })

    create_event_listeners();
    prepare_plot_data();
    graph.reset();

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
    if(index == (stepsCount - 1)){ stop(); index = 0; render(); return }
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

function play(){
    if(!playing){
        timer = setInterval(function(){ next(); }, 100);
        playing = true;
    }
}

function stop(){
    if(playing){
        clearInterval(timer);
        playing = false;
    }
}

/*****************************************************************/ 

function prepare_plot_data(){
    let actions_count = null;
    let trips_count = null;

    for(let ant = 0; ant < 10; ant++){
        ant_data = agents_flask[ant];
        ant_data.binned_actions = d3.range(5).map(() => { return([]); })
        ant_data.binned_trips = [];
        ant_data.binned_time = [];

        for(let i = 0; i < stepsCount; i+=bin_size){
            actions_count = [0,0,0,0,0];
            trips_count = 0;

            for(let j = i; j < i+bin_size; j++){
                actions_count[ant_data['action'][j]]++;
                trips_count += ant_data['tripCompleted'][j];
            }

            for(let action = 0; action < 5; action++){
                ant_data.binned_actions[action].push(actions_count[action]);
            }
            ant_data.binned_trips.push(trips_count);

            ant_data.binned_time.push(i+bin_size);
        }
    }

    agents_flask.binned_actions = agents_flask[0].binned_actions.map(arr => { return arr.map(() => { return 0 }) })
    agents_flask.binned_trips = agents_flask[0].binned_trips.map(() => { return 0 })
    agents_flask.binned_time = agents_flask[0].binned_time;

    for(let ant = 0; ant < 10; ant++){
        agents_flask.binned_trips = math.add(agents_flask.binned_trips, agents_flask[ant].binned_trips);
        agents_flask.binned_actions = math.add(agents_flask.binned_actions, agents_flask[ant].binned_actions);
    }
}

/*****************************************************************/ 

function create_event_listeners(){
    d3.select('#focusAnt').on('change', function(){
        let value = d3.select(this).property('value');
        if(value == 'null'){ focusAnt = null }
        else{ focusAnt = parseInt(value); }
        graph.reset();
        render();
    })

    d3.select('#time-slider').on('input', function(){
        stop();
        let value = d3.select(this).property('value');
        index = value-1;
        render();
    })

    d3.select('#prv-btn').on('click', function(){
        stop(); prev();
    })    

    d3.select('#next-btn').on('click', function(){
        stop(); next();
    })    
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

    if(displayPheromones){
        for(let row = 0; row < height; row++){
            for(let column = 0; column < width; column++){
                render_object.grid[row][column].homePher = world_homePher_flask[row*width + column][index];
                render_object.grid[row][column].foodPher = world_foodPher_flask[row*width + column][index];
            }
        }
    }

    if(displayAgents){
        for(let i = 0; i < antCount; i++){
            render_object.agents[i].x = agents_flask[i].column[index];
            render_object.agents[i].y = agents_flask[i].row[index];
            render_object.agents[i].dir = agents_flask[i].dir[index];
            render_object.agents[i].hasFood = agents_flask[i].hasFood[index];
        }
    }

}