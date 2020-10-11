/******************************************************************************/
/** @class Graph */

function Graph(){

}

/******************************************************************************/
/** @class Graph @func setup */

Graph.prototype.setup = function(params){
    this.div = params.div;
    this.plotDiv = document.getElementById(params.div);
}

/******************************************************************************/
/** @class Graph @func reset */

Graph.prototype.reset = function(){
    let trace_actions = [];
    let trace_trips = [];

    let actions_data = null;
    let trips_data = null;
    let time_data = null;

    if(focusAnt == null){
        actions_data = agents_flask.binned_actions;
        trips_data = agents_flask.binned_trips;
        time_data = agents_flask.binned_time;
    } else{
        actions_data = agents_flask[focusAnt].binned_actions;
        trips_data = agents_flask[focusAnt].binned_trips;
        time_data = agents_flask[focusAnt].binned_time;
    }

    for(let i = 0; i < actions_data.length; i++){
        trace_actions.push({
            x: time_data,
            y: actions_data[i],
            stackgroup: 'one'
        });
    }

    // trace_actions_marker = 

    trace_trips = {
        x: time_data,
        y: trips_data,
        type: 'scatter',
        // yaxis: 'y2',
    }

    // layout = {
    //     grid: {
    //         rows: 2,
    //         columns: 1,
    //         pattern: 'independent',
    //         subplots:[['xy'], ['xy2']],
    //         roworder:'top to bottom'
    //     }
    // }

    // Plotly.newPlot('canvas-actions', [trace_actions, trace_trips], layout);

    Plotly.newPlot('canvas-actions', trace_actions);
    Plotly.newPlot('canvas-trips', [trace_trips]);
}

/******************************************************************************/
/** @class Graph @func update */
