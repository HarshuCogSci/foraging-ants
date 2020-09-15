import os
import pandas as pd

from flask import Flask, render_template, json
app = Flask(__name__)

#########################################################################
# Read the root for folders

root = '../data/'
folders = os.listdir(root)
folder = folders[len(folders) - 1]

#########################################################################
# World Home Pheromone Data

def read_world_homePher_data():
    # world_homePher_df = pd.read_pickle(root + folder + '/world_home_pheromone.pkl')
    # return world_homePher_df.to_dict('split')

    return pd.read_pickle(root + folder + '/world_home_pheromone.pkl').to_dict('split')

#########################################################################
# World Food Pheromone Data

def read_world_foodPher_data():
    # world_foodPher_df = pd.read_pickle(root + folder + '/world_food_pheromone.pkl')
    # return world_foodPher_df.to_dict('split')

    return pd.read_pickle(root + folder + '/world_food_pheromone.pkl').to_dict('split')

#########################################################################
# Read Agents Data

def read_agents_data():
    agents_df = []

    for i in range(1, 11):
        # temp_df = pd.read_pickle(root + folder + '/agent_' + str(i) + '.pkl')
        # agents_df.append( temp_df.to_dict('split') )
        agents_df.append( pd.read_pickle(root + folder + '/agent_' + str(i) + '.pkl').to_dict('split') )

    return agents_df

#########################################################################
# Read params.json

def read_params_file():
    with open('../data/' +folder+ '/params.json') as readFile:
        data = json.load(readFile)
        return data

#########################################################################
# Root

# print("Reading Params Data: Started..\n")
params = read_params_file()

# print("Reading Agents Data: Started..\n")
agents_data = read_agents_data()

# print("Reading Home Pheromone Data: Started..\n")
world_homePher_data = read_world_homePher_data()

# print("Reading Food Pheromone Data: Started..\n")
world_foodPher_data = read_world_foodPher_data()

@app.route('/')
def index():

    global params
    global agents_data
    global world_homePher_data
    global world_foodPher_data

    return render_template(
        'index.html', 
        params = json.dumps(params),
        agents = json.dumps(agents_data),
        world_homePher = json.dumps(world_homePher_data),
        world_foodPher = json.dumps(world_foodPher_data)
    )

#########################################################################
# Running the script

if __name__ == "__main__":
    app.run()
    # app.run(debug = True)
