export default {
    async crearPropuesta() {
        if (!Input_Actividad_Propuesta.text) {
            return showAlert('Por favor describe la actividad propuesta para la Agenda de Mejora.', 'warning');
        }
        if (!NumberInput_Plazo_Dias.value || NumberInput_Plazo_Dias.value <= 0) {
            return showAlert('Por favor especifica un plazo propuesto válido en días.', 'warning');
        }

        try {
            showAlert('Registrando propuesta en la Agenda de Mejora...', 'info');
            await INSERT_PROPUESTA_MEJORA.run();
            showAlert('Propuesta de mejora agregada exitosamente.', 'success');

            await GET_AGENDA_MEJORA.run();
            resetWidget('Input_Actividad_Propuesta');
            resetWidget('NumberInput_Plazo_Dias');
            resetWidget('Select_Actividad_Origen');
            resetWidget('Select_Area_Mejora');
        } catch (error) {
            showAlert('Error al registrar la propuesta: ' + error.message, 'error');
        }
    },

    async cambiarEstado() {
        if (!Table_Agenda_Mejora.selectedRow) {
            return showAlert('Selecciona una propuesta de la tabla.', 'warning');
        }
        if (!Select_Nuevo_Estado_Mejora.selectedOptionValue) {
            return showAlert('Selecciona el nuevo estado institucional.', 'warning');
        }

        try {
            await UPDATE_ESTADO_PROPUESTA_MEJORA.run();
            showAlert('Estado de la propuesta actualizado correctamente.', 'success');
            await GET_AGENDA_MEJORA.run();
        } catch (error) {
            showAlert('Error al actualizar el estado: ' + error.message, 'error');
        }
    }
}