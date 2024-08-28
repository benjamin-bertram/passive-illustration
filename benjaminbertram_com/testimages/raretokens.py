import re
import unicodedata

def contains_emoji_or_non_latin(s):
    for char in s:
        if char.isascii():
            continue
        try:
            char_name = unicodedata.name(char)
            if unicodedata.category(char).startswith('So') or not char_name.startswith(('LATIN', 'DIGIT', 'SPACE')):
                return True
        except ValueError:
            # Some characters might not have a name; treat them as non-Latin
            return True
    return False

def process_file(input_filename, output_filename):
    unusual_filenames = []

    try:
        with open(input_filename, 'r', encoding='utf-8') as f:
            for line in f:
                filename = line.strip()
                match = re.search(r'-([^.]+)\.avif$', filename)
                if match:
                    token = match.group(1)
                    if contains_emoji_or_non_latin(token):
                        unusual_filenames.append(filename)
    except FileNotFoundError:
        print(f"Error: The file '{input_filename}' was not found.")
        return
    except Exception as e:
        print(f"An error occurred while processing the file: {e}")
        return

    try:
        with open(output_filename, 'w', encoding='utf-8') as f:
            for filename in unusual_filenames:
                f.write(filename + '\n')
    except Exception as e:
        print(f"An error occurred while writing to the file: {e}")
        return

    print(f"Filenames with emojis or non-Latin characters have been saved to '{output_filename}'.")

# Usage
input_file = "/Users/benjaminbertram/Dropbox/_MASTER/_6-7-8_Master_SS23-WS23-SS24/Homepage/benjaminbertram_com/filenames2.txt"
output_file = "/Users/benjaminbertram/Dropbox/_MASTER/_6-7-8_Master_SS23-WS23-SS24/Homepage/benjaminbertram_com/emoji_non_latin_filenames.txt"
process_file(input_file, output_file)
