export default {
    async emitirDictamen() {
        if (!Select_Evidencia_Pendiente.selectedOptionValue) {
            return showAlert('Por favor selecciona una evidencia pendiente de revisión.', 'warning');
        }
        if (!Select_Dictamen_Final.selectedOptionValue) {
            return showAlert('Selecciona el dictamen (APROBADO, OBSERVADO o RECHAZADO).', 'warning');
        }
        if (!Input_Comentarios_Auditor.text) {
            return showAlert('Debes incluir tus observaciones técnicas en el dictamen.', 'warning');
        }

        try {
            showAlert('Guardando dictamen formal...', 'info');

            await INSERT_DICTAMEN_FINAL.run();

            showAlert('Dictamen emitido exitosamente.', 'success');

            // Refrescar paneles de la interfaz
            await GET_ACTIVIDADES_PENDIENTES.run();
            await GET_DASHBOARD_SEGUIMIENTO.run();
            
            resetWidget('Input_Comentarios_Auditor');
            resetWidget('Select_Dictamen_Final');

        } catch (error) {
            showAlert('Error al registrar el dictamen: ' + error.message, 'error');
        }
    }
}