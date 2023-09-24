import os

from django.core.files.storage import FileSystemStorage
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from scipy.interpolate import interp1d

from api.v1.pluviograma.serializers import PluviogramaSerializer, ImageUploadSerializer, ModeloSerializer
from ciifen.inventario.models import Instrumento, Estacion
from ciifen.pluviograma.digitalizador import Digitalizador
from ciifen.pluviograma.models import Pluviograma, Modelo
from config import settings
import json
from datetime import datetime


def save_file_and_get_url(file_path, custom_directory):
    fs = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, custom_directory))
    with open(file_path, 'rb') as file:
        filename = fs.save(os.path.basename(file_path), file)
    return os.path.basename(filename)


class PluviogramaViewSet(viewsets.ModelViewSet):
    queryset = Pluviograma.objects.all().order_by('-id')
    serializer_class = PluviogramaSerializer

    def create(self, request, *args, **kwargs):
        # Extract x and y from data
        x_points = [float(x) for x in request.data.get('x', [])]
        y_points = [float(y) for y in request.data.get('y', [])]

        digitalizador = Digitalizador()
        plot_data = digitalizador.interpolate_graph(x_points, y_points)

        x_values = plot_data["x"]
        y_values = plot_data["y"]

        f = interp1d(x_values, y_values, kind='linear', fill_value="extrapolate")

        # Directly use the request.data for the serializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        pluviograma = serializer.save()

        min_val = pluviograma.modelo.limite_inferior

        image_path = digitalizador.generate_time_series_image_from_function(f, x_points, min_val)

        # Define directory path
        directory_path = os.path.join(settings.MEDIA_ROOT, f'ciifen/pluviograma/trazabilidades/{pluviograma.id}')

        if not os.path.exists(directory_path):
            os.makedirs(directory_path)

        # Save the images and retrieve the URLs
        url_serie_tiempo = save_file_and_get_url(image_path, directory_path)

        # Save trazabilidad JSON
        trazabilidad_json_path = os.path.join(directory_path, 'trazabilidad.json')
        with open(trazabilidad_json_path, 'w') as file:
            json.dump(plot_data, file)

        url_trazabilidad = save_file_and_get_url(trazabilidad_json_path, directory_path)

        # Update the Pluviograma instance with the URLs
        pluviograma.url_serie_tiempo = url_serie_tiempo
        pluviograma.url_trazabilidad = url_trazabilidad
        pluviograma.save()

        # Re-serialize the updated instance
        updated_serializer = self.get_serializer(pluviograma)

        return Response(updated_serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        pluviograma = self.get_object()

        # Extract x and y from data
        x_points = [float(x) for x in request.data.get('x', [])]
        y_points = [float(y_point) for y_point in request.data.get('y', [])]

        digitalizador = Digitalizador()
        plot_data = digitalizador.interpolate_graph(x_points, y_points)

        x_values = plot_data["x"]
        y_values = plot_data["y"]

        min_val = pluviograma.modelo.limite_inferior

        f = interp1d(x_values, y_values, kind='linear', fill_value="extrapolate")
        new_image_path = digitalizador.generate_time_series_image_from_function(f, x_points, min_val)

        # Define directory path
        directory_path = os.path.join(settings.MEDIA_ROOT, f'ciifen/pluviograma/trazabilidades/{pluviograma.id}')

        if not os.path.exists(directory_path):
            os.makedirs(directory_path)

        # Save the newly generated image
        url_serie_tiempo = save_file_and_get_url(new_image_path, directory_path)

        # Construct paths for overwriting files
        trazabilidad_json_path = os.path.join(directory_path, 'trazabilidad.json')

        # Save the JSON and retrieve the URL
        with open(trazabilidad_json_path, 'w') as file:
            json.dump(plot_data, file)
        url_trazabilidad = save_file_and_get_url(trazabilidad_json_path, directory_path)

        # Update the Pluviograma instance with the URLs
        pluviograma.url_serie_tiempo = url_serie_tiempo
        pluviograma.url_trazabilidad = url_trazabilidad

        estacion_id = request.data.get('estacion')
        print('casdasda', estacion_id)

        if estacion_id:
            # Fetch the Estacion instance
            estacion_instance = Estacion.objects.get(pk=estacion_id)
            # Assign to Pluviograma instance
            pluviograma.estacion = estacion_instance

        instrumento_id = request.data.get('instrumento')
        if instrumento_id:
            # Fetch the Instrumento instance (assuming Instrumento is another model)
            instrumento_instance = Instrumento.objects.get(pk=instrumento_id)
            # Assign to Pluviograma instance
            pluviograma.instrumento = instrumento_instance

        pluviograma.save()

        # Re-serialize the updated instance
        updated_serializer = self.get_serializer(pluviograma)

        return Response(updated_serializer.data, status=status.HTTP_200_OK)


class ImageUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        print("Inside POST method of ImageUploadView")
        file_serializer = ImageUploadSerializer(data=request.data)

        if file_serializer.is_valid():
            uploaded_image = request.FILES['image']

            # Save the uploaded file temporarily, so you can use it with OpenCV
            temp_image_path = "temp_image.png"
            with open(temp_image_path, 'wb+') as destination:
                for chunk in uploaded_image.chunks():
                    destination.write(chunk)

            digitalizador = Digitalizador()

            plot_data = digitalizador.digitalizar(temp_image_path)

            return Response(plot_data, status=200)
        else:
            return Response(file_serializer.errors, status=400)


class DeletePointsView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [FormParser, MultiPartParser]

    def post(self, request, *args, **kwargs):
        data = request.data
        x1 = float(data.get('x1', 0))
        y1 = float(data.get('y1', 0))
        x2 = float(data.get('x2', 0))
        y2 = float(data.get('y2', 0))

        # Parsing the string representation of the lists and then converting to float
        x_points = [float(x) for x in json.loads(data.get('x', "[]"))]
        y_points = [float(y) for y in json.loads(data.get('y', "[]"))]

        points = list(zip(x_points, y_points))

        digitalizador = Digitalizador()
        digitalizador.corrected_rainfall_data = points
        digitalizador.delete_points_in_zone(x1, y1, x2, y2)

        new_data = digitalizador.save_points_to_json(*zip(*digitalizador.corrected_rainfall_data))
        return Response(new_data, status=200)


class InterpolateGraphView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [FormParser, MultiPartParser]

    def post(self, request, *args, **kwargs):
        data = request.data

        # Parsing the string representation of the lists and then converting to float
        x_points = [float(x) for x in json.loads(data.get('x', "[]"))]
        y_points = [float(y) for y in json.loads(data.get('y', "[]"))]

        # (Assuming you also send manual_data with the request.)
        manual_data = [tuple(map(float, point)) for point in json.loads(data.get('manual_data', "[]"))]

        digitalizador = Digitalizador()
        plot_data = digitalizador.interpolate_graph(x_points, y_points, manual_data)

        return Response(plot_data, status=200)


class GenerateTimeSeriesImageView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [FormParser, MultiPartParser]

    def post(self, request, *args, **kwargs):
        data = request.data
        x_points = [float(x) for x in json.loads(data.get('x', "[]"))]
        y_points = [float(x) for x in json.loads(data.get('y', "[]"))]

        digitalizador = Digitalizador()
        plot_data = digitalizador.interpolate_graph(x_points, y_points)

        x_values = plot_data["x"]
        y_values = plot_data["y"]

        f = interp1d(x_values, y_values, kind='linear', fill_value="extrapolate")

        image_path = digitalizador.generate_time_series_image_from_function(f, x_points)

        return Response({"image_url": image_path}, status=200)


class TimeSeriesView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [FormParser, MultiPartParser]

    def post(self, request, *args, **kwargs):
        data = request.data

        # Parsing the string representation of the lists and then converting to float
        x_points = [float(x) for x in json.loads(data.get('x', "[]"))]
        y_points = [float(y) for y in json.loads(data.get('y', "[]"))]

        limiteInferior = float(data.get('limiteInferior'))
        
        fecha = data.get('horaManual')
        dia, horaManual = fecha.split(' ')
        horaManual = horaManual.strip('"')

        horaModelo = data.get('horaModelo')
        print(horaModelo)

        hora_actual = horaModelo.replace('"', "")

        # Parsear la hora en formato HH:MM:SS
        hora_parseada = datetime.strptime(hora_actual, "%H:%M:%S")

        # Formatear la hora en el nuevo formato HH:mm
        hora_formateada = hora_parseada.strftime("%H:%M")

        print(hora_formateada) 
        #desfase=0
        #desfase = data.get('desfase')        
        #desfase = desfase.replace('"', "")
        #desfase = float(desfase)
        desfase = 0.0
        y_points_adjusted = [y + limiteInferior + desfase for y in y_points]

        # Using the interpolate_graph function to get an interpolation function
        digitalizador = Digitalizador()
        plot_data = digitalizador.interpolate_graph(x_points, y_points_adjusted)

        f = interp1d(plot_data["x"], plot_data["y"], kind='linear', fill_value="extrapolate")

        # Running the time_series_calc function with the interpolation function
        if(horaModelo == horaManual):
            time_series_output = digitalizador.time_series_calc(f, hora_formateada)
        else:
            time_series_output = digitalizador.time_series_calc(f, horaManual)
        return Response({"output_str": time_series_output}, status=200)


class ModeloViewSet(viewsets.ModelViewSet):
    queryset = Modelo.objects.all().order_by('-id')
    serializer_class = ModeloSerializer
