const express = require('express');
const router = express.Router();
const Paciente = require('../models/paciente');
const Consulta = require('../models/consulta');
const Medico = require('../models/medico');

// Obtener todos los pacientes
router.get('/', async (req, res) => {
  try {
    const pacientes = await Paciente.find();
    res.render("proyecto/index",{
        arrayPacientes: pacientes
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/crear',(req, res)=>{
    res.render("proyecto/crear",{

    });
})

// Obtener un paciente por ID
// router.get('/:id', getPaciente, (req, res) => {
//   res.json(res.paciente);
// });

// Crear un nuevo paciente
router.post('/', async (req, res) => {
  const paciente = new Paciente({
    nombres: req.body.nombres,
    apellidos: req.body.apellidos,
    fecha_de_nacimiento: req.body.fecha_de_nacimiento,
    telefono: req.body.telefono,
    direccion: req.body.direccion,
    consultas: req.body.consultas
  });

  try {
    const nuevoPaciente = await paciente.save();
    res.redirect("/pacientes");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {

    const id = req.params.id

    try {

        const pacienteDB = await Paciente.findOne({ _id: id })
        console.log(pacienteDB)

        res.render('proyecto/detalle', {
            paciente: pacienteDB,
            error: false
        })
        
    } catch (error) {
        console.log(error)
        res.render('detalle', {
            error: true,
            mensaje: 'No se encuentra el id seleccionado'
        })
    }
})

router.put('/:id', async (req, res) => {
    const id = req.params.id
    const body = req.body
    
    try {

        const mascotaDB = await Paciente.findByIdAndUpdate(
            id, body, { useFindAndModify: false }
            )
        console.log(mascotaDB)

        res.json({
            estado: true,
            mensaje: 'Editado'
        })
        
    } catch (error) {
        console.log(error)
        
        res.json({
            estado: false,
            mensaje: 'Fallamos!!'
        })
    }
})
// Eliminar un paciente
router.delete('/:id', async (req, res) => {

  const id = req.params.id

    try {
        const pacienteDB = await Paciente.findByIdAndDelete({ _id: id })
        
        if (pacienteDB) {
            res.json({
                estado: true,
                mensaje: 'eliminado!'
            })
        } else {
            res.json({
                estado: false,
                mensaje: 'fallo eliminar!'
            })
        }

    } catch (error) {
        console.log(error)
    }
});

router.get('/consultas/:id/crear', async (req, res)=>{
    const id = req.params.id;
    const pacienteDB = await Paciente.findOne({ _id: id });
    const medicos = await Medico.find();
    res.render("proyecto/consultas/crear",{
        paciente: pacienteDB,
        arrayMedicos:medicos
    });
})

router.get('/consultas/:id', async (req, res) => {

    const id = req.params.id

    try {

        const pacienteDB = await Paciente.findOne({ _id: id })
        console.log(pacienteDB)

        for(const consulta of pacienteDB.consultas){
          var medico = await Medico.findById(consulta.doctor);
          console.log(medico.nombres);
          consulta.doctor = medico.nombres+' '+medico.apellidos;
        }
        console.log(pacienteDB)
        console.log("----------------");
        res.render('proyecto/consultas/index.ejs', {
            paciente: pacienteDB,
            error: false
        })
        
    } catch (error) {
        console.log(error)
        res.render('detalle', {
            error: true,
            mensaje: 'No se encuentra el id seleccionado'
        })
    }
})

router.post('/consultas/:id/crear/nueva-consulta', async (req, res) => {
    const id = req.params.id;
    const { fechad, motivo_consultad, doctord, diagnosticod} = req.body;
    console.log(fechad+"--------------------");
    console.log(req.body.doctor);
    console.log(doctord);
    try {
      const pacienteDB = await Paciente.findOne({ _id: id });
      const consulta = new Consulta({
        fecha : fechad,
        motivo: motivo_consultad,
        doctor: req.body.doctor,
        diagnostico: diagnosticod
      });
      const consultaj = {
        fechad, motivo_consultad, doctord, diagnosticod
      }
      console.log(consulta.fecha);
      console.log(pacienteDB);
      if (pacienteDB) {
        pacienteDB.consultas.push(consulta);
  
        await pacienteDB.save();
  
        res.redirect(`/pacientes/consultas/${id}`);
      } else {
        res.status(404).json({ message: 'No se encuentra el paciente con el ID especificado' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al agregar la consulta' });
    }
  });

  router.get('/consultas/:idPaciente/editar-consulta/:idConsulta', async (req, res) => {
    const idPaciente = req.params.idPaciente;
    const idConsulta = req.params.idConsulta;
  
    try {
      const pacienteDB = await Paciente.findOne({ _id: idPaciente });
      const medicos = await Medico.find();
  
      if (pacienteDB) {
        const consulta = pacienteDB.consultas.id(idConsulta);
  
        if (consulta) {
          res.render('proyecto/consultas/detalles', {
            paciente: pacienteDB,
            medicos: medicos,
            consulta,
            error: false
          });
        } else {
          res.render('proyecto/editar-consulta', {
            error: true,
            mensaje: 'No se encuentra la consulta con el ID especificado'
          });
        }
      } else {
        res.render('proyecto/editar-consulta', {
          error: true,
          mensaje: 'No se encuentra el paciente con el ID especificado'
        });
      }
    } catch (error) {
      console.log(error);
      res.render('proyecto/editar-consulta', {
        error: true,
        mensaje: 'Error al obtener el paciente o la consulta'
      });
    }
  });

  router.post('/consultas/:idPaciente/editar-consulta/:idConsulta', async (req, res) => {
    const idPaciente = req.params.idPaciente;
    const idConsulta = req.params.idConsulta;
    const { fecha, motivo, doctor, diagnostico } = req.body;
  
    try {
      const pacienteDB = await Paciente.findOne({ _id: idPaciente });
  
      if (pacienteDB) {
        const consulta = pacienteDB.consultas.id(idConsulta);
  
        if (consulta) {
          consulta.fecha = fecha;
          consulta.motivo = motivo;
          consulta.doctor = doctor;
          consulta.diagnostico = diagnostico;
  
          await pacienteDB.save();
  
          res.redirect(`/pacientes/consultas/${idPaciente}`);
        } else {
          res.status(404).json({ message: 'No se encuentra la consulta con el ID especificado' });
        }
      } else {
        res.status(404).json({ message: 'No se encuentra el paciente con el ID especificado' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al editar la consulta' });
    }
  });

  router.post('/consultas/:idPaciente/eliminar-consulta/:idConsulta', async (req, res) => {
    const idPaciente = req.params.idPaciente;
    const idConsulta = req.params.idConsulta;
    console.log(idPaciente);
    try {
      const pacienteDB = await Paciente.findOne({ _id: idPaciente });
  
      if (pacienteDB) {
        pacienteDB.consultas.remove(idConsulta);
  
        await pacienteDB.save();
  
        res.redirect(`/pacientes/consultas/${idPaciente}`);
      } else {
        res.status(404).json({ message: 'No se encuentra el paciente con el ID especificado' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al eliminar la consulta' });
    }
  });
module.exports = router;
