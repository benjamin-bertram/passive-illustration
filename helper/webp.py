import os
from PIL import Image

def convert_images_to_webp(input_folder, output_folder):
    # Ensure the output folder exists
    os.makedirs(output_folder, exist_ok=True)

    # List all files in the input folder
    for filename in os.listdir(input_folder):
        # Get the full file path
        input_path = os.path.join(input_folder, filename)
        
        # Check if it's a file
        if os.path.isfile(input_path):
            # Open the image file
            try:
                with Image.open(input_path) as img:
                    # Convert image to WebP
                    output_path = os.path.join(output_folder, f"{os.path.splitext(filename)[0]}.webp")
                    img.save(output_path, 'webp')
                    print(f"Converted: {filename} -> {output_path}")
            except Exception as e:
                print(f"Error converting {filename}: {e}")

# Define the input and output folders
input_folder = "/Users/benjaminbertram/Dropbox/_MASTER/_6-7-8_Master_SS23-WS23-SS24/passive-illustration/public/experiments"
output_folder = "helper/public"

# Convert images
convert_images_to_webp(input_folder, output_folder)