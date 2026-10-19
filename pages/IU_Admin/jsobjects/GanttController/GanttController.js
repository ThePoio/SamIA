export default {
    getEChartsConfig() {
        const data = GET_GANTT_DATA.data || [];
        
        // Extraer nombres de actividades para el eje Y
        const categories = data.map(item => item.codigo_actividad);
        
        // Serie base transparente (desplazamiento hasta la fecha de inicio)
        const startData = data.map(item => item.fecha_inicio);
        
        // Serie visible (duración del periodo programado)
        const durationData = data.map(item => {
            let color = '#20c997'; // Verde por defecto
            if (item.semaforo_estado === 'AMARILLO_RIESGO') color = '#ffc107';
            if (item.semaforo_estado === 'ROJO_RETRASADO') color = '#dc3545';
            if (item.semaforo_estado === 'VERDE_CUMPLIDO') color = '#28a745';

            return {
                value: [item.fecha_inicio, item.fecha_fin_programada],
                itemStyle: { color: color, borderRadius: 4 },
                meta: item
            };
        });

        return {
            title: {
                text: 'Cronograma de Actividades Comprometidas',
                left: 'center',
                textStyle: { fontSize: 16, color: '#333' }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: function (params) {
                    const tar = params.find(p => p.seriesName === 'Periodo');
                    if (!tar || !tar.data) return '';
                    const m = tar.data.meta;
                    return `
                        <strong>${m.codigo_actividad}</strong><br/>
                        <b>Área:</b> ${m.area_nombre}<br/>
                        <b>Responsable:</b> ${m.responsable_nombre}<br/>
                        <b>Inicio:</b> ${m.fecha_inicio}<br/>
                        <b>Término:</b> ${m.fecha_fin_programada}<br/>
                        <b>Avance:</b> ${m.porcentaje_avance}%
                    `;
                }
            },
            grid: {
                left: '15%',
                right: '10%',
                bottom: '10%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'time',
                axisLabel: {
                    formatter: '{yyyy}-{MM}-{dd}'
                }
            },
            yAxis: {
                type: 'category',
                data: categories,
                axisLabel: {
                    interval: 0
                }
            },
            series: [
                {
                    name: 'Periodo',
                    type: 'custom',
                    renderItem: function (params, api) {
                        const categoryIndex = api.value(0);
                        const start = api.coord([api.value(1), categoryIndex]);
                        const end = api.coord([api.value(2), categoryIndex]);
                        const height = api.size([0, 1])[1] * 0.4;

                        const rectShape = echarts.graphic.clipRectByRect({
                            x: start[0],
                            y: start[1] - height / 2,
                            width: end[0] - start[0],
                            height: height
                        }, {
                            x: params.coordSys.x,
                            y: params.coordSys.y,
                            width: params.coordSys.width,
                            height: params.coordSys.height
                        });

                        return rectShape && {
                            type: 'rect',
                            transition: ['shape'],
                            shape: rectShape,
                            style: api.style()
                        };
                    },
                    itemStyle: {
                        opacity: 0.85
                    },
                    encode: {
                        x: [1, 2],
                        y: 0
                    },
                    data: data.map((item, index) => ({
                        value: [index, item.fecha_inicio, item.fecha_fin_programada],
                        itemStyle: {
                            color: item.semaforo_estado === 'ROJO_RETRASADO' ? '#dc3545' :
                                   item.semaforo_estado === 'AMARILLO_RIESGO' ? '#ffc107' :
                                   item.semaforo_estado === 'VERDE_CUMPLIDO' ? '#28a745' : '#20c997'
                        },
                        meta: item
                    }))
                }
            ]
        };
    }
}