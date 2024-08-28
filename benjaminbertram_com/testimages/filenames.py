import os
import re

# Specify the folder path
folder_path = 'public'  # Replace this with your actual folder path

# Specify the output text file
output_file = 'public.txt'

# Get all filenames in the specified folder
filenames = os.listdir(folder_path)

# Function to extract the index from the filename
def get_index(filename):
    match = re.match(r'^(\d+)', filename)
    return int(match.group(1)) if match else 0

# Sort filenames based on the index
sorted_filenames = sorted(filenames, key=get_index)

# Write sorted filenames to the text file
with open(output_file, 'w') as file:
    for filename in sorted_filenames:
        file.write(filename + '\n')

print(f"Sorted filenames have been written to {output_file}")
print(f"Total number of files: {len(sorted_filenames)}")