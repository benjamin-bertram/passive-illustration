import re

# Load common names from a predefined list or database
common_names = [

  "wood",
  "steel",
  "concrete",
  "glass",
  "plastic",
  "aluminum",
  "copper",
  "gold",
  "silver",
  "titanium",
  "rubber",
  "leather",
  "cotton",
  "wool",
  "silk",
  "paper",
  "cardboard",
  "ceramic",
  "marble",
  "granite",
  "quartz",
  "brick",
  "stone",
  "asphalt",
  "vinyl",
  "fiberglass",
  "graphene",
  "carbon fiber",
  "kevlar",
  "polyester",
  "nylon",
  "acrylic",
  "bronze",
  "brass",
  "lead",
  "tin",
  "zinc",
  "nickel",
  "platinum",
  "palladium",
  "tungsten",
  "cobalt",
  "magnesium",
  "chromium",
  "silicon",
  "bamboo",
  "cork",
  "hemp",
  "jute",
  "linen",
  "plywood",
  "foam",
  "resin",
  "wax",
  "clay",
  "porcelain",
  "terracotta",
  "chalk",
  "charcoal",
  "graphite",
  "diamond",
  "amber",
  "ivory",
  "bone",
  "pearl",
  "enamel",
  "velvet",
  "denim",
  "felt",
  "suede",
  "latex",
  "silicone",
  "polyurethane",
  "polycarbonate",
  "polypropylene",
  "polyethylene",
  "teflon",
  "formica",
  "plexiglass",
  "styrofoam",
  "neoprene",
  "Gore-Tex",
  "lycra",
  "spandex",
  "rayon",
  "viscose",
  "velcro",
  "mylar",
  "cellophane",
  "celluloid",
  "linoleum",
  "fleece",
  "flannel",
  "tweed",
  "corduroy",
  "satin",
  "chiffon",
  "taffeta",
  "tulle"
]

# Read the file
with open("/Users/benjaminbertram/Dropbox/_MASTER/_6-7-8_Master_SS23-WS23-SS24/Homepage/benjaminbertram_com/filenames2.txt", "r") as file:
    filenames = file.readlines()

# Normalize names to lowercase for case-insensitive matching
common_names = [name.lower() for name in common_names]

# Extract filenames that contain any of the common names
filtered_filenames = []
for filename in filenames:
    # Strip newline and extract token part from the filename
    match = re.search(r'-(\w+)\.avif$', filename.strip())
    if match:
        token = match.group(1).lower()  # Extract token and convert to lowercase
        # Check if token contains any of the common names
        if token in common_names:
            filtered_filenames.append(filename.strip())  # Add to the new list

# Save the filtered filenames to a new file
with open("/Users/benjaminbertram/Dropbox/_MASTER/_6-7-8_Master_SS23-WS23-SS24/Homepage/benjaminbertram_com/materials_filenames.txt", "w") as output_file:
    for filtered_filename in filtered_filenames:
        output_file.write(filtered_filename + "\n")

print(f"Filtered filenames have been saved to 'names_filenames.txt'.")
