from flask import Flask, request, jsonify
import geopandas as gpd
import io
from fiona.io import ZipMemoryFile
import tempfile
import os
from flask_cors import CORS
import requests
import re

app = Flask(__name__)
CORS(app)


@app.route("/process-zip", methods=["POST"])
def process_zip():
    try:
        # Check if a file was included in the request
        if "file" not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files["file"]

        # Check if the file has an allowed extension (e.g., .zip)
        allowed_extensions = {"zip"}
        if (
            "." in file.filename
            and file.filename.rsplit(".", 1)[1].lower() not in allowed_extensions
        ):
            return jsonify({"error": "Invalid file extension"}), 400

        # Create a temporary directory to extract the contents of the zip file
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = os.path.join(temp_dir, file.filename)
            file.save(temp_path)

            # Read the zipped shapefile
            with open(temp_path, "rb") as zip_file:
                zipshp = io.BytesIO(zip_file.read())

            with ZipMemoryFile(zipshp) as memfile:
                with memfile.open() as src:
                    crs = src.crs
                    gdf = gpd.GeoDataFrame.from_features(src, crs=crs)
                    # Perform any necessary processing on gdf here
                    # For example, you can reproject it
                    gdf = gdf.to_crs(epsg=4326)

            # Convert the processed GeoDataFrame to GeoJSON
            geojson_data = gdf.to_json()

            return jsonify({"data": geojson_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route for processing GML files
@app.route("/process-gml", methods=["POST"])
def process_gml():
    try:
        # Check if a file was included in the request
        if "file" not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files["file"]

        # Check if the file has an allowed extension (e.g., .gml)
        allowed_extensions = {"gml"}
        if (
            "." in file.filename
            and file.filename.rsplit(".", 1)[1].lower() not in allowed_extensions
        ):
            return jsonify({"error": "Invalid file extension"}), 400

        # Read the GML file
        gml_data = file.read()

        # Convert the GML data to a GeoDataFrame
        gdf = gpd.read_file(io.BytesIO(gml_data))

        # Perform any necessary processing on gdf here
        # For example, you can reproject it
        print(gdf.crs)
        gdf = gdf.to_crs(epsg=4326)

        # Convert the processed GeoDataFrame to GeoJSON
        geojson_data = gdf.to_json()

        return jsonify({"data": geojson_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Add a GET endpoint
@app.route("/get-data", methods=["GET"])
def get_data():
    try:
        # Replace this with your actual data retrieval logic
        data = {"message": "This is a GET request response"}
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=8080)
