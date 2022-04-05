const ObjectId = require('mongodb').ObjectId;
const getDb = require('../mongodb');

let db = null;
class Prestamos {
  collection = null;
  constructor() {
    getDb()
      .then((database) => {
        db = database;
        this.collection = db.collection('Prestamos');
        if (process.env.MIGRATE === 'true') {
          // Por Si se ocupa algo
        }
      })
      .catch((err) => { console.error(err) });
  }

  async new(usuario, empleado, libro, fecha_prestamo, fecha_devuelto) {
    const newPrestamo = {
      usuario:new ObjectId(usuario),
      empleado:new ObjectId(empleado),
      libro:new ObjectId(libro),
      fecha_prestamo,
      fecha_devuelto
    };
    const rslt = await this.collection.insertOne(newPrestamo);
    return rslt;
  }

  async getAll() {
    const cursor = this.collection.find({});
    const documents = await cursor.toArray();
    return documents;
  }
  async getFaceted(page, items, filter = {}) {
    const cursor = this.collection.find(filter);
    const totalItems = await cursor.count();
    cursor.skip((page -1) * items);
    cursor.limit(items);
    const resultados = await cursor.toArray();
    return {
      totalItems,
      page,
      items,
      totalPages: (Math.ceil(totalItems / items)),
      resultados
    };
  }
  async getById(id) {
    const _id = new ObjectId(id);
    const filter = {_id};
    console.log(filter);
    const myDocument = await this.collection.findOne(filter);
    return myDocument;
  }
  async updateOne(id, usuario, empleado, libro, fecha_prestamo, fecha_devuelto) {
    const filter = {_id: new ObjectId(id)};
    const updateCmd = {
      '$set':{
        usuario,
        empleado,
        libro,
        fecha_prestamo,
        fecha_devuelto
      }
    };
    return await this.collection.updateOne(filter, updateCmd);
  }

  async updateAddTag(id, tagEntry){
    const updateCmd = {
      "$push": {
        tags: tagEntry
      }
    }
    const filter = {_id: new ObjectId(id)};
    return await this.collection.updateOne(filter, updateCmd);
  }

  async updateAddTagSet(id, tagEntry) {
    const updateCmd = {
      "$addToSet": {
        tags: tagEntry
      }
    }
    const filter = { _id: new ObjectId(id) };
    return await this.collection.updateOne(filter, updateCmd);
  }

  async updatePopTag(id, tagEntry) {
    console.log(tagEntry);
    const updateCmd = [{
      '$set': {
        'tags': {
          '$let': {
            'vars': { 'ix': { '$indexOfArray': ['$tags', tagEntry] } },
            'in': {
              '$concatArrays': [
                { '$slice': ['$tags', 0, {'$add':[1,'$$ix']}]},
                [],
                { '$slice': ['$tags', { '$add': [2, '$$ix'] }, { '$size': '$tags' }] }
              ]
            }
          }
        }
      }
    }];
    const filter = { _id: new ObjectId(id) };
    return await this.collection.updateOne(filter, updateCmd);
  }
  async deleteOne(id) {
    const filter = {_id: new ObjectId(id)};
    return await this.collection.deleteOne(filter);
  }
}

module.exports = Prestamos;
