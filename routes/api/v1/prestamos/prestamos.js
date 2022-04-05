const express = require('express');
const router = express.Router();

const Prestamos = require('../../../../dao/prestamos/prestamos.model');
const prestamoModel = new Prestamos();

router.get('/', (req, res) => {
  res.status(200).json(
    {
      endpoint: 'Prestamos',
      updates: new Date(2022,0,19,18,41,0)
    }
  );
}); //GET /

router.get('/all', async (req, res) => {
  try {
    console.log("User Request", req.user);
    const rows = await prestamoModel.getAll();
    res.status(200).json({status:'ok', prestamos: rows});
  } catch (ex) {
    console.log(ex);
    res.status(500).json({status:'failed'});
  }
} );


router.get('/byid/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const row = await prestamoModel.getById(id);
    res.status(200).json({ status: 'ok', prestamo: row });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: 'failed' });
  }
});

const allowedItemsNumber = [10, 15, 20];
//facet search
router.get('/facet/:page/:items', async (req, res) => {
  const page = parseInt(req.params.page, 10);
  const items = parseInt(req.params.items, 10);
  if (allowedItemsNumber.includes(items)) {
    try {
      const prestamos = await prestamoModel.getFaceted(page, items);
      res.status(200).json({docs:prestamos});
    } catch (ex) {
      console.log(ex);
      res.status(500).json({ status: 'failed' });
    }
  } else {
    return res.status(403).json({status:'error', msg:'Not a valid item value (10,15,20)'});
  }

});

router.post('/new', async (req, res) => {
  const { usuario, empleado, libro, fecha_prestamo, fecha_devuelto } = req.body;
  try {
    rslt = await prestamoModel.new(usuario, empleado, libro, fecha_devuelto, fecha_prestamo);
    res.status(200).json(
      {
        status: 'ok',
        result: rslt
      });
  } catch (ex) {
    console.log(ex);
    res.status(500).json(
      {
        status: 'failed',
        result: {}
      });
  }
}); //POST /new


router.put('/update/:id', async (req, res) => {
  try{
    const { usuario, empleado, libro, fecha_prestamo, fecha_devuelto } = req.body;
    const { id } = req.params;
    const result = await prestamoModel.updateOne(id, usuario, empleado, libro, fecha_devuelto, fecha_prestamo);
    res.status(200).json({
      status:'ok',
      result
    });
  } catch(ex){
    console.log(ex);
    res.status(500).json({ status: 'failed' });
  }
});

router.put('/addtag/:id', async (req, res) => {
  try {
    const { tag } = req.body;
    const { id } = req.params;
    const result = await prestamoModel.updateAddTag(id, tag);
    res.status(200).json({
      status: 'ok',
      result
    });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: 'failed' });
  }
});

router.put('/addtagset/:id', async (req, res) => {
  try {
    const { tag } = req.body;
    const { id } = req.params;
    const result = await prestamoModel.updateAddTagSet(id, tag);
    res.status(200).json({
      status: 'ok',
      result
    });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: 'failed' });
  }
});

router.put('/removetag/:id', async (req, res) => {
  try {
    const { tag } = req.body;
    const { id } = req.params;
    const result = await prestamoModel.updatePopTag(id, tag);
    res.status(200).json({
      status: 'ok',
      result
    });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: 'failed' });
  }
});


router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await prestamoModel.deleteOne(id);
    res.status(200).json({
      status: 'ok',
      result
    });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: 'failed' });
  }
});


module.exports = router;
