import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import connectDB from './db.js';
import User from './models/User.js';
import Model from './models/Model.js';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifyFn from 'fastify';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import Stripe from 'stripe';

const fastify = fastifyFn({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }
});

dotenv.config();
connectDB();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

await fastify.register(fastifyMultipart);

// Registrar CORS 
fastify.register(fastifyCors, {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:5500'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
});

mongoose.connection.on('connected', () => {
  console.log(' Mongoose conectado a:', mongoose.connection.db.databaseName);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose desconectado');
});

const authenticate = async (request, reply) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.code(401).send({
        success: false,
        error: 'Token de autorización no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return reply.code(401).send({
        success: false,
        error: 'Formato de token inválido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = await User.findById(decoded.userId);

    if (!request.user) {
      return reply.code(401).send({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
  } catch (error) {
    console.error('Error en autenticación:', error);
    reply.code(401).send({
      success: false,
      error: error.name === 'JsonWebTokenError' ? 'Token inválido' : error.message
    });
  }
};

fastify.post('/api/register', async (request, reply) => {
  try {
    const { username, fullname, password } = request.body;

    if (!username || !fullname || !password) {
      return reply.code(400).send({
        success: false,
        error: 'Todos los campos son requeridos',
        fields: {
          fullname: !fullname,
          username: !username,
          password: !password
        }
      });
    }

    if (password.length < 8) {
      return reply.code(400).send({
        success: false,
        error: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return reply.code(400).send({
        success: false,
        error: 'El nombre de usuario ya está en uso'
      });
    }

    const user = await User.create({
      username,
      fullname,
      password,
      currentTokens: 0
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '8h'
    });

    reply.code(201).send({
      success: true,
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    reply.code(500).send({
      success: false,
      error: 'Error en el servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// para menejar bloqueo de cuenta por intentos fallidos
fastify.post('/api/login', async (request, reply) => {
  try {
    const { username, password } = request.body;

    // Validación mejorada
    if (!username || !password) {
      return reply.code(400).send({
        success: false,
        error: 'Usuario y contraseña son requeridos',
        fields: {
          username: !username,
          password: !password
        }
      });
    }

    // Buscar usuario y verificar intentos fallidos
    const user = await User.findOne({ username }).select('+password +loginAttempts +blockUntil');

    if (user?.blockUntil && new Date(user.blockUntil) > new Date()) {
      const remainingTime = Math.ceil((new Date(user.blockUntil) - new Date()) / 60000);
      return reply.code(429).send({
        success: false,
        error: `Cuenta temporalmente bloqueada. Intente nuevamente en ${remainingTime} minutos`
      });
    }

    if (!user) {
      return reply.code(401).send({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Incrementar intentos fallidos
      user.loginAttempts = (user.loginAttempts || 0) + 1;

      // Bloquear después de 3 intentos fallidos por 15 minutos
      if (user.loginAttempts >= 3) {
        user.blockUntil = new Date(Date.now() + 15 * 60 * 1000);
        user.loginAttempts = 0;
        await user.save();

        return reply.code(429).send({
          success: false,
          error: 'Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos'
        });
      }

      await user.save();
      return reply.code(401).send({
        success: false,
        error: 'Credenciales inválidas',
        remainingAttempts: 3 - user.loginAttempts
      });
    }

    user.loginAttempts = 0;
    user.blockUntil = null;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '8h' // Tiempo de sesión extendido
    });

    reply.send({
      success: true,
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        cantidad_tokens: user.cantidad_tokens
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    reply.code(500).send({
      success: false,
      error: 'Error en el servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

fastify.post('/api/upload-model', async (request, reply) => {
  try {

    const { user, modelId, modelFileName, modelName, modelStatus, modelData } = request.body;

    if (!user) {
      return reply.code(400).send({
        success: false,
        error: 'Missing required fields'
      });
    }

    const existingModel = await Model.findOne({
      modelId: modelId
    });

    if (existingModel) {
      fastify.log.info(modelId);
      fastify.log.info(modelStatus);

      await Model.updateOne({ modelId: modelId },
        {
          $set: {
            modelName: modelName,
            modelStatus: modelStatus,
            updatedAt: new Date()
          }
        });

    } else {
      await Model.create({
        userId: user.id,
        modelFileName: modelFileName,
        modelName: modelName,
        modelStatus: modelStatus,
        uploadDate: new Date(),
        generatedTokens: 0
      });
    }

    if (modelFileName && modelData) {
      const filePath = path.join(process.cwd(), "models", user.id, modelFileName);
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, modelData, null, 0);
    }

    return reply.code(200).send({
      success: true
    });

    reply.code(201).send({ success: true, savedTo: filePath });
  } catch (err) {
    console.error('Error al subir modelo:', err);
    reply.code(500).send({
      success: false,
      error: 'Error interno al subir modelo'
    });
  }
});

fastify.post('/api/get-models', async (request, reply) => {
  let user = null;
  let token = null;

  try {
    if (request.body) {
      const body = JSON.parse(request.body);
      user = body.user;
      token = body.token;
    }

    const query = user?.id ? { userId: user.id } : {};

    const [models, total] = await Promise.all([
      Model.find(query),
      Model.countDocuments(query)
    ]);

    const processedModels = await Promise.all(models.map(async (model) => {
      const filePath = path.join(process.cwd(), "models", model.userId.toString(), model.modelFileName);

      const fileContent = JSON.parse(await fs.readFile(filePath, 'utf-8'));

      const { feature_names: featureNames, feature_types: featureTypes } = fileContent.learner;

      const newModel = model.toObject();

      const userData = await User.findById(model.userId);
      newModel.uploadedBy = userData?.fullname || "Unknown";

      newModel.modelParams = featureNames.map((name, index) => ({
        featureName: name,
        dataType: featureTypes[index]
      }));

      return newModel;
    }));

    reply.send({
      success: true,
      models: processedModels,
      total,
    });

  } catch (error) {
    fastify.log.error('Error al obtener modelos:', error);
    reply.code(500).send({
      success: false,
      error: 'Error al obtener modelos'
    });
  }
});

fastify.post('/api/execute-model', async (request, reply) => {
  try {
    const { modelId, payload } = JSON.parse(request.body);

    if (!modelId || !payload) {
      return reply.code(400).send({
        success: false,
        error: 'Model ID and payload are required.'
      });
    }

    const modelData = await Model.findOne({
      modelId: modelId
    });

    if (!modelData) {
      return reply.code(404).send({
        success: false,
        error: 'Model not found or lack of permissions.'
      });
    }

    if (!modelData.modelStatus) {
      return reply.code(503).send({
        success: false,
        error: 'The model is disabled'
      });
    }


    let userData = await User.findById(modelData.userId);

    if (userData.currentTokens <= 0) {
      return reply.code(400).send({
        success: false,
        error: 'The account does not have enough tokens.'
      });
    }

    try {
      await fetch('http://localhost:8000/execute-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model_path: `../models/${modelData.userId}/${modelData.modelFileName}`,
          payload
        })
      }).then(response => response.json())
        .then(async (json) => {
          userData = await User.findById(userData.id);
          userData.currentTokens = (userData.currentTokens || 0) - 10;
          await userData.save();

          modelData.generatedTokens = modelData.generatedTokens + 10;
          await modelData.save();

          return reply.code(200)
            .send(json);
        });

    } catch (error) {
      console.error('Error al llamar a la API Python:', error);
      return reply.code(502).send({
        success: false,
        error: 'Error al comunicarse con el servicio de modelos',
        details: error.message
      });
    }
  } catch (error) {
    console.error('Error ejecutando modelo:', error);
    reply.code(500).send({
      success: false,
      error: 'Error al ejecutar modelo',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

fastify.post('/api/delete-model', async (request, reply) => {
  const { modelId, user } = JSON.parse(request.body);

  try {
    const result = await Model.deleteOne({ modelId, userId: user.id });

    if (result.deletedCount === 0) {
      return reply.status(404)
        .send({ success: false, message: 'Model not found or not authorized' });
    } else {
      reply.status(200).send({
        success: true, message: 'Model deleted successfully'
      })
    }
  } catch (err) {
    reply.status(500)
      .send({ success: false, message: err.message });
  }
});

fastify.post('/api/profile', async (request, reply) => {

  const { user, token } = JSON.parse(request.body);

  try {
    const userData = await User.findById(user.id);

    reply.send({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Error en perfil:', error);
    reply.code(500).send({
      success: false,
      error: 'Error en el servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


fastify.post('/api/create-payment-intent', async (request, reply) => {
  try {
    const { amount, pricePerUnit } = request.body;

    if (!amount || !pricePerUnit || amount <= 0 || pricePerUnit <= 0) {
      return reply.code(400).send({
        success: false,
        error: 'Invalid amount or price per unit'
      });
    }

    const totalAmount = Math.round(amount * pricePerUnit * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'pab',
      metadata: {
        tokens: amount.toString(),
        pricePerUnit: pricePerUnit.toString()
      }
    });

    reply.send({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    reply.code(500).send({
      success: false,
      error: 'Error creating payment intent'
    });
  }
});


fastify.post('/api/add-tokens', async (request, reply) => {

  const { user, tokenAmount } = JSON.parse(request.body);

  try {
    const userData = await User.findById(user.id);

    userData.currentTokens = (userData.currentTokens || 0) + tokenAmount;
    await userData.save();

    reply.send({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Error en perfil:', error);
    reply.code(500).send({
      success: false,
      error: 'Error en el servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


fastify.get('/', async (request, reply) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;

    if (isConnected) {
      await mongoose.connection.db.admin().ping();
    }

    return {
      status: 'API funcionando',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      database: isConnected ? 'Conectado' : 'Desconectado',
      services: {
        python_api: 'http://localhost:8000'
      }
    };
  } catch (error) {
    console.error('Error en health check:', error);
    reply.code(200).send({
      status: 'API funcionando',
      database: 'Desconectado',
      error: 'No se pudo conectar a MongoDB'
    });
  }
});

const start = async () => {
  try {
    const PORT = process.env.PORT || 3001;
    const HOST = process.env.HOST || '127.0.0.1';

    await fastify.listen({ port: PORT, host: HOST });
    console.log(` Servidor ejecutándose en http://${HOST}:${PORT}`);

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error(' Error al iniciar servidor:', err);
    process.exit(1);
  }
};

const shutdown = async () => {
  console.log('Recibida señal de apagado, cerrando servidor...');
  await fastify.close();
  mongoose.connection.close();
  console.log('Servidor y conexiones cerradas');
  process.exit(0);
};

start();