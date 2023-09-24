import json
import cv2
import numpy as np
from scipy.spatial import cKDTree
from scipy.interpolate import interp1d
import matplotlib

matplotlib.use('Agg')
from matplotlib import pyplot as plt

from datetime import datetime, timedelta, time

DARK_THRESHOLD = 125
DISTANCE_THRESHOLD = 1.2
MIN_NEIGHBORS = 3
SCALE = 10
PIXEL_AMOUNT = 3
UPSCALE_FACTOR = 3


class Digitalizador:

    def __init__(self):
        self.corrected_rainfall_data = []

    @staticmethod
    def save_points_to_json(x_points, y_points):
        data = {'x': x_points, 'y': y_points}
        return data

    def delete_points_in_zone(self, x1, y1, x2, y2):
        # Ensure all coordinates are defined
        if None not in [x1, y1, x2, y2]:
            x1, y1 = min(x1, x2), min(y1, y2)
            x2, y2 = max(x1, x2), max(y1, y2)
            # Delete points from corrected_rainfall_data within the rectangle
            self.corrected_rainfall_data = [
                point for point in self.corrected_rainfall_data
                if not (x1 <= point[0] <= x2 and y1 <= point[1] <= y2)
            ]

    def digitalizar(self, imagen):
        img = cv2.imread(imagen)
        img = cv2.resize(img, (img.shape[1] * UPSCALE_FACTOR, img.shape[0] * UPSCALE_FACTOR))
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        dark_coords = []

        for i in range(gray.shape[1]):
            sorted_indices = np.argsort(gray[:, i])
            darkest_indices = sorted_indices[gray[sorted_indices, i] < DARK_THRESHOLD][:PIXEL_AMOUNT]
            dark_coords.extend([(i, y) for y in darkest_indices])

        tree = cKDTree(dark_coords)

        filtered_dark_coords = []
        for coord in dark_coords:
            neighbor_count = len(tree.query_ball_point(coord, DISTANCE_THRESHOLD)) - 1
            if neighbor_count >= MIN_NEIGHBORS:
                filtered_dark_coords.append(coord)

        filtered_rainfall_data = [[] for _ in range(gray.shape[1])]

        for x, y in filtered_dark_coords:
            rainfall_amount = (gray.shape[0] - y) / gray.shape[0] * SCALE
            filtered_rainfall_data[x].append(rainfall_amount)

        self.corrected_rainfall_data = [
            (x, y) for x, y in
            enumerate([min(column_data) if column_data else None for column_data in filtered_rainfall_data])
            if y is not None
        ]

        x_values, y_values = zip(*self.corrected_rainfall_data)
        data = self.save_points_to_json(list(x_values), list(y_values))
        return data

    def combine_points(self, corrected_data, manual_data):
        combined_data = corrected_data.copy()  # create a copy of corrected_data
        corrected_x_values = [point[0] for point in corrected_data]  # list of x-values in corrected_data

        for point in manual_data:
            if point[0] not in corrected_x_values:  # check if x-value is in the list of x-values
                combined_data.append(point)  # if not, add the manual point to the end of the combined_data list

        combined_data.sort(key=lambda point: point[0])  # sort combined_data by x-values

        return combined_data

    def interpolate_graph(self, x_points, y_points, manual_data=[]):
        corrected_data = list(zip(x_points, y_points))
        combined_data = self.combine_points(corrected_data, manual_data)

        x = np.array([coord[0] for coord in combined_data])
        y = np.array([coord[1] for coord in combined_data])

        # Generate an interpolation function
        f = interp1d(x, y, kind='linear', fill_value="extrapolate")

        # generate a set of x values covering the range of your original data
        x_values = np.linspace(min(x), max(x), 1000)  # adjust the number of points as needed

        # use your interpolation function to generate y values
        y_values = f(x_values)

        # Convert the result into a dictionary
        plot_data = {"x": x_values.tolist(), "y": y_values.tolist()}

        return plot_data

    def generate_time_series_image_from_function(self, f, x_original, min_val):
        plt.figure(figsize=(10, 5))  # Adjust the size as needed

        x_interp_values = np.linspace(min(x_original), max(x_original), 96)
        y_interp_values = f(x_interp_values)

        plt.plot([datetime.combine(datetime.today(), time(5, 30)) + timedelta(minutes=15 * i) for i in range(96)],
                 y_interp_values)

        plt.ylim(0, 11)
        plt.xlabel("Tiempo")
        plt.ylabel("Lluvia (mm)")

        # Save the image
        image_path = 'time_series.png'
        plt.savefig(image_path)
        plt.close()

        return image_path

    @staticmethod
    def time_series_calc(f, start_time_str):
        if f is None:
            return {"error": 'Primero, realiza el AutoFix del grafico.'}
        else:
            x_values = f.x
            max_x = max(x_values)
            min_x = np.maximum(min(x_values), 0)

            # Generate new time steps for every 15 minutes over 24 hours
            new_time_steps = np.linspace(min_x, max_x, 96)

            # Use the interpolation function to get the precipitation values at these new time steps
            rainfall_every_15_min = f(new_time_steps)

            # Create a start time at 5:30 AM
            start_hour, start_minute = map(int, start_time_str.split(':')) #add

            try:
                start_time = time(start_hour, start_minute)
            except:
                return {"error": "Tiempo de inicio invalido", "status": 400}

            current_time = datetime.combine(datetime.today(), start_time)

            tiempos = []
            cantidades = []

            for rainfall in rainfall_every_15_min:
                rainfall = round(rainfall, 2)  # Round rainfall to 2 decimal places
                tiempos.append(current_time.strftime('%H:%M'))
                cantidades.append(rainfall)
                current_time += timedelta(minutes=15)

            return {
                "tiempo": tiempos,
                "cantidad": cantidades
            }
