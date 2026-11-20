
const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');

let mongoServer;

async function conectarBanco() {
  try {
    mongoServer = await MongoMemoryReplSet.create({
      replSet: {
        count: 1,
        storageEngine: 'wiredTiger',
        launchTimeout: 60000
      }
    });

    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });

    console.log('MongoDB Memory Server conectado!');
    console.log('Replica Set ativo!');
    console.log('Banco de dados:', mongoose.connection.name);

  } catch (error) {
    console.error('Erro ao conectar ao banco:', error.message);

    if (mongoServer) {
      await mongoServer.stop();
      mongoServer = null;
    }

    throw error;
  }
}

async function desconectarBanco() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    if (mongoServer) {
      await mongoServer.stop();
      mongoServer = null;
    }

    console.log('Banco de dados desconectado!');

  } catch (error) {
    console.error('Erro ao desconectar:', error.message);
  }
}

module.exports = {
  conectarBanco,
  desconectarBanco
};
