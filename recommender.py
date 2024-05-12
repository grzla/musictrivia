import pandas as pd
import random

def get_songs(year, num_songs):
    # Read the TSV file for the given year
    df = pd.read_csv(f'import/billboard/{year}.tsv', sep='\t')
    
    # Randomly select num_songs songs
    songs = df.sample(num_songs)
    
    return songs

def create_round():
    # Get 2 songs from each decade
    songs_80s = get_songs(random.choice(range(1980, 1990)), 2)
    songs_90s = get_songs(random.choice(range(1990, 2000)), 2)
    songs_00s = get_songs(random.choice(range(2000, 2010)), 2)
    songs_60s_70s = get_songs(random.choice(range(1960, 1980)), 2)
    songs_10s = get_songs(random.choice(range(2010, 2024)), 2)
    
    # Concatenate the results into a single dataframe
    round_songs = pd.concat([songs_80s, songs_90s, songs_00s, songs_60s_70s, songs_10s])
    
    return round_songs

# Create 100 rounds
rounds = [create_round() for _ in range(2)]

# Print the first 10 songs from the first round in a more readable format
for index, row in rounds[0].head(10).iterrows():
    print(f"{row['Artist']} - {row['Title']}")
    # print(f"{row['Artist']} - {row['Title']}, {row['Ranking']}")

