// Definicion del modelo de Quiz con validación

module.exports = function(sequelize, DataTypes){
  return sequelize.define(
    'Quiz',
    { pregunta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Pregunta"}}
      },
      respuesta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Respuesta"}}
      },
      tema: {
        type: DataTypes.ENUM('otro','humanidades','ocio','ciencia','tecnologia'),
        validate: { isIn: {
                      args: [['otro','humanidades','ocio','ciencia','tecnologia']],
                      msg: "-> El tema no es correcto"
                    }
                  }
      }
   });
}
