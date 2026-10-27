export default {
    async procesarDocumento() {
        if (!FilePicker_PDF_Recomendaciones.files.length) {
            return showAlert('Adjunta la presentación o documento PDF con las recomendaciones.', 'warning');
        }
        if (!DatePicker_FechaLimiteGlobal.selectedDate) {
            return showAlert('Selecciona la fecha límite global de cumplimiento.', 'warning');
        }

        try {
            showAlert('El Asistente está filtrando el documento y calculando plazos por complejidad...', 'info');

            await API_Webhook_GenerarAgenda.run();

            showAlert('Propuestas de mejora generadas e insertadas correctamente.', 'success');
            await GET_AGENDA_MEJORA_COMPLETA.run();
            resetWidget('FilePicker_PDF_Recomendaciones');
        } catch (error) {
            showAlert('Error durante el procesamiento del documento: ' + error.message, 'error');
        }
    },

   async guardarEdicionFila() {
    try {
        // Validar que exista información en la fila modificada
        const filaModificada = Table_Agenda_Mejora.triggeredRow || Table_Agenda_Mejora.updatedRow;
        
        if (!filaModificada || !filaModificada.propuesta_id) {
            return showAlert('No se detectó una fila válida para actualizar.', 'warning');
        }

        // 1. Ejecutar la actualización en PostgreSQL
        await UPDATE_PROPUESTA_DIRECTA.run();
        showAlert('Propuesta actualizada correctamente.', 'success');

        // 2. Volver a consultar la base de datos
        await GET_AGENDA_MEJORA_COMPLETA.run();

    } catch (error) {
        showAlert('Error al guardar cambios: ' + error.message, 'error');
    }
},

    async cambiarEstado(propuestaId, nuevoEstado) {
        try {
            await CAMBIAR_ESTADO_PROPUESTA.run({ 
                propuesta_id: propuestaId, 
                nuevo_estado: nuevoEstado 
            });
            showAlert(`Propuesta actualizada a: ${nuevoEstado}`, 'success');
            await GET_AGENDA_MEJORA_COMPLETA.run();
        } catch (error) {
            showAlert('Error al cambiar el estado: ' + error.message, 'error');
        }
    }
}