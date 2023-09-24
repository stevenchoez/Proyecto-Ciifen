from rest_framework import serializers

from ciifen.inventario.models import Estacion, Instrumento, Mantenimiento


class EstacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estacion
        fields = '__all__'


class MantenimientoInstrumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mantenimiento
        fields = ['id', 'tipo', 'fecha', 'detalle']


class InstrumentoSerializer(serializers.ModelSerializer):
    mantenimientos = MantenimientoInstrumentoSerializer(many=True, read_only=True)
    estacion = serializers.PrimaryKeyRelatedField(queryset=Estacion.objects.all())

    class Meta:
        model = Instrumento
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['estacion'] = EstacionSerializer(instance.estacion).data
        return representation


class MantenimientoSerializer(serializers.ModelSerializer):
    instrumento = serializers.PrimaryKeyRelatedField(queryset=Instrumento.objects.all())

    class Meta:
        model = Mantenimiento
        fields = '__all__'

    def to_representation(self, instance):
        self.fields['instrumento'] = InstrumentoSerializer()
        return super(MantenimientoSerializer, self).to_representation(instance)
