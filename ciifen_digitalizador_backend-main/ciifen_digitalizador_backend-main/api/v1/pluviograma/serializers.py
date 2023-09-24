from rest_framework import serializers

from api.v1.inventario.serializers import EstacionSerializer, InstrumentoSerializer
from ciifen.inventario.models import Estacion, Instrumento
from ciifen.pluviograma.models import Pluviograma, Modelo


class PluviogramaSerializer(serializers.ModelSerializer):
    estacion = serializers.PrimaryKeyRelatedField(queryset=Estacion.objects.all())
    instrumento = serializers.PrimaryKeyRelatedField(queryset=Instrumento.objects.all())
    modelo = serializers.PrimaryKeyRelatedField(queryset=Modelo.objects.all())
    x = serializers.ListField(child=serializers.FloatField(), write_only=True)
    y = serializers.ListField(child=serializers.FloatField(), write_only=True)

    class Meta:
        model = Pluviograma
        fields = '__all__'

    def create(self, validated_data):
        # Pop out the 'x' and 'y' data since they're not part of the model
        validated_data.pop('x', None)
        validated_data.pop('y', None)
        return Pluviograma.objects.create(**validated_data)

    def to_representation(self, instance):
        self.fields['estacion'] = EstacionSerializer()
        self.fields['instrumento'] = InstrumentoSerializer()
        self.fields['modelo'] = ModeloSerializer()  # This line is added to serialize Modelo in full
        return super(PluviogramaSerializer, self).to_representation(instance)


class ImageUploadSerializer(serializers.Serializer):
    image = serializers.ImageField()


class ModeloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modelo
        fields = '__all__'
