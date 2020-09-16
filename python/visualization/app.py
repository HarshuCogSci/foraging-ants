import os
import pandas as pd
import json

from flask import Flask, render_template
app = Flask(__name__)

#########################################################################
# Read the root for folders

root = '../data/'
folders = os.listdir(root)
folder = folders[len(folders) - 1]

#########################################################################
# Serialize DataFrame Column

def serialize_df_column(df_col):
    return df_col.values.tolist()
    # return pd.Series(df_col).to_json(orient='values')

#########################################################################
# World Home Pheromone Data

def read_world_homePher_data():

    temp_df = pd.read_pickle(root + folder + '/world_home_pheromone.pkl')
    temp_data = {}
    temp_data['time'] = serialize_df_column( temp_df.index )
    columns = temp_df.columns
    for column in columns:
        temp_data[column] = serialize_df_column( temp_df[column] )

    return temp_data

#########################################################################
# World Food Pheromone Data

def read_world_foodPher_data():

    temp_df = pd.read_pickle(root + folder + '/world_food_pheromone.pkl')
    temp_data = {}
    temp_data['time'] = serialize_df_column( temp_df.index )
    columns = temp_df.columns
    for column in columns:
        temp_data[column] = serialize_df_column( temp_df[column] )
    
    return temp_data

#########################################################################
# Read Agents Data

def read_agents_data():
    agents_df = []

    for i in range(1, 11):

        temp_df = pd.read_pickle(root + folder + '/agent_' + str(i) + '.pkl')
        temp_data = {}
        temp_data['time'] = serialize_df_column( temp_df.index )
        columns = temp_df.columns
        for column in columns:
            temp_data[column] = serialize_df_column( temp_df[column] )

        agents_df.append(temp_data)

    return agents_df

#########################################################################
# Read params.json

def read_params_file():
    with open('../data/' +folder+ '/params.json') as readFile:
        data = json.load(readFile)
        return data

#########################################################################
# Root

params = json.dumps( read_params_file() )
agents_data = json.dumps(  read_agents_data() )
world_homePher_data = json.dumps( read_world_homePher_data() )
world_foodPher_data = json.dumps( read_world_foodPher_data() )

@app.route('/')
def index():

    global params
    global agents_data
    global world_homePher_data
    global world_foodPher_data

    return render_template(
        'index.html', 
        params = params,
        agents = agents_data,
        world_homePher = world_homePher_data,
        world_foodPher = world_foodPher_data
    )

#########################################################################
# Running the script

if __name__ == "__main__":
    # app.run()
    app.run(debug = True)
