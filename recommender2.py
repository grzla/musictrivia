import tkinter as tk
from tkinter import messagebox
import pandas as pd
import random

# Create a list to store the songs that should never be played
never_play = []

# Create a variable to store the current round
current_round = None

def get_songs(year, num_songs):
    # Read the TSV file for the given year
    df = pd.read_csv(f'import/billboard/{year}.tsv', sep='\t')
    
    # Randomly select num_songs songs
    songs = df.sample(num_songs)
    
    return songs

def create_round():
    global current_round

    # Get 2 songs from each decade
    songs_80s = get_songs(random.choice(range(1980, 1990)), 2)
    songs_90s = get_songs(random.choice(range(1990, 2000)), 2)
    songs_00s = get_songs(random.choice(range(2000, 2010)), 2)
    songs_60s_70s = get_songs(random.choice(range(1960, 1980)), 2)
    songs_10s = get_songs(random.choice(range(2010, 2024)), 2)
    
    # Concatenate the results into a single dataframe
    current_round = pd.concat([songs_80s, songs_90s, songs_00s, songs_60s_70s, songs_10s])
    
    # Update the song list
    update_song_list()

def update_song_list():
    # Clear the song list
    song_list.delete(0, tk.END)

    # Add the songs from the current round to the song list
    for index, song in current_round.iterrows():
        song_list.insert(tk.END, f"{song['Artist']} - {song['Title']}")

def next_song():
    global current_round

    # Get the selected song
    selected_song_index = song_list.curselection()[0]
    selected_song = current_round.iloc[selected_song_index]

    # Remove the selected song from the round
    current_round = current_round.drop(current_round.index[selected_song_index])

    # Add the selected song to the never play list
    never_play.append(selected_song)

    # Replace the selected song with a new song from the same decade
    new_song = get_songs(selected_song['Year'], 1)
    current_round = current_round.append(new_song)

    # Update the song list
    update_song_list()

def export_never_play():
    # Export the never play list to 'neverPlay.tsv'
    pd.concat(never_play).to_csv('neverPlay.tsv', sep='\t', index=False)

    # Show a message box
    messagebox.showinfo("Export", "The never play list has been exported to 'neverPlay.tsv'.")

# Create a Tkinter window
window = tk.Tk()

# Create a ListBox to display the songs
song_list = tk.Listbox(window)
song_list.pack()

# Create a button to generate a new round
new_round_button = tk.Button(window, text="New Round", command=create_round)
new_round_button.pack()

# Create a button to remove a song
next_song_button = tk.Button(window, text="Next Song", command=next_song)
next_song_button.pack()

# Create a button to export the never play list
export_button = tk.Button(window, text="Export Never Play List", command=export_never_play)
export_button.pack()

# Start the Tkinter event loop
window.mainloop()