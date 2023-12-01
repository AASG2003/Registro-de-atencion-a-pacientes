const express = require('express');
const router = express.Router();

const Medico = require('../models/medico'); // Make sure to replace 'medico' with your actual model name
const Area = require('../models/area');

router.get('/', async (req, res) => {
    try {
        const arrayMedicosDB = await Medico.find();
        const uniqueAreaIds = [...new Set(arrayMedicosDB.map(medico => medico.area))];

        // Crear un array para almacenar la información de las áreas
        const arrayAreasInfo = [];
        let i = 0;
        // Recorrer los IDs únicos de áreas y recuperar el nombre de cada área
        for (const areaId of uniqueAreaIds) {
            const areaInfo = await Area.findById(areaId);
            
            // Verificar si el área existe antes de agregarla al array
            if (areaInfo) {
                arrayAreasInfo.push({
                    id: areaInfo.id,
                    nombre: areaInfo.nombre
                });
                arrayMedicosDB[i].area = areaInfo.nombre;
                console.log(areaInfo.nombre);
            }else{
                arrayMedicosDB[i].area = "Ninguno";
            }
            i++;
        }
        
        console.log(arrayMedicosDB);
        console.log(arrayAreasInfo);
        res.render("proyecto/medicos/index", {
            arrayMedicos: arrayMedicosDB,
            arrayAreas: arrayAreasInfo
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/crear', async (req, res) => {
    const areas = await Area.find();
    res.render('proyecto/medicos/crear',{
        areas:areas
    });
});

router.post('/', async (req, res) => {
    const body = req.body;
    try {
        await Medico.create(body);
        res.redirect('/medicos');
    } catch (error) {
        console.log(error);
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const areas = await Area.find();
    try {
        const medicoDB = await Medico.findOne({ _id: id });
        console.log(medicoDB);

        res.render('proyecto/medicos/detalle', {
            medico: medicoDB,
            areas:areas,
            error: false
        });
    } catch (error) {
        console.log(error);
        res.render('proyecto/medicos/detalle', {
            error: true,
            mensaje: 'No se encuentra el id seleccionado'
        });
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const medicoDB = await Medico.findByIdAndDelete({ _id: id });

        if (medicoDB) {
            res.json({
                estado: true,
                mensaje: 'eliminado!'
            });
        } else {
            res.json({
                estado: false,
                mensaje: 'fallo eliminar!'
            });
        }
    } catch (error) {
        console.log(error);
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    try {
        const medicoDB = await Medico.findByIdAndUpdate(id, body, { useFindAndModify: false });
        console.log(medicoDB);

        res.json({
            estado: true,
            mensaje: 'Editado'
        });
    } catch (error) {
        console.log(error);

        res.json({
            estado: false,
            mensaje: 'Fallamos!!'
        });
    }
});

module.exports = router;
