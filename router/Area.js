const express = require('express');
const router = express.Router();

const Area = require('../models/area'); // Update 'medico' with 'area' for the actual model name

router.get('/', async (req, res) => {
    try {
        const arrayAreasDB = await Area.find();
        console.log(arrayAreasDB);
        res.render("proyecto/areas/index", {
            arrayAreas: arrayAreasDB
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/crear', (req, res) => {
    res.render('proyecto/areas/crear');
});

router.post('/', async (req, res) => {
    const body = req.body;
    try {
        await Area.create(body);
        res.redirect('/areas');
    } catch (error) {
        console.log(error);
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const areaDB = await Area.findOne({ _id: id });
        console.log(areaDB);

        res.render('proyecto/areas/detalle', {
            area: areaDB,
            error: false
        });
    } catch (error) {
        console.log(error);
        res.render('proyecto/areas/detalle', {
            error: true,
            mensaje: 'No se encuentra el id seleccionado'
        });
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const areaDB = await Area.findByIdAndDelete({ _id: id });

        if (areaDB) {
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
        const areaDB = await Area.findByIdAndUpdate(id, body, { useFindAndModify: false });
        console.log(areaDB);

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
