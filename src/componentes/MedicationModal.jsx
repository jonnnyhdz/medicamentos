import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const MedicationModal = ({
    showModal,
    setShowModal,
    inputValues,
    suggestedMedicamentos,
    handleInputChange,
    handleSaveMedication,
}) => {
    const isSaveButtonDisabled = !(
        inputValues.nombre &&
        inputValues.dosis &&
        inputValues.frecuencia &&
        inputValues.duracion
    );

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Medicamento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="nombre">
                        <Form.Label>Nombre del Medicamento</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            value={inputValues.nombre || ''}
                            onChange={(event) => handleInputChange(event, 'nombre')}
                            list="medicamentos"
                        />
                        <datalist id="medicamentos">
                            {suggestedMedicamentos.map((med, index) => (
                                <option key={index} value={med} />
                            ))}
                        </datalist>
                    </Form.Group>
                    <Form.Group controlId="dosis">
                        <Form.Label>Dosis del Medicamento</Form.Label>
                        <Form.Control
                            type="number"
                            name="dosis"
                            value={inputValues.dosis || ''}
                            onChange={(event) => handleInputChange(event, 'dosis')}
                            min="1"
                        />
                    </Form.Group>
                    <Form.Group controlId="frecuencia">
                        <Form.Label>Frecuencia en que se tomará el Medicamento</Form.Label>
                        <Form.Control
                            type="number"
                            name="frecuencia"
                            value={inputValues.frecuencia || ''}
                            onChange={(event) => handleInputChange(event, 'frecuencia')}
                            min="1" // Mínimo valor permitido
                        />
                    </Form.Group>
                    <Form.Group controlId="duracion">
                        <Form.Label>Durante cuantos días</Form.Label>
                        <Form.Control
                            type="number"
                            name="duracion"
                            value={inputValues.duracion || ''}
                            onChange={(event) => handleInputChange(event, 'duracion')}
                            min="1"
                        />
                    </Form.Group>
                    <Form.Group controlId="soloParaMalestar">
                        <Form.Check
                            type="checkbox"
                            label="Solo para cuando esté mal"
                            name="soloParaMalestar"
                            checked={inputValues.soloParaMalestar || false}
                            onChange={(event) => handleInputChange(event, 'soloParaMalestar')}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cerrar
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSaveMedication}
                    disabled={isSaveButtonDisabled}
                >
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MedicationModal;
