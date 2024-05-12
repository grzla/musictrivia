import sys
# python removeQuotes.py myfile.txt

def remove_quotes(filename):
    with open(filename, 'r') as file:
        data = file.read()

    data = data.replace('"', '')

    with open(filename, 'w') as file:
        file.write(data)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python removeQuotes.py <filename>")
    else:
        remove_quotes(sys.argv[1])