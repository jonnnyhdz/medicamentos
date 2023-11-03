import React, { useState, useEffect, useRef } from 'react';
import { FaSun, FaMoon, FaClock } from 'react-icons/fa';
import { MdRotateRight } from 'react-icons/md';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import MedicationModal from './MedicationModal';
import './MedicationChart.css';
import NavigationBar from './Navbar';

const MedicationChart = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [medicamentosOptions, setMedicamentosOptions] = useState([]);
  const [suggestedMedicamentos, setSuggestedMedicamentos] = useState([]);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const timerRef = useRef(null);

  const [descriptions, setDescriptions] = useState({});

  const calculateHorario = (horaInicio) => {
    if (!horaInicio) return 'Unknown';

    const [hour, minute] = horaInicio.split(':').map(Number);

    if (
      (hour >= 6 && (hour < 12 || (hour === 12 && minute === 0))) // Morning
    ) {
      return 'Morning';
    } else if (
      (hour >= 12 && (hour < 16 || (hour === 16 && minute === 0))) // Noon
    ) {
      return 'Noon';
    } else if (
      (hour >= 16 && (hour < 19 || (hour === 19 && minute === 0))) // Evening
    ) {
      return 'Evening';
    } else {
      return 'Night';
    }
  };

  const calculateHorarioActual = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 6 && currentHour < 12) return 'Morning';
    if (currentHour >= 12 && currentHour < 16) return 'Noon';
    if (currentHour >= 16 && currentHour < 19) return 'Evening';
    return 'Night';
  };

  useEffect(() => {
    axios
      .get('http://localhost:8082/obtenerMedicamentos')
      .then((respuesta) => {
        const medicamentosData = respuesta.data.medicamentos;
        setMedicamentosOptions(medicamentosData.map((med) => med.nombre));

        const descriptionsData = {};
        medicamentosData.forEach((med) => {
          descriptionsData[med.nombre] = med.descripcion;
        });
        setDescriptions(descriptionsData);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    // Determine el horario actual
    const horarioActual = calculateHorarioActual();

    medicamentos.forEach((medication) => {
      if (medication.nextDoseTime) {
        const currentTime = new Date();
        const timeUntilNextDose = medication.nextDoseTime - currentTime;

        if (timeUntilNextDose > 0) {
          timerRef.current = setTimeout(() => {
            updateNextDoseTime(medication, horarioActual);
          }, timeUntilNextDose);
        }
      }
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [medicamentos]);

  const calculateNextDoseTime = (horaInicio, frecuencia) => {
    if (!horaInicio) return null;
    const [hour, minute] = horaInicio.split(':').map(Number);
    const currentDate = new Date();
    const nextDoseTime = new Date(currentDate);
    nextDoseTime.setHours(hour);
    nextDoseTime.setMinutes(minute);

    while (nextDoseTime <= currentDate) {
      nextDoseTime.setHours(nextDoseTime.getHours() + frecuencia);
    }

    return nextDoseTime;
  };

  const updateNextDoseTime = (medication, horarioActual) => {
    if (medication) {
      const nextDoseTime = calculateNextDoseTime(
        parseInt(medication.frecuencia),
        medication.horaInicio
      );

      setMedicamentos((prevMedicamentos) =>
        prevMedicamentos.map((med) => {
          if (med.nombre === medication.nombre) {
            return {
              ...med,
              nextDoseTime,
              horario: calculateHorario(medication.horaInicio),
            };
          }
          return med;
        })
      );

      if (nextDoseTime) {
        const currentTime = new Date();
        const timeUntilNextDose = nextDoseTime - currentTime;

        if (timeUntilNextDose > 0) {
          timerRef.current = setTimeout(() => {
            updateNextDoseTime(medication, horarioActual);
          }, timeUntilNextDose);
        }
      }
    }
  };

  const handleInputChange = (event, name) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    const suggestions = medicamentosOptions || [];
    if (typeof value === 'string') {
      const filteredSuggestions = suggestions.filter((med) =>
        med && med.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestedMedicamentos(filteredSuggestions);
    }

    // Verificar si los campos requeridos están llenos
    const requiredFields = ['nombre', 'dosis', 'frecuencia', 'duracion', 'horaInicio'];
    const allRequiredFieldsFilled = requiredFields.every((field) => !!inputValues[field]);
    setIsSaveDisabled(!allRequiredFieldsFilled);
  };

  const calculateNextDose = (horaInicio, frecuencia) => {
    if (!horaInicio || !frecuencia) return null;
    const [hour, minute] = horaInicio.split(':').map(Number);
    const currentDate = new Date();
    const nextDoseTime = new Date(currentDate);
    nextDoseTime.setHours(hour);
    nextDoseTime.setMinutes(minute);

    while (nextDoseTime <= currentDate) {
      nextDoseTime.setHours(nextDoseTime.getHours() + frecuencia);
    }

    return nextDoseTime;
  };

  const handleSaveMedication = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current); // Limpiar el temporizador anterior
    }

    const nextDoseTime = calculateNextDose(inputValues.horaInicio, parseInt(inputValues.frecuencia));

    // Asignar automáticamente el horario actual al nuevo medicamento
    const horarioActual = calculateHorarioActual();

    const newMedication = {
      nombre: inputValues.nombre || '',
      dosis: inputValues.dosis || '',
      frecuencia: inputValues.frecuencia || '',
      duracion: inputValues.duracion || '',
      comentarios: inputValues.comentarios || '',
      horaInicio: inputValues.horaInicio || '',
      soloParaMalestar: inputValues.soloParaMalestar || false,
      nextDoseTime, // Hora de la próxima dosis
      horario: horarioActual, // Utilizar el horario actual
    };

    if (newMedication.soloParaMalestar) {
      newMedication.horario = 'Only when I need it';
    } else if (nextDoseTime) {
      updateNextDoseTime(newMedication, horarioActual);
    }

    setMedicamentos([...medicamentos, newMedication]);
    setShowModal(false);
    setInputValues({});
    setIsSaveDisabled(true); // Deshabilitar el botón después de guardar
  };

  const timeData = [
    { label: 'Morning', icon: <FaSun style={styles.timeIcon} />, color: '#FFDDDD' },
    { label: 'Noon', icon: <FaClock style={styles.timeIcon} />, color: '#FFE8DD' },
    { label: 'Evening', icon: <FaSun style={styles.timeIcon} />, color: '#DDF2E8' },
    { label: 'Night', icon: <FaMoon style={styles.timeIcon} />, color: '#DDE7F2' },
    { label: 'Only when I need it', icon: <MdRotateRight style={styles.rotateIcon} />, color: '#E4E4E4' },
  ];

  return (
    <>
      <NavigationBar />
      <div className="container">
        <div className="header">CUADRO DE MEDICAMENTOS</div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Agregar Medicamento
        </Button>
        <div className="tableContainer">
          <table className="table">
            <thead>
              <tr>
                <th className="th"></th>
                {[
                  'Medications',
                  'Dosage',
                  'Frequency',
                  'Duration',
                  'Comments',
                  'Siguiente Dosis',
                ].map((header) => (
                  <th className="th" key={header}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeData.map((time) => (
                <tr key={time.label}>
                  <td style={{ ...styles.td, background: time.color }}>
                    {time.icon}
                    <span style={{ color: '#555555', fontWeight: 'bold' }}>{time.label}</span>
                  </td>
                  {[
                    'nombre',
                    'dosis',
                    'frecuencia',
                    'duracion',
                    'comentarios',
                    'Siguiente Dosis',
                  ].map((field) => (
                    <td key={field} style={{ ...styles.td, background: time.color }}>
                      {medicamentos
                        .filter((med) => med.horario === time.label)
                        .map((med, index) => (
                          <div key={index} style={styles.column}>
                            {field === 'comentarios' && med.nombre in descriptions
                              ? `${med[field]}\n\n${descriptions[med.nombre]}`
                              : field === 'Siguiente Dosis' && med.horaInicio && med.frecuencia
                              ? `(${calculateNextDoseTime(med.horaInicio, parseInt(med.frecuencia)).toLocaleTimeString()})`
                              : med[field]}
                          </div>
                        ))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <MedicationModal
          showModal={showModal}
          setShowModal={setShowModal}
          inputValues={inputValues}
          suggestedMedicamentos={suggestedMedicamentos}
          isSaveDisabled={isSaveDisabled}
          handleInputChange={handleInputChange}
          handleSaveMedication={handleSaveMedication}
        />
      </div>
    </>
  );
};

const styles = {
  timeIcon: {
    marginRight: '10px',
    verticalAlign: 'middle',
  },
  rotateIcon: {
    marginRight: '10px',
    verticalAlign: 'middle',
  },
  td: {
    padding: '10px',
    textAlign: 'center',
  },
  column: {
    marginBottom: '5px',
  },
};

export default MedicationChart;