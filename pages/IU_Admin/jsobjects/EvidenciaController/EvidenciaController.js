export default {
    async subirYProcesar() {
        if (!Select_Actividad.selectedOptionValue) {
            return showAlert('Por favor selecciona una actividad comprometida.', 'warning');
        }
        if (!FilePicker_Evidencia.files.length) {
            return showAlert('Por favor adjunta el archivo de evidencia.', 'warning');
        }

        try {
            showAlert('Registrando evidencia y ejecutando triaje de coherencia con IA...', 'info');

            // 1. Guardar la evidencia en PostgreSQL
            const res = await INSERT_EVIDENCIA.run();
            const nuevaEvidenciaId = res[0].evidencia_id;

            // 2. Disparar flujo n8n
            await Api_Webhook_n8n.run({
                evidencia_id: nuevaEvidenciaId,
                actividad_id: Select_Actividad.selectedOptionValue,
                nombre_archivo: FilePicker_Evidencia.files[0].name,
                tipo_mime: FilePicker_Evidencia.files[0].type,
                base64_data: FilePicker_Evidencia.files[0].data
            });

            showAlert('Pre-análisis de la IA completado. Listo para revisión del auditor.', 'success');

            // 3. Refrescar interfaz
            await GET_TRIAJE_IA_ACTUAL.run();
            await GET_EVIDENCIAS_PEND_DICTAMEN.run();
            resetWidget('FilePicker_Evidencia');

        } catch (error) {
            showAlert('Error en el procesamiento: ' + error.message, 'error');
        }
    }
}