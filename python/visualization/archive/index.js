let schematic = null;
let data = null;
let directions = [[0,-1], [1,-1], [1,0], [1,1], [0,1], [-1, 1], [-1, 0], [-1,-1]];
let index = 0;

/*****************************************************************/ 

$.getJSON('../data/1599649992.json', function(raw_data){
    console.log(raw_data);
    data = raw_data;

    schematic = new Schematic();
    schematic.setup({ div: 'size-div', background: 'background_layer', foreground: 'foreground_layer', columns: 30, rows: 30, antCount: 10 });

    render();
    // setInterval(function(){ next(); }, 100)
})

/*****************************************************************/ 

function render(){
    schematic.reset();
    d3.select('#index').html(index);
    schematic.update(create_world_data(index));
}

function next(){
    if(index == data.world.foodPherArray.length){ return }
    index++;
    render();
}

function prev(){
    if(index == 0){ return }
    index--; 
    render();
}

/*****************************************************************/ 

function create_world_data(index){
    let temp = {};

    temp.grid = d3.range(30).map(row => { 
        return d3.range(30).map(column => { 
            let world = data.world[index];
            return { 
                homePher: data.world.homePherArray[index][row][column], 
                foodPher: data.world.foodPherArray[index][row][column],
                isFood: data.world.isFood[row][column],
                isHome: data.world.isHome[row][column],
            } 
        }) 
    });

    temp.agents = d3.range(10).map(i => {
        return {
            x: data.agents[i].columnArray[index],
            y: data.agents[i].rowArray[index],
            dir: data.agents[i].dirArray[index],
            hasFood: data.agents[i].hasFoodArray[index],
        }
    })

    return temp
}